import { NextResponse } from "next/server";
import { z } from "zod";
import Razorpay from "razorpay";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { ratelimit } from "@/lib/ratelimit";

const CheckoutSchema = z.object({
    cartItems: z.array(z.object({
        productId: z.string(),
        title: z.string(),
        quantity: z.number().min(1),
        size: z.string(),
        color: z.string(),
    })).min(1, "Cart cannot be empty"),
    shippingAddress: z.object({
        name: z.string().min(1, "Name is required"),
        addressLine1: z.string().min(1, "Address is required"),
        addressLine2: z.string().optional(),
        city: z.string().min(1, "City is required"),
        state: z.string().min(1, "State is required"),
        pincode: z.string().length(6, "Pincode must be 6 digits"),
        phone: z.string().min(10, "Valid phone number required"),
    }),
});

export async function POST(req: Request) {
    // 1. Rate Limiting
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await ratelimit.limit(ip);
    
    if (!success) {
        return NextResponse.json(
            { message: "Too many requests. Please try again later." },
            { status: 429 }
        );
    }

    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID as string,
        key_secret: process.env.RAZORPAY_KEY_SECRET as string,
    });

    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        
        // Validate with Zod
        const parseResult = CheckoutSchema.safeParse(body);
        if (!parseResult.success) {
            const firstError = parseResult.error.issues[0];
            return NextResponse.json(
                { message: `${firstError.path.join(".")}: ${firstError.message}` },
                { status: 400 }
            );
        }

        const { cartItems, shippingAddress } = parseResult.data;

        if (!cartItems || cartItems.length === 0) {
            return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
        }

        await dbConnect();

        let calculatedTotal = 0;
        const validatedProducts = [];

        // Recalculate true total from Database pricing to prevent client tampering
        for (const item of cartItems) {
            const dbProduct = await Product.findById(item.productId);
            if (!dbProduct) {
                return NextResponse.json(
                    { message: `Product ${item.title} not found in database.` },
                    { status: 404 }
                );
            }
            calculatedTotal += dbProduct.price * item.quantity;

            validatedProducts.push({
                product: dbProduct._id,
                quantity: item.quantity,
                size: item.size,
                color: item.color,
            });
        }

        // 1. Create a 'pending' order in our DB holding the line items and shipping details
        const order = await Order.create({
            user: session.user.id,
            products: validatedProducts,
            totalAmount: calculatedTotal,
            status: "pending",
            shippingAddress: shippingAddress,
            paymentId: "", // Will be updated on verification
        });

        // 2. Create Razorpay order (amounts in Razorpay are in paise, so multiply INR by 100)
        // Pass the Mongo Order ID in the notes so Webhooks can find it later
        const options = {
            amount: calculatedTotal * 100,
            currency: "INR",
            receipt: `rcpt_${Math.random().toString(36).substring(7)}`,
            notes: {
                mongo_order_id: order._id.toString(),
            },
        };

        const razorpayOrder = await razorpay.orders.create(options);

        // Security Fix: Link the Razorpay order ID to our database order to prevent replay attacks
        await Order.findByIdAndUpdate(order._id, { razorpayOrderId: razorpayOrder.id });

        return NextResponse.json({
            orderId: order._id, // Mongo ID
            razorpayOrderId: razorpayOrder.id, // Razorpay generated ID
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
        });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

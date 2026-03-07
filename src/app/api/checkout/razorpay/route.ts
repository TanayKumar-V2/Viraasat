import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID as string,
    key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { cartItems, shippingAddress } = await req.json();

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

        // Create Razorpay order (amounts in Razorpay are in paise, so multiply INR by 100)
        const options = {
            amount: calculatedTotal * 100,
            currency: "INR",
            receipt: `rcpt_${Math.random().toString(36).substring(7)}`,
        };

        const razorpayOrder = await razorpay.orders.create(options);

        // Create a 'pending' order in our DB holding the line items and shipping details
        const order = await Order.create({
            user: session.user.id,
            products: validatedProducts,
            totalAmount: calculatedTotal,
            status: "pending",
            shippingAddress: shippingAddress,
            paymentId: "", // Will be updated on verification
        });

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

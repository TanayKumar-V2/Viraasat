import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/db";
import Order from "@/models/Order"; // <-- Added missing import

export async function POST(req: Request) {
    try {
        // Extract the mongo_order_id that the client is sending
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, mongo_order_id } = await req.json();

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            return NextResponse.json(
                { message: "Invalid Payment Signature" },
                { status: 400 }
            );
        }

        await dbConnect();

        // THE FIX: Actually update the database so the order is marked as paid
        const updatedOrder = await Order.findByIdAndUpdate(
            mongo_order_id,
            {
                status: "paid",
                paymentId: razorpay_payment_id,
            },
            { new: true } // Return the updated document
        );

        if (!updatedOrder) {
            return NextResponse.json({ message: "Order not found in database" }, { status: 404 });
        }

        // Phase 5: Automate Fulfillment via Qikink API
        try {
            const { pushOrderToQikink } = await import("@/lib/qikink");
            const qikinkRes = await pushOrderToQikink(mongo_order_id);

            if (qikinkRes.success) {
                await Order.findByIdAndUpdate(mongo_order_id, { status: "processing" });
                console.log(`Order ${mongo_order_id} successfully pushed to Qikink and marked as processing.`);
            } else {
                console.error(`Order ${mongo_order_id} marked as paid but Qikink push failed.`);
                // Note: We intentionally do NOT throw here so the user checkout still succeeds visually.
                // In production, we would add the order to a dead-letter queue or retry-table.
            }
        } catch (fulfillmentError) {
            console.error(`CRITICAL: Fulfillment error on paid order ${mongo_order_id}:`, fulfillmentError);
            // Again, do not fail the user's payment success route because our 3rd party API failed.
        }

        return NextResponse.json(
            { message: "Payment Verified Successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Payment Verification Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
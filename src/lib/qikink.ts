import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import dbConnect from "@/lib/db";

const QIKINK_API_URL = process.env.QIKINK_API_URL || "https://api.qikink.com/api/v1";
const QIKINK_API_KEY = process.env.QIKINK_API_KEY || "";
const QIKINK_API_SECRET = process.env.QIKINK_API_SECRET || "";

export async function pushOrderToQikink(orderId: string) {
    try {
        await dbConnect();

        // Fetch the fully populated order
        const order = await Order.findById(orderId)
            .populate({
                path: "products.product",
                model: Product,
            })
            .populate({
                path: "user",
                model: User,
                select: "name email",
            })
            .lean();

        if (!order) {
            throw new Error(`Order ${orderId} not found`);
        }

        if (!order.shippingAddress) {
            throw new Error(`Order ${orderId} missing shipping address`);
        }

        // Map Mongo Line Items to Qikink API format
        const orderItems = order.products.map((item: { product: { qikink_sku: string, title: string, price: number }, quantity: number, size: string, color: string }) => ({
            sku: item.product.qikink_sku,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            name: item.product.title,
            price: item.product.price,
        }));

        // Qikink expects explicit billing and shipping
        const shippingData = {
            first_name: order.shippingAddress.name || order.user.name,
            address1: order.shippingAddress.addressLine1,
            city: order.shippingAddress.city,
            state: order.shippingAddress.state,
            zip: order.shippingAddress.pincode,
            country: "IN",
            phone: order.shippingAddress.phone || "0000000000",
            email: order.user.email,
        };

        const payload = {
            order_id: order._id.toString(), // client order ref
            payment_method: "Prepaid",
            shipping_address: shippingData,
            billing_address: shippingData,
            line_items: orderItems,
        };

        console.log("Pushing to Qikink:", JSON.stringify(payload, null, 2));

        // Perform actual API Call to Qikink
        const response = await fetch(`${QIKINK_API_URL}/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": QIKINK_API_KEY,
                "api-secret": QIKINK_API_SECRET,
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Qikink API Error:", data);
            return { success: false, error: data.message || "Unknown API Error" };
        }

        return { success: true, data };

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`Failed to push order ${orderId} to Qikink:`, error.message);
        } else {
            console.error(`Failed to push order ${orderId} to Qikink:`, error);
        }
        return { success: false, error };
    }
}

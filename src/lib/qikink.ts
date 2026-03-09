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
            .populate({ path: "products.product", model: Product })
            .populate({ path: "user", model: User, select: "name email" })
            .lean();

        if (!order) throw new Error(`Order ${orderId} not found`);
        if (!order.shippingAddress) throw new Error(`Order ${orderId} missing shipping address`);

        const isSandbox = QIKINK_API_URL.includes("sandbox");
        const baseUrl = isSandbox ? "https://sandbox.qikink.com" : "https://api.qikink.com";

        // Step 1: Generate Access Token
        const params = new URLSearchParams();
        params.append("ClientId", QIKINK_API_KEY);
        params.append("client_secret", QIKINK_API_SECRET);

        const tokenRes = await fetch(`${baseUrl}/api/token`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params.toString(),
        });
        const tokenData = await tokenRes.json();
        
        if (!tokenRes.ok || !tokenData.Accesstoken) {
            console.error("Qikink Token Error:", tokenData);
            return { success: false, error: "Failed to generate Qikink access token" };
        }
        
        const accessToken = tokenData.Accesstoken;

        // Step 2: Push Order
        const orderItems = order.products.map((item: any) => ({
            search_from_my_products: 1, // Assumes products exist in Qikink dashboard
            quantity: String(item.quantity),
            price: String(item.product.price),
            sku: item.product.qikink_sku,
        }));

        const shippingData = {
            first_name: order.shippingAddress.name || order.user.name.split(" ")[0],
            last_name: order.shippingAddress.name.split(" ").slice(1).join(" ") || "Customer",
            address1: order.shippingAddress.addressLine1,
            address2: order.shippingAddress.addressLine2 || "",
            city: order.shippingAddress.city,
            province: order.shippingAddress.state,
            zip: String(order.shippingAddress.pincode),
            country: "IN",
            phone: String(order.shippingAddress.phone || "0000000000"),
            email: order.user.email,
        };

        const payload = {
            order_number: order._id.toString(), // client order ref
            qikink_shipping: "1", // '1' = Qikink ships it
            gateway: "Prepaid",
            total_order_value: String(order.totalAmount),
            line_items: orderItems,
            shipping_address: shippingData,
        };

        console.log("Pushing to Qikink:", JSON.stringify(payload, null, 2));

        const response = await fetch(`${baseUrl}/api/order/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "ClientId": QIKINK_API_KEY,
                "Accesstoken": accessToken,
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok || (data.status === false && data.error)) {
            console.error("Qikink Order API Error:", data);
            return { success: false, error: data.error || data.message || "Unknown API Error" };
        }

        return { success: true, data };

    } catch (error: any) {
        console.error(`Failed to push order ${orderId} to Qikink:`, error.message || error);
        return { success: false, error: error.message || error };
    }
}

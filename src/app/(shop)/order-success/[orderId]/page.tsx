import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

async function getOrder(orderId: string, userId: string) {
    try {
        await dbConnect();
        const order = await Order.findOne({ _id: orderId, user: userId }).lean();
        if (!order) return null;
        return {
            _id: order._id.toString(),
            status: order.status,
            totalAmount: order.totalAmount,
            createdAt: new Date(order.createdAt).toLocaleDateString("en-IN", {
                year: "numeric", month: "long", day: "numeric",
            }),
            shippingAddress: order.shippingAddress,
            products: order.products.length,
        };
    } catch {
        return null;
    }
}

export default async function OrderSuccessPage({ params }: { params: Promise<{ orderId: string }> }) {
    const session = await getServerSession(authOptions);
    const { orderId } = await params;

    const order = session ? await getOrder(orderId, session.user.id) : null;

    return (
        <div className="container mx-auto px-4 py-20 min-h-screen flex flex-col items-center justify-center text-center max-w-lg">
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6 border border-green-500/20">
                <CheckCircle className="w-10 h-10 text-green-500" />
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-8">
                Thank you for your purchase. We&apos;ve received your order and it&apos;s being processed.
            </p>

            {order && (
                <div className="w-full bg-card border rounded-xl p-6 mb-8 text-left space-y-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Order ID</span>
                        <span className="font-mono font-medium">#{order._id}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Date</span>
                        <span>{order.createdAt}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Items</span>
                        <span>{order.products} item{order.products !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="flex justify-between text-sm border-t pt-4">
                        <span className="font-semibold">Total Paid</span>
                        <span className="font-bold text-lg">₹{order.totalAmount}</span>
                    </div>
                    {order.shippingAddress && (
                        <div className="border-t pt-4">
                            <p className="text-sm text-muted-foreground mb-1">Shipping to</p>
                            <p className="text-sm font-medium">{order.shippingAddress.name}</p>
                            <p className="text-sm text-muted-foreground">
                                {order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}
                            </p>
                        </div>
                    )}
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Button asChild className="flex-1">
                    <Link href="/">Continue Shopping</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                    <Link href="/profile">View All Orders</Link>
                </Button>
            </div>
        </div>
    );
}

import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingBag, IndianRupee } from "lucide-react";

export default async function AdminDashboard() {
    await dbConnect();

    // Fetch basic stats
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();
    
    // Calculate total revenue
    const orders = await Order.find({ paymentStatus: "paid" }).select("totalAmount");
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                <p className="text-muted-foreground mt-2">Welcome to the Viraasat Admin Control Panel.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">From all paid orders</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{productCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">Products live on site</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{orderCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">Lifetime orders</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

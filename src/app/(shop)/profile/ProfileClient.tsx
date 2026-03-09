"use client";

import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Order {
    _id: string;
    status: string;
    totalAmount: number;
    createdAt: string;
    products: number;
}

const statusColors: Record<string, string> = {
    pending: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
    paid: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    processing: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    shipped: "text-green-500 bg-green-500/10 border-green-500/20",
};

export default function ProfileClient({
    session,
    orders,
}: {
    session: Session;
    orders: Order[];
}) {
    return (
        <div className="container mx-auto px-4 py-12 min-h-screen max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">My Account</h1>
                    <p className="text-muted-foreground mt-1">Manage your profile and orders</p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => signOut({ callbackUrl: "/" })}
                >
                    Sign Out
                </Button>
            </div>

            {/* Profile Info Card */}
            <Card className="mb-10">
                <CardContent className="p-6 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 border border-border flex items-center justify-center text-2xl font-bold text-primary">
                        {session.user?.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div>
                        <p className="text-xl font-semibold">{session.user?.name}</p>
                        <p className="text-sm text-muted-foreground">{session.user?.email}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Order History */}
            <div>
                <h2 className="text-xl font-bold tracking-tight mb-6">Order History</h2>

                {orders.length === 0 ? (
                    <div className="text-center border border-dashed rounded-lg p-16 text-muted-foreground">
                        <p className="text-lg font-medium mb-2">No orders yet</p>
                        <p className="text-sm">Your orders will appear here after you make a purchase.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <Card key={order._id} className="overflow-hidden">
                                <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground font-mono">
                                            #{order._id}
                                        </p>
                                        <p className="text-sm font-medium">
                                            {order.products} item{order.products !== 1 ? "s" : ""} · {order.createdAt}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span
                                            className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize ${statusColors[order.status] ?? "text-muted-foreground"}`}
                                        >
                                            {order.status}
                                        </span>
                                        <p className="font-bold text-lg">₹{order.totalAmount}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

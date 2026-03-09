import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { signOut } from "next-auth/react";
import ProfileClient from './ProfileClient';

async function getUserOrders(userId: string) {
    try {
        await dbConnect();
        const orders = await Order.find({ user: userId })
            .sort({ createdAt: -1 })
            .lean();

        return orders.map((o) => ({
            _id: o._id.toString(),
            status: o.status,
            totalAmount: o.totalAmount,
            createdAt: new Date(o.createdAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
            }),
            products: o.products.length,
        }));
    } catch {
        return [];
    }
}

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const orders = await getUserOrders(session.user.id);

    return <ProfileClient session={session} orders={orders} />;
}

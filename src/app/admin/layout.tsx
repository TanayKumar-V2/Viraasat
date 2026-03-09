import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart } from "lucide-react";

export default async function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // 1. Secure the entire /admin route
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
        redirect("/");
    }

    return (
        <div className="flex min-h-[calc(100vh-80px)] bg-muted/40">
            {/* Admin Sidebar */}
            <aside className="w-64 border-r bg-background hidden md:block">
                <div className="p-6">
                    <h2 className="text-xl font-black tracking-tight mb-6">Admin Panel</h2>
                    <nav className="space-y-2">
                        <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium transition-colors">
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </Link>
                        <Link href="/admin/products" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium transition-colors">
                            <Package className="h-4 w-4" />
                            Products
                        </Link>
                        <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium transition-colors text-muted-foreground cursor-not-allowed pointer-events-none">
                            <ShoppingCart className="h-4 w-4" />
                            Orders (Coming Soon)
                        </Link>
                    </nav>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-6 lg:p-10">
                {children}
            </main>
        </div>
    );
}

"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";
import CartSheet from "../CartSheet";

export default function Navbar() {
    const { data: session } = useSession();
    const { setCartOpen, getTotalItems } = useCartStore();

    return (
        <>
            <nav className="border-b bg-background px-6 py-4 fixed w-full top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="text-2xl font-bold tracking-tighter">
                            VIRAASAT
                        </Link>
                        <div className="hidden md:flex items-center gap-6">
                            <Link href="/men" className="text-sm font-medium hover:text-primary transition-colors">Men</Link>
                            <Link href="/women" className="text-sm font-medium hover:text-primary transition-colors">Women</Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button onClick={() => setCartOpen(true)} className="relative group p-2">
                            <ShoppingCart className="w-5 h-5 group-hover:text-primary transition-colors" />
                            <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                                {getTotalItems()}
                            </span>
                        </button>

                        {session ? (
                            <Link href="/profile" className="text-sm font-medium hover:underline">
                                {session.user?.name || "Profile"}
                            </Link>
                        ) : (
                            <Link href="/login" className="text-sm font-medium bg-foreground text-background px-4 py-2 rounded-md hover:bg-foreground/90 transition-colors">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </nav>
            <CartSheet />
        </>
    );
}

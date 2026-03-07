"use client";

import { useCartStore } from "@/store/cartStore";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CartSheet() {
    const router = useRouter();
    const { items, isCartOpen, setCartOpen, removeItem, updateQuantity, getSubtotal } = useCartStore();

    const handleCheckout = () => {
        setCartOpen(false);
        router.push("/checkout");
    };

    return (
        <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
            <SheetContent className="w-full sm:max-w-md flex flex-col">
                <SheetHeader className="pb-4">
                    <SheetTitle className="flex items-center text-xl font-bold tracking-tight">
                        <ShoppingBag className="mr-2 h-5 w-5" />
                        Shopping Cart ({items.reduce((acc, item) => acc + item.quantity, 0)})
                    </SheetTitle>
                </SheetHeader>

                <Separator />

                {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
                        <div className="bg-muted p-4 rounded-full">
                            <ShoppingBag className="h-10 w-10 text-muted-foreground opacity-50" />
                        </div>
                        <p className="text-muted-foreground">Your cart is empty</p>
                        <Button variant="outline" onClick={() => setCartOpen(false)}>
                            Continue Shopping
                        </Button>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="flex-1 -mx-6 px-6 py-4">
                            <div className="space-y-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative aspect-[3/4] w-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-semibold text-sm line-clamp-1">{item.title}</h4>
                                                    <p className="text-sm text-muted-foreground mt-1 font-mono">
                                                        {item.color} / {item.size}
                                                    </p>
                                                </div>
                                                <p className="font-medium text-sm">₹{item.price * item.quantity}</p>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center border rounded-md">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1.5 hover:bg-muted transition-colors disabled:opacity-50"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </button>
                                                    <span className="text-xs font-semibold w-6 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1.5 hover:bg-muted transition-colors"
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-muted-foreground hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        <div className="space-y-4 pt-6 pb-2 border-t mt-auto">
                            <div className="flex items-center justify-between font-semibold text-lg">
                                <span>Subtotal</span>
                                <span>₹{getSubtotal()}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Shipping and taxes calculated at checkout.
                            </p>
                            <Button onClick={handleCheckout} className="w-full font-bold uppercase tracking-wider h-12">
                                Checkout
                            </Button>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}

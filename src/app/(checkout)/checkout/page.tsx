"use client";

import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Add Razorpay type to Window
declare global {
    interface Window {
        Razorpay: unknown;
    }
}

interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

export default function CheckoutPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const { items, getSubtotal, clearCart } = useCartStore();
    const [isProcessing, setIsProcessing] = useState(false);

    const [shippingDetails, setShippingDetails] = useState({
        name: session?.user?.name || "",
        phone: "",
        addressLine1: "",
        city: "",
        state: "",
        pincode: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShippingDetails(prev => ({ ...prev, [name]: value }));
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) return;

        setIsProcessing(true);

        try {
            // 1. Create Order on our Server (Razorpay POST request)
            const res = await fetch("/api/checkout/razorpay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cartItems: items,
                    shippingAddress: shippingDetails
                }),
            });

            const orderData = await res.json();

            if (!res.ok) throw new Error(orderData.message);

            // 2. Initialize Razorpay Modal
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use public key here
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Viraasat",
                description: "Premium Print-on-Demand Apparel",
                order_id: orderData.razorpayOrderId,
                handler: async function (response: RazorpayResponse) {
                    // 3. Verify Payment Signature
                    const verifyRes = await fetch("/api/checkout/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            mongo_order_id: orderData.orderId,
                        }),
                    });

                    if (verifyRes.ok) {
                        clearCart();
                        // In a real app we'd redirect to a dedicated success page
                        alert("Payment Successful! Order Placed.");
                        router.push("/");
                    } else {
                        alert("Payment verification failed.");
                    }
                },
                prefill: {
                    name: shippingDetails.name,
                    email: session?.user?.email,
                    contact: shippingDetails.phone,
                },
                theme: {
                    color: "#000000",
                },
            };

            // @ts-expect-error Window Razorpay is injected via script
            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                alert(error.message || "Failed to initiate payment");
            } else {
                alert("Failed to initiate payment");
            }
        } finally {
            setIsProcessing(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-3xl font-bold mb-4">Checkout</h1>
                <p className="text-muted-foreground mb-8">Your cart is empty.</p>
                <Button onClick={() => router.push("/")}>Return to Shop</Button>
            </div>
        );
    }

    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

            <div className="container mx-auto px-4 py-12 lg:py-20 min-h-screen">
                <h1 className="text-3xl font-bold tracking-tight mb-8">Secure Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Form Section */}
                    <div className="lg:col-span-7">
                        <div className="bg-card border rounded-xl p-6 shadow-sm">
                            <h2 className="text-xl font-semibold mb-6">Shipping Details</h2>
                            <form id="checkout-form" onSubmit={handlePayment} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" name="name" required value={shippingDetails.name} onChange={handleInputChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input id="phone" name="phone" required value={shippingDetails.phone} onChange={handleInputChange} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="addressLine1">Address Line 1</Label>
                                    <Input id="addressLine1" name="addressLine1" required value={shippingDetails.addressLine1} onChange={handleInputChange} />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2 col-span-1">
                                        <Label htmlFor="city">City</Label>
                                        <Input id="city" name="city" required value={shippingDetails.city} onChange={handleInputChange} />
                                    </div>
                                    <div className="space-y-2 col-span-1">
                                        <Label htmlFor="state">State</Label>
                                        <Input id="state" name="state" required value={shippingDetails.state} onChange={handleInputChange} />
                                    </div>
                                    <div className="space-y-2 col-span-1">
                                        <Label htmlFor="pincode">PIN Code</Label>
                                        <Input id="pincode" name="pincode" required value={shippingDetails.pincode} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="bg-muted/50 border rounded-xl p-6 sticky top-24">
                            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <p className="font-medium text-sm line-clamp-1">{item.title}</p>
                                            <p className="text-xs text-muted-foreground mt-1 text-[10px]">
                                                Qty: {item.quantity} | {item.size} / {item.color}
                                            </p>
                                        </div>
                                        <p className="font-medium text-sm">₹{item.price * item.quantity}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 space-y-3">
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span>₹{getSubtotal()}</span>
                                </div>
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold border-t pt-3">
                                    <span>Total</span>
                                    <span>₹{getSubtotal()}</span>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                form="checkout-form"
                                className="w-full mt-8 h-12 text-lg tracking-wider"
                                disabled={isProcessing}
                            >
                                {isProcessing ? "Processing..." : "Pay Now"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

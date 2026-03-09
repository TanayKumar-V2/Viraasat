"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function NewProductForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const result = await createProduct(formData);

        if (result.success) {
            router.push("/admin/products");
            router.refresh();
        } else {
            setError(result.error as string);
            setIsLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/products">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Create Product</h1>
                    <p className="text-muted-foreground mt-1">Add a new product and link it to its Qikink SKU.</p>
                </div>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <form onSubmit={onSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 rounded-md bg-destructive/15 text-destructive text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="title">Product Title</Label>
                            <Input id="title" name="title" placeholder="e.g. Cyberpunk Oversized Tee" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" placeholder="Product details..." rows={4} required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price (₹)</Label>
                                <Input id="price" name="price" type="number" min="0" step="0.01" placeholder="999" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select name="category" defaultValue="men" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="men">Men</SelectItem>
                                        <SelectItem value="women">Women</SelectItem>
                                        <SelectItem value="unisex">Unisex</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="qikink_sku" className="flex items-center gap-2">
                                Qikink SKU
                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Critical for Fulfillment</span>
                            </Label>
                            <Input id="qikink_sku" name="qikink_sku" placeholder="e.g. M-OVR-CYB-01" required />
                            <p className="text-xs text-muted-foreground">Find this SKU inside your Qikink Dashboard when you create a product.</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="images">Image URLs (Comma Separated)</Label>
                            <Textarea id="images" name="images" placeholder="https://image1.com/img.jpg, https://image2.com/img.jpg" rows={3} required />
                            <p className="text-xs text-muted-foreground">Paste the mockup image URLs from Qikink or your own hosting.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="sizes">Sizes (Comma Separated)</Label>
                                <Input id="sizes" name="sizes" defaultValue="S, M, L, XL" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="colors">Colors (Comma Separated)</Label>
                                <Input id="colors" name="colors" defaultValue="Black" />
                            </div>
                        </div>

                        <div className="pt-4 border-t flex justify-end gap-4">
                            <Button type="button" variant="outline" asChild disabled={isLoading}>
                                <Link href="/admin/products">Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Product
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

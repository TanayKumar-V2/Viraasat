"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

export default function ProductVariants({
    product,
    sizes,
    colors,
}: {
    product: { id: string; title: string; price: number; image: string };
    sizes: string[];
    colors: string[];
}) {
    const [selectedSize, setSelectedSize] = useState<string | null>(sizes[0] || null);
    const [selectedColor, setSelectedColor] = useState<string | null>(colors[0] || null);

    const addItem = useCartStore((state) => state.addItem);

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor) {
            alert("Please select a size and color.");
            return;
        }

        addItem({
            id: `${product.id}-${selectedSize}-${selectedColor}`,
            productId: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            size: selectedSize,
            color: selectedColor,
            quantity: 1,
        });
    };

    return (
        <div className="space-y-6">
            {/* Colors */}
            {colors && colors.length > 0 && (
                <div>
                    <h3 className="text-sm font-medium mb-3">Color</h3>
                    <div className="flex flex-wrap gap-3">
                        {colors.map((color) => (
                            <button
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={`px-4 py-2 border rounded-md text-sm font-medium transition-all ${selectedColor === color
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border hover:border-primary/50 text-foreground"
                                    }`}
                            >
                                {color}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Sizes */}
            {sizes && sizes.length > 0 && (
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-medium">Size</h3>
                        <button className="text-xs text-muted-foreground underline hover:text-foreground">
                            Size Guide
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {sizes.map((size) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`w-12 h-12 flex items-center justify-center border rounded-md font-medium transition-all ${selectedSize === size
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border hover:border-primary/50 text-foreground"
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <Button onClick={handleAddToCart} size="lg" className="w-full mt-6 text-lg h-14 uppercase tracking-wider font-bold">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Add to Cart
            </Button>
        </div>
    );
}

import { notFound } from "next/navigation";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import ProductVariants from "@/components/ProductVariants";

async function getProductDetails(id: string) {
    try {
        await dbConnect();
        const product = await Product.findById(id).lean();
        if (!product) return null;

        return {
            _id: product._id.toString(),
            title: product.title,
            description: product.description,
            price: product.price,
            images: product.images,
            sizes: product.sizes,
            colors: product.colors,
        };
    } catch (error) {
        console.error("Failed to fetch product", error);
        return null;
    }
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
    const product = await getProductDetails(params.id);

    if (!product) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8 lg:py-16 min-h-[calc(100vh-80px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                {/* Image Gallery Column */}
                <div className="flex flex-col gap-4">
                    <div className="aspect-[3/4] rounded-xl overflow-hidden bg-muted border border-border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={product.images?.[0] || 'https://placehold.co/600x800/111111/FFFFFF/png?text=No+Image'}
                            alt={product.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {product.images && product.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-4">
                            {product.images.map((img: string, idx: number) => (
                                <div key={idx} className="aspect-[3/4] rounded-md overflow-hidden bg-muted border border-border cursor-pointer hover:opacity-80 transition-opacity">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={img} alt={`${product.title} view ${idx + 1}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info Column */}
                <div className="flex flex-col space-y-8">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight mb-4">{product.title}</h1>
                        <p className="text-2xl font-medium text-primary">₹{product.price}</p>
                    </div>

                    <div className="prose prose-sm dark:prose-invert">
                        <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                    </div>

                    <div className="border-t border-b py-8">
                        <ProductVariants
                            product={{
                                id: product._id.toString(),
                                title: product.title,
                                price: product.price,
                                image: product.images[0],
                            }}
                            sizes={product.sizes}
                            colors={product.colors}
                        />
                    </div>

                    <div className="space-y-4">
                        <p className="text-center text-sm text-muted-foreground">
                            Free shipping on orders over ₹2000. 14-day hassle-free returns.
                        </p>
                    </div>

                    {/* Details Accordion (Placeholder for realism) */}
                    <div className="mt-8 pt-8 space-y-6 text-sm text-muted-foreground">
                        <div>
                            <h4 className="font-semibold text-foreground mb-2">Material & Care</h4>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>100% Premium Terry Cotton</li>
                                <li>Machine wash cold with like colors</li>
                                <li>Tumble dry low or hang dry</li>
                                <li>Do not iron directly on print</li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

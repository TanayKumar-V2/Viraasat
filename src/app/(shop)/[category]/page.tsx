import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";

async function getCategoryProducts(category: string) {
    try {
        await dbConnect();
        const products = await Product.find({ category }).lean();
        return products.map(p => ({
            _id: p._id.toString(),
            title: p.title,
            price: p.price,
            images: p.images,
        }));
    } catch (error) {
        console.error(`Failed to fetch ${category} products.`, error);
        return [];
    }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category: rawCategory } = await params;
    const allowedCategories = ["men", "women", "unisex"];
    const category = rawCategory.toLowerCase();

    if (!allowedCategories.includes(category)) {
        notFound();
    }

    const products = await getCategoryProducts(category);

    return (
        <div className="container mx-auto px-4 py-12 min-h-screen">
            <div className="mb-12 border-b pb-8">
                <h1 className="text-4xl font-extrabold tracking-tight uppercase capitalize">
                    {category}&apos;s Collection
                </h1>
                <p className="text-muted-foreground mt-2">
                    Explore our exclusive premium print-on-demand streetwear for {category}.
                </p>
            </div>

            {products.length === 0 ? (
                <div className="text-center text-muted-foreground p-12 border border-dashed rounded-lg">
                    No products found in this category.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <Link key={product._id} href={`/product/${product._id}`} className="group relative">
                            <Card className="overflow-hidden border-border bg-card hover:border-primary transition-all duration-300">
                                <CardContent className="p-0 relative aspect-[3/4]">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={product.images?.[0]}
                                        alt={product.title}
                                        className="w-full h-full object-cover"
                                    />

                                    {product.images && product.images.length > 1 && (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img
                                            src={product.images[1]}
                                            alt={`${product.title} alternative`}
                                            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                        />
                                    )}

                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-sm border-t translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                                        <p className="text-sm font-bold uppercase tracking-wider text-center">View Details</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <div className="mt-4 flex justify-between items-start">
                                <h3 className="font-semibold text-foreground mr-4 leading-tight">{product.title}</h3>
                                <p className="font-medium text-foreground whitespace-nowrap">₹{product.price}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

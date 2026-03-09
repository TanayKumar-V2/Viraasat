import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminProductsPage() {
    await dbConnect();
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                    <p className="text-muted-foreground mt-2">Manage your store inventory and Qikink integrations.</p>
                </div>
                <Button asChild>
                    <Link href="/admin/products/new" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add New Product
                    </Link>
                </Button>
            </div>

            <div className="border rounded-lg bg-background overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Qikink SKU</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                    No products found. Click "Add New Product" to create one.
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product: any) => (
                                <TableRow key={product._id.toString()}>
                                    <TableCell>
                                        <div className="h-12 w-12 rounded-md overflow-hidden bg-muted">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img 
                                                src={product.images?.[0] || "https://placehold.co/100x100"} 
                                                alt={product.title}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{product.title}</TableCell>
                                    <TableCell className="capitalize">{product.category}</TableCell>
                                    <TableCell>₹{product.price}</TableCell>
                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                        {product.qikink_sku || "N/A"}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

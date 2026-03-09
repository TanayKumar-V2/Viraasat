import { MetadataRoute } from 'next'
import dbConnect from "@/lib/db";
import Product from "@/models/Product";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://viraasat.store";

  // Static routes
  const routes = [
    "",
    "/men",
    "/women",
    "/unisex",
    "/login",
    "/register"
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === "" ? 1 : 0.8,
  }));

  try {
    // Dynamic routes for products
    await dbConnect();
    const products = await Product.find({}).select('_id updatedAt').lean();
    
    const productRoutes = products.map((product) => ({
      url: `${baseUrl}/product/${product._id}`,
      lastModified: new Date(product.updatedAt || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    return [...routes, ...productRoutes];
  } catch {
    return routes;
  }
}

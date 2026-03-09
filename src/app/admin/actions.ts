"use server";

import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
    try {
        await dbConnect();

        // Basic parsing
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const priceStr = formData.get("price") as string;
        const category = formData.get("category") as string;
        const qikink_sku = formData.get("qikink_sku") as string;

        // Parse CSV-like fields
        const imagesRaw = formData.get("images") as string;
        const sizesRaw = formData.get("sizes") as string;
        const colorsRaw = formData.get("colors") as string;

        if (!title || !priceStr || !category || !qikink_sku || !imagesRaw) {
            return { success: false, error: "Missing required fields" };
        }

        const price = parseFloat(priceStr);
        if (isNaN(price)) {
            return { success: false, error: "Price must be a valid number" };
        }

        const images = imagesRaw.split(",").map(i => i.trim()).filter(Boolean);
        const sizes = sizesRaw ? sizesRaw.split(",").map(i => i.trim()).filter(Boolean) : ["S", "M", "L", "XL"];
        const colors = colorsRaw ? colorsRaw.split(",").map(i => i.trim()).filter(Boolean) : ["Black"];

        const newProduct = await Product.create({
            title,
            description,
            price,
            category,
            qikink_sku,
            images,
            sizes,
            colors,
        });

        // Tell Next.js to purge its static cache for the store pages so the new product appears instantly
        revalidatePath("/");
        revalidatePath("/men");
        revalidatePath("/women");
        revalidatePath("/unisex");
        revalidatePath("/admin/products");

        return { success: true, id: newProduct._id.toString() };

    } catch (error: any) {
        console.error("Failed to create product:", error);
        return { success: false, error: error.message || "Failed to create product in database" };
    }
}

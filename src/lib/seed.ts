import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import dbConnect from "./db";
import Product from "../models/Product";

const dummyProducts = [
    // Men
    {
        title: "Cyberpunk Oversized Tee",
        description: "Premium oversized drop-shoulder t-shirt featuring cyberpunk aesthetics. 100% combed cotton.",
        price: 999,
        category: "men",
        images: ["https://placehold.co/600x800/111111/FFFFFF/png?text=Cyberpunk+Tee", "https://placehold.co/600x800/222222/FFFFFF/png?text=Back+View"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "White"],
        qikink_sku: "M-OVR-CYB-01",
    },
    {
        title: "Glitch Art Hoodie",
        description: "Heavyweight 320 GSM hoodie with vibrant glitch art backprint. Perfect for winter streetwear.",
        price: 1899,
        category: "men",
        images: ["https://placehold.co/600x800/111111/FFFFFF/png?text=Glitch+Hoodie", "https://placehold.co/600x800/222222/FFFFFF/png?text=Hoodie+Detail"],
        sizes: ["M", "L", "XL"],
        colors: ["Black"],
        qikink_sku: "M-HOD-GLT-02",
    },
    {
        title: "Minimalist Essential Joggers",
        description: "Comfortable organic cotton joggers with subtle logo embroidery. Tapered fit.",
        price: 1299,
        category: "men",
        images: ["https://placehold.co/600x800/111111/FFFFFF/png?text=Essential+Joggers"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Grey Melange", "Black"],
        qikink_sku: "M-JOG-ESS-03",
    },
    // Women
    {
        title: "Neon Genesis Crop Top",
        description: "Slim fit crop top with retro-futuristic neon prints. Soft and breathable fabric.",
        price: 699,
        category: "women",
        images: ["https://placehold.co/600x800/111111/FFFFFF/png?text=Neon+Crop+Top"],
        sizes: ["XS", "S", "M", "L"],
        colors: ["White", "Neon Pink"],
        qikink_sku: "W-CRP-NEO-01",
    },
    {
        title: "Holographic Anime Jacket",
        description: "Water-resistant windbreaker jacket with holographic anime motifs on the sleeves.",
        price: 2499,
        category: "women",
        images: ["https://placehold.co/600x800/111111/FFFFFF/png?text=Holo+Jacket", "https://placehold.co/600x800/222222/FFFFFF/png?text=Sleeve+Detail"],
        sizes: ["S", "M", "L"],
        colors: ["Black/Holo"],
        qikink_sku: "W-JKT-HOL-02",
    },
    {
        title: "Street Ninja Cargo Pants",
        description: "High-waisted techwear cargo pants with multiple utility pockets and adjustable straps.",
        price: 1599,
        category: "women",
        images: ["https://placehold.co/600x800/111111/FFFFFF/png?text=Ninja+Cargos"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Olive Green", "Black"],
        qikink_sku: "W-CRG-NJA-03",
    }
];

async function seed() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined.");
        }
        await dbConnect();
        console.log("Connected to MongoDB.");

        await Product.deleteMany({});
        console.log("Cleared existing products.");

        await Product.insertMany(dummyProducts);
        console.log("Successfully seeded 6 dummy products.");

    } catch (error) {
        console.error("Error seeding data:", error);
    } finally {
        process.exit(0);
    }
}

seed();

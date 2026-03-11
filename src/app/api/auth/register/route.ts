import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { z } from "zod";
import { authRatelimit } from "@/lib/ratelimit";

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: Request) {
    // 1. Rate Limiting
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await authRatelimit.limit(ip);
    
    if (!success) {
        return NextResponse.json(
            { message: "Too many requests. Please try again later." },
            { status: 429 }
        );
    }

    try {
        const body = await req.json();
        const parseResult = registerSchema.safeParse(body);

        if (!parseResult.success) {
            return NextResponse.json(
                { message: parseResult.error.issues[0].message },
                { status: 400 }
            );
        }

        const { name, email, password } = parseResult.data;

        await dbConnect();

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists with this email" },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return NextResponse.json(
            { message: "User created successfully", userId: user._id },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

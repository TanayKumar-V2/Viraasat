import { NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db";
import Contact from "@/models/Contact";

const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parseResult = contactSchema.safeParse(body);

        if (!parseResult.success) {
            return NextResponse.json(
                { message: parseResult.error.issues[0].message },
                { status: 400 }
            );
        }

        const { name, email, message } = parseResult.data;

        await dbConnect();
        
        await Contact.create({
            name,
            email,
            message,
        });

        // Simulate a slight delay for realism
        await new Promise(resolve => setTimeout(resolve, 800));

        return NextResponse.json(
            { message: "Thank you for your message. We will get back to you soon." },
            { status: 200 }
        );
    } catch (error) {
        console.error("Contact form error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

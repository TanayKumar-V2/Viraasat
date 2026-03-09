import { NextResponse } from "next/server";

// We'll use the Keys from .env but map them to ClientId and client_secret
const QIKINK_API_KEY = process.env.QIKINK_API_KEY || "";
const QIKINK_API_SECRET = process.env.QIKINK_API_SECRET || "";

export async function GET() {
    try {
        if (!QIKINK_API_KEY || !QIKINK_API_SECRET) {
            return NextResponse.json({
                success: false,
                message: "Qikink API credentials are missing from .env",
            }, { status: 500 });
        }

        // 1. Qikink requires generating a temporary Access Token first
        // If API URL contains sandbox, use sandbox token route, otherwise default live.
        const baseUrl = process.env.QIKINK_API_URL?.includes("sandbox") 
            ? "https://sandbox.qikink.com" 
            : "https://api.qikink.com";
        const tokenUrl = `${baseUrl}/api/token`;
        
        const params = new URLSearchParams();
        params.append("ClientId", QIKINK_API_KEY);
        params.append("client_secret", QIKINK_API_SECRET);

        const tokenResponse = await fetch(tokenUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params.toString(),
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok || !tokenData.Accesstoken) {
            return NextResponse.json({
                success: false,
                message: "Qikink API rejected the credentials during token generation.",
                details: tokenData,
            }, { status: 401 });
        }

        // If we get an Accesstoken, it proves the ClientId and client_secret are 100% valid!
        return NextResponse.json({
            success: true,
            message: "Qikink API connection successful! Token generated.",
            token_sample: `${tokenData.Accesstoken.substring(0, 10)}...`, 
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Failed to connect to Qikink API",
            error: error instanceof Error ? error.message : "Unknown error",
        }, { status: 500 });
    }
}

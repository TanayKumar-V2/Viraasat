import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-9xl font-black text-muted mb-4">404</h1>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Page Not Found</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
                Oops! The page you are looking for doesn't exist or has been moved.
            </p>
            <div className="flex gap-4">
                <Button asChild size="lg">
                    <Link href="/">Return Home</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                    <Link href="/men">Shop Men</Link>
                </Button>
            </div>
        </div>
    );
}

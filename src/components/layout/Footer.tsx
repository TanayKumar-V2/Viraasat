import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t bg-background mt-auto py-12 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="font-bold tracking-tighter text-lg mb-4">VIRAASAT</h3>
                    <p className="text-sm text-muted-foreground">Premium Print-on-Demand streetwear. Born in the digital age, forged for the physical world.</p>
                </div>

                <div>
                    <h4 className="font-semibold mb-4">Shop</h4>
                    <ul className="space-y-2">
                        <li><Link href="/men" className="text-sm text-muted-foreground hover:text-foreground">Men&apos;s Collection</Link></li>
                        <li><Link href="/women" className="text-sm text-muted-foreground hover:text-foreground">Women&apos;s Collection</Link></li>
                        <li><Link href="/unisex" className="text-sm text-muted-foreground hover:text-foreground">Unisex Apparel</Link></li>
                        <li><Link href="/accessories" className="text-sm text-muted-foreground hover:text-foreground">Accessories</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-4">Support</h4>
                    <ul className="space-y-2">
                        <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground">FAQ</Link></li>
                        <li><Link href="/shipping" className="text-sm text-muted-foreground hover:text-foreground">Shipping Details</Link></li>
                        <li><Link href="/returns" className="text-sm text-muted-foreground hover:text-foreground">Returns & Exchanges</Link></li>
                        <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact Us</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-4">Legal</h4>
                    <ul className="space-y-2">
                        <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
                        <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
                        <li><Link href="/refunds" className="text-sm text-muted-foreground hover:text-foreground">Refund Policy</Link></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between">
                <p>© {new Date().getFullYear()} Viraasat. All rights reserved.</p>
            </div>
        </footer>
    );
}

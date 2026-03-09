import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";

async function getFeaturedProducts() {
  try {
    await dbConnect();
    const products = await Product.find({}).limit(4).lean();
    return products.map(p => ({
      _id: p._id.toString(),
      title: p.title,
      price: p.price,
      images: p.images,
      category: p.category,
    }));
  } catch (error) {
    console.error("Failed to fetch featured products. Ensure MongoDB is running.", error);
    return [];
  }
}

export const revalidate = 0; // Disable static caching so the db is queried on load

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  const heroSlides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=2000",
      title: "VIRAASAT SEASON 1",
      subtitle: "The dawn of a new era in streetwear.",
      href: "/men",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=2000",
      title: "CYBERPUNK ESSENTIALS",
      subtitle: "Gear up for the neon-lit future.",
      href: "/women",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=2000",
      title: "ANIME INSPIRED",
      subtitle: "Art that speaks your language.",
      href: "/unisex",
    }
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)]">
      {/* Hero Section with Carousel */}
      <section className="w-full relative">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {heroSlides.map((slide) => (
              <CarouselItem key={slide.id}>
                <div className="relative w-full h-[600px] sm:h-[70vh]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-6">
                    <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tighter mb-4 drop-shadow-md">
                      {slide.title}
                    </h1>
                    <p className="text-lg sm:text-2xl text-zinc-200 mb-8 max-w-2xl drop-shadow-sm">
                      {slide.subtitle}
                    </p>
                    <Link
                      href={slide.href}
                      className="bg-white text-black px-8 py-3 rounded-md font-bold hover:bg-zinc-200 transition-colors"
                    >
                      Shop Collection
                    </Link>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden sm:block">
            <CarouselPrevious className="left-8 text-black bg-white/80 hover:bg-white border-0 w-12 h-12" />
            <CarouselNext className="right-8 text-black bg-white/80 hover:bg-white border-0 w-12 h-12" />
          </div>
        </Carousel>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold tracking-tight">Featured Drops</h2>
          <Link href="/men" className="text-sm font-medium text-primary hover:underline">
            View All →
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="text-center text-muted-foreground border border-dashed rounded-lg p-12">
            No products found. Please run the seed script with a valid MONGODB_URI.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <Link key={product._id} href={`/product/${product._id}`} className="group">
                <Card className="overflow-hidden border-transparent bg-transparent hover:border-border transition-all duration-300">
                  <CardContent className="p-0 relative aspect-[3/4]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.images?.[0]}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <h3 className="font-semibold text-white truncate">{product.title}</h3>
                      <p className="text-zinc-300">₹{product.price}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Categories Banner */}
      <section className="pb-20 px-6 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/men" className="relative h-[400px] rounded-lg overflow-hidden group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1492288991661-058aa541ff43?auto=format&fit=crop&q=80&w=800" alt="Men" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <h2 className="text-4xl font-bold text-white tracking-widest uppercase">Men</h2>
          </div>
        </Link>
        <Link href="/women" className="relative h-[400px] rounded-lg overflow-hidden group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800" alt="Women" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <h2 className="text-4xl font-bold text-white tracking-widest uppercase">Women</h2>
          </div>
        </Link>
      </section>
    </div>
  );
}

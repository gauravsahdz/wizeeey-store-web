import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <div className="relative">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-bg.jpg"
          alt="Hero background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-32">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Summer Collection 2024
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Discover our latest collection of premium products. From casual wear to
            formal attire, we have everything you need to elevate your style.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Link href="/explore">
              <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                Shop Now
              </Button>
            </Link>
            <Link href="/categories">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                View Categories
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 
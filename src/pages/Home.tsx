import { useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Clock, Flame } from "lucide-react";
import HeroCarousel from "@/components/features/HeroCarousel";
import CategoryGrid from "@/components/features/CategoryGrid";
import ProductGrid from "@/components/features/ProductGrid";
import { useAdminStore } from "@/stores/adminStore";

export default function Home() {
  const products = useAdminStore((s) => s.products);
  const featured = useMemo(() => products.filter((p) => p.featured), [products]);
  const trending = useMemo(
    () => [...products].sort((a, b) => b.soldCount - a.soldCount).slice(0, 8),
    [products],
  );
  const newest = useMemo(
    () =>
      [...products]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 8),
    [products],
  );

  return (
    <div className="space-y-10 lg:space-y-16 pb-8">
      {/* Hero Carousel */}
      <section className="px-4 lg:px-6 max-w-7xl mx-auto pt-2">
        <HeroCarousel />
      </section>

      {/* Flash deals banner */}
      <section className="px-4 lg:px-6 max-w-7xl mx-auto">
        <div className="glass-strong rounded-2xl p-4 lg:p-6 flex items-center justify-between overflow-hidden refraction">
          <div className="flex items-center gap-3 relative z-10">
            <div className="size-10 lg:size-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Flame className="size-5 lg:size-6 text-primary" />
            </div>
            <div>
              <h3 className="font-display text-lg lg:text-xl font-bold text-foreground">
                Flash Sale
              </h3>
              <p className="text-xs lg:text-sm text-muted-foreground font-body">
                Ofertas que acabam em breve
              </p>
            </div>
          </div>
          <div className="flex gap-2 relative z-10">
            {["05", "23", "47"].map((n, i) => (
              <div
                key={i}
                className="glass rounded-lg px-2.5 py-1.5 lg:px-3 lg:py-2"
              >
                <span className="font-body font-bold text-sm lg:text-base tabular-nums text-foreground">
                  {n}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 lg:px-6 max-w-7xl mx-auto">
        <CategoryGrid />
      </section>

      {/* Featured */}
      <section className="px-4 lg:px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="size-5 text-gold-500" />
          <span className="text-xs font-body font-semibold text-gold-600 uppercase tracking-wide">
            Curadoria Especial
          </span>
        </div>
        <ProductGrid
          products={featured}
          title="Destaques"
          subtitle="As peças mais desejadas da temporada"
          columns={4}
        />
      </section>

      {/* Trending */}
      <section className="px-4 lg:px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="size-5 text-primary" />
          <span className="text-xs font-body font-semibold text-primary uppercase tracking-wide">
            Em Alta
          </span>
        </div>
        <ProductGrid
          products={trending}
          title="Mais Vendidos"
          subtitle="O que todo mundo está usando"
          columns={4}
        />
      </section>

      {/* Promotional banner */}
      <section className="px-4 lg:px-6 max-w-7xl mx-auto">
        <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden aspect-[16/5] sm:aspect-[16/4]">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=400&fit=crop"
            alt="Coleção verão"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/70 via-primary/30 to-transparent flex items-center">
            <div className="px-6 sm:px-10 lg:px-16">
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 text-balance">
                Coleção Verão 2025
              </h2>
              <p className="text-white/80 font-body text-sm sm:text-base max-w-md">
                Peças leves e coloridas para brilhar nesta temporada. Frescor e
                elegância em cada detalhe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newest */}
      <section className="px-4 lg:px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="size-5 text-gold-500" />
          <span className="text-xs font-body font-semibold text-gold-600 uppercase tracking-wide">
            Acabou de Chegar
          </span>
        </div>
        <ProductGrid
          products={newest}
          title="Novidades"
          subtitle="As últimas peças adicionadas à nossa coleção"
          columns={4}
        />
      </section>
    </div>
  );
}

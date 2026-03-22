import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAdminStore } from "@/stores/adminStore";

export default function CategoryGrid() {
  const categories = useAdminStore((s) => s.categories);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -200 : 200,
      behavior: "smooth",
    });
  };

  return (
    <section>
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="font-display text-2xl lg:text-3xl font-semibold text-foreground">
            Categorias
          </h2>
          <p className="text-sm text-muted-foreground font-body mt-1">
            Encontre seu estilo
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            className="hidden sm:flex p-1.5 rounded-full border border-border hover:bg-muted transition-colors"
            aria-label="Anterior"
          >
            <ChevronLeft className="size-4 text-foreground/60" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="hidden sm:flex p-1.5 rounded-full border border-border hover:bg-muted transition-colors"
            aria-label="Próximo"
          >
            <ChevronRight className="size-4 text-foreground/60" />
          </button>
          <Link
            to="/produtos"
            className="text-sm font-body font-medium text-primary hover:underline ml-1"
          >
            Ver tudo →
          </Link>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 lg:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 -mx-4 px-4"
      >
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
            className="snap-start shrink-0"
          >
            <Link
              to={`/produtos?categoria=${cat.slug}`}
              className="group flex flex-col items-center gap-2 w-20 lg:w-24"
            >
              <div className="relative size-16 lg:size-20 rounded-full overflow-hidden ring-2 ring-gold-200/60 group-hover:ring-gold-400 transition-all duration-300 shadow-md group-hover:shadow-lg">
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <span className="text-xs lg:text-sm font-body font-medium text-foreground/70 group-hover:text-gold-600 text-center leading-tight transition-colors line-clamp-2">
                {cat.name}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

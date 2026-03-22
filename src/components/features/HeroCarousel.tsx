import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAdminStore } from "@/stores/adminStore";

export default function HeroCarousel() {
  const banners = useAdminStore((s) => s.banners);
  const [current, setCurrent] = useState(0);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % (banners.length || 1)),
    [banners.length],
  );
  const prev = useCallback(
    () =>
      setCurrent(
        (c) => (c - 1 + (banners.length || 1)) % (banners.length || 1),
      ),
    [banners.length],
  );

  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next]);

  if (!banners.length) return null;

  const banner = banners[current];

  return (
    <section className="relative w-full overflow-hidden rounded-2xl lg:rounded-3xl">
      {/* Aspect ratio container */}
      <div className="relative w-full aspect-[16/8] sm:aspect-[16/6] lg:aspect-[16/5]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            {/* Glass overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="px-6 sm:px-10 lg:px-16 max-w-lg">
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="font-display text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-2 lg:mb-3 text-balance"
                >
                  {banner.title}
                </motion.h2>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="text-white/85 font-body text-sm sm:text-base lg:text-lg mb-4 lg:mb-6"
                >
                  {banner.subtitle}
                </motion.p>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link
                    to={banner.link}
                    className="inline-flex items-center px-6 py-2.5 lg:px-8 lg:py-3 bg-white/20 backdrop-blur-md text-white font-body font-semibold text-sm lg:text-base rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-300"
                  >
                    Conferir
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 size-9 lg:size-10 rounded-full glass flex items-center justify-center text-white/80 hover:text-white transition-colors"
          aria-label="Anterior"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 size-9 lg:size-10 rounded-full glass flex items-center justify-center text-white/80 hover:text-white transition-colors"
          aria-label="Próximo"
        >
          <ChevronRight className="size-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "w-6 bg-white" : "w-1.5 bg-white/50"
              }`}
              aria-label={`Banner ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

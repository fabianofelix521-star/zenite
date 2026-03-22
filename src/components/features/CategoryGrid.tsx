import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAdminStore } from "@/stores/adminStore";

export default function CategoryGrid() {
  const categories = useAdminStore((s) => s.categories);

  return (
    <section>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl lg:text-3xl font-semibold text-foreground">
            Categorias
          </h2>
          <p className="text-sm text-muted-foreground font-body mt-1">
            Encontre seu estilo
          </p>
        </div>
        <Link
          to="/produtos"
          className="text-sm font-body font-medium text-primary hover:underline"
        >
          Ver tudo →
        </Link>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link
              to={`/produtos?categoria=${cat.slug}`}
              className="group block relative rounded-2xl overflow-hidden aspect-[3/4]"
            >
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3 lg:p-4">
                <h3 className="font-display text-sm lg:text-base font-semibold text-white">
                  {cat.name}
                </h3>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

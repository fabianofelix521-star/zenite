import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { useAdminStore } from "@/stores/adminStore";
import { formatPrice } from "@/lib/utils";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const products = useAdminStore((s) => s.products);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    const q = query.toLowerCase();
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q)),
      )
      .slice(0, 6);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/produtos?busca=${encodeURIComponent(query)}`);
      onClose();
      setQuery("");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-modal"
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative max-w-2xl mx-auto mt-20 mx-4"
          >
            <div className="glass-strong rounded-2xl overflow-hidden shadow-2xl mx-4">
              <form onSubmit={handleSubmit} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Buscar vestidos, blusas, acessórios..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-transparent font-body text-base text-foreground placeholder:text-muted-foreground outline-none"
                />
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
                  aria-label="Fechar busca"
                >
                  <X className="size-4" />
                </button>
              </form>

              {results.length > 0 && (
                <div className="border-t border-border max-h-80 overflow-y-auto">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      to={`/produto/${product.slug}`}
                      onClick={() => {
                        onClose();
                        setQuery("");
                      }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="size-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-body font-medium text-foreground truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-muted-foreground font-body">
                          {product.category}
                        </p>
                      </div>
                      <span className="price-tag text-sm">
                        {formatPrice(product.price)}
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {query.length >= 2 && results.length === 0 && (
                <div className="border-t border-border px-4 py-6 text-center">
                  <p className="text-sm text-muted-foreground font-body">
                    Nenhum produto encontrado
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

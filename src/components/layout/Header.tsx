import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ShoppingBag, Heart, Settings, X } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useSearch } from "@/hooks/useSearch";
import { STORE_CONFIG } from "@/constants/config";
import { useAdminStore } from "@/stores/adminStore";
import { useAuthStore } from "@/stores/authStore";
import SearchOverlay from "@/components/features/SearchOverlay";

export default function Header() {
  const categories = useAdminStore((s) => s.categories);
  const [scrolled, setScrolled] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const {
    isOpen: searchOpen,
    setIsOpen: setSearchOpen,
    query,
    setQuery,
  } = useSearch();
  const totalItems = useCartStore((s) => s.totalItems());
  const isAdmin = useAuthStore((s) => s.isAdmin);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-header transition-all duration-300 ${
          scrolled ? "bg-white shadow-sm border-b border-border" : "bg-white"
        }`}
      >
        {/* Top bar - promo */}
        <div className="bg-gold-400/90 text-white text-center py-1.5 text-xs font-body tracking-wide font-medium">
          Frete grátis em compras acima de R$ 299 | Até 6x sem juros
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 lg:h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-1.5 shrink-0">
              <span className="font-display text-xl lg:text-2xl font-semibold text-gold-gradient tracking-tight">
                {STORE_CONFIG.name}
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {categories.slice(0, 5).map((cat) => (
                <Link
                  key={cat.id}
                  to={`/produtos?categoria=${cat.slug}`}
                  className="px-3 py-2 text-sm font-body font-medium text-foreground/70 hover:text-gold-600 rounded-lg hover:bg-muted transition-all duration-200"
                >
                  {cat.name}
                </Link>
              ))}
              <Link
                to="/produtos"
                className="px-3 py-2 text-sm font-body font-medium text-gold-600 hover:bg-muted rounded-lg transition-all duration-200"
              >
                Ver Tudo
              </Link>
            </nav>

            {/* Search bar + Cart (all screens) */}
            <div className="flex items-center gap-1.5 lg:gap-2">
              {/* Mobile: collapsible search */}
              <div className="flex lg:hidden items-center">
                {searchExpanded ? (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "auto", opacity: 1 }}
                    className="flex items-center"
                  >
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Buscar..."
                        autoFocus
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setSearchOpen(true)}
                        className="w-36 pl-8 pr-2 py-2 rounded-xl border border-border bg-muted/50 text-sm font-body focus:outline-none focus:ring-2 focus:ring-gold-400/40"
                      />
                    </div>
                    <button
                      onClick={() => {
                        setSearchExpanded(false);
                        setQuery("");
                      }}
                      className="p-2 rounded-xl hover:bg-muted transition-colors ml-0.5"
                    >
                      <X className="size-4 text-foreground/50" />
                    </button>
                  </motion.div>
                ) : (
                  <button
                    onClick={() => setSearchExpanded(true)}
                    className="p-2.5 rounded-xl hover:bg-muted transition-colors"
                    aria-label="Buscar"
                  >
                    <Search className="size-5 text-gold-600" />
                  </button>
                )}
              </div>

              {/* Desktop: search button opens overlay */}
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden lg:flex p-2.5 rounded-xl hover:bg-muted transition-colors"
                aria-label="Buscar"
              >
                <Search className="size-5 text-gold-600" />
              </button>

              {/* Desktop extras */}
              <Link
                to="/favoritos"
                className="hidden lg:flex p-2.5 rounded-xl hover:bg-muted transition-colors"
                aria-label="Favoritos"
              >
                <Heart className="size-5 text-gold-600" />
              </Link>

              {/* Cart - visible on ALL screens */}
              <Link
                to="/carrinho"
                className="relative p-2.5 rounded-xl hover:bg-muted transition-colors"
                aria-label="Carrinho"
              >
                <ShoppingBag className="size-5 text-gold-600" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 size-5 flex items-center justify-center bg-gold text-white text-[10px] font-bold rounded-full"
                  >
                    {totalItems > 9 ? "9+" : totalItems}
                  </motion.span>
                )}
              </Link>

              {/* Admin link - desktop only, only for admins */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="hidden lg:flex p-2.5 rounded-xl hover:bg-muted transition-colors"
                  aria-label="Admin"
                >
                  <Settings className="size-5 text-gold-600" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Search overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Header spacer */}
      <div className="h-[calc(3.5rem+28px)] lg:h-[calc(4rem+28px)]" />
    </>
  );
}

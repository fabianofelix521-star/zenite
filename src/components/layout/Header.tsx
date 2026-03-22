import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, Menu, X, Heart, User } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useSearch } from "@/hooks/useSearch";
import { STORE_CONFIG } from "@/constants/config";
import { useAdminStore } from "@/stores/adminStore";
import SearchOverlay from "@/components/features/SearchOverlay";

export default function Header() {
  const categories = useAdminStore((s) => s.categories);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isOpen: searchOpen, setIsOpen: setSearchOpen } = useSearch();
  const totalItems = useCartStore((s) => s.totalItems());
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

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
            {/* Mobile menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Menu"
            >
              {menuOpen ? (
                <X className="size-5 text-gold-600" />
              ) : (
                <Menu className="size-5 text-gold-600" />
              )}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-1.5">
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

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-xl hover:bg-muted transition-colors"
                aria-label="Buscar"
              >
                <Search className="size-5 text-gold-600" />
              </button>
              <Link
                to="/favoritos"
                className="hidden sm:flex p-2.5 rounded-xl hover:bg-muted transition-colors"
                aria-label="Favoritos"
              >
                <Heart className="size-5 text-gold-600" />
              </Link>
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
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-overlay lg:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-72 glass-strong z-modal lg:hidden shadow-2xl"
              style={{
                background: "white",
                borderRadius: "0 24px 24px 0",
              }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-display text-xl font-semibold text-gold-gradient">
                    {STORE_CONFIG.name}
                  </span>
                  <button
                    onClick={() => setMenuOpen(false)}
                    aria-label="Fechar"
                  >
                    <X className="size-5 text-gold-600" />
                  </button>
                </div>
                <nav className="space-y-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/produtos?categoria=${cat.slug}`}
                      className="block px-4 py-3 text-sm font-body font-medium text-foreground/80 hover:text-gold-600 hover:bg-muted rounded-xl transition-all"
                    >
                      {cat.name}
                    </Link>
                  ))}
                  <div className="border-t border-border my-4" />
                  <Link
                    to="/produtos"
                    className="block px-4 py-3 text-sm font-body font-semibold text-gold-600 hover:bg-muted rounded-xl transition-all"
                  >
                    Ver Todos os Produtos
                  </Link>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Header spacer */}
      <div className="h-[calc(3.5rem+28px)] lg:h-[calc(4rem+28px)]" />
    </>
  );
}

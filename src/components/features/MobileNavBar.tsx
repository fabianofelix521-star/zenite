import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ShoppingBag, Heart, Search, Settings, User } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useSearch } from "@/hooks/useSearch";

export default function MobileNavBar() {
  const location = useLocation();
  const totalItems = useCartStore((s) => s.totalItems());
  const { setIsOpen: setSearchOpen } = useSearch();

  // Hide on product detail pages (FloatingBar is shown there instead)
  if (location.pathname.startsWith("/produto/")) return null;
  // Hide on admin pages
  if (location.pathname.startsWith("/admin")) return null;

  const isActive = (path: string) => location.pathname === path;

  const items = [
    { path: "/", icon: Home, label: "Início" },
    { path: "search", icon: Search, label: "Buscar" },
    { path: "/carrinho", icon: ShoppingBag, label: "Carrinho", badge: totalItems },
    { path: "/favoritos", icon: Heart, label: "Favoritos" },
    { path: "/admin", icon: Settings, label: "Admin" },
  ];

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 28, stiffness: 300, delay: 0.3 }}
      className="fixed bottom-4 left-4 right-4 z-header lg:hidden"
    >
      <nav
        className="flex items-center justify-around px-2 py-2.5 rounded-[28px]"
        style={{
          background: "rgba(255, 255, 255, 0.55)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          boxShadow:
            "0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
          border: "1px solid rgba(255, 255, 255, 0.45)",
        }}
      >
        {items.map((item) => {
          const active = item.path === "search" ? false : isActive(item.path);

          if (item.path === "search") {
            return (
              <button
                key={item.path}
                onClick={() => setSearchOpen(true)}
                className="relative flex flex-col items-center justify-center w-14 h-11 rounded-2xl transition-all duration-200"
                aria-label={item.label}
              >
                <item.icon
                  className="size-[22px] text-foreground/50"
                  strokeWidth={1.8}
                />
                <span className="text-[9px] font-body font-medium text-foreground/40 mt-0.5">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center justify-center w-14 h-11 rounded-2xl transition-all duration-200 ${
                active
                  ? "bg-gold-400/15"
                  : ""
              }`}
              aria-label={item.label}
            >
              <item.icon
                className={`size-[22px] transition-colors ${
                  active ? "text-gold-600" : "text-foreground/50"
                }`}
                strokeWidth={active ? 2.2 : 1.8}
              />
              {item.badge ? (
                <span className="absolute top-0.5 right-2 size-4 flex items-center justify-center bg-gold text-white text-[8px] font-bold rounded-full">
                  {item.badge > 9 ? "9+" : item.badge}
                </span>
              ) : null}
              <span
                className={`text-[9px] font-body font-medium mt-0.5 transition-colors ${
                  active ? "text-gold-600" : "text-foreground/40"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </motion.div>
  );
}

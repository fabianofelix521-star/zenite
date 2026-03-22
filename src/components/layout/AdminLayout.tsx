import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FolderOpen,
  Monitor,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { STORE_CONFIG } from "@/constants/config";

const NAV_ITEMS = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart },
  { path: "/admin/produtos", label: "Produtos", icon: Package },
  { path: "/admin/categorias", label: "Categorias", icon: FolderOpen },
  { path: "/admin/home-editor", label: "Editar Tela Inicial", icon: Monitor },
  { path: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-6 py-6 border-b border-border">
        <Link to="/admin" className="flex items-center gap-2">
          <span className="font-display text-xl font-semibold text-gold-gradient">
            {STORE_CONFIG.name}
          </span>
        </Link>
        <span className="text-xs text-muted-foreground font-body mt-1 block">
          Painel Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-body font-medium transition-all duration-200 cursor-pointer ${
                active
                  ? "bg-gold-400/15 text-gold-600 shadow-lg shadow-gold-400/5"
                  : "text-foreground/60 hover:text-gold-600 hover:bg-muted"
              }`}
            >
              <Icon
                className={`size-5 ${active ? "text-gold-600" : "text-gold-600/50"}`}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-border">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-body font-medium text-foreground/60 hover:text-gold-600 hover:bg-muted transition-all cursor-pointer"
        >
          <LogOut className="size-5 text-gold-600/50" />
          Voltar à Loja
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex lg:w-64 flex-col fixed inset-y-0 left-0 z-30 border-r border-border"
        style={{
          background: "white",
          borderRadius: "0",
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-64 flex flex-col z-50 lg:hidden shadow-2xl border-r border-border"
              style={{
                background: "white",
                borderRadius: "0 24px 24px 0",
              }}
            >
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Fechar menu"
                  className="p-2 rounded-xl hover:bg-muted cursor-pointer"
                >
                  <X className="size-5 text-gold-600" />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 lg:ml-64">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-20 bg-white shadow-sm px-4 py-3 flex items-center gap-3 border-b border-border">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl hover:bg-muted cursor-pointer"
            aria-label="Abrir menu"
          >
            <Menu className="size-5 text-gold-600" />
          </button>
          <span className="font-display text-lg font-semibold text-gold-gradient">
            {STORE_CONFIG.name}
          </span>
        </header>

        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

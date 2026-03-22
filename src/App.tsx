import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import AdminLayout from "@/components/layout/AdminLayout";
import { Toaster } from "@/components/ui/toaster";
import { useAdminStore } from "@/stores/adminStore";

const Home = lazy(() => import("@/pages/Home"));
const Products = lazy(() => import("@/pages/Products"));
const ProductDetail = lazy(() => import("@/pages/ProductDetail"));
const Cart = lazy(() => import("@/pages/Cart"));
const Checkout = lazy(() => import("@/pages/Checkout"));

const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AdminOrders = lazy(() => import("@/pages/admin/Orders"));
const AdminProducts = lazy(() => import("@/pages/admin/Products"));
const AdminCategories = lazy(() => import("@/pages/admin/Categories"));
const AdminHomeEditor = lazy(() => import("@/pages/admin/HomeEditor"));
const AdminSettings = lazy(() => import("@/pages/admin/Settings"));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="size-10 rounded-full border-2 border-gold-400/20 border-t-gold-400 animate-spin" />
        <span className="text-sm font-body text-muted-foreground">
          Carregando...
        </span>
      </div>
    </div>
  );
}

export default function App() {
  const hydrate = useAdminStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/produtos" element={<Products />} />
            <Route path="/produto/:slug" element={<ProductDetail />} />
            <Route path="/carrinho" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/favoritos" element={<Products />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="pedidos" element={<AdminOrders />} />
            <Route path="produtos" element={<AdminProducts />} />
            <Route path="categorias" element={<AdminCategories />} />
            <Route path="home-editor" element={<AdminHomeEditor />} />
            <Route path="configuracoes" element={<AdminSettings />} />
          </Route>
        </Routes>
      </Suspense>
      <Toaster />
    </BrowserRouter>
  );
}

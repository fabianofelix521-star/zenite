import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowRight, Trash2, Tag } from "lucide-react";
import CartItemCard from "@/components/features/CartItemCard";
import ShippingCalculator from "@/components/features/ShippingCalculator";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";
import { ShippingOption } from "@/types";

export default function Cart() {
  const { items, clearCart, totalPrice } = useCartStore();
  const navigate = useNavigate();
  const [shipping, setShipping] = useState<ShippingOption | null>(null);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const subtotal = totalPrice();
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const shippingCost = shipping?.price || 0;
  const freeShipping = subtotal >= 299;
  const finalShipping = freeShipping ? 0 : shippingCost;
  const total = subtotal - discount + finalShipping;

  const handleApplyCoupon = () => {
    if (coupon.toLowerCase() === "rose10") {
      setCouponApplied(true);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto"
        >
          <div className="size-20 mx-auto mb-6 rounded-3xl glass flex items-center justify-center">
            <ShoppingBag className="size-8 text-primary/50" />
          </div>
          <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
            Seu carrinho está vazio
          </h2>
          <p className="text-sm text-muted-foreground font-body mb-6">
            Que tal adicionar algumas peças lindas?
          </p>
          <Link
            to="/produtos"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-body font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            Explorar produtos
            <ArrowRight className="size-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 lg:py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs font-body text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary transition-colors">
          Início
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">Carrinho</span>
      </nav>

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
          Meu Carrinho
          <span className="text-muted-foreground text-lg font-normal ml-2">
            ({items.length})
          </span>
        </h1>
        <button
          onClick={clearCart}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive font-body transition-colors"
        >
          <Trash2 className="size-4" />
          Limpar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Items */}
        <div className="lg:col-span-8 space-y-3">
          {freeShipping && (
            <div className="glass-strong rounded-xl p-3 flex items-center gap-2 text-sm font-body text-green-700">
              <span className="text-base">🎉</span>
              Parabéns! Você ganhou <strong>frete grátis!</strong>
            </div>
          )}
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.name}`}
                layout
                exit={{ opacity: 0, x: -50 }}
              >
                <CartItemCard item={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28 space-y-4">
            {/* Coupon */}
            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="size-4 text-primary" />
                <h3 className="text-sm font-body font-semibold text-foreground">
                  Cupom de desconto
                </h3>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="ROSE10"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  disabled={couponApplied}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-muted/30 border border-border font-body text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-gold-400/30 disabled:opacity-50"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={couponApplied || !coupon}
                  className="px-4 py-2.5 rounded-xl bg-primary text-white font-body font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 shrink-0"
                >
                  {couponApplied ? "✓" : "Aplicar"}
                </button>
              </div>
              {couponApplied && (
                <p className="text-xs text-green-600 font-body mt-2">
                  Cupom ROSE10 aplicado: 10% de desconto!
                </p>
              )}
            </div>

            {/* Shipping */}
            <div className="glass-card rounded-2xl p-4">
              <ShippingCalculator onSelect={setShipping} selected={shipping} />
            </div>

            {/* Summary */}
            <div className="glass-strong rounded-2xl p-5 space-y-3">
              <h3 className="font-display text-lg font-semibold text-foreground">
                Resumo
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-body">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-green-600">Desconto</span>
                    <span className="text-green-600">
                      -{formatPrice(discount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-body">
                  <span className="text-muted-foreground">Frete</span>
                  <span
                    className={
                      freeShipping
                        ? "text-green-600 font-medium"
                        : "text-foreground"
                    }
                  >
                    {freeShipping
                      ? "Grátis"
                      : finalShipping > 0
                        ? formatPrice(finalShipping)
                        : "Calcular"}
                  </span>
                </div>
                <div className="border-t border-border pt-2">
                  <div className="flex justify-between">
                    <span className="font-body font-semibold text-foreground">
                      Total
                    </span>
                    <span className="price-tag text-xl">
                      {formatPrice(total)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-body text-right mt-0.5">
                    ou 6x de {formatPrice(total / 6)} sem juros
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-white font-body font-bold text-base hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                Finalizar Compra
                <ArrowRight className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

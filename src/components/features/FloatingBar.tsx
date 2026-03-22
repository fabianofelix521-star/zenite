import { motion } from "framer-motion";
import { ShoppingBag, Zap } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface FloatingBarProps {
  price: number;
  onAddToCart: () => void;
  onBuyNow: () => void;
  disabled?: boolean;
}

export default function FloatingBar({
  price,
  onAddToCart,
  onBuyNow,
  disabled,
}: FloatingBarProps) {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-header lg:hidden"
    >
      <div className="glass-strong border-t border-border px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <span className="price-tag text-lg text-gold-400">
              {formatPrice(price)}
            </span>
          </div>
          <button
            onClick={onAddToCart}
            disabled={disabled}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-gold-400 text-gold-400 font-body font-semibold text-sm hover:bg-gold-400/10 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <ShoppingBag className="size-4" />
            Carrinho
          </button>
          <button
            onClick={onBuyNow}
            disabled={disabled}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gold text-white font-body font-semibold text-sm hover:opacity-90 transition-colors shadow-lg shadow-gold-400/20 disabled:opacity-50 cursor-pointer"
          >
            <Zap className="size-4" />
            Comprar
          </button>
        </div>
      </div>
    </motion.div>
  );
}

import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem as CartItemType } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cartStore";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItemCard({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const { product, quantity, selectedSize, selectedColor } = item;

  return (
    <div className="glass-card rounded-2xl p-4 flex gap-4">
      <img
        src={product.images[0]}
        alt={product.name}
        className="size-24 sm:size-28 rounded-xl object-cover shrink-0"
      />
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h3 className="font-body text-sm font-medium text-foreground line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="size-4 rounded-full border border-black/10 shrink-0"
              style={{ backgroundColor: selectedColor.hex }}
            />
            <span className="text-xs text-muted-foreground font-body">
              {selectedColor.name} · {selectedSize}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() =>
                updateQuantity(
                  product.id,
                  selectedSize,
                  selectedColor.name,
                  quantity - 1,
                )
              }
              disabled={quantity <= 1}
              className="size-8 rounded-lg glass flex items-center justify-center disabled:opacity-40 hover:bg-muted/50 transition-colors"
              aria-label="Diminuir quantidade"
            >
              <Minus className="size-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-body font-semibold tabular-nums">
              {quantity}
            </span>
            <button
              onClick={() =>
                updateQuantity(
                  product.id,
                  selectedSize,
                  selectedColor.name,
                  quantity + 1,
                )
              }
              className="size-8 rounded-lg glass flex items-center justify-center hover:bg-muted/50 transition-colors"
              aria-label="Aumentar quantidade"
            >
              <Plus className="size-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="price-tag text-base">
              {formatPrice(product.price * quantity)}
            </span>
            <button
              onClick={() =>
                removeItem(product.id, selectedSize, selectedColor.name)
              }
              className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              aria-label="Remover item"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

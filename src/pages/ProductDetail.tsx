import { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star,
  ShoppingBag,
  Zap,
  Truck,
  Shield,
  RotateCcw,
  Share2,
  Heart,
  Check,
} from "lucide-react";
import ProductGallery from "@/components/features/ProductGallery";
import SizeColorPicker from "@/components/features/SizeColorPicker";
import FloatingBar from "@/components/features/FloatingBar";
import ShippingCalculator from "@/components/features/ShippingCalculator";
import ProductGrid from "@/components/features/ProductGrid";
import { useAdminStore } from "@/stores/adminStore";
import { formatPrice, calcDiscount } from "@/lib/utils";
import { useCartStore } from "@/stores/cartStore";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const products = useAdminStore((s) => s.products);
  const addItem = useCartStore((s) => s.addItem);
  const { toast } = useToast();

  const product = useMemo(() => products.find((p) => p.slug === slug), [slug, products]);

  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || "");
  const [selectedColor, setSelectedColor] = useState(
    product?.colors[0] || { name: "", hex: "" },
  );
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);

  const related = useMemo(() => {
    if (!product) return [];
    return products.filter(
      (p) => p.categorySlug === product.categorySlug && p.id !== product.id,
    ).slice(0, 4);
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-2xl font-semibold mb-4">
          Produto não encontrado
        </h2>
        <Link to="/produtos" className="text-primary font-body hover:underline">
          Voltar aos produtos
        </Link>
      </div>
    );
  }

  const discount = calcDiscount(product.originalPrice, product.price);

  const handleAddToCart = () => {
    addItem(product, selectedSize, selectedColor, quantity);
    toast({
      title: "Adicionado ao carrinho!",
      description: `${product.name} - ${selectedColor.name}, ${selectedSize}`,
    });
  };

  const handleBuyNow = () => {
    addItem(product, selectedSize, selectedColor, quantity);
    navigate("/carrinho");
  };

  return (
    <div className="pb-floating lg:pb-8">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 lg:py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs font-body text-muted-foreground mb-4 lg:mb-6">
          <Link to="/" className="hover:text-primary transition-colors">
            Início
          </Link>
          <span>/</span>
          <Link
            to={`/produtos?categoria=${product.categorySlug}`}
            className="hover:text-primary transition-colors"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate">
            {product.name}
          </span>
        </nav>

        {/* Product layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          {/* Gallery - 7 cols */}
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} name={product.name} />
          </div>

          {/* Info - 5 cols */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:sticky lg:top-28 space-y-5"
            >
              {/* Title & price */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h1 className="font-display text-xl lg:text-2xl font-bold text-foreground leading-tight text-balance">
                    {product.name}
                  </h1>
                  <button
                    onClick={() => setLiked(!liked)}
                    className="shrink-0 size-10 rounded-xl glass flex items-center justify-center hover:scale-105 transition-transform"
                    aria-label="Favoritar"
                  >
                    <Heart
                      className={`size-5 ${liked ? "fill-primary text-primary" : "text-foreground/50"}`}
                    />
                  </button>
                </div>

                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="size-4 fill-gold-400 text-gold-400" />
                    <span className="text-sm font-body font-semibold">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground font-body">
                    {product.reviewCount} avaliações
                  </span>
                  <span className="text-xs text-muted-foreground font-body">
                    {product.soldCount} vendidos
                  </span>
                </div>

                <div className="flex items-baseline gap-3 mt-4">
                  <span className="price-tag text-2xl lg:text-3xl">
                    {formatPrice(product.price)}
                  </span>
                  {discount > 0 && (
                    <>
                      <span className="text-base text-muted-foreground line-through font-body">
                        {formatPrice(product.originalPrice)}
                      </span>
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-body font-bold rounded-lg">
                        -{discount}%
                      </span>
                    </>
                  )}
                </div>
                <p className="text-xs text-muted-foreground font-body mt-1">
                  ou 6x de {formatPrice(product.price / 6)} sem juros
                </p>
              </div>

              {/* Separator */}
              <div className="border-t border-border" />

              {/* Size & Color */}
              <SizeColorPicker
                sizes={product.sizes}
                colors={product.colors}
                selectedSize={selectedSize}
                selectedColor={selectedColor}
                onSizeChange={setSelectedSize}
                onColorChange={setSelectedColor}
              />

              {/* Quantity */}
              <div>
                <span className="text-sm font-body font-medium text-foreground mb-2 block">
                  Quantidade
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center glass-card rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-foreground hover:bg-muted transition-colors font-body font-semibold"
                    >
                      −
                    </button>
                    <span className="px-4 py-2 text-sm font-body font-semibold tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 text-foreground hover:bg-muted transition-colors font-body font-semibold"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-muted-foreground font-body">
                    {product.stock <= 5 ? (
                      <span className="text-gold-600">
                        Apenas {product.stock} em estoque!
                      </span>
                    ) : (
                      `${product.stock} disponíveis`
                    )}
                  </span>
                </div>
              </div>

              {/* Desktop CTA buttons */}
              <div className="hidden lg:flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border-2 border-primary text-primary font-body font-semibold hover:bg-primary/5 transition-colors"
                >
                  <ShoppingBag className="size-5" />
                  Adicionar ao Carrinho
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-white font-body font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                  <Zap className="size-5" />
                  Comprar Agora
                </button>
              </div>

              {/* Separator */}
              <div className="border-t border-border" />

              {/* Shipping */}
              <ShippingCalculator />

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Shield, label: "Compra Segura" },
                  { icon: RotateCcw, label: "7 dias troca" },
                  { icon: Truck, label: "Frete rápido" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="glass-card rounded-xl p-3 text-center"
                  >
                    <Icon className="size-5 text-primary mx-auto mb-1" />
                    <span className="text-[11px] font-body text-muted-foreground leading-tight block">
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-body font-semibold text-foreground mb-2">
                  Descrição
                </h3>
                <p className="text-sm text-muted-foreground font-body leading-relaxed text-pretty">
                  {product.description}
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-14 lg:mt-20">
            <ProductGrid
              products={related}
              title="Você também pode gostar"
              subtitle="Produtos relacionados"
              columns={4}
            />
          </section>
        )}
      </div>

      {/* Mobile floating bar */}
      <FloatingBar
        price={product.price * quantity}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />
    </div>
  );
}

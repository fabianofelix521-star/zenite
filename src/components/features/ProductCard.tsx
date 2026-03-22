import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, calcDiscount } from '@/lib/utils';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [liked, setLiked] = useState(false);
  const discount = calcDiscount(product.originalPrice, product.price);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group"
    >
      <Link to={`/produto/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative rounded-xl lg:rounded-2xl overflow-hidden aspect-[3/4] mb-2.5">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Discount badge */}
          {discount > 0 && (
            <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-primary text-white text-[11px] font-body font-bold rounded-lg">
              -{discount}%
            </span>
          )}
          
          {/* Low stock */}
          {product.stock <= 5 && (
            <span className="absolute top-2.5 right-10 px-2 py-0.5 bg-gold-500 text-white text-[11px] font-body font-bold rounded-lg">
              Últimas peças
            </span>
          )}

          {/* Heart */}
          <button
            onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
            className="absolute top-2.5 right-2.5 size-8 rounded-full glass flex items-center justify-center transition-all duration-200 hover:scale-110"
            aria-label="Favoritar"
          >
            <Heart className={`size-4 ${liked ? 'fill-primary text-primary' : 'text-white'}`} />
          </button>

          {/* Quick add overlay */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="glass-strong p-3 flex items-center justify-center gap-2">
              <ShoppingBag className="size-4 text-primary" />
              <span className="text-xs font-body font-semibold text-foreground">Ver detalhes</span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="px-0.5">
          <h3 className="font-body text-sm font-medium text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="price-tag text-base">{formatPrice(product.price)}</span>
            {discount > 0 && (
              <span className="text-xs text-muted-foreground line-through font-body">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex items-center gap-0.5">
              <Star className="size-3 fill-gold-400 text-gold-400" />
              <span className="text-xs font-body font-medium text-foreground">{product.rating}</span>
            </div>
            <span className="text-xs text-muted-foreground font-body">
              {product.soldCount} vendidos
            </span>
          </div>
          {/* Color dots */}
          <div className="flex items-center gap-1 mt-2">
            {product.colors.slice(0, 4).map((c) => (
              <span
                key={c.name}
                className="size-3.5 rounded-full border border-black/10"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[10px] text-muted-foreground font-body">+{product.colors.length - 4}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

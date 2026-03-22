import { Product } from '@/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  columns?: 2 | 3 | 4 | 5;
}

export default function ProductGrid({ products, title, subtitle, columns = 4 }: ProductGridProps) {
  const gridCols: Record<number, string> = {
    2: 'grid-cols-2 sm:grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
  };

  return (
    <section>
      {(title || subtitle) && (
        <div className="mb-6">
          {title && <h2 className="font-display text-2xl lg:text-3xl font-semibold text-foreground">{title}</h2>}
          {subtitle && <p className="text-sm text-muted-foreground font-body mt-1">{subtitle}</p>}
        </div>
      )}
      <div className={`grid ${gridCols[columns]} gap-3 lg:gap-5`}>
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </section>
  );
}

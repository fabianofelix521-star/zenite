import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  SlidersHorizontal,
  ChevronDown,
  X,
  Grid3X3,
  LayoutGrid,
} from "lucide-react";
import ProductGrid from "@/components/features/ProductGrid";
import { useAdminStore } from "@/stores/adminStore";

type SortOption =
  | "relevance"
  | "price-asc"
  | "price-desc"
  | "newest"
  | "popular";

const SORT_LABELS: Record<SortOption, string> = {
  relevance: "Relevância",
  "price-asc": "Menor preço",
  "price-desc": "Maior preço",
  newest: "Mais recentes",
  popular: "Mais vendidos",
};

export default function Products() {
  const products = useAdminStore((s) => s.products);
  const categories = useAdminStore((s) => s.categories);
  const [params] = useSearchParams();
  const categorySlug = params.get("categoria");
  const searchQuery = params.get("busca");
  const [sort, setSort] = useState<SortOption>("relevance");
  const [showFilters, setShowFilters] = useState(false);
  const [cols, setCols] = useState<2 | 4>(4);

  const filtered = useMemo(() => {
    let result = [...products];

    if (categorySlug) {
      result = result.filter((p) => p.categorySlug === categorySlug);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q)),
      );
    }

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case "popular":
        result.sort((a, b) => b.soldCount - a.soldCount);
        break;
    }

    return result;
  }, [categorySlug, searchQuery, sort, products]);

  const activeCategory = categories.find((c) => c.slug === categorySlug);
  const pageTitle =
    activeCategory?.name ||
    (searchQuery ? `Resultados para "${searchQuery}"` : "Todos os Produtos");

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 lg:py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs font-body text-muted-foreground mb-4">
        <Link to="/" className="hover:text-primary transition-colors">
          Início
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">{pageTitle}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
            {pageTitle}
          </h1>
          <p className="text-sm text-muted-foreground font-body mt-1">
            {filtered.length} produtos encontrados
          </p>
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
        <Link
          to="/produtos"
          className={`shrink-0 px-4 py-2 rounded-xl text-sm font-body font-medium transition-all ${
            !categorySlug
              ? "bg-primary text-white shadow-md shadow-primary/20"
              : "glass-card text-foreground"
          }`}
        >
          Tudo
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/produtos?categoria=${cat.slug}`}
            className={`shrink-0 px-4 py-2 rounded-xl text-sm font-body font-medium transition-all ${
              categorySlug === cat.slug
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "glass-card text-foreground"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Sort / View controls */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass-card text-sm font-body font-medium"
          >
            <SlidersHorizontal className="size-4" />
            <span className="hidden sm:inline">Filtros</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Grid toggle */}
          <div className="hidden sm:flex items-center glass-card rounded-xl overflow-hidden">
            <button
              onClick={() => setCols(4)}
              className={`p-2 transition-colors ${cols === 4 ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}
              aria-label="Grade 4 colunas"
            >
              <Grid3X3 className="size-4" />
            </button>
            <button
              onClick={() => setCols(2)}
              className={`p-2 transition-colors ${cols === 2 ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}
              aria-label="Grade 2 colunas"
            >
              <LayoutGrid className="size-4" />
            </button>
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="appearance-none px-4 py-2 pr-8 rounded-xl glass-card text-sm font-body font-medium text-foreground cursor-pointer outline-none focus:ring-2 focus:ring-primary/30"
            >
              {Object.entries(SORT_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Product grid */}
      {filtered.length > 0 ? (
        <ProductGrid products={filtered} columns={cols} />
      ) : (
        <div className="text-center py-20">
          <div className="size-16 mx-auto mb-4 rounded-2xl glass flex items-center justify-center">
            <span className="text-2xl">🔍</span>
          </div>
          <h3 className="font-display text-xl font-semibold text-foreground mb-2">
            Nenhum produto encontrado
          </h3>
          <p className="text-sm text-muted-foreground font-body mb-6">
            Tente buscar por outro termo ou categoria
          </p>
          <Link
            to="/produtos"
            className="inline-flex px-6 py-2.5 rounded-xl bg-primary text-white font-body font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            Ver todos os produtos
          </Link>
        </div>
      )}
    </div>
  );
}

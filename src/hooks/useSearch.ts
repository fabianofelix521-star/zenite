import { useState, useMemo } from 'react';
import { PRODUCTS } from '@/constants/mockData';
import { Product } from '@/types';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const results: Product[] = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    const q = query.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q))
    ).slice(0, 8);
  }, [query]);

  return { query, setQuery, results, isOpen, setIsOpen };
}

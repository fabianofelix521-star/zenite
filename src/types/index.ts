export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number;
  description: string;
  images: string[];
  sizes: string[];
  colors: ProductColor[];
  category: string;
  categorySlug: string;
  rating: number;
  reviewCount: number;
  soldCount: number;
  stock: number;
  tags: string[];
  featured: boolean;
  createdAt: string;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: ProductColor;
}

export interface Banner {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  link: string;
}

export interface ShippingOption {
  name: string;
  price: number;
  days: string;
  type: 'pac' | 'sedex' | 'express';
}

export interface Address {
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
  complemento?: string;
  numero?: string;
}

export interface OrderSummary {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
}

export const STORE_CONFIG = {
  name: "Zênite",
  tagline: "Perfumaria de Luxo",
  description:
    "Fragrâncias exclusivas e cosméticos premium. Experiência olfativa única com entrega para todo Brasil.",
  phone: "(11) 99999-0000",
  email: "contato@zenite.com.br",
  instagram: "@zenite.perfumes",
  address: "Rua Oscar Freire, 900 - Jardins, São Paulo - SP",
  cep_origin: "01426-001",
} as const;

export const CATEGORY_IMAGES: Record<string, string> = {
  vestidos:
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop",
  blusas:
    "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&h=500&fit=crop",
  saias:
    "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&h=500&fit=crop",
  calcas:
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop",
  conjuntos:
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop",
  acessorios:
    "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400&h=500&fit=crop",
};

export const SHIPPING_REGIONS: Record<
  string,
  { pacMultiplier: number; sedexMultiplier: number }
> = {
  SP: { pacMultiplier: 1, sedexMultiplier: 1 },
  RJ: { pacMultiplier: 1.2, sedexMultiplier: 1.15 },
  MG: { pacMultiplier: 1.3, sedexMultiplier: 1.2 },
  ES: { pacMultiplier: 1.3, sedexMultiplier: 1.2 },
  PR: { pacMultiplier: 1.4, sedexMultiplier: 1.3 },
  SC: { pacMultiplier: 1.5, sedexMultiplier: 1.4 },
  RS: { pacMultiplier: 1.6, sedexMultiplier: 1.5 },
  BA: { pacMultiplier: 1.8, sedexMultiplier: 1.6 },
  PE: { pacMultiplier: 2.0, sedexMultiplier: 1.8 },
  CE: { pacMultiplier: 2.0, sedexMultiplier: 1.8 },
  DEFAULT: { pacMultiplier: 2.2, sedexMultiplier: 2.0 },
};

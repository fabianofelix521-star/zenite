import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types";
import { PRODUCTS as DEFAULT_PRODUCTS } from "@/constants/mockData";
import { supabase } from "@/lib/supabase";

export interface AdminSettings {
  ai: {
    enabled: boolean;
    endpointUrl: string;
    apiKey: string;
    model: "grok" | "claude" | "gpt";
  };
  whatsapp: {
    enabled: boolean;
    url: string;
  };
  payment: {
    provider: string;
    config: Record<string, string>;
  };
}

export interface Banner {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  link: string;
}

export interface AdminOrder {
  id: string;
  customer: string;
  email: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: number;
  date: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
}

export interface FooterLegalPage {
  id: string;
  title: string;
  content: string;
}

export interface FooterContact {
  email: string;
  phone: string;
  address: string;
}

export interface FooterSocial {
  instagram: string;
  facebook: string;
  twitter: string;
  tiktok: string;
  youtube: string;
}

interface AdminStore {
  products: Product[];
  settings: AdminSettings;
  banners: Banner[];
  logoUrl: string;
  orders: AdminOrder[];
  categories: AdminCategory[];
  isHydrated: boolean;
  updateSettings: (settings: Partial<AdminSettings>) => void;
  setBanners: (banners: Banner[]) => void;
  addBanner: (banner: Banner) => void;
  removeBanner: (id: string) => void;
  updateBanner: (id: string, data: Partial<Banner>) => void;
  setLogoUrl: (url: string) => void;
  addCategory: (cat: AdminCategory) => void;
  updateCategory: (id: string, data: Partial<AdminCategory>) => void;
  removeCategory: (id: string) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  updateOrder: (id: string, data: Partial<AdminOrder>) => void;
  footerLegalPages: FooterLegalPage[];
  footerContact: FooterContact;
  footerSocial: FooterSocial;
  addLegalPage: (page: FooterLegalPage) => void;
  updateLegalPage: (id: string, data: Partial<FooterLegalPage>) => void;
  removeLegalPage: (id: string) => void;
  updateFooterContact: (data: Partial<FooterContact>) => void;
  updateFooterSocial: (data: Partial<FooterSocial>) => void;
  hydrate: () => Promise<void>;
}

// --- DB Mapping Helpers ---

function productFromDB(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    price: Number(row.price),
    originalPrice: Number(row.original_price),
    description: (row.description as string) || "",
    images: (row.images as string[]) || [],
    sizes: (row.sizes as string[]) || [],
    colors: (row.colors as Product["colors"]) || [],
    category: (row.category as string) || "",
    categorySlug: (row.category_slug as string) || "",
    rating: Number(row.rating),
    reviewCount: (row.review_count as number) || 0,
    soldCount: (row.sold_count as number) || 0,
    stock: (row.stock as number) || 0,
    tags: (row.tags as string[]) || [],
    featured: (row.featured as boolean) || false,
    createdAt: (row.created_at as string) || "",
  };
}

function productToDB(p: Product) {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    original_price: p.originalPrice,
    description: p.description,
    images: p.images,
    sizes: p.sizes,
    colors: p.colors,
    category: p.category,
    category_slug: p.categorySlug,
    rating: p.rating,
    review_count: p.reviewCount,
    sold_count: p.soldCount,
    stock: p.stock,
    tags: p.tags,
    featured: p.featured,
    created_at: p.createdAt,
  };
}

function categoryFromDB(row: Record<string, unknown>): AdminCategory {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    imageUrl: (row.image_url as string) || "",
  };
}

function categoryToDB(c: AdminCategory) {
  return { id: c.id, name: c.name, slug: c.slug, image_url: c.imageUrl };
}

function bannerFromDB(row: Record<string, unknown>): Banner {
  return {
    id: row.id as string,
    imageUrl: (row.image_url as string) || "",
    title: (row.title as string) || "",
    subtitle: (row.subtitle as string) || "",
    link: (row.link as string) || "",
  };
}

function bannerToDB(b: Banner) {
  return {
    id: b.id,
    image_url: b.imageUrl,
    title: b.title,
    subtitle: b.subtitle,
    link: b.link,
  };
}

function orderFromDB(row: Record<string, unknown>): AdminOrder {
  return {
    id: row.id as string,
    customer: row.customer as string,
    email: row.email as string,
    status: row.status as AdminOrder["status"],
    total: Number(row.total),
    items: (row.items as number) || 0,
    date: (row.date as string) || "",
  };
}

// --- Payment Providers ---

const PAYMENT_PROVIDERS: Record<
  string,
  { label: string; fields: { key: string; label: string }[] }
> = {
  pix: { label: "Pix", fields: [{ key: "pixKey", label: "Chave Pix" }] },
  stripe: {
    label: "Stripe",
    fields: [
      { key: "apiKey", label: "API Key" },
      { key: "webhookSecret", label: "Webhook Secret" },
    ],
  },
  mercadoPago: {
    label: "Mercado Pago",
    fields: [
      { key: "accessToken", label: "Access Token" },
      { key: "publicKey", label: "Public Key" },
    ],
  },
  pagSeguro: {
    label: "PagSeguro",
    fields: [
      { key: "email", label: "E-mail" },
      { key: "token", label: "Token" },
    ],
  },
  bb: {
    label: "Banco do Brasil",
    fields: [
      { key: "clientId", label: "Client ID" },
      { key: "clientSecret", label: "Client Secret" },
      { key: "merchantId", label: "Merchant ID" },
    ],
  },
  itau: {
    label: "Itaú",
    fields: [
      { key: "clientId", label: "Client ID" },
      { key: "clientSecret", label: "Client Secret" },
    ],
  },
  bradesco: {
    label: "Bradesco",
    fields: [
      { key: "merchantId", label: "Merchant ID" },
      { key: "apiKey", label: "API Key" },
    ],
  },
  nubank: {
    label: "Nubank",
    fields: [
      { key: "apiKey", label: "API Key" },
      { key: "webhookUrl", label: "Webhook URL" },
    ],
  },
  santander: {
    label: "Santander",
    fields: [
      { key: "merchantId", label: "Merchant ID" },
      { key: "apiKey", label: "API Key" },
    ],
  },
  caixa: {
    label: "Caixa",
    fields: [
      { key: "merchantId", label: "Merchant ID" },
      { key: "apiKey", label: "API Key" },
    ],
  },
};

export { PAYMENT_PROVIDERS };

// --- Default Data ---

const DEFAULT_BANNERS: Banner[] = [
  {
    id: "1",
    imageUrl:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&h=500&fit=crop",
    title: "Nova Coleção",
    subtitle: "Fragrâncias exclusivas de inverno",
    link: "/produtos",
  },
  {
    id: "2",
    imageUrl:
      "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=1200&h=500&fit=crop",
    title: "Promoção Especial",
    subtitle: "Até 40% de desconto em perfumes selecionados",
    link: "/produtos",
  },
];

const DEFAULT_CATEGORIES: AdminCategory[] = [
  {
    id: "1",
    name: "Perfumes Masculinos",
    slug: "perfumes-masculinos",
    imageUrl:
      "https://images.unsplash.com/photo-1594035910387-fea081ce83c4?w=400&h=500&fit=crop",
  },
  {
    id: "2",
    name: "Perfumes Femininos",
    slug: "perfumes-femininos",
    imageUrl:
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&h=500&fit=crop",
  },
  {
    id: "3",
    name: "Cosméticos",
    slug: "cosmeticos",
    imageUrl:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=500&fit=crop",
  },
  {
    id: "4",
    name: "Kits Presente",
    slug: "kits-presente",
    imageUrl:
      "https://images.unsplash.com/photo-1549465220-1a8b9238f067?w=400&h=500&fit=crop",
  },
];

const DEFAULT_ORDERS: AdminOrder[] = [
  { id: "ZEN-001", customer: "Maria Silva", email: "maria@email.com", status: "delivered", total: 459.9, items: 2, date: "2025-03-18" },
  { id: "ZEN-002", customer: "João Santos", email: "joao@email.com", status: "shipped", total: 289.9, items: 1, date: "2025-03-19" },
  { id: "ZEN-003", customer: "Ana Costa", email: "ana@email.com", status: "processing", total: 879.7, items: 3, date: "2025-03-20" },
  { id: "ZEN-004", customer: "Pedro Lima", email: "pedro@email.com", status: "pending", total: 199.9, items: 1, date: "2025-03-21" },
  { id: "ZEN-005", customer: "Carla Souza", email: "carla@email.com", status: "delivered", total: 1259.7, items: 4, date: "2025-03-17" },
];

const DEFAULT_LEGAL_PAGES: FooterLegalPage[] = [
  { id: "1", title: "Envio e Entrega", content: "" },
  { id: "2", title: "Trocas e Devoluções", content: "" },
  { id: "3", title: "Perguntas Frequentes", content: "" },
  { id: "4", title: "Fale Conosco", content: "" },
];

// --- Store ---

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      products: DEFAULT_PRODUCTS,
      settings: {
        ai: { enabled: false, endpointUrl: "", apiKey: "", model: "gpt" },
        whatsapp: { enabled: false, url: "" },
        payment: { provider: "pix", config: {} },
      },
      banners: DEFAULT_BANNERS,
      logoUrl: "",
      orders: DEFAULT_ORDERS,
      categories: DEFAULT_CATEGORIES,
      isHydrated: false,
      footerLegalPages: DEFAULT_LEGAL_PAGES,
      footerContact: { email: "", phone: "", address: "" },
      footerSocial: { instagram: "", facebook: "", twitter: "", tiktok: "", youtube: "" },

      // --- Hydrate from Supabase ---
      hydrate: async () => {
        try {
          const [productsRes, categoriesRes, bannersRes, ordersRes, settingsRes, legalRes] =
            await Promise.all([
              supabase.from("products").select("*"),
              supabase.from("categories").select("*"),
              supabase.from("banners").select("*").order("sort_order"),
              supabase.from("orders").select("*").order("created_at", { ascending: false }),
              supabase.from("store_settings").select("*").single(),
              supabase.from("footer_legal_pages").select("*").order("sort_order"),
            ]);

          const updates: Partial<AdminStore> = {};

          // Products
          if (productsRes.data && productsRes.data.length > 0) {
            updates.products = productsRes.data.map(productFromDB);
          } else {
            // Seed Supabase with default products
            const defaults = get().products;
            await supabase.from("products").upsert(defaults.map(productToDB));
          }

          // Categories
          if (categoriesRes.data && categoriesRes.data.length > 0) {
            updates.categories = categoriesRes.data.map(categoryFromDB);
          } else {
            const defaults = get().categories;
            await supabase.from("categories").upsert(defaults.map(categoryToDB));
          }

          // Banners
          if (bannersRes.data && bannersRes.data.length > 0) {
            updates.banners = bannersRes.data.map(bannerFromDB);
          } else {
            const defaults = get().banners;
            await supabase.from("banners").upsert(defaults.map(bannerToDB));
          }

          // Orders
          if (ordersRes.data && ordersRes.data.length > 0) {
            updates.orders = ordersRes.data.map(orderFromDB);
          } else {
            const defaults = get().orders;
            await supabase.from("orders").upsert(
              defaults.map((o) => ({
                id: o.id, customer: o.customer, email: o.email,
                status: o.status, total: o.total, items: o.items, date: o.date,
              })),
            );
          }

          // Settings
          if (settingsRes.data) {
            const s = settingsRes.data;
            if (s.settings) updates.settings = s.settings as AdminSettings;
            if (s.logo_url) updates.logoUrl = s.logo_url;
            if (s.footer_contact) updates.footerContact = s.footer_contact as FooterContact;
            if (s.footer_social) updates.footerSocial = s.footer_social as FooterSocial;
          }

          // Legal pages
          if (legalRes.data && legalRes.data.length > 0) {
            updates.footerLegalPages = legalRes.data.map((r) => ({
              id: r.id as string,
              title: r.title as string,
              content: (r.content as string) || "",
            }));
          } else {
            const defaults = get().footerLegalPages;
            await supabase.from("footer_legal_pages").upsert(
              defaults.map((p, i) => ({ id: p.id, title: p.title, content: p.content, sort_order: i })),
            );
          }

          set({ ...updates, isHydrated: true });
        } catch (err) {
          console.error("Supabase hydration error:", err);
          set({ isHydrated: true });
        }
      },

      // --- Settings ---
      updateSettings: (partial) => {
        set((s) => {
          const merged = { ...s.settings, ...partial };
          supabase.from("store_settings").update({ settings: merged, updated_at: new Date().toISOString() }).eq("id", 1).then();
          return { settings: merged };
        });
      },

      // --- Banners ---
      setBanners: (banners) => set({ banners }),
      addBanner: (banner) => {
        set((s) => ({ banners: [...s.banners, banner] }));
        supabase.from("banners").upsert(bannerToDB(banner)).then();
      },
      removeBanner: (id) => {
        set((s) => ({ banners: s.banners.filter((b) => b.id !== id) }));
        supabase.from("banners").delete().eq("id", id).then();
      },
      updateBanner: (id, data) => {
        set((s) => ({
          banners: s.banners.map((b) => (b.id === id ? { ...b, ...data } : b)),
        }));
        const row: Record<string, unknown> = {};
        if (data.imageUrl !== undefined) row.image_url = data.imageUrl;
        if (data.title !== undefined) row.title = data.title;
        if (data.subtitle !== undefined) row.subtitle = data.subtitle;
        if (data.link !== undefined) row.link = data.link;
        supabase.from("banners").update(row).eq("id", id).then();
      },

      // --- Logo ---
      setLogoUrl: (logoUrl) => {
        set({ logoUrl });
        supabase.from("store_settings").update({ logo_url: logoUrl, updated_at: new Date().toISOString() }).eq("id", 1).then();
      },

      // --- Categories ---
      addCategory: (cat) => {
        set((s) => ({ categories: [...s.categories, cat] }));
        supabase.from("categories").upsert(categoryToDB(cat)).then();
      },
      updateCategory: (id, data) => {
        set((s) => ({
          categories: s.categories.map((c) => (c.id === id ? { ...c, ...data } : c)),
        }));
        const row: Record<string, unknown> = {};
        if (data.name !== undefined) row.name = data.name;
        if (data.slug !== undefined) row.slug = data.slug;
        if (data.imageUrl !== undefined) row.image_url = data.imageUrl;
        supabase.from("categories").update(row).eq("id", id).then();
      },
      removeCategory: (id) => {
        set((s) => ({ categories: s.categories.filter((c) => c.id !== id) }));
        supabase.from("categories").delete().eq("id", id).then();
      },

      // --- Products ---
      addProduct: (product) => {
        set((s) => ({ products: [...s.products, product] }));
        supabase.from("products").upsert(productToDB(product)).then();
      },
      updateProduct: (id, data) => {
        set((s) => ({
          products: s.products.map((p) => (p.id === id ? { ...p, ...data } : p)),
        }));
        const updated = get().products.find((p) => p.id === id);
        if (updated) supabase.from("products").upsert(productToDB(updated)).then();
      },
      removeProduct: (id) => {
        set((s) => ({ products: s.products.filter((p) => p.id !== id) }));
        supabase.from("products").delete().eq("id", id).then();
      },

      // --- Orders ---
      updateOrder: (id, data) => {
        set((s) => ({
          orders: s.orders.map((o) => (o.id === id ? { ...o, ...data } : o)),
        }));
        const row: Record<string, unknown> = {};
        if (data.status !== undefined) row.status = data.status;
        if (data.customer !== undefined) row.customer = data.customer;
        if (data.email !== undefined) row.email = data.email;
        supabase.from("orders").update(row).eq("id", id).then();
      },

      // --- Footer ---
      addLegalPage: (page) => {
        set((s) => ({ footerLegalPages: [...s.footerLegalPages, page] }));
        supabase.from("footer_legal_pages").upsert({ id: page.id, title: page.title, content: page.content, sort_order: get().footerLegalPages.length }).then();
      },
      updateLegalPage: (id, data) => {
        set((s) => ({
          footerLegalPages: s.footerLegalPages.map((p) => (p.id === id ? { ...p, ...data } : p)),
        }));
        const row: Record<string, unknown> = {};
        if (data.title !== undefined) row.title = data.title;
        if (data.content !== undefined) row.content = data.content;
        supabase.from("footer_legal_pages").update(row).eq("id", id).then();
      },
      removeLegalPage: (id) => {
        set((s) => ({ footerLegalPages: s.footerLegalPages.filter((p) => p.id !== id) }));
        supabase.from("footer_legal_pages").delete().eq("id", id).then();
      },
      updateFooterContact: (data) => {
        set((s) => {
          const merged = { ...s.footerContact, ...data };
          supabase.from("store_settings").update({ footer_contact: merged, updated_at: new Date().toISOString() }).eq("id", 1).then();
          return { footerContact: merged };
        });
      },
      updateFooterSocial: (data) => {
        set((s) => {
          const merged = { ...s.footerSocial, ...data };
          supabase.from("store_settings").update({ footer_social: merged, updated_at: new Date().toISOString() }).eq("id", 1).then();
          return { footerSocial: merged };
        });
      },
    }),
    { name: "zenite-admin" },
  ),
);

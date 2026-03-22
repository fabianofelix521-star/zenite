import { useState } from "react";
import { Plus, Pencil, Trash2, X, Search, Upload, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useAdminStore } from "@/stores/adminStore";
import { uploadImage } from "@/lib/uploadImage";
import type { Product } from "@/types";

type EditingProduct = Omit<Product, "id"> & { id?: string };

const emptyProduct = (): EditingProduct => ({
  name: "",
  slug: "",
  description: "",
  price: 0,
  originalPrice: 0,
  stock: 0,
  sizes: [],
  colors: [],
  category: "",
  categorySlug: "",
  images: [],
  rating: 0,
  reviewCount: 0,
  soldCount: 0,
  tags: [],
  featured: false,
  createdAt: new Date().toISOString(),
});

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminProducts() {
  const products = useAdminStore((s) => s.products);
  const addProduct = useAdminStore((s) => s.addProduct);
  const updateProduct = useAdminStore((s) => s.updateProduct);
  const removeProduct = useAdminStore((s) => s.removeProduct);

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<EditingProduct>(emptyProduct());
  const [uploading, setUploading] = useState(false);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  );

  const openAdd = () => {
    setEditingProduct(emptyProduct());
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditingProduct({ ...p });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editingProduct.id) {
      const { id, ...data } = editingProduct;
      updateProduct(id, data);
    } else {
      addProduct({
        ...editingProduct,
        id: crypto.randomUUID(),
        slug: editingProduct.slug || slugify(editingProduct.name),
        categorySlug: editingProduct.categorySlug || slugify(editingProduct.category),
        createdAt: new Date().toISOString(),
      });
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    removeProduct(id);
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadImage(file, "products");
      setEditingProduct((p) => ({ ...p, images: [...p.images, url] }));
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-semibold text-gold-gradient">
            Produtos
          </h1>
          <p className="text-sm text-muted-foreground font-body mt-1">
            Gerencie seu catálogo
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gold text-white font-body font-semibold text-sm hover:opacity-90 transition-colors cursor-pointer"
        >
          <Plus className="size-4" />
          <span className="hidden sm:inline">Adicionar</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gold-400/50" />
        <input
          type="text"
          placeholder="Buscar produto ou categoria..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-card text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-gold-400/30"
        />
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gold-600 uppercase tracking-wider">
                  Produto
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gold-600 uppercase tracking-wider hidden md:table-cell">
                  Categoria
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gold-600 uppercase tracking-wider">
                  Preço
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gold-600 uppercase tracking-wider hidden sm:table-cell">
                  Estoque
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gold-600 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.images[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="size-10 rounded-xl object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium text-foreground">
                          {product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {product.sizes.join(", ") || "—"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    {product.category}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gold-600 tabular-nums">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground hidden sm:table-cell">
                    {product.stock}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(product)}
                        className="p-2 rounded-xl hover:bg-muted transition-colors cursor-pointer"
                        aria-label="Editar"
                      >
                        <Pencil className="size-4 text-gold-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 rounded-xl hover:bg-red-500/10 transition-colors cursor-pointer"
                        aria-label="Excluir"
                      >
                        <Trash2 className="size-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground font-body text-sm">
            Nenhum produto encontrado.
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setModalOpen(false)}
          />
          <div
            className="relative glass-strong w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6"
            style={{ background: "white" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-semibold text-gold-600">
                {editingProduct.id ? "Editar Produto" : "Adicionar Produto"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl hover:bg-muted cursor-pointer"
                aria-label="Fechar"
              >
                <X className="size-5 text-gold-600" />
              </button>
            </div>

            <div className="grid gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-body font-medium text-gold-600 mb-1.5">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct((p) => ({ ...p, name: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 rounded-2xl glass-card text-sm font-body text-foreground focus:outline-none focus:ring-1 focus:ring-gold-400/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-body font-medium text-gold-600 mb-1.5">
                    Categoria
                  </label>
                  <input
                    type="text"
                    value={editingProduct.category}
                    onChange={(e) =>
                      setEditingProduct((p) => ({
                        ...p,
                        category: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-2xl glass-card text-sm font-body text-foreground focus:outline-none focus:ring-1 focus:ring-gold-400/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-body font-medium text-gold-600 mb-1.5">
                  Descrição
                </label>
                <textarea
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct((p) => ({
                      ...p,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-2xl glass-card text-sm font-body text-foreground focus:outline-none focus:ring-1 focus:ring-gold-400/30 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-body font-medium text-gold-600 mb-1.5">
                    Preço (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.price || ""}
                    onChange={(e) =>
                      setEditingProduct((p) => ({
                        ...p,
                        price: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-2xl glass-card text-sm font-body text-foreground focus:outline-none focus:ring-1 focus:ring-gold-400/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-body font-medium text-gold-600 mb-1.5">
                    Preço Original (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.originalPrice || ""}
                    onChange={(e) =>
                      setEditingProduct((p) => ({
                        ...p,
                        originalPrice: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-2xl glass-card text-sm font-body text-foreground focus:outline-none focus:ring-1 focus:ring-gold-400/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-body font-medium text-gold-600 mb-1.5">
                    Estoque
                  </label>
                  <input
                    type="number"
                    value={editingProduct.stock || ""}
                    onChange={(e) =>
                      setEditingProduct((p) => ({
                        ...p,
                        stock: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-2xl glass-card text-sm font-body text-foreground focus:outline-none focus:ring-1 focus:ring-gold-400/30"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-body font-medium text-gold-600 mb-1.5">
                    Tamanhos (separados por vírgula)
                  </label>
                  <input
                    type="text"
                    value={editingProduct.sizes.join(", ")}
                    onChange={(e) =>
                      setEditingProduct((p) => ({
                        ...p,
                        sizes: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-2xl glass-card text-sm font-body text-foreground focus:outline-none focus:ring-1 focus:ring-gold-400/30"
                    placeholder="Ex: 30ml, 50ml, 100ml"
                  />
                </div>
                <div>
                  <label className="block text-xs font-body font-medium text-gold-600 mb-1.5">
                    Tags (separadas por vírgula)
                  </label>
                  <input
                    type="text"
                    value={editingProduct.tags.join(", ")}
                    onChange={(e) =>
                      setEditingProduct((p) => ({
                        ...p,
                        tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-2xl glass-card text-sm font-body text-foreground focus:outline-none focus:ring-1 focus:ring-gold-400/30"
                    placeholder="Ex: floral, noturno, premium"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={editingProduct.featured}
                  onChange={(e) =>
                    setEditingProduct((p) => ({ ...p, featured: e.target.checked }))
                  }
                  className="rounded accent-gold-600"
                />
                <label htmlFor="featured" className="text-sm font-body text-foreground">
                  Produto em Destaque
                </label>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-body font-medium text-gold-600 mb-1.5">
                  Imagens do Produto
                </label>
                {editingProduct.images.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-2">
                    {editingProduct.images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img}
                          alt={`Preview ${idx + 1}`}
                          className="w-20 h-20 object-cover rounded-xl"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setEditingProduct((p) => ({
                              ...p,
                              images: p.images.filter((_, i) => i !== idx),
                            }))
                          }
                          className="absolute -top-1 -right-1 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-border cursor-pointer hover:bg-muted/50 transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
                  {uploading ? (
                    <Loader2 className="size-4 text-gold-600 animate-spin" />
                  ) : (
                    <Upload className="size-4 text-gold-600" />
                  )}
                  <span className="text-sm font-body text-muted-foreground">
                    {uploading ? "Enviando..." : "Escolher imagem"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-2xl border border-border text-sm font-body font-medium text-foreground/60 hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="px-5 py-2.5 rounded-2xl bg-gold text-white text-sm font-body font-semibold hover:opacity-90 transition-colors cursor-pointer"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

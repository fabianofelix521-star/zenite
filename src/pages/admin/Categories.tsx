import { useState } from "react";
import { Plus, Trash2, X, Upload, Loader2 } from "lucide-react";
import { useAdminStore } from "@/stores/adminStore";
import { uploadImage } from "@/lib/uploadImage";

export default function AdminCategories() {
  const categories = useAdminStore((s) => s.categories);
  const addCategory = useAdminStore((s) => s.addCategory);
  const removeCategory = useAdminStore((s) => s.removeCategory);
  const [modalOpen, setModalOpen] = useState(false);
  const [newCat, setNewCat] = useState({ name: "", imageUrl: "" });
  const [uploading, setUploading] = useState(false);

  const handleAdd = () => {
    if (!newCat.name.trim()) return;
    addCategory({
      id: crypto.randomUUID(),
      name: newCat.name,
      slug: newCat.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""),
      imageUrl: newCat.imageUrl,
    });
    setNewCat({ name: "", imageUrl: "" });
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-semibold text-gold-gradient">
            Categorias
          </h1>
          <p className="text-sm text-muted-foreground font-body mt-1">
            Gerencie as categorias da loja
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gold text-white font-body font-semibold text-sm hover:opacity-90 transition-colors cursor-pointer"
        >
          <Plus className="size-4" />
          <span className="hidden sm:inline">Adicionar</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="glass-card overflow-hidden group relative"
          >
            <div className="aspect-[4/5] relative">
              {cat.imageUrl ? (
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-muted-foreground font-body text-sm">
                    Sem imagem
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="font-display text-base font-semibold text-white">
                  {cat.name}
                </p>
                <p className="text-xs text-white/60 font-body">/{cat.slug}</p>
              </div>
              <button
                onClick={() => removeCategory(cat.id)}
                className="absolute top-3 right-3 p-2 rounded-xl bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 cursor-pointer"
                aria-label="Excluir categoria"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-16 text-muted-foreground font-body text-sm">
          Nenhuma categoria cadastrada. Clique em "Adicionar" para criar.
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setModalOpen(false)}
          />
          <div
            className="relative glass-strong w-full max-w-md p-6"
            style={{ background: "white" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-semibold text-gold-600">
                Nova Categoria
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl hover:bg-muted cursor-pointer"
                aria-label="Fechar"
              >
                <X className="size-5 text-gold-600" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-body font-medium text-gold-600 mb-1.5">
                  Nome
                </label>
                <input
                  type="text"
                  value={newCat.name}
                  onChange={(e) =>
                    setNewCat((c) => ({ ...c, name: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-2xl glass-card text-sm font-body text-foreground focus:outline-none focus:ring-1 focus:ring-gold-400/30"
                  placeholder="Ex: Perfumes Unissex"
                />
              </div>
              <div>
                <label className="block text-xs font-body font-medium text-gold-600 mb-1.5">
                  Imagem da Categoria
                </label>
                {newCat.imageUrl && (
                  <img
                    src={newCat.imageUrl}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-xl mb-2"
                  />
                )}
                <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-border cursor-pointer hover:bg-muted/50 transition-colors">
                  <Upload className="size-4 text-gold-600" />
                  <span className="text-sm font-body text-muted-foreground">
                    Escolher imagem
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setUploading(true);
                      try {
                        const url = await uploadImage(file, "categories");
                        setNewCat((c) => ({
                          ...c,
                          imageUrl: url,
                        }));
                      } catch (err) {
                        console.error("Upload failed:", err);
                      } finally {
                        setUploading(false);
                      }
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
                  onClick={handleAdd}
                  className="px-5 py-2.5 rounded-2xl bg-gold text-white text-sm font-body font-semibold hover:opacity-90 transition-colors cursor-pointer"
                >
                  Criar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

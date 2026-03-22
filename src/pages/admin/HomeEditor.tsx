import { useState } from "react";
import { Plus, Trash2, Pencil, X, Upload, Eye, Loader2 } from "lucide-react";
import { useAdminStore, type Banner } from "@/stores/adminStore";
import { uploadImage } from "@/lib/uploadImage";

export default function AdminHomeEditor() {
  const banners = useAdminStore((s) => s.banners);
  const logoUrl = useAdminStore((s) => s.logoUrl);
  const promoBanner = useAdminStore((s) => s.promoBanner);
  const addBanner = useAdminStore((s) => s.addBanner);
  const removeBanner = useAdminStore((s) => s.removeBanner);
  const updateBanner = useAdminStore((s) => s.updateBanner);
  const setLogoUrl = useAdminStore((s) => s.setLogoUrl);
  const updatePromoBanner = useAdminStore((s) => s.updatePromoBanner);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Banner> & { isNew?: boolean }>(
    {},
  );
  const [previewOpen, setPreviewOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const openAdd = () => {
    setEditing({
      isNew: true,
      title: "",
      subtitle: "",
      imageUrl: "",
      link: "/produtos",
    });
    setModalOpen(true);
  };

  const openEdit = (b: Banner) => {
    setEditing({ ...b });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editing.isNew) {
      addBanner({
        id: crypto.randomUUID(),
        title: editing.title || "",
        subtitle: editing.subtitle || "",
        imageUrl: editing.imageUrl || "",
        link: editing.link || "/produtos",
      });
    } else if (editing.id) {
      updateBanner(editing.id, {
        title: editing.title,
        subtitle: editing.subtitle,
        imageUrl: editing.imageUrl,
        link: editing.link,
      });
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-display font-semibold text-gold-gradient">
          Editar Tela Inicial
        </h1>
        <p className="text-sm text-muted-foreground font-body mt-1">
          Gerencie a logo e banners da home
        </p>
      </div>

      {/* Logo Section */}
      <div className="glass-card p-5">
        <h3 className="text-base font-display font-semibold text-gold-600 mb-4">
          Logo da Loja
        </h3>
        <div className="flex items-center gap-4">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Logo"
              className="h-16 rounded-xl object-contain"
            />
          ) : (
            <div className="h-16 w-32 rounded-xl bg-gray-100 flex items-center justify-center">
              <span className="text-xs text-muted-foreground font-body">
                Sem logo
              </span>
            </div>
          )}
          <div className="flex-1">
            <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-border cursor-pointer hover:bg-muted/50 transition-colors">
              <Upload className="size-4 text-gold-600" />
              <span className="text-sm font-body text-muted-foreground">
                Enviar logo
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploading(true);
                  try {
                    const url = await uploadImage(file, "logo");
                    setLogoUrl(url);
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
        </div>
      </div>

      {/* Banners Section */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-display font-semibold text-gold-600">
            Banners ({banners.length})
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setPreviewOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-sm font-body text-foreground/60 hover:text-gold-600 hover:bg-muted transition-colors cursor-pointer"
            >
              <Eye className="size-4" />
              Preview
            </button>
            <button
              onClick={openAdd}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gold text-white text-sm font-body font-semibold hover:opacity-90 transition-colors cursor-pointer"
            >
              <Plus className="size-4" />
              Adicionar
            </button>
          </div>
        </div>

        {banners.length === 0 && (
          <p className="text-sm text-muted-foreground font-body py-8 text-center">
            Nenhum banner cadastrado.
          </p>
        )}

        <div className="space-y-3">
          {banners.map((banner, idx) => (
            <div
              key={banner.id}
              className="flex items-center gap-4 p-3 rounded-2xl bg-muted/50 hover:bg-muted transition-colors"
            >
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="w-28 h-16 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-body font-medium text-foreground truncate">
                  {banner.title || `Banner ${idx + 1}`}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {banner.subtitle}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => openEdit(banner)}
                  className="p-2 rounded-xl hover:bg-muted transition-colors cursor-pointer"
                  aria-label="Editar"
                >
                  <Pencil className="size-4 text-gold-600" />
                </button>
                <button
                  onClick={() => removeBanner(banner.id)}
                  className="p-2 rounded-xl hover:bg-red-500/10 transition-colors cursor-pointer"
                  aria-label="Excluir"
                >
                  <Trash2 className="size-4 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground font-body mt-3">
          {banners.length === 1
            ? "Com apenas 1 banner, ele será exibido de forma estática (sem carrossel)."
            : `${banners.length} banners exibidos em carrossel na home.`}
        </p>
      </div>

      {/* Promo Banner Section */}
      <div className="glass-card p-5">
        <h3 className="text-base font-display font-semibold text-gold-600 mb-4">
          Banner Promocional
        </h3>
        <p className="text-xs text-muted-foreground font-body mb-4">
          Banner exibido entre as seções de produtos na home.
        </p>
        {promoBanner.imageUrl && (
          <img
            src={promoBanner.imageUrl}
            alt="Preview promo"
            className="w-full h-32 object-cover rounded-xl mb-3"
          />
        )}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-body font-medium text-gold-600 mb-1.5">
              Título
            </label>
            <input
              type="text"
              value={promoBanner.title}
              onChange={(e) => updatePromoBanner({ title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl glass-card text-sm font-body text-foreground focus:outline-none focus:ring-1 focus:ring-gold-400/30"
            />
          </div>
          <div>
            <label className="block text-xs font-body font-medium text-gold-600 mb-1.5">
              Subtítulo
            </label>
            <textarea
              value={promoBanner.subtitle}
              onChange={(e) => updatePromoBanner({ subtitle: e.target.value })}
              rows={2}
              className="w-full px-4 py-2.5 rounded-2xl glass-card text-sm font-body text-foreground focus:outline-none focus:ring-1 focus:ring-gold-400/30 resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-body font-medium text-gold-600 mb-1.5">
              Imagem
            </label>
            <label className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-border cursor-pointer hover:bg-muted/50 transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
              {uploading ? (
                <Loader2 className="size-4 text-gold-600 animate-spin" />
              ) : (
                <Upload className="size-4 text-gold-600" />
              )}
              <span className="text-sm font-body text-muted-foreground">
                {uploading ? "Enviando..." : "Trocar imagem"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploading(true);
                  try {
                    const url = await uploadImage(file, "promo");
                    updatePromoBanner({ imageUrl: url });
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
        </div>
      </div>

      {/* Banner Modal */}
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
                {editing.isNew ? "Novo Banner" : "Editar Banner"}
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
                  Título
                </label>
                <input
                  type="text"
                  value={editing.title || ""}
                  onChange={(e) =>
                    setEditing((p) => ({ ...p, title: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-2xl glass-card text-sm font-body text-foreground focus:outline-none focus:ring-1 focus:ring-gold-400/30"
                />
              </div>
              <div>
                <label className="block text-xs font-body font-medium text-gold-600 mb-1.5">
                  Subtítulo
                </label>
                <input
                  type="text"
                  value={editing.subtitle || ""}
                  onChange={(e) =>
                    setEditing((p) => ({ ...p, subtitle: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-2xl glass-card text-sm font-body text-foreground focus:outline-none focus:ring-1 focus:ring-gold-400/30"
                />
              </div>
              <div>
                <label className="block text-xs font-body font-medium text-gold-600 mb-1.5">
                  Imagem do Banner
                </label>
                {editing.imageUrl && (
                  <img
                    src={editing.imageUrl}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-2xl mb-2"
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
                        const url = await uploadImage(file, "banners");
                        setEditing((p) => ({
                          ...p,
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
              <div>
                <label className="block text-xs font-body font-medium text-gold-600 mb-1.5">
                  Link
                </label>
                <input
                  type="text"
                  value={editing.link || ""}
                  onChange={(e) =>
                    setEditing((p) => ({ ...p, link: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-2xl glass-card text-sm font-body text-foreground focus:outline-none focus:ring-1 focus:ring-gold-400/30"
                />
              </div>
              {editing.imageUrl && (
                <img
                  src={editing.imageUrl}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-2xl"
                />
              )}
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

      {/* Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setPreviewOpen(false)}
          />
          <div
            className="relative glass-strong w-full max-w-3xl p-6 max-h-[85vh] overflow-y-auto"
            style={{ background: "white" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-semibold text-gold-600">
                Preview da Home
              </h2>
              <button
                onClick={() => setPreviewOpen(false)}
                className="p-2 rounded-xl hover:bg-muted cursor-pointer"
                aria-label="Fechar"
              >
                <X className="size-5 text-gold-600" />
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden border border-border">
              {/* Mini header preview */}
              <div className="bg-white px-4 py-3 flex items-center justify-center border-b border-border">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Logo"
                    className="h-8 object-contain"
                  />
                ) : (
                  <span className="font-display text-lg text-gold-gradient font-semibold">
                    Zênite
                  </span>
                )}
              </div>
              {/* Banner preview */}
              {banners.length === 0 ? (
                <div className="h-48 bg-gray-100 flex items-center justify-center text-muted-foreground text-sm font-body">
                  Nenhum banner
                </div>
              ) : banners.length === 1 ? (
                <div className="relative h-48">
                  <img
                    src={banners[0].imageUrl}
                    alt={banners[0].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <div>
                      <h3 className="font-display text-xl text-white font-semibold">
                        {banners[0].title}
                      </h3>
                      <p className="text-sm text-white/70 font-body">
                        {banners[0].subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex overflow-x-auto snap-x snap-mandatory">
                  {banners.map((b) => (
                    <div
                      key={b.id}
                      className="relative h-48 min-w-full snap-center"
                    >
                      <img
                        src={b.imageUrl}
                        alt={b.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                        <div>
                          <h3 className="font-display text-xl text-white font-semibold">
                            {b.title}
                          </h3>
                          <p className="text-sm text-white/70 font-body">
                            {b.subtitle}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

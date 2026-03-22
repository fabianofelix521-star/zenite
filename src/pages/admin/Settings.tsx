import { useState } from "react";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { useAdminStore, PAYMENT_PROVIDERS } from "@/stores/adminStore";

export default function AdminSettings() {
  const settings = useAdminStore((s) => s.settings);
  const updateSettings = useAdminStore((s) => s.updateSettings);
  const footerLegalPages = useAdminStore((s) => s.footerLegalPages);
  const footerContact = useAdminStore((s) => s.footerContact);
  const footerSocial = useAdminStore((s) => s.footerSocial);
  const addLegalPage = useAdminStore((s) => s.addLegalPage);
  const updateLegalPage = useAdminStore((s) => s.updateLegalPage);
  const removeLegalPage = useAdminStore((s) => s.removeLegalPage);
  const updateFooterContact = useAdminStore((s) => s.updateFooterContact);
  const updateFooterSocial = useAdminStore((s) => s.updateFooterSocial);
  const [expandedPages, setExpandedPages] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedPages((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const handleAiToggle = () => {
    updateSettings({ ai: { ...settings.ai, enabled: !settings.ai.enabled } });
  };

  const handleWhatsAppToggle = () => {
    updateSettings({
      whatsapp: { ...settings.whatsapp, enabled: !settings.whatsapp.enabled },
    });
  };

  const handleAiField = (field: string, value: string) => {
    updateSettings({ ai: { ...settings.ai, [field]: value } });
  };

  const handleWhatsAppUrl = (url: string) => {
    updateSettings({ whatsapp: { ...settings.whatsapp, url } });
  };

  const handlePaymentProvider = (provider: string) => {
    updateSettings({ payment: { provider, config: {} } });
  };

  const handlePaymentConfig = (key: string, value: string) => {
    updateSettings({
      payment: {
        ...settings.payment,
        config: { ...settings.payment.config, [key]: value },
      },
    });
  };

  const providerInfo = PAYMENT_PROVIDERS[settings.payment.provider];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-display font-semibold text-gold-gradient">
          Configurações
        </h1>
        <p className="text-sm text-muted-foreground font-body mt-1">
          Gerencie integrações e pagamentos
        </p>
      </div>

      {/* AI Settings */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-display font-semibold text-gold-600">
              Assistente IA
            </h3>
            <p className="text-xs text-muted-foreground font-body mt-0.5">
              Ative o ícone flutuante de chat IA na loja
            </p>
          </div>
          <button
            onClick={handleAiToggle}
            className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
              settings.ai.enabled ? "bg-gold" : "bg-gray-200"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                settings.ai.enabled ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {settings.ai.enabled && (
          <div className="space-y-3 pt-2 border-t border-border">
            <div className="mt-3">
              <label className="block text-xs font-body font-medium text-gold-600 mb-1.5">
                Modelo
              </label>
              <select
                value={settings.ai.model}
                onChange={(e) => handleAiField("model", e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl glass-card text-sm font-body text-foreground focus:outline-none focus:ring-1 focus:ring-gold-400/30 appearance-none cursor-pointer"
              >
                <option value="gpt">GPT (OpenAI)</option>
                <option value="claude">Claude (Anthropic)</option>
                <option value="grok">Grok (xAI)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-body font-medium text-gold-600 mb-1.5">
                API Key
              </label>
              <input
                type="password"
                value={settings.ai.apiKey}
                onChange={(e) => handleAiField("apiKey", e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl glass-card text-sm font-body text-foreground focus:outline-none focus:ring-1 focus:ring-gold-400/30"
                placeholder="sk-..."
                autoComplete="off"
              />
            </div>
          </div>
        )}
      </div>

      {/* WhatsApp Settings */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-display font-semibold text-gold-600">
              WhatsApp
            </h3>
            <p className="text-xs text-muted-foreground font-body mt-0.5">
              Ative o ícone flutuante de WhatsApp na loja
            </p>
          </div>
          <button
            onClick={handleWhatsAppToggle}
            className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
              settings.whatsapp.enabled ? "bg-gold" : "bg-gray-200"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                settings.whatsapp.enabled ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {settings.whatsapp.enabled && (
          <div className="pt-2 border-t border-border">
            <div className="mt-3">
              <label className="block text-xs font-body font-medium text-gold-600 mb-1.5">
                URL do WhatsApp
              </label>
              <input
                type="url"
                value={settings.whatsapp.url}
                onChange={(e) => handleWhatsAppUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl glass-card text-sm font-body text-foreground focus:outline-none focus:ring-1 focus:ring-gold-400/30"
                placeholder="https://wa.me/5511999999999"
              />
            </div>
          </div>
        )}
      </div>

      {/* Payment Settings */}
      <div className="glass-card p-5">
        <h3 className="text-base font-display font-semibold text-gold-600 mb-4">
          Pagamento
        </h3>
        <div>
          <label className="block text-xs font-body font-medium text-gold-600 mb-1.5">
            Provedor
          </label>
          <select
            value={settings.payment.provider}
            onChange={(e) => handlePaymentProvider(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl glass-card text-sm font-body text-foreground focus:outline-none focus:ring-1 focus:ring-gold-400/30 appearance-none cursor-pointer"
          >
            {Object.entries(PAYMENT_PROVIDERS).map(([key, p]) => (
              <option key={key} value={key}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {providerInfo && providerInfo.fields.length > 0 && (
          <div className="space-y-3 mt-4 pt-3 border-t border-border">
            {providerInfo.fields.map((field) => (
              <div key={field.key}>
                <label className="block text-xs font-body font-medium text-gold-600 mb-1.5">
                  {field.label}
                </label>
                <input
                  type={
                    field.key.toLowerCase().includes("secret") ||
                    field.key.toLowerCase().includes("key") ||
                    field.key.toLowerCase().includes("token")
                      ? "password"
                      : "text"
                  }
                  value={settings.payment.config[field.key] || ""}
                  onChange={(e) =>
                    handlePaymentConfig(field.key, e.target.value)
                  }
                  className="w-full px-4 py-2.5 rounded-2xl glass-card text-sm font-body text-foreground focus:outline-none focus:ring-1 focus:ring-gold-400/30"
                  placeholder={field.label}
                  autoComplete="off"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer - Legal Pages */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-display font-semibold text-gold-600">
              Rodapé — Páginas Legais
            </h3>
            <p className="text-xs text-muted-foreground font-body mt-0.5">
              Links e conteúdo exibidos no rodapé da loja
            </p>
          </div>
          <button
            onClick={() =>
              addLegalPage({
                id: crypto.randomUUID(),
                title: "Nova Página",
                content: "",
              })
            }
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gold text-white text-sm font-body font-semibold hover:opacity-90 transition-colors cursor-pointer"
          >
            <Plus className="size-4" />
            Adicionar
          </button>
        </div>

        <div className="space-y-2">
          {footerLegalPages.map((page) => (
            <div
              key={page.id}
              className="rounded-2xl border border-border overflow-hidden"
            >
              <div
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleExpand(page.id)}
              >
                <input
                  type="text"
                  value={page.title}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) =>
                    updateLegalPage(page.id, { title: e.target.value })
                  }
                  className="text-sm font-body font-medium text-foreground bg-transparent focus:outline-none focus:ring-1 focus:ring-gold-400/30 rounded-lg px-2 py-1"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeLegalPage(page.id);
                    }}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
                    aria-label="Excluir"
                  >
                    <Trash2 className="size-3.5 text-red-400" />
                  </button>
                  {expandedPages.includes(page.id) ? (
                    <ChevronUp className="size-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="size-4 text-muted-foreground" />
                  )}
                </div>
              </div>
              {expandedPages.includes(page.id) && (
                <div className="px-4 pb-4">
                  <textarea
                    value={page.content}
                    onChange={(e) =>
                      updateLegalPage(page.id, { content: e.target.value })
                    }
                    rows={5}
                    className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm font-body text-foreground focus:outline-none focus:ring-1 focus:ring-gold-400/30 resize-none"
                    placeholder="Conteúdo da página..."
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {footerLegalPages.length === 0 && (
          <p className="text-sm text-muted-foreground font-body py-4 text-center">
            Nenhuma página legal cadastrada.
          </p>
        )}
      </div>

      {/* Footer - Contact */}
      <div className="glass-card p-5">
        <h3 className="text-base font-display font-semibold text-gold-600 mb-4">
          Rodapé — Contato
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-body font-medium text-gold-600 mb-1.5">
              E-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gold-600/50" />
              <input
                type="email"
                value={footerContact.email}
                onChange={(e) => updateFooterContact({ email: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-card text-sm font-body text-foreground focus:outline-none focus:ring-1 focus:ring-gold-400/30"
                placeholder="contato@exemplo.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-body font-medium text-gold-600 mb-1.5">
              Telefone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gold-600/50" />
              <input
                type="tel"
                value={footerContact.phone}
                onChange={(e) => updateFooterContact({ phone: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-card text-sm font-body text-foreground focus:outline-none focus:ring-1 focus:ring-gold-400/30"
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-body font-medium text-gold-600 mb-1.5">
              Endereço
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gold-600/50" />
              <input
                type="text"
                value={footerContact.address}
                onChange={(e) =>
                  updateFooterContact({ address: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-card text-sm font-body text-foreground focus:outline-none focus:ring-1 focus:ring-gold-400/30"
                placeholder="Rua..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Social Media */}
      <div className="glass-card p-5">
        <h3 className="text-base font-display font-semibold text-gold-600 mb-4">
          Rodapé — Redes Sociais
        </h3>
        <div className="space-y-3">
          {[
            {
              key: "instagram",
              label: "Instagram",
              placeholder: "https://instagram.com/...",
            },
            {
              key: "facebook",
              label: "Facebook",
              placeholder: "https://facebook.com/...",
            },
            {
              key: "twitter",
              label: "Twitter / X",
              placeholder: "https://x.com/...",
            },
            {
              key: "tiktok",
              label: "TikTok",
              placeholder: "https://tiktok.com/@...",
            },
            {
              key: "youtube",
              label: "YouTube",
              placeholder: "https://youtube.com/@...",
            },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-body font-medium text-gold-600 mb-1.5">
                {label}
              </label>
              <input
                type="url"
                value={footerSocial[key as keyof typeof footerSocial]}
                onChange={(e) => updateFooterSocial({ [key]: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl glass-card text-sm font-body text-foreground focus:outline-none focus:ring-1 focus:ring-gold-400/30"
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { Instagram, Mail, Phone, MapPin } from "lucide-react";
import { STORE_CONFIG } from "@/constants/config";
import { useAdminStore } from "@/stores/adminStore";

export default function Footer() {
  const categories = useAdminStore((s) => s.categories);

  return (
    <footer className="relative mt-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gray-50 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 lg:px-6 pt-16 pb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="font-display text-2xl font-semibold text-gold-gradient mb-3">
              {STORE_CONFIG.name}
            </h3>
            <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4">
              {STORE_CONFIG.description}
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="size-10 rounded-xl glass-card flex items-center justify-center hover:text-gold-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="size-4 text-gold-600" />
              </a>
              <a
                href={`mailto:${STORE_CONFIG.email}`}
                className="size-10 rounded-xl glass-card flex items-center justify-center hover:text-gold-600 transition-colors"
                aria-label="Email"
              >
                <Mail className="size-4 text-gold-600" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display text-base font-semibold text-gold-600 mb-4">
              Categorias
            </h4>
            <nav className="space-y-2.5">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/produtos?categoria=${cat.slug}`}
                  className="block text-sm text-muted-foreground hover:text-gold-600 transition-colors font-body"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-display text-base font-semibold text-gold-600 mb-4">
              Ajuda
            </h4>
            <nav className="space-y-2.5">
              {[
                "Trocas e Devoluções",
                "Rastreamento",
                "FAQ",
                "Política de Privacidade",
                "Termos de Uso",
              ].map((link) => (
                <Link
                  key={link}
                  to="#"
                  className="block text-sm text-muted-foreground hover:text-gold-600 transition-colors font-body"
                >
                  {link}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-base font-semibold text-gold-600 mb-4">
              Contato
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <Phone className="size-4 text-gold-600 mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground font-body">
                  {STORE_CONFIG.phone}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="size-4 text-gold-600 mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground font-body">
                  {STORE_CONFIG.email}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="size-4 text-gold-600 mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground font-body">
                  {STORE_CONFIG.address}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground font-body">
            © 2025 {STORE_CONFIG.name}. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground font-body">
              Pagamentos:
            </span>
            <div className="flex gap-2">
              {["Pix", "Visa", "Master", "Elo"].map((p) => (
                <span
                  key={p}
                  className="px-2 py-1 text-[10px] font-body font-medium glass-card rounded-md text-gold-600"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

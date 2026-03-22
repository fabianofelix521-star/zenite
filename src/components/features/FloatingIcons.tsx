import { Bot, MessageCircle } from "lucide-react";
import { useAdminStore } from "@/stores/adminStore";

export default function FloatingIcons() {
  const aiEnabled = useAdminStore((s) => s.settings.ai.enabled);
  const whatsappEnabled = useAdminStore((s) => s.settings.whatsapp.enabled);
  const whatsappUrl = useAdminStore((s) => s.settings.whatsapp.url);

  if (!aiEnabled && !whatsappEnabled) return null;

  return (
    <div className="fixed right-4 bottom-24 z-40 flex flex-col items-center gap-3">
      {whatsappEnabled && whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center size-12 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-105 transition-transform cursor-pointer"
          aria-label="WhatsApp"
        >
          <MessageCircle className="size-6" />
        </a>
      )}
      {aiEnabled && (
        <button
          className="flex items-center justify-center size-12 rounded-full bg-gold text-white shadow-lg hover:scale-105 transition-transform cursor-pointer"
          aria-label="Assistente IA"
        >
          <Bot className="size-6" />
        </button>
      )}
    </div>
  );
}

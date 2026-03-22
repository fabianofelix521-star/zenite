import { useState } from "react";
import { Truck, Loader2, MapPin } from "lucide-react";
import { useShipping } from "@/hooks/useShipping";
import { formatPrice } from "@/lib/utils";
import { ShippingOption } from "@/types";

interface ShippingCalculatorProps {
  onSelect?: (option: ShippingOption) => void;
  selected?: ShippingOption | null;
}

export default function ShippingCalculator({
  onSelect,
  selected,
}: ShippingCalculatorProps) {
  const { cep, setCep, address, options, loading, error, calculateShipping } =
    useShipping();

  const formatCep = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    if (digits.length > 5) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    return digits;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateShipping(cep);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Truck className="size-4 text-primary" />
        <h4 className="text-sm font-body font-semibold text-foreground">
          Calcular frete
        </h4>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="00000-000"
          value={formatCep(cep)}
          onChange={(e) => setCep(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl glass-card font-body text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30"
          maxLength={9}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-primary text-white font-body font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 shrink-0"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Calcular"}
        </button>
      </form>

      {error && <p className="text-xs text-destructive font-body">{error}</p>}

      {address && (
        <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-muted/50">
          <MapPin className="size-3.5 text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground font-body">
            {address.logradouro}, {address.bairro} — {address.cidade}/
            {address.uf}
          </p>
        </div>
      )}

      {options.length > 0 && (
        <div className="space-y-2">
          {options.map((opt) => (
            <button
              key={opt.type}
              onClick={() => onSelect?.(opt)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                selected?.type === opt.type
                  ? "glass-strong border-primary/40 ring-2 ring-primary/20"
                  : "glass-card"
              }`}
            >
              <div className="text-left">
                <p className="text-sm font-body font-medium text-foreground">
                  {opt.name}
                </p>
                <p className="text-xs text-muted-foreground font-body">
                  {opt.days}
                </p>
              </div>
              <span
                className={`text-sm font-body font-bold ${opt.price === 0 ? "text-green-600" : "text-foreground"}`}
              >
                {opt.price === 0 ? "Grátis" : formatPrice(opt.price)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

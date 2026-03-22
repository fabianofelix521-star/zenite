import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  CreditCard,
  QrCode,
  Check,
  ChevronLeft,
  ShieldCheck,
  Lock,
  Loader2,
} from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useShipping } from "@/hooks/useShipping";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type Step = "address" | "shipping" | "payment" | "success";
type PaymentMethod = "pix" | "credit" | "boleto";

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("address");
  const [processing, setProcessing] = useState(false);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [shippingCost] = useState(18.9);

  const subtotal = totalPrice();
  const total = subtotal + shippingCost;

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCepLookup = async () => {
    const clean = form.cep.replace(/\D/g, "");
    if (clean.length !== 8) return;

    await new Promise((r) => setTimeout(r, 500));
    const regions: Record<string, Partial<typeof form>> = {
      "0": {
        logradouro: "Rua da Consolação",
        bairro: "Centro",
        cidade: "São Paulo",
        uf: "SP",
      },
      "1": {
        logradouro: "Rua dos Pinheiros",
        bairro: "Pinheiros",
        cidade: "São Paulo",
        uf: "SP",
      },
      "2": {
        logradouro: "Av. Atlântica",
        bairro: "Copacabana",
        cidade: "Rio de Janeiro",
        uf: "RJ",
      },
    };
    const data = regions[clean[0]] || regions["0"];
    setForm((prev) => ({ ...prev, ...data }));
  };

  const handlePlaceOrder = async () => {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 2000));
    setProcessing(false);
    setStep("success");
    clearCart();
  };

  if (items.length === 0 && step !== "success") {
    navigate("/carrinho");
    return null;
  }

  const steps = [
    { key: "address", label: "Endereço", icon: MapPin },
    { key: "shipping", label: "Envio", icon: Check },
    { key: "payment", label: "Pagamento", icon: CreditCard },
  ];

  if (step === "success") {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <div className="size-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="size-12 text-green-600" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-3">
            Pedido Confirmado!
          </h1>
          <p className="text-muted-foreground font-body mb-2">
            Pedido{" "}
            <strong className="text-foreground">
              #RA{Date.now().toString().slice(-6)}
            </strong>
          </p>
          <p className="text-sm text-muted-foreground font-body mb-8">
            Você receberá um e-mail com os detalhes e rastreamento.
          </p>
          <div className="glass-strong rounded-2xl p-6 mb-8 text-left">
            <h3 className="font-body font-semibold text-foreground mb-3">
              Resumo do pedido
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-body">
                <span className="text-muted-foreground">Total pago</span>
                <span className="price-tag">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm font-body">
                <span className="text-muted-foreground">Pagamento</span>
                <span className="text-foreground capitalize">
                  {paymentMethod === "pix"
                    ? "PIX"
                    : paymentMethod === "credit"
                      ? "Cartão de Crédito"
                      : "Boleto"}
                </span>
              </div>
              <div className="flex justify-between text-sm font-body">
                <span className="text-muted-foreground">
                  Previsão de entrega
                </span>
                <span className="text-foreground">5-8 dias úteis</span>
              </div>
            </div>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-white font-body font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            Continuar Comprando
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-6 py-4 lg:py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs font-body text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary transition-colors">
          Início
        </Link>
        <span>/</span>
        <Link to="/carrinho" className="hover:text-primary transition-colors">
          Carrinho
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">Checkout</span>
      </nav>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <div
              className={`size-9 rounded-full flex items-center justify-center text-sm font-body font-semibold transition-all ${
                step === s.key
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : steps.findIndex((x) => x.key === step) > i
                    ? "bg-green-500 text-white"
                    : "glass text-muted-foreground"
              }`}
            >
              {steps.findIndex((x) => x.key === step) > i ? (
                <Check className="size-4" />
              ) : (
                <s.icon className="size-4" />
              )}
            </div>
            <span className="hidden sm:block text-xs font-body font-medium text-muted-foreground">
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <div className="w-8 sm:w-16 h-px bg-border" />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Form area */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {/* Address Step */}
            {step === "address" && (
              <motion.div
                key="address"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card rounded-2xl p-5 lg:p-6"
              >
                <h2 className="font-display text-xl font-bold text-foreground mb-5">
                  Dados de Entrega
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-body font-medium text-foreground mb-1 block">
                      Nome completo
                    </label>
                    <input
                      type="text"
                      value={form.nome}
                      onChange={(e) => updateField("nome", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border font-body text-sm outline-none focus:ring-2 focus:ring-gold-400/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-body font-medium text-foreground mb-1 block">
                      E-mail
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border font-body text-sm outline-none focus:ring-2 focus:ring-gold-400/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-body font-medium text-foreground mb-1 block">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      value={form.telefone}
                      onChange={(e) => updateField("telefone", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border font-body text-sm outline-none focus:ring-2 focus:ring-gold-400/30"
                      placeholder="(11) 99999-0000"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-body font-medium text-foreground mb-1 block">
                      CEP
                    </label>
                    <input
                      type="text"
                      value={form.cep}
                      onChange={(e) => updateField("cep", e.target.value)}
                      onBlur={handleCepLookup}
                      className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border font-body text-sm outline-none focus:ring-2 focus:ring-gold-400/30"
                      placeholder="00000-000"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-body font-medium text-foreground mb-1 block">
                      Número
                    </label>
                    <input
                      type="text"
                      value={form.numero}
                      onChange={(e) => updateField("numero", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border font-body text-sm outline-none focus:ring-2 focus:ring-gold-400/30"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-body font-medium text-foreground mb-1 block">
                      Logradouro
                    </label>
                    <input
                      type="text"
                      value={form.logradouro}
                      onChange={(e) =>
                        updateField("logradouro", e.target.value)
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border font-body text-sm outline-none focus:ring-2 focus:ring-gold-400/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-body font-medium text-foreground mb-1 block">
                      Complemento
                    </label>
                    <input
                      type="text"
                      value={form.complemento}
                      onChange={(e) =>
                        updateField("complemento", e.target.value)
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border font-body text-sm outline-none focus:ring-2 focus:ring-gold-400/30"
                      placeholder="Opcional"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-body font-medium text-foreground mb-1 block">
                      Bairro
                    </label>
                    <input
                      type="text"
                      value={form.bairro}
                      onChange={(e) => updateField("bairro", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border font-body text-sm outline-none focus:ring-2 focus:ring-gold-400/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-body font-medium text-foreground mb-1 block">
                      Cidade
                    </label>
                    <input
                      type="text"
                      value={form.cidade}
                      onChange={(e) => updateField("cidade", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border font-body text-sm outline-none focus:ring-2 focus:ring-gold-400/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-body font-medium text-foreground mb-1 block">
                      UF
                    </label>
                    <input
                      type="text"
                      value={form.uf}
                      onChange={(e) => updateField("uf", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border font-body text-sm outline-none focus:ring-2 focus:ring-gold-400/30"
                      maxLength={2}
                    />
                  </div>
                </div>
                <button
                  onClick={() => setStep("payment")}
                  className="w-full mt-6 py-3.5 rounded-xl bg-primary text-white font-body font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                  Continuar para Pagamento
                </button>
              </motion.div>
            )}

            {/* Payment Step */}
            {step === "payment" && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card rounded-2xl p-5 lg:p-6"
              >
                <button
                  onClick={() => setStep("address")}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground font-body mb-4 transition-colors"
                >
                  <ChevronLeft className="size-4" />
                  Voltar
                </button>
                <h2 className="font-display text-xl font-bold text-foreground mb-5">
                  Forma de Pagamento
                </h2>

                <div className="space-y-3">
                  {[
                    {
                      id: "pix" as const,
                      label: "PIX",
                      desc: "10% de desconto",
                      icon: QrCode,
                      badge: "-10%",
                    },
                    {
                      id: "credit" as const,
                      label: "Cartão de Crédito",
                      desc: "Até 6x sem juros",
                      icon: CreditCard,
                      badge: "6x",
                    },
                    {
                      id: "boleto" as const,
                      label: "Boleto Bancário",
                      desc: "Vencimento em 3 dias",
                      icon: CreditCard,
                      badge: null,
                    },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-200 text-left ${
                        paymentMethod === method.id
                          ? "glass-strong border-primary/40 ring-2 ring-primary/20"
                          : "glass-card"
                      }`}
                    >
                      <div
                        className={`size-10 rounded-xl flex items-center justify-center ${
                          paymentMethod === method.id
                            ? "bg-primary/10"
                            : "bg-muted"
                        }`}
                      >
                        <method.icon
                          className={`size-5 ${paymentMethod === method.id ? "text-primary" : "text-muted-foreground"}`}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-body font-semibold text-foreground">
                          {method.label}
                        </p>
                        <p className="text-xs text-muted-foreground font-body">
                          {method.desc}
                        </p>
                      </div>
                      {method.badge && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-body font-bold rounded-lg">
                          {method.badge}
                        </span>
                      )}
                      <div
                        className={`size-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === method.id
                            ? "border-primary bg-primary"
                            : "border-border"
                        }`}
                      >
                        {paymentMethod === method.id && (
                          <Check className="size-3 text-white" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {paymentMethod === "credit" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 space-y-3"
                  >
                    <input
                      type="text"
                      placeholder="Número do cartão"
                      className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border font-body text-sm outline-none focus:ring-2 focus:ring-gold-400/30"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Validade (MM/AA)"
                        className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border font-body text-sm outline-none focus:ring-2 focus:ring-gold-400/30"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border font-body text-sm outline-none focus:ring-2 focus:ring-gold-400/30"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Nome impresso no cartão"
                      className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border font-body text-sm outline-none focus:ring-2 focus:ring-gold-400/30"
                    />
                  </motion.div>
                )}

                <div className="flex items-center gap-2 mt-5 p-3 rounded-lg bg-green-50/50">
                  <Lock className="size-4 text-green-600 shrink-0" />
                  <p className="text-xs text-green-700 font-body">
                    Pagamento 100% seguro. Seus dados são protegidos com
                    criptografia SSL.
                  </p>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={processing}
                  className="w-full mt-5 py-3.5 rounded-xl bg-primary text-white font-body font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {processing ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="size-5" />
                      Finalizar Pedido —{" "}
                      {formatPrice(
                        paymentMethod === "pix" ? total * 0.9 : total,
                      )}
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order Summary sidebar */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28 glass-strong rounded-2xl p-5 space-y-4">
            <h3 className="font-display text-lg font-semibold text-foreground">
              Resumo do Pedido
            </h3>

            {/* Items mini list */}
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}`}
                  className="flex items-center gap-3"
                >
                  <div className="relative">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="size-14 rounded-lg object-cover"
                    />
                    <span className="absolute -top-1 -right-1 size-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-body font-medium text-foreground truncate">
                      {item.product.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-body">
                      {item.selectedColor.name} · {item.selectedSize}
                    </p>
                  </div>
                  <span className="text-sm font-body font-semibold text-foreground tabular-nums">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-3 space-y-2">
              <div className="flex justify-between text-sm font-body">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm font-body">
                <span className="text-muted-foreground">Frete</span>
                <span>{formatPrice(shippingCost)}</span>
              </div>
              {paymentMethod === "pix" && (
                <div className="flex justify-between text-sm font-body">
                  <span className="text-green-600">Desconto PIX (10%)</span>
                  <span className="text-green-600">
                    -{formatPrice(total * 0.1)}
                  </span>
                </div>
              )}
              <div className="border-t border-border pt-2">
                <div className="flex justify-between">
                  <span className="font-body font-bold text-foreground">
                    Total
                  </span>
                  <span className="price-tag text-xl">
                    {formatPrice(paymentMethod === "pix" ? total * 0.9 : total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

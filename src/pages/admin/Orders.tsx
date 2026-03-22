import { useState } from "react";
import { Eye, Search } from "lucide-react";
import { useAdminStore, type AdminOrder } from "@/stores/adminStore";
import { formatPrice } from "@/lib/utils";

const STATUS_MAP: Record<
  AdminOrder["status"],
  { label: string; className: string }
> = {
  pending: { label: "Pendente", className: "bg-yellow-500/20 text-yellow-400" },
  processing: {
    label: "Processando",
    className: "bg-blue-500/20 text-blue-400",
  },
  shipped: { label: "Enviado", className: "bg-purple-500/20 text-purple-400" },
  delivered: {
    label: "Entregue",
    className: "bg-emerald-500/20 text-emerald-400",
  },
  cancelled: { label: "Cancelado", className: "bg-red-500/20 text-red-400" },
};

export default function AdminOrders() {
  const orders = useAdminStore((s) => s.orders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-display font-semibold text-gold-gradient">
          Pedidos
        </h1>
        <p className="text-sm text-muted-foreground font-body mt-1">
          Gerencie os pedidos da loja
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gold-400/50" />
          <input
            type="text"
            placeholder="Buscar por cliente ou ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-card text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-gold-400/30"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-2xl glass-card text-sm font-body text-foreground focus:outline-none focus:ring-1 focus:ring-gold-400/30 cursor-pointer"
        >
          <option value="all">Todos Status</option>
          <option value="pending">Pendente</option>
          <option value="processing">Processando</option>
          <option value="shipped">Enviado</option>
          <option value="delivered">Entregue</option>
          <option value="cancelled">Cancelado</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gold-600 uppercase tracking-wider">
                  Pedido
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gold-600 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gold-600 uppercase tracking-wider hidden md:table-cell">
                  Data
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gold-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gold-600 uppercase tracking-wider">
                  Total
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gold-600 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((order) => {
                const status = STATUS_MAP[order.status];
                return (
                  <tr
                    key={order.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {order.id}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-foreground">{order.customer}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                      {new Date(order.date).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gold-600 tabular-nums">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        className="p-2 rounded-xl hover:bg-muted transition-colors cursor-pointer"
                        aria-label="Ver detalhes"
                      >
                        <Eye className="size-4 text-gold-600" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground font-body text-sm">
            Nenhum pedido encontrado.
          </div>
        )}
      </div>
    </div>
  );
}

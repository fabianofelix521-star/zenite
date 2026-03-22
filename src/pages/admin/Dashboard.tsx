import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  Package,
} from "lucide-react";

const salesData = [
  { name: "Seg", vendas: 4200, pedidos: 12 },
  { name: "Ter", vendas: 3800, pedidos: 10 },
  { name: "Qua", vendas: 5100, pedidos: 15 },
  { name: "Qui", vendas: 4700, pedidos: 14 },
  { name: "Sex", vendas: 6300, pedidos: 19 },
  { name: "Sáb", vendas: 7800, pedidos: 24 },
  { name: "Dom", vendas: 5200, pedidos: 16 },
];

const revenueMonthly = [
  { name: "Jan", receita: 42000 },
  { name: "Fev", receita: 38000 },
  { name: "Mar", receita: 51000 },
  { name: "Abr", receita: 47000 },
  { name: "Mai", receita: 53000 },
  { name: "Jun", receita: 61000 },
];

const categoryData = [
  { name: "Perfumes Fem.", value: 40 },
  { name: "Perfumes Masc.", value: 30 },
  { name: "Cosméticos", value: 20 },
  { name: "Kits", value: 10 },
];

const GOLD_COLORS = ["#D4AF37", "#E8C670", "#C5A055", "#a88630"];

const stats = [
  {
    label: "Receita Hoje",
    value: "R$ 7.830",
    change: "+12.5%",
    icon: DollarSign,
  },
  { label: "Pedidos Hoje", value: "24", change: "+8.3%", icon: ShoppingCart },
  { label: "Usuários Ativos", value: "1.432", change: "+5.2%", icon: Users },
  { label: "Taxa Conversão", value: "3.8%", change: "+0.4%", icon: TrendingUp },
  { label: "Produtos Ativos", value: "156", change: "+3", icon: Package },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-display font-semibold text-gold-gradient">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground font-body mt-1">
          Visão geral da loja
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-card p-4 lg:p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="size-10 rounded-2xl bg-gold-400/10 flex items-center justify-center">
                  <Icon className="size-5 text-gold-400" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground font-body">
                {stat.label}
              </p>
              <p className="text-xl font-display font-semibold text-foreground mt-1">
                {stat.value}
              </p>
              <span className="text-xs text-emerald-400 font-body font-medium">
                {stat.change}
              </span>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Sales Bar Chart */}
        <div className="glass-card p-5">
          <h3 className="text-base font-display font-semibold text-gold-600 mb-4">
            Vendas da Semana
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
              <XAxis
                dataKey="name"
                tick={{ fill: "rgba(0,0,0,0.5)", fontSize: 12 }}
              />
              <YAxis tick={{ fill: "rgba(0,0,0,0.5)", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: 16,
                  color: "#1a2744",
                }}
                labelStyle={{ color: "#a88630" }}
              />
              <Bar dataKey="vendas" fill="#D4AF37" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Line Chart */}
        <div className="glass-card p-5">
          <h3 className="text-base font-display font-semibold text-gold-600 mb-4">
            Receita Mensal
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueMonthly}>
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#D4AF37" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
              <XAxis
                dataKey="name"
                tick={{ fill: "rgba(0,0,0,0.5)", fontSize: 12 }}
              />
              <YAxis tick={{ fill: "rgba(0,0,0,0.5)", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: 16,
                  color: "#1a2744",
                }}
                labelStyle={{ color: "#a88630" }}
              />
              <Area
                type="monotone"
                dataKey="receita"
                stroke="#D4AF37"
                fill="url(#goldGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pie chart */}
        <div className="glass-card p-5">
          <h3 className="text-base font-display font-semibold text-gold-600 mb-4">
            Vendas por Categoria
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {categoryData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={GOLD_COLORS[index % GOLD_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: 16,
                  color: "#1a2744",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Orders trend */}
        <div className="glass-card p-5 lg:col-span-2">
          <h3 className="text-base font-display font-semibold text-gold-600 mb-4">
            Pedidos da Semana
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
              <XAxis
                dataKey="name"
                tick={{ fill: "rgba(0,0,0,0.5)", fontSize: 12 }}
              />
              <YAxis tick={{ fill: "rgba(0,0,0,0.5)", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: 16,
                  color: "#1a2744",
                }}
                labelStyle={{ color: "#a88630" }}
              />
              <Legend wrapperStyle={{ color: "rgba(0,0,0,0.6)" }} />
              <Line
                type="monotone"
                dataKey="pedidos"
                stroke="#E8C670"
                strokeWidth={2}
                dot={{ fill: "#D4AF37", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

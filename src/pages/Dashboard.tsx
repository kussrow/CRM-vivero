import { mockLeads, mockBudgets, mockEvents, mockContacts } from '../data/mockData';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, DollarSign, Users, FileText, CalendarDays, 
  ArrowUpRight, ArrowDownRight, Target
} from 'lucide-react';
import Badge from '../components/ui/Badge';

export default function Dashboard() {
  const activeLeads = mockLeads.filter(l => l.status === 'active').length;
  const wonLeads = mockLeads.filter(l => l.pipeline_stage_id === 's5').length;
  const lostLeads = mockLeads.filter(l => l.pipeline_stage_id === 's6').length;
  const totalBudgeted = mockBudgets.reduce((acc, curr) => acc + curr.total_amount, 0);
  const acceptedBudgets = mockBudgets.filter(b => b.status === 'accepted');
  const totalWon = acceptedBudgets.reduce((acc, curr) => acc + curr.total_amount, 0);
  const conversionRate = Math.round((wonLeads / activeLeads) * 100);
  const pendingEvents = mockEvents.filter(e => e.status === 'pending').length;

  const fmtCurrency = (n: number) => new Intl.NumberFormat('es-AR', { 
    style: 'currency', currency: 'ARS', maximumFractionDigits: 0 
  }).format(n);

  const leadsByStage = [
    { name: 'Nuevo', value: mockLeads.filter(l => l.pipeline_stage_id === 's1').length },
    { name: 'Contactado', value: mockLeads.filter(l => l.pipeline_stage_id === 's2').length },
    { name: 'Presupuesto', value: mockLeads.filter(l => l.pipeline_stage_id === 's3').length },
    { name: 'Negociación', value: mockLeads.filter(l => l.pipeline_stage_id === 's4').length },
  ];

  const leadsBySource = [
    { name: 'WhatsApp', value: mockLeads.filter(l => l.source === 'WhatsApp').length },
    { name: 'Instagram', value: mockLeads.filter(l => l.source === 'Instagram').length },
    { name: 'Web', value: mockLeads.filter(l => l.source === 'Web').length },
    { name: 'Correo/Otros', value: mockLeads.filter(l => !['WhatsApp', 'Instagram', 'Web'].includes(l.source || '')).length },
  ].filter(s => s.value > 0);

  // Simulated monthly revenue data
  const revenueData = [
    { month: 'Ene', revenue: 1200000 },
    { month: 'Feb', revenue: 1800000 },
    { month: 'Mar', revenue: 2400000 },
    { month: 'Abr', revenue: 3100000 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  const metrics = [
    { 
      title: 'Leads Activos', 
      value: activeLeads, 
      change: '+12%', 
      up: true,
      icon: Users, 
      color: 'from-blue-500 to-blue-600',
      shadow: 'shadow-blue-500/20'
    },
    { 
      title: 'Ventas Cerradas', 
      value: fmtCurrency(totalWon), 
      change: '+8%', 
      up: true,
      icon: DollarSign, 
      color: 'from-emerald-500 to-emerald-600',
      shadow: 'shadow-emerald-500/20'
    },
    { 
      title: 'Conversión', 
      value: `${conversionRate}%`, 
      change: '-2%', 
      up: false,
      icon: Target, 
      color: 'from-violet-500 to-violet-600',
      shadow: 'shadow-violet-500/20'
    },
    { 
      title: 'Eventos Pendientes', 
      value: pendingEvents, 
      change: '+3', 
      up: true,
      icon: CalendarDays, 
      color: 'from-amber-500 to-orange-500',
      shadow: 'shadow-amber-500/20'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Resumen General</h2>
          <p className="text-sm text-muted-foreground mt-1">Vista rápida del rendimiento comercial</p>
        </div>
        <Badge variant="info" dot>Última actualización: Hoy</Badge>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.title} className="relative p-5 bg-card rounded-xl border border-border shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${metric.color} ${metric.shadow} shadow-lg`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold ${metric.up ? 'text-emerald-500' : 'text-red-500'}`}>
                  {metric.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {metric.change}
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{metric.value}</p>
              <p className="text-xs text-muted-foreground mt-1 font-medium uppercase tracking-wider">{metric.title}</p>
              {/* Hover glow */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity bg-gradient-to-br ${metric.color} rounded-xl`} />
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart - Wider */}
        <div className="lg:col-span-2 p-6 bg-card rounded-xl border border-border shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-semibold text-foreground">Ingresos Mensuales</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Evolución de ventas cerradas</p>
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-emerald-500">
              <TrendingUp className="h-4 w-4" />
              +29%
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000000).toFixed(1)}M`} />
                <RechartsTooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))', 
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '12px',
                    fontSize: '13px',
                  }} 
                  formatter={(value: number) => [fmtCurrency(value), 'Ingresos']}
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="url(#colorRevenue)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline Distribution */}
        <div className="p-6 bg-card rounded-xl border border-border shadow-sm">
          <h3 className="text-base font-semibold text-foreground mb-1">Pipeline</h3>
          <p className="text-xs text-muted-foreground mb-6">Distribución de leads</p>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leadsByStage}
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {leadsByStage.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))', 
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '12px',
                    fontSize: '13px',
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {leadsByStage.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-muted-foreground text-xs">{item.name}</span>
                </div>
                <span className="font-semibold text-foreground text-xs">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads by Source Bar Chart */}
        <div className="p-6 bg-card rounded-xl border border-border shadow-sm">
          <h3 className="text-base font-semibold text-foreground mb-1">Origen de Leads</h3>
          <p className="text-xs text-muted-foreground mb-6">Canales de adquisición de clientes</p>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadsBySource}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  cursor={{fill: 'hsl(var(--muted))'}} 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))', 
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '12px',
                    fontSize: '13px',
                  }} 
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-6 bg-card rounded-xl border border-border shadow-sm">
          <h3 className="text-base font-semibold text-foreground mb-1">Actividad Reciente</h3>
          <p className="text-xs text-muted-foreground mb-6">Últimos movimientos del equipo</p>
          <div className="space-y-4">
            {mockLeads.slice(0, 5).map((lead, i) => (
              <div key={lead.id} className="flex items-center gap-4 group">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center flex-shrink-0 ring-1 ring-blue-500/10">
                  <span className="text-xs font-bold text-primary">{lead.first_name[0]}{lead.last_name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {lead.first_name} {lead.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{lead.product_interest}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-foreground">{fmtCurrency(lead.estimated_amount)}</p>
                  <p className="text-[10px] text-muted-foreground">{lead.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

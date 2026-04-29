import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { mockUsers } from '../data/mockData';
import { Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  
  // Initialize theme on load
  useThemeStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    await new Promise(r => setTimeout(r, 600));

    const user = mockUsers.find((u) => u.email === email);
    
    if (user && password.length > 3) {
      login(user);
      navigate('/dashboard');
    } else {
      setError('Credenciales inválidas. Probá con admin@crm.com');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex dark bg-[hsl(224,71%,4%)]">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-violet-800" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIj48cGF0aCBkPSJNMCAwaDQwdjQwSDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjxwYXRoIGQ9Ik0wIDBoMXY0MEgweiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNhKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-40" />
        
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative z-10 flex flex-col justify-center items-start p-16 text-white">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-8 ring-1 ring-white/20">
            <span className="text-2xl font-bold">V</span>
          </div>
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Gestión Comercial<br />
            <span className="text-blue-200">Inteligente</span>
          </h2>
          <p className="text-blue-100/80 text-lg max-w-md leading-relaxed">
            Controlá tus leads, presupuestos y pipeline de ventas en una sola plataforma diseñada para tu equipo.
          </p>

          <div className="mt-12 grid grid-cols-3 gap-8">
            <div>
              <p className="text-3xl font-bold text-white">98%</p>
              <p className="text-sm text-blue-200/70 mt-1">Satisfacción</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">2.5x</p>
              <p className="text-sm text-blue-200/70 mt-1">Más ventas</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">24/7</p>
              <p className="text-sm text-blue-200/70 mt-1">Disponible</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[hsl(224,71%,4%)]">
        <div className="max-w-sm w-full">
          <div className="text-center mb-8">
            <div className="lg:hidden w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/25">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Bienvenido de vuelta</h1>
            <p className="text-[hsl(215,20%,65%)] mt-2 text-sm">Ingresá tus credenciales para acceder</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[hsl(215,20%,65%)] mb-1.5 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(215,20%,45%)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-[hsl(217,32%,15%)] rounded-xl bg-[hsl(224,71%,6%)] text-white placeholder:text-[hsl(215,20%,35%)] focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 outline-none transition-all text-sm"
                  placeholder="admin@crm.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[hsl(215,20%,65%)] mb-1.5 uppercase tracking-wider">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(215,20%,45%)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 border border-[hsl(217,32%,15%)] rounded-xl bg-[hsl(224,71%,6%)] text-white placeholder:text-[hsl(215,20%,35%)] focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 outline-none transition-all text-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[hsl(215,20%,45%)] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-slide-up">
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm mt-6"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Ingresar
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 p-4 rounded-xl bg-[hsl(224,71%,6%)] border border-[hsl(217,32%,15%)]">
            <p className="text-xs text-[hsl(215,20%,45%)] mb-2 font-medium uppercase tracking-wider">Demo — Usuarios de prueba</p>
            <div className="space-y-1">
              {mockUsers.map(u => (
                <button
                  key={u.id}
                  onClick={() => { setEmail(u.email); setPassword('demo1234'); }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-[hsl(215,20%,65%)] hover:bg-[hsl(217,32%,12%)] hover:text-white transition-colors flex justify-between items-center group"
                >
                  <span>{u.email}</span>
                  <span className="text-[10px] uppercase tracking-wider text-[hsl(215,20%,35%)] group-hover:text-blue-400 transition-colors">{u.role}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { Moon, Sun, Shield, Building2, User as UserIcon } from 'lucide-react';

export default function Settings() {
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Configuración</h2>
        <p className="text-sm text-muted-foreground mt-1">Ajustes de tu cuenta y preferencias</p>
      </div>

      {/* Profile Section */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-indigo-500/10">
            <UserIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Perfil de Usuario</h3>
            <p className="text-xs text-muted-foreground">Información personal y preferencias</p>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <span className="text-white font-bold text-xl">{user?.full_name?.charAt(0) || 'U'}</span>
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{user?.full_name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <p className="text-xs text-primary font-medium mt-1 capitalize">{user?.role === 'admin' ? 'Administrador' : 'Vendedor'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Nombre Completo</label>
              <input 
                type="text" 
                defaultValue={user?.full_name} 
                className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Email</label>
              <input 
                type="email" 
                defaultValue={user?.email} 
                className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm disabled:opacity-50"
                disabled
              />
            </div>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10">
            {theme === 'dark' ? <Moon className="h-5 w-5 text-amber-500" /> : <Sun className="h-5 w-5 text-amber-500" />}
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Apariencia</h3>
            <p className="text-xs text-muted-foreground">Personaliza la interfaz visual</p>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Modo Oscuro</p>
              <p className="text-xs text-muted-foreground mt-0.5">Cambia entre el tema claro y oscuro</p>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${
                theme === 'dark' ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 flex items-center justify-center ${
                theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
              }`}>
                {theme === 'dark' ? <Moon className="h-3 w-3 text-primary" /> : <Sun className="h-3 w-3 text-amber-500" />}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Company Settings (Admin only) */}
      {user?.role === 'admin' && (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10">
              <Building2 className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">Configuración de Empresa</h3>
              <p className="text-xs text-muted-foreground">Ajustes generales del CRM</p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Nombre de la Empresa</label>
                <input 
                  type="text" 
                  defaultValue="CRM Comercial Vivero" 
                  className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Moneda</label>
                <select className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm">
                  <option value="ARS">ARS - Peso Argentino</option>
                  <option value="USD">USD - Dólar</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-border">
              <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg text-sm shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 transition-all">
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-red-500/10 to-rose-500/10">
            <Shield className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Seguridad</h3>
            <p className="text-xs text-muted-foreground">Contraseña y acceso a la cuenta</p>
          </div>
        </div>
        <div className="p-6">
          <button className="px-4 py-2.5 text-sm font-medium text-foreground border border-input rounded-lg hover:bg-accent transition-colors">
            Cambiar Contraseña
          </button>
        </div>
      </div>
    </div>
  );
}

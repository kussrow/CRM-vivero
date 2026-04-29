import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { 
  LayoutDashboard, Users, Contact, Columns3, CalendarDays, 
  Package, FileText, Settings, LogOut, Menu, Moon, Sun, 
  Bell, ChevronRight, Clock
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { mockEvents } from '../../data/mockData';
import { isPast, parseISO, isToday } from 'date-fns';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Leads', href: '/leads', icon: Users },
  { name: 'Pipeline', href: '/kanban', icon: Columns3 },
  { name: 'Calendario', href: '/calendar', icon: CalendarDays },
  { name: 'Contactos', href: '/contacts', icon: Contact },
  { name: 'Productos', href: '/products', icon: Package },
  { name: 'Presupuestos', href: '/budgets', icon: FileText },
];

export default function AppLayout() {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close notifications if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const expiredEvents = mockEvents.filter(e => isPast(parseISO(e.due_at)) && e.status !== 'completed' && !isToday(parseISO(e.due_at)));

  const currentPage = navigation.find(n => n.href === location.pathname)?.name 
    || (location.pathname === '/settings' ? 'Configuración' : 'Dashboard');

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-[260px] bg-card border-r border-border transform transition-transform duration-300 ease-out lg:translate-x-0 lg:static lg:inset-auto flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground tracking-tight">Vivero CRM</h1>
              <p className="text-[10px] text-muted-foreground font-medium">Panel Comercial</p>
            </div>
          </div>
        </div>
        
        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-3 py-2.5 text-[13px] font-medium rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className={`mr-3 h-[18px] w-[18px] flex-shrink-0 transition-colors ${
                  isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-accent-foreground'
                }`} />
                {item.name}
                {isActive && (
                  <ChevronRight className="ml-auto h-4 w-4 text-primary-foreground/60" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-3 border-t border-border space-y-1">
          <Link
            to="/settings"
            className={`flex items-center px-3 py-2.5 text-[13px] font-medium rounded-lg transition-all duration-200 ${
              location.pathname === '/settings' 
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <Settings className="mr-3 h-[18px] w-[18px]" />
            Configuración
          </Link>
          
          <div className="flex items-center justify-between px-3 py-3 mt-2 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="text-white font-bold text-xs">
                  {user?.full_name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{user?.full_name}</p>
                <p className="text-[10px] text-muted-foreground capitalize">{user?.role === 'admin' ? 'Admin' : 'Vendedor'}</p>
              </div>
            </div>
            <button 
              onClick={logout} 
              className="p-1.5 text-muted-foreground hover:text-destructive rounded-md hover:bg-destructive/10 transition-colors flex-shrink-0"
              title="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-14 flex items-center justify-between px-4 sm:px-6 bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-muted-foreground hover:bg-accent rounded-lg transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="text-base font-semibold text-foreground">
              {currentPage}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
              >
                <Bell className="h-[18px] w-[18px]" />
                {expiredEvents.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-card" />
                )}
              </button>

              {/* Dropdown de Notificaciones */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
                  <div className="p-3 border-b border-border flex justify-between items-center bg-muted/30">
                    <h3 className="font-semibold text-sm text-foreground">Notificaciones</h3>
                    <span className="text-xs bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full font-medium">
                      {expiredEvents.length} Vencidos
                    </span>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {expiredEvents.length === 0 ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No tienes eventos vencidos. ¡Todo al día!
                      </div>
                    ) : (
                      <div className="divide-y divide-border">
                        {expiredEvents.map(event => (
                          <div key={event.id} className="p-3 hover:bg-muted/30 transition-colors">
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 p-1.5 bg-red-500/10 text-red-500 rounded-md">
                                <Clock className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">{event.title}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  Venció el {new Date(event.due_at).toLocaleDateString()} a las {new Date(event.due_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {expiredEvents.length > 0 && (
                    <div className="p-2 border-t border-border bg-muted/30">
                      <Link 
                        to="/calendar" 
                        onClick={() => setShowNotifications(false)}
                        className="block w-full text-center text-xs font-medium text-primary hover:text-primary/80 py-1.5"
                      >
                        Ver en el calendario
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
              title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
            >
              {theme === 'dark' ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
            </button>
          </div>
        </header>

        {/* Main scrollable area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="animate-slide-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

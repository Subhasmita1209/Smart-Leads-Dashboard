import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, Moon, Sun, Zap } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const { isDark, toggle } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/leads', icon: Users, label: 'Leads' },
  ];

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside className="w-64 flex flex-col border-r" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-6 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>
            Smart Leads
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-600 text-white'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
              style={({ isActive }) => isActive ? {} : { color: 'var(--text-secondary)' }}
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t space-y-2" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center">
              <span className="text-brand-600 dark:text-brand-400 text-xs font-semibold">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                {user?.name}
              </p>
              <p className="text-xs capitalize" style={{ color: 'var(--text-secondary)' }}>
                {user?.role}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggle}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
              style={{ color: 'var(--text-secondary)' }}
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
              <span className="text-xs">{isDark ? 'Light' : 'Dark'}</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            >
              <LogOut size={15} />
              <span className="text-xs">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

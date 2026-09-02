import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Layers,
  FolderKanban,
  Calculator,
  LineChart,
  Menu,
  X,
  Sun,
  Moon,
  Search,
  Bell,
  ChevronRight,
  TrendingUp,
  LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, active, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      active
        ? 'bg-primary text-primary-foreground font-medium shadow-md shadow-primary/20'
        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
    }`}
  >
    <div className={`transition-transform duration-200 group-hover:scale-110 ${active ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
      {icon}
    </div>
    <span>{label}</span>
  </Link>
);

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [globalSearch, setGlobalSearch] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  const navLinks = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/marches', icon: <Briefcase size={20} />, label: 'Marchés' },
    { to: '/hierarchie', icon: <Layers size={20} />, label: 'Arborescence' },
    { to: '/series', icon: <Layers size={20} />, label: 'Séries (Consultation)' },
    { to: '/ouvrages', icon: <FolderKanban size={20} />, label: 'Ouvrages (Client)' },
    { to: '/production', icon: <Calculator size={20} />, label: 'Libellés Production' },
    { to: '/decompositions', icon: <LineChart size={20} />, label: 'Décompositions' },
  ];

  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/') return [{ label: 'Dashboard', to: '/' }];

    const crumbs = [{ label: 'Accueil', to: '/' }];
    if (path.startsWith('/marches')) {
      crumbs.push({ label: 'Marchés', to: '/marches' });
    } else if (path.startsWith('/series')) {
      crumbs.push({ label: 'Marchés', to: '/marches' });
      crumbs.push({ label: 'Séries', to: '/series' });
    } else if (path.startsWith('/ouvrages')) {
      crumbs.push({ label: 'Marchés', to: '/marches' });
      crumbs.push({ label: 'Séries', to: '/series' });
      crumbs.push({ label: 'Ouvrages', to: '/ouvrages' });
    } else if (path.startsWith('/production')) {
      crumbs.push({ label: 'Marchés', to: '/marches' });
      crumbs.push({ label: 'Séries', to: '/series' });
      crumbs.push({ label: 'Ouvrages', to: '/ouvrages' });
      crumbs.push({ label: 'Libellés Production', to: '/production' });
    } else if (path.startsWith('/decompositions')) {
      crumbs.push({ label: 'Marchés', to: '/marches' });
      crumbs.push({ label: 'Séries', to: '/series' });
      crumbs.push({ label: 'Ouvrages', to: '/ouvrages' });
      crumbs.push({ label: 'Libellés Production', to: '/production' });
      crumbs.push({ label: 'Décompositions', to: '/decompositions' });
    } else if (path.startsWith('/hierarchie')) {
      crumbs.push({ label: 'Marchés', to: '/marches' });
      crumbs.push({ label: 'Arborescence', to: '/hierarchie' });
    }

    return crumbs;
  };

  const crumbs = getBreadcrumbs();

  const handleGlobalSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      // Rediriger vers la page Marchés avec un filtre de recherche
      navigate(`/marches?search=${encodeURIComponent(globalSearch)}`);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground transition-colors duration-200">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card/50 backdrop-blur-md p-4 transition-all duration-300">
        <div className="flex items-center gap-3 px-3 py-4 border-b border-border/80 mb-6">
          <div className="bg-primary/10 text-primary p-2.5 rounded-xl border border-primary/20 shadow-inner">
            <TrendingUp size={22} className="animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight">BTP Manager</h1>
            <span className="text-xs text-muted-foreground font-medium">Gestion de Marchés</span>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-1.5">
          {navLinks.map((link) => (
            <SidebarLink
              key={link.to}
              to={link.to}
              icon={link.icon}
              label={link.label}
              active={location.pathname === link.to}
            />
          ))}
        </nav>

        <div className="mt-auto border-t border-border pt-4 px-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 shrink-0 rounded-full bg-primary/20 flex items-center justify-center font-semibold text-primary uppercase">
                {user?.prenom?.[0]}{user?.nom?.[0]}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate">Bienvenue {user?.prenom}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Se déconnecter"
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors shrink-0"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Sidebar - Mobile drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative flex flex-col w-64 bg-card p-4 border-r border-border">
            <button className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground" onClick={() => setSidebarOpen(false)}>
              <X size={20} />
            </button>
            <div className="flex items-center gap-3 px-3 py-4 border-b border-border mb-6">
              <div className="bg-primary/10 text-primary p-2 rounded-lg">
                <TrendingUp size={20} />
              </div>
              <h1 className="font-bold text-lg">BTP Manager</h1>
            </div>
            <nav className="flex-1 flex flex-col gap-1">
              {navLinks.map((link) => (
                <SidebarLink
                  key={link.to}
                  to={link.to}
                  icon={link.icon}
                  label={link.label}
                  active={location.pathname === link.to}
                  onClick={() => setSidebarOpen(false)}
                />
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border bg-card/30 backdrop-blur-md px-6 py-4">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>

            {/* Breadcrumbs */}
            <div className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground">
              {crumbs.map((crumb, idx) => (
                <React.Fragment key={crumb.to}>
                  {idx > 0 && <ChevronRight size={14} className="text-muted-foreground/60" />}
                  <Link
                    to={crumb.to}
                    className={`transition-colors hover:text-foreground ${
                      idx === crumbs.length - 1 ? 'text-foreground font-semibold' : ''
                    }`}
                  >
                    {crumb.label}
                  </Link>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Global Search */}
            <form onSubmit={handleGlobalSearchSubmit} className="relative hidden md:block">
              <Search className="absolute left-3 top-2.5 text-muted-foreground" size={16} />
              <input
                type="text"
                placeholder="Recherche globale..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-64 pl-9 pr-4 py-2 text-sm rounded-xl border border-input bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              />
            </form>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-200"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notifications */}
            <button className="p-2.5 rounded-xl border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground relative transition-all duration-200">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-6 bg-background/50">
          {children}
        </main>
      </div>
    </div>
  );
};

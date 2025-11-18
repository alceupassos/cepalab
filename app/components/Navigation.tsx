'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Home, 
  DollarSign, 
  Package, 
  TrendingUp, 
  BarChart3, 
  Settings, 
  LogOut,
  User,
  Bell,
  Search,
  ChevronDown,
  Moon,
  Sun,
  RefreshCw,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

interface NavigationProps {
  onRefresh?: () => void;
  onExport?: () => void;
  showActions?: boolean;
}

export function Navigation({ onRefresh, onExport, showActions = true }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check for dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/auth/login' });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  const navigationItems = [
    { 
      name: 'Dashboard', 
      href: '/cepalab/dashboard/enhanced', 
      icon: Home,
      description: 'Visão geral dos negócios'
    },
    { 
      name: 'Vendas', 
      href: '/cepalab/vendas', 
      icon: DollarSign,
      description: 'Gestão de vendas e pedidos'
    },
    { 
      name: 'Estoque', 
      href: '/cepalab/estoque', 
      icon: Package,
      description: 'Controle de inventário'
    },
    { 
      name: 'Financeiro', 
      href: '/cepalab/financeiro', 
      icon: TrendingUp,
      description: 'Contas a receber e caixa'
    },
    { 
      name: 'Relatórios', 
      href: '/cepalab/relatorios', 
      icon: BarChart3,
      description: 'Análises e relatórios'
    },
    { 
      name: 'Configurações', 
      href: '/cepalab/configuracoes', 
      icon: Settings,
      description: 'Preferências do sistema'
    }
  ];

  const quickActions = [
    { name: 'Nova Venda', action: () => router.push('/cepalab/vendas/nova'), icon: DollarSign },
    { name: 'Importar Produtos', action: () => console.log('Import products'), icon: Package },
    { name: 'Exportar Dados', action: onExport, icon: Download },
    { name: 'Atualizar', action: onRefresh, icon: RefreshCw }
  ];

  const menuVariants = {
    hidden: { 
      opacity: 0, 
      x: -300,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.3, 
        ease: "easeInOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  const userMenuVariants = {
    hidden: { 
      opacity: 0, 
      y: -10,
      scale: 0.95,
      transition: { duration: 0.2 }
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { duration: 0.2 }
    }
  };

  return (
    <>
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-y-0 left-0 w-80 bg-white dark:bg-gray-900 shadow-xl z-50 lg:hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/70 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">C</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">CEPALAB</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Sistema Integrado</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <motion.div key={item.name} variants={itemVariants}>
                      <a
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg transition-all group",
                          isActive
                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary"
                        )}
                      >
                        <Icon className={cn("w-5 h-5", isActive && "text-white")} />
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs opacity-75">{item.description}</div>
                        </div>
                      </a>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Quick Actions */}
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Ações Rápidas</h3>
                <div className="space-y-2">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <motion.button
                        key={action.name}
                        onClick={action.action}
                        variants={itemVariants}
                        className="flex items-center gap-3 w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{action.name}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* User Info */}
              {session?.user && (
                <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">{session.user.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{session.user.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full mt-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-30 transition-all duration-300",
          isScrolled 
            ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg" 
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Mobile Menu */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
              
              <a href="/cepalab/dashboard/enhanced" className="flex items-center gap-3">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="w-10 h-10 bg-gradient-to-r from-primary to-primary/70 rounded-lg flex items-center justify-center shadow-lg"
                >
                  <span className="text-white font-bold text-lg">C</span>
                </motion.div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">CEPALAB</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Sistema Integrado</p>
                </div>
              </a>
            </div>

            {/* Desktop Navigation Items */}
            <div className="hidden lg:flex items-center gap-1">
              {navigationItems.slice(0, -1).map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg transition-all group relative",
                      isActive
                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.a>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <form onSubmit={handleSearch} className="hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-64 bg-gray-100 dark:bg-gray-800 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </form>

              {/* Quick Actions */}
              {showActions && (
                <div className="hidden lg:flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onRefresh}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    title="Atualizar dados"
                  >
                    <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onExport}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    title="Exportar dados"
                  >
                    <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </motion.button>
                </div>
              )}

              {/* Dark Mode Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title={darkMode ? "Modo claro" : "Modo escuro"}
              >
                <AnimatePresence mode="wait">
                  {darkMode ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun className="w-4 h-4 text-yellow-500" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon className="w-4 h-4 text-gray-600" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="Notificações"
              >
                <Bell className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                />
              </motion.button>

              {/* User Menu */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-white" />
                  </div>
                  <ChevronDown className={cn("w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform", showUserMenu && "rotate-180")} />
                </motion.button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      variants={userMenuVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2"
                    >
                      {session?.user && (
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          <div className="font-medium text-gray-900 dark:text-white">{session.user.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{session.user.email}</div>
                        </div>
                      )}
                      
                      <div className="py-2">
                        <a
                          href="/cepalab/perfil"
                          className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          <span>Meu Perfil</span>
                        </a>
                        
                        <a
                          href="/cepalab/configuracoes"
                          className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Configurações</span>
                        </a>
                      </div>
                      
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sair</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Spacer to prevent content from being hidden under fixed nav */}
      <div className="h-16" />
    </>
  );
}

export function NavigationProvider({ children, ...props }: { children: React.ReactNode } & NavigationProps) {
  return (
    <>
      <Navigation {...props} />
      {children}
    </>
  );
}
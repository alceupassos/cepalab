'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign, 
  ShoppingCart,
  Target,
  MapPin,
  FileText,
  Brain,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { AnimatedCard } from '@/app/components/AnimatedCard';
import { useRouter } from 'next/navigation';

interface BIReport {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: 'vendas' | 'estoque' | 'financeiro' | 'comercial' | 'analise';
  powerBIUrl?: string;
  lastUpdated?: string;
  status: 'active' | 'development' | 'maintenance';
  priority: 'high' | 'medium' | 'low';
}

const biReports: BIReport[] = [
  {
    id: 'analise-ecommerce',
    title: 'Análise E-commerce',
    description: 'Dashboard completo de vendas online com análise de conversão, ticket médio e comportamento do cliente',
    icon: BarChart3,
    category: 'vendas',
    powerBIUrl: 'https://app.powerbi.com/view?r=eyJrIjoiN2Q5ZWI2YWEtMGI0NC00OTA2LThhZjYtZjk3NmIxMjA0YTU0IiwidCI6IjY1ZWVhYTdhLTg0NmEtNGRlMS1hNTE5LTUzNTRiMzM0OWQ5NCJ9&pageName=a5ac8b208bd2ea5777a4',
    lastUpdated: '2024-01-15',
    status: 'active',
    priority: 'high'
  },
  {
    id: 'comissoes-representante',
    title: 'Comissões Representante',
    description: 'Gestão detalhada de comissões por representante com análise de performance e metas',
    icon: Users,
    category: 'comercial',
    powerBIUrl: 'https://app.powerbi.com/view?r=eyJrIjoiYjljMmIzMjktMWRhYi00MzI4LWJjNjgtYTdjZTJjMDgyYzkxIiwidCI6Ijc0MTkwYjM3LTgyOTgtNGRmMS1hZGYxLTMyMjNlMjEwYWU3OSJ9',
    lastUpdated: '2024-01-14',
    status: 'active',
    priority: 'high'
  },
  {
    id: 'comissoes-influencers',
    title: 'Comissões Influencers',
    description: 'Análise de performance de influencers, ROI por campanha e engajamento',
    icon: TrendingUp,
    category: 'comercial',
    powerBIUrl: 'https://app.powerbi.com/view?r=eyJrIjoiZDY0MDFjMjAtZGUzOS00MjgyLWEzNTctODkxMDJkODJhMmRiIiwidCI6Ijc0MTkwYjM3LTgyOTgtNGRmMS1hZGYxLTMyMjNlMjEwYWU3OSJ9&pageName=ReportSection470598b273719767cc9a',
    lastUpdated: '2024-01-13',
    status: 'active',
    priority: 'medium'
  },
  {
    id: 'estoque-gerencial',
    title: 'Estoque Gerencial',
    description: 'Visão gerencial do estoque com giro, análise de curva ABC e indicadores de performance',
    icon: Package,
    category: 'estoque',
    powerBIUrl: 'https://app.powerbi.com/view?r=eyJrIjoiYmZmMDNhZDItOThmZC00ZjE3LWI3ZGQtOTc5YzBhNDZhNzU5IiwidCI6IjY1ZWVhYTdhLTg0NmEtNGRlMS1hNTE5LTUzNTRiMzM0OWQ5NCJ9',
    lastUpdated: '2024-01-12',
    status: 'active',
    priority: 'high'
  },
  {
    id: 'estoque-comercial',
    title: 'Estoque Comercial',
    description: 'Análise comercial de estoque com disponibilidade, reserva e análise de vendas por produto',
    icon: ShoppingCart,
    category: 'estoque',
    powerBIUrl: 'https://app.powerbi.com/view?r=eyJrIjoiZjViMGVkYzYtYmM0Zi00MzUyLWIxYzItZWU0ZTJkMmI1YzY5IiwidCI6IjY1ZWVhYTdhLTg0NmEtNGRlMS1hNTE5LTUzNTRiMzM0OWQ5NCJ9',
    lastUpdated: '2024-01-11',
    status: 'active',
    priority: 'medium'
  },
  {
    id: 'sugestao-compra',
    title: 'Sugestão de Compra',
    description: 'Inteligência artificial para sugerir compras baseada em histórico, sazonalidade e estoque',
    icon: Brain,
    category: 'estoque',
    powerBIUrl: 'https://app.powerbi.com/view?r=eyJrIjoiODk2NDIxZjEtNTMyMS00OTAwLWE5MTAtNWFiN2E0NDJjZDQyIiwidCI6IjY1ZWVhYTdhLTg0NmEtNGRlMS1hNTE5LTUzNTRiMzM0OWQ5NCJ9',
    lastUpdated: '2024-01-10',
    status: 'development',
    priority: 'high'
  },
  {
    id: 'analise-financeira',
    title: 'Análise Financeira',
    description: 'Dashboard financeiro completo com DRE, fluxo de caixa e indicadores de saúde financeira',
    icon: DollarSign,
    category: 'financeiro',
    powerBIUrl: 'https://app.powerbi.com/view?r=eyJrIjoiODNjODVkZGQtZGJmMS00NjI3LWJlYzItZmZjZGZiYmZjMTNkIiwidCI6IjY1ZWVhYTdhLTg0NmEtNGRlMS1hNTE5LTUzNTRiMzM0OWQ5NCJ9',
    lastUpdated: '2024-01-09',
    status: 'active',
    priority: 'high'
  },
  {
    id: 'painel-faturamento',
    title: 'Painel Faturamento',
    description: 'Acompanhamento de faturamento por período, produto, região e representante',
    icon: Target,
    category: 'financeiro',
    powerBIUrl: 'https://app.powerbi.com/view?r=eyJrIjoiYmRjMmIwMzktY2NkMS00MDkyLWFlZDYtNDQ1ODdhODMxNTlkIiwidCI6IjY1ZWVhYTdhLTg0NmEtNGRlMS1hNTE5LTUzNTRiMzM0OWQ5NCJ9',
    lastUpdated: '2024-01-08',
    status: 'active',
    priority: 'high'
  },
  {
    id: 'painel-licitacao',
    title: 'Painel Licitação',
    description: 'Gestão de licitações com acompanhamento de propostas, concorrências e resultados',
    icon: FileText,
    category: 'comercial',
    powerBIUrl: 'https://app.powerbi.com/view?r=eyJrIjoiNGYxZDcyMjctM2MzZi00ZGYyLThlODYtMDAwY2IwYmEzYzQ5IiwidCI6IjY1ZWVhYTdhLTg0NmEtNGRlMS1hNTE5LTUzNTRiMzM0OWQ5NCJ9',
    lastUpdated: '2024-01-07',
    status: 'development',
    priority: 'medium'
  },
  {
    id: 'controle-bhz',
    title: 'Controle BHZ',
    description: 'Controle específico de operações BHZ com análise territorial e performance regional',
    icon: MapPin,
    category: 'comercial',
    powerBIUrl: 'https://app.powerbi.com/view?r=eyJrIjoiZjFiNTJmYmYtOWJkMS00OTA3LWJkMWQtYWE2ODdlMmJhZjFkIiwidCI6IjY1ZWVhYTdhLTg0NmEtNGRlMS1hNTE5LTUzNTRiMzM0OWQ5NCJ9',
    lastUpdated: '2024-01-06',
    status: 'active',
    priority: 'medium'
  },
  {
    id: 'pedidos-sibionics',
    title: 'Pedidos Sibionics',
    description: 'Análise detalhada de pedidos Sibionics com tracking, status e performance de entrega',
    icon: Package,
    category: 'vendas',
    powerBIUrl: 'https://app.powerbi.com/view?r=eyJrIjoiY2IwMDk3NWEtZTI1Zi00OTEwLWIyNTAtYTUzNzQ2MTQwNDMxIiwidCI6IjY1ZWVhYTdhLTg0NmEtNGRlMS1hNTE5LTUzNTRiMzM0OWQ5NCJ9',
    lastUpdated: '2024-01-05',
    status: 'active',
    priority: 'medium'
  }
];

const categories = [
  { id: 'all', name: 'Todos', color: 'bg-slate-500' },
  { id: 'vendas', name: 'Vendas', color: 'bg-blue-500' },
  { id: 'estoque', name: 'Estoque', color: 'bg-green-500' },
  { id: 'financeiro', name: 'Financeiro', color: 'bg-yellow-500' },
  { id: 'comercial', name: 'Comercial', color: 'bg-purple-500' },
  { id: 'analise', name: 'Análise', color: 'bg-red-500' }
];

export default function RelatoriosPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAIInsights, setShowAIInsights] = useState(false);
  const router = useRouter();

  const filteredReports = biReports.filter(report => {
    const matchesCategory = selectedCategory === 'all' || report.category === selectedCategory;
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'development': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'maintenance': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-slate-500';
    }
  };

  const handleReportClick = (reportId: string) => {
    // Map report IDs to their respective routes
    const routeMap: Record<string, string> = {
      'analise-ecommerce': '/cepalab/relatorios/ecommerce',
      'comissoes-representante': '/cepalab/relatorios/comissoes',
      'dashboard-vendas': '/cepalab/relatorios/vendas',
      'analise-estoque': '/cepalab/relatorios/estoque',
      'relatorio-financeiro': '/cepalab/relatorios/financeiro',
      'performance-comercial': '/cepalab/relatorios/comercial',
      'analise-clientes': '/cepalab/relatorios/clientes',
      'dashboard-operacional': '/cepalab/relatorios/operacional',
      'indicadores-gerenciais': '/cepalab/relatorios/gerencial',
      'analise-fornecedores': '/cepalab/relatorios/fornecedores',
      'dashboard-regional': '/cepalab/relatorios/regional'
    };
    
    const route = routeMap[reportId];
    if (route) {
      router.push(route);
    } else {
      console.warn(`Route not found for report: ${reportId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Business Intelligence & Relatórios
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Dashboards interativos com análises avançadas e insights de IA para tomada de decisão
          </p>
        </motion.div>

        {/* AI Insights Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 mb-8 text-white"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Brain className="w-8 h-8" />
              <div>
                <h2 className="text-xl font-semibold mb-1">Análise de IA Disponível</h2>
                <p className="text-purple-100">
                  Obtenha insights inteligentes e previsões baseadas em machine learning para seus dados
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAIInsights(!showAIInsights)}
              className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors"
            >
              {showAIInsights ? 'Ocultar' : 'Ver'} Insights
            </button>
          </div>

          <AnimatePresence>
            {showAIInsights && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 pt-6 border-t border-purple-400"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-purple-500/20 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">📈 Tendências de Vendas</h3>
                    <p className="text-sm text-purple-100">
                      IA detectou aumento de 23% nas vendas do setor de diabetes na próxima semana
                    </p>
                  </div>
                  <div className="bg-purple-500/20 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">⚠️ Alertas de Estoque</h3>
                    <p className="text-sm text-purple-100">
                      15 produtos com risco de falta baseado em padrões históricos
                    </p>
                  </div>
                  <div className="bg-purple-500/20 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">💡 Otimização</h3>
                    <p className="text-sm text-purple-100">
                      Reduza estoque em 12% sem impacto nas vendas projetadas
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Pesquisar relatórios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-700"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Reports Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredReports.map((report, index) => {
            const IconComponent = report.icon;
            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="cursor-pointer"
                onClick={() => handleReportClick(report.id)}
              >
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6 h-full hover:shadow-lg transition-all duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${
                        report.category === 'vendas' ? 'bg-blue-100 dark:bg-blue-900' :
                        report.category === 'estoque' ? 'bg-green-100 dark:bg-green-900' :
                        report.category === 'financeiro' ? 'bg-yellow-100 dark:bg-yellow-900' :
                        report.category === 'comercial' ? 'bg-purple-100 dark:bg-purple-900' :
                        'bg-red-100 dark:bg-red-900'
                      }`}>
                        <IconComponent className={`w-6 h-6 ${
                          report.category === 'vendas' ? 'text-blue-600' :
                          report.category === 'estoque' ? 'text-green-600' :
                          report.category === 'financeiro' ? 'text-yellow-600' :
                          report.category === 'comercial' ? 'text-purple-600' :
                          'text-red-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                          {report.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {report.description}
                        </p>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(report.priority)}`} />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full ${getStatusColor(report.status)}`}>
                        {report.status === 'active' ? 'Ativo' :
                         report.status === 'development' ? 'Em Desenvolvimento' :
                         'Manutenção'}
                      </span>
                      <span>•</span>
                      <span>Atualizado: {report.lastUpdated}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      <Filter className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Empty State */}
        {filteredReports.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BarChart3 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              Nenhum relatório encontrado
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Tente ajustar seus filtros ou pesquisa para encontrar relatórios disponíveis
            </p>
          </motion.div>
        )}

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <AnimatedCard
            icon={<BarChart3 className="w-6 h-6" />}
            title="Total Relatórios"
            value={biReports.length}
            variant="info"
          >
            <div className="text-sm text-gray-600 dark:text-gray-400">Relatórios disponíveis</div>
          </AnimatedCard>
          <AnimatedCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Relatórios Ativos"
            value={biReports.filter(r => r.status === 'active').length}
            variant="success"
          >
            <div className="text-sm text-gray-600 dark:text-gray-400">Ativos atualmente</div>
          </AnimatedCard>
          <AnimatedCard
            icon={<Brain className="w-6 h-6" />}
            title="Com IA"
            value={biReports.filter(r => r.id.includes('sugestao')).length}
            variant="info"
          >
            <div className="text-sm text-gray-600 dark:text-gray-400">Relatórios com insights</div>
          </AnimatedCard>
          <AnimatedCard
            icon={<Download className="w-6 h-6" />}
            title="Exportações"
            value="1.2k"
            variant="info"
          >
            <div className="text-sm text-gray-600 dark:text-gray-400">Exportações realizadas</div>
          </AnimatedCard>
        </motion.div>
      </div>
    </div>
  );
}
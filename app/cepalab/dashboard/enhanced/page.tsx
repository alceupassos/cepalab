'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { AIReport } from '@/components/AIReport';
import { AnimatedCard, AnimatedCardGrid } from '@/app/components/AnimatedCard';
import { VendasFilter, VendasFilters } from '@/app/components/filters/VendasFilter';
import { EstoqueFilter, EstoqueFilters } from '@/app/components/filters/EstoqueFilter';
import { Navigation } from '@/app/components/Navigation';
import { DataExporter } from '@/app/utils/export';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, 
  Package, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Filter,
  RefreshCw,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardData {
  sales: any;
  stock: any;
  financial: any;
  analysis: any;
}

export default function EnhancedDashboard() {
  const [data, setData] = useState<DashboardData>({ sales: null, stock: null, financial: null, analysis: null });
  const [loading, setLoading] = useState(true);
  const [loadingAI, setLoadingAI] = useState(false);
  const [vendasFilters, setVendasFilters] = useState<VendasFilters>({
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    },
    status: 'all'
  });
  const [estoqueFilters, setEstoqueFilters] = useState<EstoqueFilters>({
    status: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'vendas' | 'estoque' | 'financeiro'>('overview');
  const [showFilters, setShowFilters] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [salesRes, stockRes, financialRes] = await Promise.all([
        fetch('/api/cepalab/sales'),
        fetch('/api/cepalab/stock'),
        fetch('/api/cepalab/financial')
      ]);

      const [sales, stock, financial] = await Promise.all([
        salesRes.json(),
        stockRes.json(),
        financialRes.json()
      ]);

      setData(prev => ({ ...prev, sales, stock, financial }));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const runAIAnalysis = async () => {
    setLoadingAI(true);
    try {
      const response = await fetch('/api/cepalab/analyze', { method: 'POST' });
      const analysis = await response.json();
      setData(prev => ({ ...prev, analysis }));
    } catch (error) {
      console.error('Error running AI analysis:', error);
    } finally {
      setLoadingAI(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchData, 30000); // 30 seconds
      setRefreshInterval(interval);
    } else {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [autoRefresh]);

  const monthlyData = (data.sales?.monthly || []).map((m: any) => ({
    label: `${String(m.mes).padStart(2, "0")}/${m.ano}`,
    vendas: Number(m.valor_total || 0),
    pedidos: Number(m.total_vendas || 0),
    ticketMedio: Number(m.valor_total || 0) / Number(m.total_vendas || 1)
  })).reverse();

  const receivablesStatus = (data.financial?.receivables || []).reduce((acc: Record<string, number>, r: any) => {
    const key = r.Sit_nome || "N/A";
    acc[key] = (acc[key] || 0) + Number(r.valor || 0);
    return acc;
  }, {});

  const receivablesPie = Object.entries(receivablesStatus).map(([name, value]) => ({ name, value }));
  const pieColors = ["#10b981", "#f59e0b", "#ef4444", "#6366f1", "#6b7280"];

  const topProducts = (data.stock?.products || [])
    .sort((a: any, b: any) => Number(b.valor_total || 0) - Number(a.valor_total || 0))
    .slice(0, 10)
    .map((p: any) => ({
      name: p.produto,
      valor: Number(p.valor_total || 0),
      quantidade: Number(p.quantidade || 0)
    }));

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const handleExport = (format: 'csv' | 'json' | 'pdf' | 'excel', dataType: 'sales' | 'stock' | 'financial') => {
    let exportData;
    
    switch (dataType) {
      case 'sales':
        exportData = DataExporter.prepareSalesData(data.sales, vendasFilters.dateRange);
        break;
      case 'stock':
        exportData = DataExporter.prepareStockData(data.stock);
        break;
      case 'financial':
        exportData = DataExporter.prepareFinancialData(data.financial);
        break;
      default:
        return;
    }

    DataExporter.exportData(exportData, {
      format,
      filename: `${dataType}_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xls' : format}`
    });
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
    >
      {/* Header */}
      <motion.div 
        variants={tabVariants}
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Dashboard CEPALAB
          </h1>
          <p className="text-gray-600 mt-1">Visão geral integrada dos seus negócios</p>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap">
          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all",
              showFilters ? "bg-primary text-white border-primary" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Filter className="w-4 h-4" />
            Filtros
          </motion.button>
          
          <motion.button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all",
              autoRefresh ? "bg-success text-white border-success" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw className={cn("w-4 h-4", autoRefresh && "animate-spin")} />
            Auto Atualizar
          </motion.button>
          
          <motion.button
            onClick={runAIAnalysis}
            disabled={loadingAI}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:opacity-90 transition-all disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <TrendingUp className={cn("w-4 h-4", loadingAI && "animate-pulse")} />
            {loadingAI ? 'Analisando...' : 'IA Análise'}
          </motion.button>
        </div>
      </motion.div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <VendasFilter onFilterChange={setVendasFilters} />
              <EstoqueFilter onFilterChange={setEstoqueFilters} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <motion.div 
        variants={tabVariants}
        className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg"
      >
        {[
          { key: 'overview', label: 'Visão Geral', icon: Eye },
          { key: 'vendas', label: 'Vendas', icon: DollarSign },
          { key: 'estoque', label: 'Estoque', icon: Package },
          { key: 'financeiro', label: 'Financeiro', icon: TrendingUp }
        ].map(({ key, label, icon: Icon }) => (
          <motion.button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm font-medium",
              activeTab === key 
                ? "bg-white text-primary shadow-sm" 
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Icon className="w-4 h-4" />
            {label}
          </motion.button>
        ))}
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="space-y-6"
          >
            {/* KPI Cards */}
            <AnimatedCardGrid>
              <AnimatedCard
                icon={<DollarSign className="w-6 h-6" />}
                title="Vendas Totais"
                value={`R$ ${Number(data.sales?.totalSales || 0).toLocaleString("pt-BR")}`}
                subtitle={`${Number(data.sales?.totalOrders || 0)} pedidos`}
                variant="success"
                glow
                loading={loading}
              >
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Última atualização: {new Date().toLocaleTimeString('pt-BR')}
                </div>
              </AnimatedCard>
              <AnimatedCard
                icon={<Package className="w-6 h-6" />}
                title="Estoque Disponível"
                value={Number(data.stock?.summary?.total_disponivel || 0).toLocaleString("pt-BR")}
                subtitle={`${Number(data.stock?.summary?.produtos || 0)} produtos`}
                variant="info"
                glow
                loading={loading}
              >
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Produtos em estoque
                </div>
              </AnimatedCard>
              <AnimatedCard
                icon={<AlertTriangle className="w-6 h-6" />}
                title="Contas Vencidas"
                value={`R$ ${Number(data.financial?.overdue?.total || 0).toLocaleString("pt-BR")}`}
                subtitle={`${Number(data.financial?.overdue?.qtd || 0)} títulos`}
                variant="danger"
                glow
                loading={loading}
              >
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Requer atenção imediata
                </div>
              </AnimatedCard>
              <AnimatedCard
                icon={<TrendingDown className="w-6 h-6" />}
                title="Estoque Negativo"
                value={Number(data.stock?.negatives?.length || 0)}
                subtitle="produtos com falta"
                variant="warning"
                glow
                loading={loading}
              >
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Verificar reposição
                </div>
              </AnimatedCard>
            </AnimatedCardGrid>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatedCard title="Vendas por Mês" loading={loading}>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorPedidos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="label" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="vendas" 
                      stroke="#3b82f6" 
                      fillOpacity={1}
                      fill="url(#colorVendas)"
                      strokeWidth={2}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="pedidos" 
                      stroke="#10b981" 
                      fillOpacity={1}
                      fill="url(#colorPedidos)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </AnimatedCard>

              <AnimatedCard title="Contas por Status" loading={loading}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <defs>
                      {pieColors.map((color, index) => (
                        <linearGradient key={index} id={`color${index}`} x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor={color} stopOpacity={0.8}/>
                          <stop offset="100%" stopColor={color} stopOpacity={0.6}/>
                        </linearGradient>
                      ))}
                    </defs>
                    <Pie 
                      data={receivablesPie} 
                      dataKey="value" 
                      nameKey="name" 
                      cx="50%" 
                      cy="50%" 
                      outerRadius={100}
                      innerRadius={40}
                      paddingAngle={2}
                    >
                      {receivablesPie.map((entry: any, index: number) => (
                        <Cell key={index} fill={`url(#color${index})`} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </AnimatedCard>
            </div>

            {/* AI Report */}
            <AnimatedCard title="Análise Inteligente" loading={loadingAI}>
              <AIReport
                aiSummary={data.analysis?.aiSummary || ""}
                analysis={data.analysis?.analysis || null}
                vulns={data.analysis?.vulns || null}
                kpis={data.analysis?.kpis || null}
                securityMetrics={data.analysis?.securityMetrics || null}
                performanceMetrics={data.analysis?.performanceMetrics || null}
                onRegenerate={runAIAnalysis}
                isLoading={loadingAI}
              />
            </AnimatedCard>
          </motion.div>
        )}

        {activeTab === 'vendas' && (
          <motion.div
            key="vendas"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="space-y-6"
          >
            <AnimatedCardGrid>
              <AnimatedCard
                icon={<DollarSign className="w-6 h-6" />}
                title="Vendas do Período"
                value={`R$ ${Number(data.sales?.totalSales || 0).toLocaleString("pt-BR")}`}
                subtitle={`${Number(data.sales?.totalOrders || 0)} pedidos`}
                change={{ value: 12.5, trend: 'up' }}
                variant="success"
                glow
              >
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Performance do período selecionado
                </div>
              </AnimatedCard>
              <AnimatedCard
                icon={<TrendingUp className="w-6 h-6" />}
                title="Ticket Médio"
                value={`R$ ${(Number(data.sales?.totalSales || 0) / Number(data.sales?.totalOrders || 1)).toLocaleString("pt-BR")}`}
                subtitle="por pedido"
                change={{ value: 8.3, trend: 'up' }}
                variant="info"
                glow
              >
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Valor médio por transação
                </div>
              </AnimatedCard>
              <AnimatedCard
                icon={<Users className="w-6 h-6" />}
                title="Clientes Ativos"
                value={Number(data.sales?.topClients?.length || 0)}
                subtitle="no período"
                change={{ value: 15.2, trend: 'up' }}
                variant="info"
                glow
              >
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Base de clientes ativa
                </div>
              </AnimatedCard>
            </AnimatedCardGrid>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatedCard title="Top Clientes" subtitle="Maiores compradores do período">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={(data.sales?.topClients || []).slice(0, 10).map((c: any) => ({ 
                    name: c.nome_cliente?.substring(0, 20) + '...', 
                    valor: Number(c.valor_total || 0) 
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="valor" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </AnimatedCard>

              <AnimatedCard title="Vendas por Vendedor">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={(data.sales?.bySeller || []).map((s: any) => ({ 
                    name: s.vendedor, 
                    valor: Number(s.valor_total || 0) 
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="valor" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </AnimatedCard>
            </div>
          </motion.div>
        )}

        {activeTab === 'estoque' && (
          <motion.div
            key="estoque"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="space-y-6"
          >
            <AnimatedCardGrid>
              <AnimatedCard
                icon={<Package className="w-6 h-6" />}
                title="Total em Estoque"
                value={Number(data.stock?.summary?.total_disponivel || 0).toLocaleString("pt-BR")}
                subtitle={`${Number(data.stock?.summary?.produtos || 0)} produtos`}
                change={{ value: 5.7, trend: 'up' }}
                variant="info"
                glow
              >
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Estoque disponível
                </div>
              </AnimatedCard>
              <AnimatedCard
                icon={<AlertTriangle className="w-6 h-6" />}
                title="Produtos Negativos"
                value={Number(data.stock?.negatives?.length || 0)}
                subtitle="em falta"
                change={{ value: -12.3, trend: 'down' }}
                variant="danger"
                glow
              >
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Requer reposição urgente
                </div>
              </AnimatedCard>
              <AnimatedCard
                icon={<TrendingUp className="w-6 h-6" />}
                title="Valor Total"
                value={`R$ ${Number(data.stock?.summary?.valor_total || 0).toLocaleString("pt-BR")}`}
                subtitle="em estoque"
                change={{ value: 18.9, trend: 'up' }}
                variant="success"
                glow
              >
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Valor total do estoque
                </div>
              </AnimatedCard>
            </AnimatedCardGrid>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatedCard title="Top Produtos por Valor">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topProducts}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#6b7280" fontSize={12} angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="valor" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </AnimatedCard>

              <AnimatedCard title="Estoque por Categoria">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie 
                      data={Object.entries(
                        (data.stock?.products || []).reduce((acc: Record<string, number>, p: any) => {
                          const cat = p.categoria || 'Sem Categoria';
                          acc[cat] = (acc[cat] || 0) + Number(p.valor_total || 0);
                          return acc;
                        }, {})
                      ).map(([name, value]) => ({ name, value }))} 
                      dataKey="value" 
                      nameKey="name" 
                      cx="50%" 
                      cy="50%" 
                      outerRadius={100}
                      innerRadius={40}
                      paddingAngle={2}
                    >
                      {pieColors.map((color, index) => (
                        <Cell key={index} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </AnimatedCard>
            </div>

            {/* Stock Alerts */}
            <AnimatedCard title="Alertas de Estoque">
              <div className="space-y-3">
                {(data.stock?.negatives || []).slice(0, 5).map((item: any, index: number) => (
                  <motion.div
                    key={item.produto}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-danger-50 border border-danger-200 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-danger-900">{item.produto}</div>
                      <div className="text-sm text-danger-700">
                        Estoque: {Number(item.quantidade || 0)} | Local: {item.localizacao}
                      </div>
                    </div>
                    <div className="text-danger-900 font-semibold">
                      R$ {Number(item.valor_total || 0).toLocaleString("pt-BR")}
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatedCard>
          </motion.div>
        )}

        {activeTab === 'financeiro' && (
          <motion.div
            key="financeiro"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="space-y-6"
          >
            <AnimatedCardGrid>
              <AnimatedCard
                icon={<DollarSign className="w-6 h-6" />}
                title="Contas a Receber"
                value={`R$ ${Number(data.financial?.receivables?.reduce((acc: number, r: any) => acc + Number(r.valor || 0), 0) || 0).toLocaleString("pt-BR")}`}
                subtitle="total em aberto"
                change={{ value: -5.2, trend: 'down' }}
                variant="warning"
                glow
              >
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Pendências financeiras
                </div>
              </AnimatedCard>
              <AnimatedCard
                icon={<AlertTriangle className="w-6 h-6" />}
                title="Contas Vencidas"
                value={`R$ ${Number(data.financial?.overdue?.total || 0).toLocaleString("pt-BR")}`}
                subtitle={`${Number(data.financial?.overdue?.qtd || 0)} títulos`}
                change={{ value: -23.1, trend: 'down' }}
                variant="danger"
                glow
              >
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Atrasos críticos
                </div>
              </AnimatedCard>
              <AnimatedCard
                icon={<TrendingUp className="w-6 h-6" />}
                title="Caixa Atual"
                value={`R$ ${Number(data.financial?.cashboxes?.reduce((acc: number, c: any) => acc + Number(c.saldo_atual_total || 0), 0) || 0).toLocaleString("pt-BR")}`}
                subtitle="saldo total"
                change={{ value: 12.8, trend: 'up' }}
                variant="success"
                glow
              >
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Liquidez disponível
                </div>
              </AnimatedCard>
            </AnimatedCardGrid>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatedCard title="Situação dos Caixas">
                <div className="space-y-3">
                  {(data.financial?.cashboxes || []).map((c: any, index: number) => (
                    <motion.div
                      key={c.nome}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border",
                        Number(c.saldo_atual_total) < 0 
                          ? "bg-danger-50 border-danger-200" 
                          : "bg-success-50 border-success-200"
                      )}
                    >
                      <div>
                        <div className="font-medium">{c.nome}</div>
                        <div className="text-sm text-gray-600">{c.situacao}</div>
                      </div>
                      <div className={cn(
                        "font-semibold",
                        Number(c.saldo_atual_total) < 0 ? "text-danger-900" : "text-success-900"
                      )}>
                        R$ {Number(c.saldo_atual_total || 0).toLocaleString("pt-BR")}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatedCard>

              <AnimatedCard title="Contas por Status">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie 
                      data={receivablesPie} 
                      dataKey="value" 
                      nameKey="name" 
                      cx="50%" 
                      cy="50%" 
                      outerRadius={100}
                      innerRadius={40}
                      paddingAngle={2}
                    >
                      {pieColors.map((color, index) => (
                        <Cell key={index} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`R$ ${value.toLocaleString("pt-BR")}`, 'Valor']}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px'
                      }} 
                    />
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-lg font-bold">
                      Contas
                    </text>
                  </PieChart>
                </ResponsiveContainer>
              </AnimatedCard>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
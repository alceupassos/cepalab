'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EnhancedChart } from '@/components/EnhancedChart';
import { AISummary } from '@/components/AISummary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, Users, Package, BarChart3, Calendar } from 'lucide-react';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';

interface VendasData {
  mes: string;
  vendas: number;
  receita: number;
  clientes: number;
  ticket_medio: number;
  produtos_vendidos: number;
  margem_lucro: number;
  desconto_medio: number;
}

interface VendedorData {
  nome: string;
  vendas: number;
  receita: number;
  clientes: number;
  ticket_medio: number;
}

interface ProdutoData {
  nome: string;
  quantidade: number;
  receita: number;
  margem: number;
}

export default function VendasReport() {
  const [vendasData, setVendasData] = useState<VendasData[]>([]);
  const [vendedorData, setVendedorData] = useState<VendedorData[]>([]);
  const [produtoData, setProdutoData] = useState<ProdutoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('12meses');
  const [selectedView, setSelectedView] = useState('mensal');
  
  const { insights, generateInsights } = useAIAnalysis();

  // Mock data for demonstration - replace with actual API calls
  useEffect(() => {
    const mockVendasData: VendasData[] = [
      { mes: 'Jan/2024', vendas: 1250, receita: 625000, clientes: 890, ticket_medio: 702, produtos_vendidos: 2340, margem_lucro: 28.5, desconto_medio: 5.2 },
      { mes: 'Fev/2024', vendas: 1380, receita: 690000, clientes: 950, ticket_medio: 726, produtos_vendidos: 2580, margem_lucro: 29.1, desconto_medio: 4.8 },
      { mes: 'Mar/2024', vendas: 1420, receita: 710000, clientes: 1020, ticket_medio: 696, produtos_vendidos: 2750, margem_lucro: 27.8, desconto_medio: 6.1 },
      { mes: 'Abr/2024', vendas: 1350, receita: 675000, clientes: 980, ticket_medio: 689, produtos_vendidos: 2640, margem_lucro: 28.9, desconto_medio: 5.7 },
      { mes: 'Mai/2024', vendas: 1580, receita: 790000, clientes: 1150, ticket_medio: 687, produtos_vendidos: 3120, margem_lucro: 30.2, desconto_medio: 4.5 },
      { mes: 'Jun/2024', vendas: 1620, receita: 810000, clientes: 1180, ticket_medio: 686, produtos_vendidos: 3280, margem_lucro: 29.7, desconto_medio: 5.1 },
      { mes: 'Jul/2024', vendas: 1750, receita: 875000, clientes: 1280, ticket_medio: 684, produtos_vendidos: 3450, margem_lucro: 31.1, desconto_medio: 4.2 },
      { mes: 'Ago/2024', vendas: 1680, receita: 840000, clientes: 1220, ticket_medio: 689, produtos_vendidos: 3320, margem_lucro: 28.4, desconto_medio: 5.8 },
      { mes: 'Set/2024', vendas: 1820, receita: 910000, clientes: 1350, ticket_medio: 674, produtos_vendidos: 3680, margem_lucro: 30.8, desconto_medio: 4.9 },
      { mes: 'Out/2024', vendas: 1920, receita: 960000, clientes: 1420, ticket_medio: 676, produtos_vendidos: 3850, margem_lucro: 29.5, desconto_medio: 5.3 },
      { mes: 'Nov/2024', vendas: 2050, receita: 1025000, clientes: 1520, ticket_medio: 674, produtos_vendidos: 4120, margem_lucro: 31.2, desconto_medio: 4.1 },
      { mes: 'Dez/2024', vendas: 2180, receita: 1090000, clientes: 1650, ticket_medio: 661, produtos_vendidos: 4380, margem_lucro: 32.1, desconto_medio: 3.8 }
    ];

    const mockVendedorData: VendedorData[] = [
      { nome: 'Carlos Mendes', vendas: 450, receita: 225000, clientes: 320, ticket_medio: 703 },
      { nome: 'Ana Silva', vendas: 380, receita: 190000, clientes: 275, ticket_medio: 691 },
      { nome: 'Pedro Oliveira', vendas: 520, receita: 260000, clientes: 380, ticket_medio: 684 },
      { nome: 'Maria Santos', vendas: 410, receita: 205000, clientes: 295, ticket_medio: 695 },
      { nome: 'João Costa', vendas: 340, receita: 170000, clientes: 245, ticket_medio: 694 }
    ];

    const mockProdutoData: ProdutoData[] = [
      { nome: 'Produto A', quantidade: 1200, receita: 180000, margem: 35.2 },
      { nome: 'Produto B', quantidade: 950, receita: 142500, margem: 28.7 },
      { nome: 'Produto C', quantidade: 820, receita: 123000, margem: 31.5 },
      { nome: 'Produto D', quantidade: 710, receita: 106500, margem: 25.8 },
      { nome: 'Produto E', quantidade: 640, receita: 96000, margem: 29.1 }
    ];

    setVendasData(mockVendasData);
    setVendedorData(mockVendedorData);
    setProdutoData(mockProdutoData);
    setLoading(false);

    // Generate AI insights
    generateInsights('vendas', mockVendasData);
  }, [generateInsights]);

  const kpiCards = [
    {
      title: 'Receita Total',
      value: 'R$ 9.585.000',
      change: '+15.2%',
      icon: DollarSign,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900'
    },
    {
      title: 'Total de Vendas',
      value: '19.300',
      change: '+8.3%',
      icon: TrendingUp,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900'
    },
    {
      title: 'Clientes Atendidos',
      value: '14.245',
      change: '+12.1%',
      icon: Users,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900'
    },
    {
      title: 'Margem Média',
      value: '29.7%',
      change: '+1.8%',
      icon: Package,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6 dark:bg-gray-900 dark:text-gray-100">
      <div className="flex items-center gap-3">
        <img src="/logocepalab.svg" alt="CEPALAB" className="h-7 w-auto" />
        <span className="text-sm text-gray-500 dark:text-gray-400">Vendas</span>
      </div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard de Vendas</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Análise completa do desempenho de vendas e comercial</p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="6meses">Últimos 6 meses</option>
            <option value="12meses">Últimos 12 meses</option>
            <option value="24meses">Últimos 24 meses</option>
          </select>
          <select
            value={selectedView}
            onChange={(e) => setSelectedView(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="mensal">Visão Mensal</option>
            <option value="trimestral">Visão Trimestral</option>
            <option value="anual">Visão Anual</option>
          </select>
          <Button variant="outline" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </motion.div>

      {/* AI Summary */}
      <AISummary insights={insights} module="vendas" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{kpi.title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{kpi.value}</p>
                    <p className={`text-sm mt-1 ${kpi.color}`}>{kpi.change}</p>
                  </div>
                  <div className={`p-3 rounded-full ${kpi.bgColor}`}>
                    <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Charts */}
      <Tabs defaultValue="vendas" className="space-y-4">
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 w-full dark:bg-gray-800">
          <TabsTrigger value="vendas" className="dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100">Vendas & Receita</TabsTrigger>
          <TabsTrigger value="performance" className="dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100">Performance</TabsTrigger>
          <TabsTrigger value="produtos" className="dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100">Produtos</TabsTrigger>
          <TabsTrigger value="analise" className="dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100">Análise Detalhada</TabsTrigger>
        </TabsList>

        <TabsContent value="vendas" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EnhancedChart
              title="Evolução de Vendas"
              description="Número de vendas por mês"
              data={vendasData.map(d => ({ name: d.mes, value: d.vendas }))}
              chartType="line"
              module="vendas"
            />
            <EnhancedChart
              title="Evolução da Receita"
              description="Receita total por mês"
              data={vendasData.map(d => ({ name: d.mes, value: d.receita }))}
              chartType="area"
              module="vendas"
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EnhancedChart
              title="Ticket Médio"
              description="Ticket médio por mês"
              data={vendasData.map(d => ({ name: d.mes, value: d.ticket_medio }))}
              chartType="line"
              module="vendas"
            />
            <EnhancedChart
              title="Margem de Lucro"
              description="Margem de lucro por mês"
              data={vendasData.map(d => ({ name: d.mes, value: d.margem_lucro }))}
              chartType="line"
              module="vendas"
            />
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EnhancedChart
              title="Performance por Vendedor"
              description="Total de vendas por vendedor"
              data={vendedorData.map(v => ({ name: v.nome, value: v.vendas }))}
              chartType="bar"
              module="vendas"
            />
            <EnhancedChart
              title="Receita por Vendedor"
              description="Receita gerada por vendedor"
              data={vendedorData.map(v => ({ name: v.nome, value: v.receita }))}
              chartType="bar"
              module="vendas"
            />
          </div>
        </TabsContent>

        <TabsContent value="produtos" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EnhancedChart
              title="Top Produtos por Quantidade"
              description="Produtos mais vendidos por quantidade"
              data={produtoData.map(p => ({ name: p.nome, value: p.quantidade }))}
              chartType="bar"
              module="vendas"
            />
            <EnhancedChart
              title="Top Produtos por Receita"
              description="Produtos com maior receita"
              data={produtoData.map(p => ({ name: p.nome, value: p.receita }))}
              chartType="bar"
              module="vendas"
            />
          </div>
        </TabsContent>

        <TabsContent value="analise" className="space-y-4">
          <EnhancedChart
            title="Desconto vs Margem"
            description="Comparativo mensal de desconto e margem"
            data={vendasData.map(d => ({ name: d.mes, value: d.margem_lucro, trend: d.desconto_medio }))}
            chartType="composed"
            module="vendas"
          />
        </TabsContent>
      </Tabs>

      {/* Performance Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Indicadores de Performance - {selectedPeriod}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">798.750</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Vendas/Mês (Média)</div>
              <Badge variant="outline" className="mt-2 dark:border-gray-600">Meta: 750.000</Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">29.7%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Margem Média</div>
              <Badge variant="outline" className="mt-2 dark:border-gray-600">Meta: 30%</Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">R$ 687</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Ticket Médio</div>
              <Badge variant="outline" className="mt-2 dark:border-gray-600">+2.3% vs ano anterior</Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">4.9%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Desconto Médio</div>
              <Badge variant="outline" className="mt-2 dark:border-gray-600">Meta: 5%</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EnhancedChart } from '@/components/EnhancedChart';
import { AISummary } from '@/components/AISummary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, TrendingUp, Users, DollarSign, Package, BarChart3 } from 'lucide-react';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';

interface EcommerceData {
  mes: string;
  vendas: number;
  pedidos: number;
  ticket_medio: number;
  clientes_ativos: number;
  taxa_conversao: number;
  produtos_vendidos: number;
  receita: number;
}

interface ProdutoData {
  nome: string;
  vendas: number;
  receita: number;
  quantidade: number;
}

export default function EcommerceReport() {
  const [ecommerceData, setEcommerceData] = useState<EcommerceData[]>([]);
  const [produtosData, setProdutosData] = useState<ProdutoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('12meses');
  
  const { insights, generateInsights } = useAIAnalysis();

  // Mock data for demonstration - replace with actual API calls
  useEffect(() => {
    const mockEcommerceData: EcommerceData[] = [
      { mes: 'Jan/2024', vendas: 1250, pedidos: 890, ticket_medio: 145.50, clientes_ativos: 678, taxa_conversao: 3.2, produtos_vendidos: 2340, receita: 129500 },
      { mes: 'Fev/2024', vendas: 1380, pedidos: 950, ticket_medio: 152.30, clientes_ativos: 720, taxa_conversao: 3.5, produtos_vendidos: 2580, receita: 144800 },
      { mes: 'Mar/2024', vendas: 1420, pedidos: 1020, ticket_medio: 148.90, clientes_ativos: 765, taxa_conversao: 3.8, produtos_vendidos: 2750, receita: 151900 },
      { mes: 'Abr/2024', vendas: 1350, pedidos: 980, ticket_medio: 141.20, clientes_ativos: 745, taxa_conversao: 3.4, produtos_vendidos: 2640, receita: 138400 },
      { mes: 'Mai/2024', vendas: 1580, pedidos: 1150, ticket_medio: 158.70, clientes_ativos: 820, taxa_conversao: 4.1, produtos_vendidos: 3120, receita: 182500 },
      { mes: 'Jun/2024', vendas: 1620, pedidos: 1180, ticket_medio: 162.40, clientes_ativos: 845, taxa_conversao: 4.3, produtos_vendidos: 3280, receita: 191600 },
      { mes: 'Jul/2024', vendas: 1750, pedidos: 1280, ticket_medio: 168.90, clientes_ativos: 890, taxa_conversao: 4.5, produtos_vendidos: 3450, receita: 216200 },
      { mes: 'Ago/2024', vendas: 1680, pedidos: 1220, ticket_medio: 165.20, clientes_ativos: 865, taxa_conversao: 4.2, produtos_vendidos: 3320, receita: 201500 },
      { mes: 'Set/2024', vendas: 1820, pedidos: 1350, ticket_medio: 172.50, clientes_ativos: 920, taxa_conversao: 4.8, produtos_vendidos: 3680, receita: 232900 },
      { mes: 'Out/2024', vendas: 1920, pedidos: 1420, ticket_medio: 178.30, clientes_ativos: 965, taxa_conversao: 5.1, produtos_vendidos: 3850, receita: 253200 },
      { mes: 'Nov/2024', vendas: 2050, pedidos: 1520, ticket_medio: 185.60, clientes_ativos: 1020, taxa_conversao: 5.4, produtos_vendidos: 4120, receita: 282200 },
      { mes: 'Dez/2024', vendas: 2180, pedidos: 1650, ticket_medio: 192.40, clientes_ativos: 1085, taxa_conversao: 5.7, produtos_vendidos: 4380, receita: 317500 }
    ];

    const mockProdutosData: ProdutoData[] = [
      { nome: 'Produto A', vendas: 850, receita: 125000, quantidade: 1200 },
      { nome: 'Produto B', vendas: 720, receita: 98000, quantidade: 950 },
      { nome: 'Produto C', vendas: 680, receita: 87000, quantidade: 820 },
      { nome: 'Produto D', vendas: 590, receita: 76000, quantidade: 710 },
      { nome: 'Produto E', vendas: 520, receita: 65000, quantidade: 640 }
    ];

    setEcommerceData(mockEcommerceData);
    setProdutosData(mockProdutosData);
    setLoading(false);

    // Generate AI insights
    generateInsights('ecommerce', mockEcommerceData);
  }, [generateInsights]);

  const kpiCards = [
    {
      title: 'Receita Total',
      value: 'R$ 2.339.200',
      change: '+12.5%',
      icon: DollarSign,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900'
    },
    {
      title: 'Total de Vendas',
      value: '19.300',
      change: '+8.3%',
      icon: ShoppingCart,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900'
    },
    {
      title: 'Ticket Médio',
      value: 'R$ 168.90',
      change: '+5.2%',
      icon: TrendingUp,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900'
    },
    {
      title: 'Clientes Ativos',
      value: '1.085',
      change: '+15.7%',
      icon: Users,
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
        <span className="text-sm text-gray-500 dark:text-gray-400">E-commerce</span>
      </div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Análise E-commerce</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Dashboard completo de vendas e performance do e-commerce</p>
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
          <Button variant="outline" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </motion.div>

      {/* AI Summary */}
      <AISummary insights={insights} module="ecommerce" />

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
          <TabsTrigger value="pedidos" className="dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100">Pedidos & Conversão</TabsTrigger>
          <TabsTrigger value="clientes" className="dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100">Clientes</TabsTrigger>
          <TabsTrigger value="produtos" className="dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100">Produtos</TabsTrigger>
        </TabsList>

        <TabsContent value="vendas" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EnhancedChart
              title="Evolução de Vendas"
              description="Número de vendas por mês"
              data={ecommerceData.map(d => ({ name: d.mes, value: d.vendas }))}
              chartType="line"
              module="ecommerce"
            />
            <EnhancedChart
              title="Evolução da Receita"
              description="Receita total por mês"
              data={ecommerceData.map(d => ({ name: d.mes, value: d.receita }))}
              chartType="area"
              module="ecommerce"
            />
          </div>
        </TabsContent>

        <TabsContent value="pedidos" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EnhancedChart
              title="Evolução de Pedidos"
              description="Número de pedidos por mês"
              data={ecommerceData.map(d => ({ name: d.mes, value: d.pedidos }))}
              chartType="bar"
              module="ecommerce"
            />
            <EnhancedChart
              title="Taxa de Conversão"
              description="Taxa de conversão por mês"
              data={ecommerceData.map(d => ({ name: d.mes, value: d.taxa_conversao }))}
              chartType="line"
              module="ecommerce"
            />
          </div>
        </TabsContent>

        <TabsContent value="clientes" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EnhancedChart
              title="Clientes Ativos"
              description="Número de clientes ativos por mês"
              data={ecommerceData.map(d => ({ name: d.mes, value: d.clientes_ativos }))}
              chartType="area"
              module="ecommerce"
            />
            <EnhancedChart
              title="Ticket Médio"
              description="Ticket médio por mês"
              data={ecommerceData.map(d => ({ name: d.mes, value: d.ticket_medio }))}
              chartType="line"
              module="ecommerce"
            />
          </div>
        </TabsContent>

        <TabsContent value="produtos" className="space-y-4">
          <EnhancedChart
            title="Top Produtos por Receita"
            description="Produtos com maior receita"
            data={produtosData.map(p => ({ name: p.nome, value: p.receita }))}
            chartType="bar"
            module="ecommerce"
          />
        </TabsContent>
      </Tabs>

      {/* Performance Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Indicadores de Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">4.2%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Taxa Média de Conversão</div>
              <Badge variant="outline" className="mt-2 dark:border-gray-600">Meta: 5%</Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">R$ 168.90</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Ticket Médio</div>
              <Badge variant="outline" className="mt-2 dark:border-gray-600">+5.2% vs mês anterior</Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">3.180</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Produtos Vendidos/Mês</div>
              <Badge variant="outline" className="mt-2 dark:border-gray-600">+18% vs ano anterior</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export const dynamic = 'force-dynamic';
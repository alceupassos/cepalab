'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EnhancedChart } from '@/components/EnhancedChart';
import { AISummary } from '@/components/AISummary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, MapPin, FileText, BarChart3, Award } from 'lucide-react';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';

interface ComercialData {
  mes: string;
  representantes_ativos: number;
  clientes_ativos: number;
  vendas_total: number;
  ticket_medio: number;
  novos_clientes: number;
  churn_rate: number;
  satisfacao_cliente: number;
}

interface RegionalData {
  regiao: string;
  vendas: number;
  clientes: number;
  representantes: number;
  market_share: number;
}

export default function ComercialReport() {
  const [comercialData, setComercialData] = useState<ComercialData[]>([]);
  const [regionalData, setRegionalData] = useState<RegionalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('12meses');
  const [selectedView, setSelectedView] = useState('geral');
  
  const { insights, generateInsights } = useAIAnalysis();

  // Mock data for demonstration
  useEffect(() => {
    const mockComercialData: ComercialData[] = [
      { mes: 'Jan/2024', representantes_ativos: 45, clientes_ativos: 1250, vendas_total: 2850000, ticket_medio: 2280, novos_clientes: 85, churn_rate: 3.2, satisfacao_cliente: 8.5 },
      { mes: 'Fev/2024', representantes_ativos: 47, clientes_ativos: 1280, vendas_total: 2920000, ticket_medio: 2281, novos_clientes: 92, churn_rate: 2.8, satisfacao_cliente: 8.6 },
      { mes: 'Mar/2024', representantes_ativos: 49, clientes_ativos: 1320, vendas_total: 3100000, ticket_medio: 2348, novos_clientes: 105, churn_rate: 2.5, satisfacao_cliente: 8.7 },
      { mes: 'Abr/2024', representantes_ativos: 48, clientes_ativos: 1350, vendas_total: 2980000, ticket_medio: 2207, novos_clientes: 78, churn_rate: 3.1, satisfacao_cliente: 8.4 },
      { mes: 'Mai/2024', representantes_ativos: 52, clientes_ativos: 1420, vendas_total: 3250000, ticket_medio: 2288, novos_clientes: 118, churn_rate: 2.2, satisfacao_cliente: 8.8 },
      { mes: 'Jun/2024', representantes_ativos: 54, clientes_ativos: 1480, vendas_total: 3350000, ticket_medio: 2263, novos_clientes: 125, churn_rate: 2.0, satisfacao_cliente: 8.9 },
      { mes: 'Jul/2024', representantes_ativos: 56, clientes_ativos: 1520, vendas_total: 3420000, ticket_medio: 2250, novos_clientes: 108, churn_rate: 1.8, satisfacao_cliente: 9.0 },
      { mes: 'Ago/2024', representantes_ativos: 58, clientes_ativos: 1580, vendas_total: 3580000, ticket_medio: 2266, novos_clientes: 135, churn_rate: 1.5, satisfacao_cliente: 9.1 },
      { mes: 'Set/2024', representantes_ativos: 60, clientes_ativos: 1620, vendas_total: 3650000, ticket_medio: 2253, novos_clientes: 128, churn_rate: 1.6, satisfacao_cliente: 9.0 },
      { mes: 'Out/2024', representantes_ativos: 62, clientes_ativos: 1680, vendas_total: 3780000, ticket_medio: 2250, novos_clientes: 145, churn_rate: 1.3, satisfacao_cliente: 9.2 },
      { mes: 'Nov/2024', representantes_ativos: 64, clientes_ativos: 1720, vendas_total: 3850000, ticket_medio: 2238, novos_clientes: 138, churn_rate: 1.4, satisfacao_cliente: 9.1 },
      { mes: 'Dez/2024', representantes_ativos: 68, clientes_ativos: 1800, vendas_total: 4120000, ticket_medio: 2289, novos_clientes: 155, churn_rate: 1.2, satisfacao_cliente: 9.3 }
    ];

    const mockRegionalData: RegionalData[] = [
      { regiao: 'Sudeste', vendas: 8500000, clientes: 580, representantes: 22, market_share: 35.2 },
      { regiao: 'Sul', vendas: 6200000, clientes: 420, representantes: 16, market_share: 25.7 },
      { regiao: 'Nordeste', vendas: 4800000, clientes: 350, representantes: 14, market_share: 19.8 },
      { regiao: 'Centro-Oeste', vendas: 2800000, clientes: 280, representantes: 10, market_share: 11.6 },
      { regiao: 'Norte', vendas: 1850000, clientes: 170, representantes: 6, market_share: 7.7 }
    ];

    setComercialData(mockComercialData);
    setRegionalData(mockRegionalData);
    setLoading(false);
    generateInsights('comercial', mockComercialData);
  }, [generateInsights]);

  const kpiCards = [
    {
      title: 'Representantes Ativos',
      value: '68',
      change: '+51.1%',
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900'
    },
    {
      title: 'Clientes Ativos',
      value: '1.800',
      change: '+44.0%',
      icon: Users,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900'
    },
    {
      title: 'Ticket Médio',
      value: 'R$ 2.289',
      change: '+0.4%',
      icon: TrendingUp,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900'
    },
    {
      title: 'Satisfação do Cliente',
      value: '9.3/10',
      change: '+9.4%',
      icon: Award,
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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard Comercial</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Análise completa do desempenho comercial, representantes e clientes</p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedView}
            onChange={(e) => setSelectedView(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="geral">Visão Geral</option>
            <option value="regional">Regional</option>
            <option value="performance">Performance</option>
          </select>
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
      <AISummary insights={insights} module="comercial" />

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
      <Tabs defaultValue="representantes" className="space-y-4">
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 w-full dark:bg-gray-800">
          <TabsTrigger value="representantes" className="dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100">Representantes</TabsTrigger>
          <TabsTrigger value="clientes" className="dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100">Clientes</TabsTrigger>
          <TabsTrigger value="vendas" className="dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100">Vendas</TabsTrigger>
          <TabsTrigger value="regional" className="dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100">Regional</TabsTrigger>
        </TabsList>

        <TabsContent value="representantes" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EnhancedChart
              title="Evolução de Representantes Ativos"
              description="Número de representantes ativos por mês"
              data={comercialData.map(d => ({ name: d.mes, value: d.representantes_ativos }))}
              chartType="line"
              module="comercial"
            />
            <EnhancedChart
              title="Satisfação do Cliente"
              description="Índice de satisfação do cliente por mês"
              data={comercialData.map(d => ({ name: d.mes, value: d.satisfacao_cliente }))}
              chartType="line"
              module="comercial"
            />
          </div>
        </TabsContent>

        <TabsContent value="clientes" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EnhancedChart
              title="Evolução de Clientes Ativos"
              description="Número de clientes ativos por mês"
              data={comercialData.map(d => ({ name: d.mes, value: d.clientes_ativos }))}
              chartType="area"
              module="comercial"
            />
            <EnhancedChart
              title="Churn Rate"
              description="Taxa de churn mensal"
              data={comercialData.map(d => ({ name: d.mes, value: d.churn_rate }))}
              chartType="line"
              module="comercial"
            />
          </div>
        </TabsContent>

        <TabsContent value="vendas" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EnhancedChart
              title="Evolução de Vendas"
              description="Vendas totais por mês"
              data={comercialData.map(d => ({ name: d.mes, value: d.vendas_total }))}
              chartType="area"
              module="comercial"
            />
            <EnhancedChart
              title="Ticket Médio"
              description="Ticket médio mensal"
              data={comercialData.map(d => ({ name: d.mes, value: d.ticket_medio }))}
              chartType="line"
              module="comercial"
            />
          </div>
        </TabsContent>

        <TabsContent value="regional" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EnhancedChart
              title="Vendas por Região"
              description="Distribuição de vendas por região"
              data={regionalData.map(r => ({ name: r.regiao, value: r.vendas }))}
              chartType="bar"
              module="comercial"
            />
            <EnhancedChart
              title="Market Share por Região"
              description="Participação de mercado por região"
              data={regionalData.map(r => ({ name: r.regiao, value: r.market_share }))}
              chartType="bar"
              module="comercial"
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Performance Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Indicadores de Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">155</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Novos Clientes no Mês</div>
              <Badge variant="outline" className="mt-2 dark:border-gray-600">Meta: 120</Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">1.2%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Churn Rate</div>
              <Badge variant="outline" className="mt-2 dark:border-gray-600">Meta: 2%</Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">R$ 2.289</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Ticket Médio</div>
              <Badge variant="outline" className="mt-2 dark:border-gray-600">+0.4% vs mês anterior</Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">9.3/10</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Satisfação do Cliente</div>
              <Badge variant="outline" className="mt-2 dark:border-gray-600">Excelente</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
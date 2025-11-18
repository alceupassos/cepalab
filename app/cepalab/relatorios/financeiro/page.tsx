'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EnhancedChart } from '@/components/EnhancedChart';
import { AISummary } from '@/components/AISummary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, TrendingDown, BarChart3, Calendar, PieChart } from 'lucide-react';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';

interface FinanceiroData {
  mes: string;
  receita: number;
  despesa: number;
  lucro: number;
  margem_lucro: number;
  ebitda: number;
  fluxo_caixa: number;
  roi: number;
}

interface CategoriaDespesa {
  categoria: string;
  valor: number;
  percentual: number;
}

export default function FinanceiroReport() {
  const [financeiroData, setFinanceiroData] = useState<FinanceiroData[]>([]);
  const [categoriaDespesa, setCategoriaDespesa] = useState<CategoriaDespesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('12meses');
  const [selectedView, setSelectedView] = useState('geral');
  
  const { insights, generateInsights } = useAIAnalysis();

  // Mock data for demonstration
  useEffect(() => {
    const mockFinanceiroData: FinanceiroData[] = [
      { mes: 'Jan/2024', receita: 2850000, despesa: 2280000, lucro: 570000, margem_lucro: 20.0, ebitda: 650000, fluxo_caixa: 485000, roi: 15.2 },
      { mes: 'Fev/2024', receita: 2920000, despesa: 2336000, lucro: 584000, margem_lucro: 20.0, ebitda: 670000, fluxo_caixa: 502000, roi: 15.8 },
      { mes: 'Mar/2024', receita: 3100000, despesa: 2448000, lucro: 652000, margem_lucro: 21.0, ebitda: 740000, fluxo_caixa: 578000, roi: 17.1 },
      { mes: 'Abr/2024', receita: 2980000, despesa: 2384000, lucro: 596000, margem_lucro: 20.0, ebitda: 685000, fluxo_caixa: 521000, roi: 16.0 },
      { mes: 'Mai/2024', receita: 3250000, despesa: 2537500, lucro: 712500, margem_lucro: 21.9, ebitda: 810000, fluxo_caixa: 635000, roi: 18.5 },
      { mes: 'Jun/2024', receita: 3350000, despesa: 2609000, lucro: 741000, margem_lucro: 22.1, ebitda: 845000, fluxo_caixa: 668000, roi: 19.2 },
      { mes: 'Jul/2024', receita: 3420000, despesa: 2655600, lucro: 764400, margem_lucro: 22.4, ebitda: 875000, fluxo_caixa: 692000, roi: 19.8 },
      { mes: 'Ago/2024', receita: 3580000, despesa: 2760600, lucro: 819400, margem_lucro: 22.9, ebitda: 935000, fluxo_caixa: 748000, roi: 21.2 },
      { mes: 'Set/2024', receita: 3650000, despesa: 2813500, lucro: 836500, margem_lucro: 22.9, ebitda: 955000, fluxo_caixa: 765000, roi: 21.5 },
      { mes: 'Out/2024', receita: 3780000, despesa: 2896200, lucro: 883800, margem_lucro: 23.4, ebitda: 1010000, fluxo_caixa: 812000, roi: 22.8 },
      { mes: 'Nov/2024', receita: 3850000, despesa: 2940500, lucro: 909500, margem_lucro: 23.6, ebitda: 1040000, fluxo_caixa: 838000, roi: 23.2 },
      { mes: 'Dez/2024', receita: 4120000, despesa: 3127200, lucro: 992800, margem_lucro: 24.1, ebitda: 1135000, fluxo_caixa: 925000, roi: 25.1 }
    ];

    const mockCategoriaDespesa: CategoriaDespesa[] = [
      { categoria: 'Pessoal', valor: 1250000, percentual: 42.0 },
      { categoria: 'Operacional', valor: 650000, percentual: 22.0 },
      { categoria: 'Marketing', valor: 420000, percentual: 14.0 },
      { categoria: 'Tecnologia', valor: 315000, percentual: 11.0 },
      { categoria: 'Administrativo', valor: 280000, percentual: 9.0 },
      { categoria: 'Outros', valor: 150000, percentual: 5.0 }
    ];

    setFinanceiroData(mockFinanceiroData);
    setCategoriaDespesa(mockCategoriaDespesa);
    setLoading(false);
    generateInsights('financeiro', mockFinanceiroData);
  }, [generateInsights]);

  const kpiCards = [
    {
      title: 'Receita Total',
      value: 'R$ 38.485.000',
      change: '+18.5%',
      icon: DollarSign,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900'
    },
    {
      title: 'Lucro Líquido',
      value: 'R$ 8.925.400',
      change: '+22.8%',
      icon: TrendingUp,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900'
    },
    {
      title: 'Margem de Lucro',
      value: '23.2%',
      change: '+2.1%',
      icon: PieChart,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900'
    },
    {
      title: 'ROI',
      value: '21.5%',
      change: '+3.2%',
      icon: BarChart3,
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
        <span className="text-sm text-gray-500 dark:text-gray-400">Financeiro</span>
      </div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard Financeiro</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Análise completa do desempenho financeiro com DRE, fluxo de caixa e indicadores</p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedView}
            onChange={(e) => setSelectedView(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="geral">Visão Geral</option>
            <option value="dre">DRE</option>
            <option value="fluxo">Fluxo de Caixa</option>
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
      <AISummary insights={insights} module="financeiro" />

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
      <Tabs defaultValue="receita" className="space-y-4">
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 w-full dark:bg-gray-800">
          <TabsTrigger value="receita" className="dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100">Receita & Despesas</TabsTrigger>
          <TabsTrigger value="lucro" className="dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100">Lucro & Margem</TabsTrigger>
          <TabsTrigger value="fluxo" className="dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100">Fluxo de Caixa</TabsTrigger>
          <TabsTrigger value="despesas" className="dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100">Despesas por Categoria</TabsTrigger>
        </TabsList>

        <TabsContent value="receita" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EnhancedChart
              title="Evolução de Receita vs Despesas"
              description="Comparativo mensal de receitas e despesas"
              data={financeiroData.map(d => ({ name: d.mes, value: d.receita, trend: d.despesa }))}
              chartType="composed"
              module="financeiro"
            />
            <EnhancedChart
              title="Evolução do Lucro"
              description="Lucro mensal"
              data={financeiroData.map(d => ({ name: d.mes, value: d.lucro }))}
              chartType="line"
              module="financeiro"
            />
          </div>
        </TabsContent>

        <TabsContent value="lucro" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EnhancedChart
              title="Margem de Lucro"
              description="Margem de lucro mensal"
              data={financeiroData.map(d => ({ name: d.mes, value: d.margem_lucro }))}
              chartType="line"
              module="financeiro"
            />
            <EnhancedChart
              title="EBITDA"
              description="EBITDA mensal"
              data={financeiroData.map(d => ({ name: d.mes, value: d.ebitda }))}
              chartType="bar"
              module="financeiro"
            />
          </div>
        </TabsContent>

        <TabsContent value="fluxo" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EnhancedChart
              title="Fluxo de Caixa"
              description="Fluxo de caixa mensal"
              data={financeiroData.map(d => ({ name: d.mes, value: d.fluxo_caixa }))}
              chartType="area"
              module="financeiro"
            />
            <EnhancedChart
              title="ROI"
              description="Return on Investment mensal"
              data={financeiroData.map(d => ({ name: d.mes, value: d.roi }))}
              chartType="line"
              module="financeiro"
            />
          </div>
        </TabsContent>

        <TabsContent value="despesas" className="space-y-4">
          <EnhancedChart
            title="Despesas por Categoria"
            description="Distribuição de despesas por categoria"
            data={categoriaDespesa.map(c => ({ name: c.categoria, value: c.valor }))}
            chartType="bar"
            module="financeiro"
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
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">24.1%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Margem de Lucro Média</div>
              <Badge variant="outline" className="mt-2 dark:border-gray-600">Meta: 25%</Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">21.5%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">ROI Médio</div>
              <Badge variant="outline" className="mt-2 dark:border-gray-600">Meta: 20%</Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">R$ 925.000</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Fluxo de Caixa</div>
              <Badge variant="outline" className="mt-2 dark:border-gray-600">+15% vs mês anterior</Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">R$ 1.135.000</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">EBITDA</div>
              <Badge variant="outline" className="mt-2 dark:border-gray-600">+12% vs mês anterior</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export const dynamic = 'force-dynamic';
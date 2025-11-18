'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EnhancedChart } from '@/components/EnhancedChart';
import { AISummary } from '@/components/AISummary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Package, TrendingUp, AlertTriangle, BarChart3, RotateCcw, DollarSign } from 'lucide-react';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';

interface EstoqueData {
  mes: string;
  estoque_total: number;
  giro_estoque: number;
  produtos_sem_movimento: number;
  curva_a: number;
  curva_b: number;
  curva_c: number;
  ruptura: number;
  obsolescencia: number;
}

export default function EstoqueReport() {
  const [estoqueData, setEstoqueData] = useState<EstoqueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('12meses');
  const { insights, generateInsights } = useAIAnalysis();

  // Mock data for demonstration
  useEffect(() => {
    const mockEstoqueData: EstoqueData[] = [
      { mes: 'Jan/2024', estoque_total: 2500000, giro_estoque: 8.5, produtos_sem_movimento: 125, curva_a: 450, curva_b: 890, curva_c: 2340, ruptura: 15, obsolescencia: 3.2 },
      { mes: 'Fev/2024', estoque_total: 2650000, giro_estoque: 8.2, produtos_sem_movimento: 118, curva_a: 465, curva_b: 920, curva_c: 2380, ruptura: 12, obsolescencia: 3.5 },
      { mes: 'Mar/2024', estoque_total: 2720000, giro_estoque: 8.8, produtos_sem_movimento: 105, curva_a: 480, curva_b: 945, curva_c: 2420, ruptura: 18, obsolescencia: 3.1 },
      { mes: 'Abr/2024', estoque_total: 2580000, giro_estoque: 9.1, produtos_sem_movimento: 98, curva_a: 475, curva_b: 935, curva_c: 2390, ruptura: 14, obsolescencia: 2.8 },
      { mes: 'Mai/2024', estoque_total: 2850000, giro_estoque: 8.9, produtos_sem_movimento: 102, curva_a: 495, curva_b: 980, curva_c: 2480, ruptura: 16, obsolescencia: 3.0 },
      { mes: 'Jun/2024', estoque_total: 2920000, giro_estoque: 9.3, produtos_sem_movimento: 89, curva_a: 510, curva_b: 1015, curva_c: 2525, ruptura: 11, obsolescencia: 2.5 },
      { mes: 'Jul/2024', estoque_total: 3150000, giro_estoque: 9.0, produtos_sem_movimento: 95, curva_a: 525, curva_b: 1045, curva_c: 2580, ruptura: 13, obsolescencia: 2.7 },
      { mes: 'Ago/2024', estoque_total: 3080000, giro_estoque: 9.5, produtos_sem_movimento: 85, curva_a: 540, curva_b: 1070, curva_c: 2610, ruptura: 9, obsolescencia: 2.3 },
      { mes: 'Set/2024', estoque_total: 3250000, giro_estoque: 9.2, produtos_sem_movimento: 91, curva_a: 555, curva_b: 1100, curva_c: 2655, ruptura: 17, obsolescencia: 2.9 },
      { mes: 'Out/2024', estoque_total: 3350000, giro_estoque: 9.8, produtos_sem_movimento: 78, curva_a: 570, curva_b: 1135, curva_c: 2700, ruptura: 10, obsolescencia: 2.1 },
      { mes: 'Nov/2024', estoque_total: 3420000, giro_estoque: 9.6, produtos_sem_movimento: 82, curva_a: 585, curva_b: 1165, curva_c: 2740, ruptura: 12, obsolescencia: 2.4 },
      { mes: 'Dez/2024', estoque_total: 3580000, giro_estoque: 10.1, produtos_sem_movimento: 70, curva_a: 600, curva_b: 1200, curva_c: 2800, ruptura: 8, obsolescencia: 1.9 }
    ];

    setEstoqueData(mockEstoqueData);
    setLoading(false);
    generateInsights('estoque', mockEstoqueData);
  }, [generateInsights]);

  const kpiCards = [
    {
      title: 'Valor Total Estoque',
      value: 'R$ 3.580.000',
      change: '+12.5%',
      icon: DollarSign,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900'
    },
    {
      title: 'Giro de Estoque',
      value: '10.1x',
      change: '+8.3%',
      icon: RotateCcw,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900'
    },
    {
      title: 'Produtos Sem Movimento',
      value: '70',
      change: '-44.0%',
      icon: AlertTriangle,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900'
    },
    {
      title: 'Ruptura de Estoque',
      value: '8',
      change: '-46.7%',
      icon: Package,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900'
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard de Estoque</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Análise completa do estoque com giro, curva ABC e indicadores de performance</p>
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
      <AISummary insights={insights} module="estoque" />

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
      <Tabs defaultValue="estoque" className="space-y-4">
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 w-full dark:bg-gray-800">
          <TabsTrigger value="estoque" className="dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100">Estoque Total</TabsTrigger>
          <TabsTrigger value="giro" className="dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100">Giro de Estoque</TabsTrigger>
          <TabsTrigger value="curva" className="dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100">Curva ABC</TabsTrigger>
          <TabsTrigger value="analise" className="dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100">Análise</TabsTrigger>
        </TabsList>

        <TabsContent value="estoque" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EnhancedChart
              title="Evolução do Estoque Total"
              description="Valor total do estoque por mês"
              data={estoqueData.map(d => ({ name: d.mes, value: d.estoque_total }))}
              chartType="area"
              module="estoque"
            />
            <EnhancedChart
              title="Produtos Sem Movimento"
              description="Número de produtos sem movimento por mês"
              data={estoqueData.map(d => ({ name: d.mes, value: d.produtos_sem_movimento }))}
              chartType="line"
              module="estoque"
            />
          </div>
        </TabsContent>

        <TabsContent value="giro" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EnhancedChart
              title="Giro de Estoque"
              description="Giro de estoque por mês"
              data={estoqueData.map(d => ({ name: d.mes, value: d.giro_estoque }))}
              chartType="line"
              module="estoque"
            />
            <EnhancedChart
              title="Ruptura de Estoque"
              description="Número de rupturas por mês"
              data={estoqueData.map(d => ({ name: d.mes, value: d.ruptura }))}
              chartType="bar"
              module="estoque"
            />
          </div>
        </TabsContent>

        <TabsContent value="curva" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EnhancedChart
              title="Curva ABC (Curva A)"
              description="Quantidade de produtos na Curva A"
              data={estoqueData.map(d => ({ name: d.mes, value: d.curva_a }))}
              chartType="bar"
              module="estoque"
            />
            <EnhancedChart
              title="Obsolescência"
              description="Percentual de obsolescência por mês"
              data={estoqueData.map(d => ({ name: d.mes, value: d.obsolescencia }))}
              chartType="line"
              module="estoque"
            />
          </div>
        </TabsContent>

        <TabsContent value="analise" className="space-y-4">
          <EnhancedChart
            title="Giro vs Obsolescência"
            description="Comparativo mensal de giro e obsolescência"
            data={estoqueData.map(d => ({ name: d.mes, value: d.obsolescencia, trend: d.giro_estoque }))}
            chartType="composed"
            module="estoque"
          />
        </TabsContent>
      </Tabs>

      {/* Performance Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Indicadores de Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">10.1x</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Giro de Estoque</div>
              <Badge variant="outline" className="mt-2 dark:border-gray-600">Meta: 12x</Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">70</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Produtos Sem Movimento</div>
              <Badge variant="outline" className="mt-2 dark:border-gray-600">-44% vs ano anterior</Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">8</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Rupturas no Mês</div>
              <Badge variant="outline" className="mt-2 dark:border-gray-600">Meta: 5 rupturas</Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">1.9%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Obsolescência</div>
              <Badge variant="outline" className="mt-2 dark:border-gray-600">Meta: 2%</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
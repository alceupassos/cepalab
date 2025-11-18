'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EnhancedChart } from '@/components/EnhancedChart';
import { AISummary } from '@/components/AISummary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, DollarSign, TrendingUp, Award, Target, BarChart3 } from 'lucide-react';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';

interface ComissaoData {
  representante: string;
  mes: string;
  vendas: number;
  comissao: number;
  percentual_comissao: number;
  clientes_atendidos: number;
  ticket_medio: number;
  meta: number;
  atingimento_meta: number;
}

interface RepresentanteSummary {
  representante: string;
  total_vendas: number;
  total_comissao: number;
  media_percentual: number;
  clientes_totais: number;
  ranking: number;
}

export default function ComissoesReport() {
  const [comissaoData, setComissaoData] = useState<ComissaoData[]>([]);
  const [representanteSummary, setRepresentanteSummary] = useState<RepresentanteSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('12meses');
  const [selectedRepresentante, setSelectedRepresentante] = useState('todos');
  
  const { insights, generateInsights } = useAIAnalysis();

  // Mock data for demonstration - replace with actual API calls
  useEffect(() => {
    const mockComissaoData: ComissaoData[] = [
      { representante: 'Carlos Silva', mes: 'Jan/2024', vendas: 125000, comissao: 5000, percentual_comissao: 4.0, clientes_atendidos: 45, ticket_medio: 2778, meta: 120000, atingimento_meta: 104.2 },
      { representante: 'Ana Santos', mes: 'Jan/2024', vendas: 98000, comissao: 3920, percentual_comissao: 4.0, clientes_atendidos: 38, ticket_medio: 2579, meta: 100000, atingimento_meta: 98.0 },
      { representante: 'Pedro Oliveira', mes: 'Jan/2024', vendas: 156000, comissao: 7800, percentual_comissao: 5.0, clientes_atendidos: 52, ticket_medio: 3000, meta: 150000, atingimento_meta: 104.0 },
      { representante: 'Maria Costa', mes: 'Jan/2024', vendas: 134000, comissao: 5360, percentual_comissao: 4.0, clientes_atendidos: 41, ticket_medio: 3268, meta: 130000, atingimento_meta: 103.1 },
      { representante: 'João Ferreira', mes: 'Jan/2024', vendas: 87000, comissao: 3480, percentual_comissao: 4.0, clientes_atendidos: 35, ticket_medio: 2486, meta: 90000, atingimento_meta: 96.7 },
      
      { representante: 'Carlos Silva', mes: 'Fev/2024', vendas: 142000, comissao: 5680, percentual_comissao: 4.0, clientes_atendidos: 48, ticket_medio: 2958, meta: 120000, atingimento_meta: 118.3 },
      { representante: 'Ana Santos', mes: 'Fev/2024', vendas: 115000, comissao: 4600, percentual_comissao: 4.0, clientes_atendidos: 42, ticket_medio: 2738, meta: 100000, atingimento_meta: 115.0 },
      { representante: 'Pedro Oliveira', mes: 'Fev/2024', vendas: 168000, comissao: 8400, percentual_comissao: 5.0, clientes_atendidos: 55, ticket_medio: 3055, meta: 150000, atingimento_meta: 112.0 },
      { representante: 'Maria Costa', mes: 'Fev/2024', vendas: 145000, comissao: 5800, percentual_comissao: 4.0, clientes_atendidos: 44, ticket_medio: 3295, meta: 130000, atingimento_meta: 111.5 },
      { representante: 'João Ferreira', mes: 'Fev/2024', vendas: 95000, comissao: 3800, percentual_comissao: 4.0, clientes_atendidos: 37, ticket_medio: 2568, meta: 90000, atingimento_meta: 105.6 },
      
      { representante: 'Carlos Silva', mes: 'Mar/2024', vendas: 158000, comissao: 6320, percentual_comissao: 4.0, clientes_atendidos: 51, ticket_medio: 3098, meta: 120000, atingimento_meta: 131.7 },
      { representante: 'Ana Santos', mes: 'Mar/2024', vendas: 128000, comissao: 5120, percentual_comissao: 4.0, clientes_atendidos: 46, ticket_medio: 2783, meta: 100000, atingimento_meta: 128.0 },
      { representante: 'Pedro Oliveira', mes: 'Mar/2024', vendas: 185000, comissao: 9250, percentual_comissao: 5.0, clientes_atendidos: 58, ticket_medio: 3190, meta: 150000, atingimento_meta: 123.3 },
      { representante: 'Maria Costa', mes: 'Mar/2024', vendas: 162000, comissao: 6480, percentual_comissao: 4.0, clientes_atendidos: 49, ticket_medio: 3306, meta: 130000, atingimento_meta: 124.6 },
      { representante: 'João Ferreira', mes: 'Mar/2024', vendas: 102000, comissao: 4080, percentual_comissao: 4.0, clientes_atendidos: 39, ticket_medio: 2615, meta: 90000, atingimento_meta: 113.3 }
    ];

    // Calculate summary data
    const representantes = ['Carlos Silva', 'Ana Santos', 'Pedro Oliveira', 'Maria Costa', 'João Ferreira'];
    const summaryData: RepresentanteSummary[] = representantes.map((rep, index) => {
      const repData = mockComissaoData.filter(d => d.representante === rep);
      const total_vendas = repData.reduce((sum, d) => sum + d.vendas, 0);
      const total_comissao = repData.reduce((sum, d) => sum + d.comissao, 0);
      const media_percentual = repData.reduce((sum, d) => sum + d.percentual_comissao, 0) / repData.length;
      const clientes_totais = repData.reduce((sum, d) => sum + d.clientes_atendidos, 0);
      
      return {
        representante: rep,
        total_vendas,
        total_comissao,
        media_percentual,
        clientes_totais,
        ranking: index + 1
      };
    }).sort((a, b) => b.total_vendas - a.total_vendas);

    setComissaoData(mockComissaoData);
    setRepresentanteSummary(summaryData);
    setLoading(false);

    // Generate AI insights
    generateInsights('comissoes', mockComissaoData);
  }, [generateInsights]);

  const kpiCards = [
    {
      title: 'Total de Comissões',
      value: 'R$ 95.290',
      change: '+15.2%',
      icon: DollarSign,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900'
    },
    {
      title: 'Total de Vendas',
      value: 'R$ 2.382.000',
      change: '+12.8%',
      icon: TrendingUp,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900'
    },
    {
      title: 'Representantes Ativos',
      value: '5',
      change: '0%',
      icon: Users,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900'
    },
    {
      title: 'Média de Atingimento',
      value: '110.4%',
      change: '+8.7%',
      icon: Target,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900'
    }
  ];

  const topRepresentantes = representanteSummary.slice(0, 3);

  const vendasMensais = Object.values(
    comissaoData.reduce((acc: Record<string, { name: string; value: number }>, d) => {
      acc[d.mes] = acc[d.mes] || { name: d.mes, value: 0 };
      acc[d.mes].value += d.vendas;
      return acc;
    }, {})
  ).sort((a, b) => a.name.localeCompare(b.name));

  const comissoesMensais = Object.values(
    comissaoData.reduce((acc: Record<string, { name: string; value: number }>, d) => {
      acc[d.mes] = acc[d.mes] || { name: d.mes, value: 0 };
      acc[d.mes].value += d.comissao;
      return acc;
    }, {})
  ).sort((a, b) => a.name.localeCompare(b.name));

  const ticketMedioPorRepresentante = Object.values(
    comissaoData.reduce((acc: Record<string, { name: string; total: number; count: number }>, d) => {
      const key = d.representante;
      acc[key] = acc[key] || { name: key, total: 0, count: 0 };
      acc[key].total += d.ticket_medio;
      acc[key].count += 1;
      return acc;
    }, {})
  ).map(({ name, total, count }) => ({ name, value: Number((total / count).toFixed(2)) }));

  const atingimentoPorRepresentante = Object.values(
    comissaoData.reduce((acc: Record<string, { name: string; total: number; count: number }>, d) => {
      const key = d.representante;
      acc[key] = acc[key] || { name: key, total: 0, count: 0 };
      acc[key].total += d.atingimento_meta;
      acc[key].count += 1;
      return acc;
    }, {})
  ).map(({ name, total, count }) => ({ name, value: Number((total / count).toFixed(2)) }));

  const clientesPorRepresentante = Object.values(
    comissaoData.reduce((acc: Record<string, { name: string; value: number }>, d) => {
      const key = d.representante;
      acc[key] = acc[key] || { name: key, value: 0 };
      acc[key].value += d.clientes_atendidos;
      return acc;
    }, {})
  );

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
        <span className="text-sm text-gray-500 dark:text-gray-400">Comissões</span>
      </div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Comissões Representante</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Análise detalhada de comissões e performance dos representantes</p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedRepresentante}
            onChange={(e) => setSelectedRepresentante(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="todos">Todos Representantes</option>
            {representanteSummary.map(rep => (
              <option key={rep.representante} value={rep.representante}>
                {rep.representante}
              </option>
            ))}
          </select>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="3meses">Últimos 3 meses</option>
            <option value="6meses">Últimos 6 meses</option>
            <option value="12meses">Últimos 12 meses</option>
          </select>
          <Button variant="outline" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </motion.div>

      {/* AI Summary */}
      <AISummary insights={insights} module="comissoes" />

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

      {/* Top Representantes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Top 3 Representantes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topRepresentantes.map((rep, index) => (
              <div key={rep.representante} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400 dark:bg-gray-500' : 'bg-orange-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">{rep.representante}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{rep.clientes_totais} clientes atendidos</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900 dark:text-gray-100">R$ {rep.total_vendas.toLocaleString()}</div>
                  <div className="text-sm text-green-600 dark:text-green-400">R$ {rep.total_comissao.toLocaleString()} comissão</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Charts */}
      <Tabs defaultValue="vendas" className="space-y-4">
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 w-full dark:bg-gray-800">
          <TabsTrigger value="vendas" className="dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100">Vendas & Comissões</TabsTrigger>
          <TabsTrigger value="performance" className="dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100">Performance por Rep</TabsTrigger>
          <TabsTrigger value="metas" className="dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100">Metas & Atingimento</TabsTrigger>
          <TabsTrigger value="analise" className="dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100">Análise Detalhada</TabsTrigger>
        </TabsList>

        <TabsContent value="vendas" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EnhancedChart
              title="Vendas Totais por Mês"
              description="Soma de vendas dos representantes por mês"
              data={vendasMensais}
              chartType="line"
              module="comissoes"
            />
            <EnhancedChart
              title="Evolução de Comissões"
              description="Comissões pagas por mês"
              data={comissoesMensais}
              chartType="area"
              module="comissoes"
            />
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EnhancedChart
              title="Performance por Representante"
              description="Total de vendas por representante"
              data={representanteSummary.map(r => ({ name: r.representante, value: r.total_vendas }))}
              chartType="bar"
              module="comissoes"
            />
            <EnhancedChart
              title="Ticket Médio por Representante"
              description="Ticket médio mensal por representante"
              data={ticketMedioPorRepresentante}
              chartType="bar"
              module="comissoes"
            />
          </div>
        </TabsContent>

        <TabsContent value="metas" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EnhancedChart
              title="Atingimento de Metas"
              description="Percentual de atingimento das metas"
              data={atingimentoPorRepresentante}
              chartType="bar"
              module="comissoes"
            />
            <EnhancedChart
              title="Clientes Atendidos"
              description="Número de clientes atendidos por representante"
              data={clientesPorRepresentante}
              chartType="bar"
              module="comissoes"
            />
          </div>
        </TabsContent>

        <TabsContent value="analise" className="space-y-4">
          <EnhancedChart
            title="Comissões por Mês"
            description="Relação entre comissões e meses"
            data={comissoesMensais}
            chartType="line"
            module="comissoes"
          />
        </TabsContent>
      </Tabs>

      {/* Performance Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Indicadores de Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">4.2%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Média de Comissão</div>
              <Badge variant="outline" className="mt-2 dark:border-gray-600">Meta: 4.5%</Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">110.4%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Atingimento de Metas</div>
              <Badge variant="outline" className="mt-2 dark:border-gray-600">+8.7% vs trimestre anterior</Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">R$ 2.878</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Ticket Médio</div>
              <Badge variant="outline" className="mt-2 dark:border-gray-600">+5.2% vs mês anterior</Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">44</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Clientes/Representante</div>
              <Badge variant="outline" className="mt-2 dark:border-gray-600">Meta: 50 clientes</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export const dynamic = 'force-dynamic';
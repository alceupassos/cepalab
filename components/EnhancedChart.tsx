'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ComposedChart,
  ScatterChart,
  Scatter
} from 'recharts';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Download, Filter, RefreshCw, Maximize2 } from 'lucide-react';
import { AIInsight, AIAnalysisService } from '@/app/utils/ai-analysis';

export type ChartType = 'line' | 'area' | 'bar' | 'pie' | 'composed' | 'scatter';

export interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

export interface EnhancedChartProps {
  title: string;
  description?: string;
  data: ChartData[];
  chartType: ChartType;
  colors?: string[];
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  enableAI?: boolean;
  module: 'vendas' | 'estoque' | 'financeiro' | 'comercial' | 'comissoes' | 'ecommerce';
  onExport?: (format: 'png' | 'pdf' | 'csv') => void;
  onFilter?: () => void;
  className?: string;
}

const defaultColors = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
];

export function EnhancedChart({
  title,
  description,
  data,
  chartType,
  colors = defaultColors,
  height = 400,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  enableAI = true,
  module,
  onExport,
  onFilter,
  className = ''
}: EnhancedChartProps) {
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [showAI, setShowAI] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [chartKey, setChartKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (enableAI && data.length > 0) {
      generateAIInsights();
    }
  }, [data, enableAI]);

  const generateAIInsights = async () => {
    setLoadingAI(true);
    try {
      const insights = await AIAnalysisService.generateQuickInsights(data, module);
      setAiInsights(insights);
    } catch (error) {
      console.error('Failed to generate AI insights:', error);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleExport = (format: 'png' | 'pdf' | 'csv') => {
    if (onExport) {
      onExport(format);
    } else {
      // Default export logic
      console.log(`Exporting chart as ${format}`);
    }
  };

  const refreshChart = () => {
    setChartKey(prev => prev + 1);
    if (enableAI) {
      generateAIInsights();
    }
  };

  const getInsightIcon = (category: AIInsight['category']) => {
    switch (category) {
      case 'trend': return <TrendingUp className="w-4 h-4" />;
      case 'anomaly': return <AlertTriangle className="w-4 h-4" />;
      case 'recommendation': return <Lightbulb className="w-4 h-4" />;
      case 'prediction': return <Brain className="w-4 h-4" />;
      default: return <TrendingUp className="w-4 h-4" />;
    }
  };

  const getInsightColor = (category: AIInsight['category']) => {
    switch (category) {
      case 'trend': return 'text-blue-600 bg-blue-100';
      case 'anomaly': return 'text-red-600 bg-red-100';
      case 'recommendation': return 'text-green-600 bg-green-100';
      case 'prediction': return 'text-purple-600 bg-purple-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 20 }
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
            <XAxis dataKey="name" className="text-xs" />
            <YAxis className="text-xs" />
            {showTooltip && <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: 'none', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />}
            {showLegend && <Legend />}
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={colors[0]} 
              strokeWidth={3}
              dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: colors[0], strokeWidth: 2 }}
            />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
            <XAxis dataKey="name" className="text-xs" />
            <YAxis className="text-xs" />
            {showTooltip && <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: 'none', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />}
            {showLegend && <Legend />}
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={colors[0]} 
              fillOpacity={0.3}
              fill={colors[0]}
            />
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
            <XAxis dataKey="name" className="text-xs" />
            <YAxis className="text-xs" />
            {showTooltip && <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: 'none', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />}
            {showLegend && <Legend />}
            <Bar 
              dataKey="value" 
              fill={colors[0]}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            {showTooltip && <Tooltip />}
            {showLegend && <Legend />}
          </PieChart>
        );

      case 'composed':
        return (
          <ComposedChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
            <XAxis dataKey="name" className="text-xs" />
            <YAxis className="text-xs" />
            {showTooltip && <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: 'none', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />}
            {showLegend && <Legend />}
            <Bar dataKey="value" fill={colors[0]} radius={[4, 4, 0, 0]} />
            <Line type="monotone" dataKey="trend" stroke={colors[1]} strokeWidth={2} />
          </ComposedChart>
        );

      case 'scatter':
        return (
          <ScatterChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
            <XAxis dataKey="x" className="text-xs" />
            <YAxis dataKey="y" className="text-xs" />
            {showTooltip && <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: 'none', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />}
            {showLegend && <Legend />}
            <Scatter 
              dataKey="value" 
              fill={colors[0]}
              strokeWidth={2}
            />
          </ScatterChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
          {description && (
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {enableAI && (
            <button
              onClick={() => setShowAI(!showAI)}
              className={`p-2 rounded-lg transition-colors ${
                showAI 
                  ? 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
              }`}
              title="IA Insights"
            >
              <Brain className="w-4 h-4" />
            </button>
          )}
          {onFilter && (
            <button
              onClick={onFilter}
              className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
              title="Filtrar"
            >
              <Filter className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={refreshChart}
            className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
            title="Atualizar"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <div className="relative">
            <button
              className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
              title="Exportar"
            >
              <Download className="w-4 h-4" />
            </button>
            {/* Export dropdown would go here */}
          </div>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
            title="Tela Cheia"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* AI Insights */}
      <AnimatePresence>
        {showAI && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-b border-slate-200 dark:border-slate-700"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <h4 className="font-semibold text-slate-900 dark:text-white">Insights de IA</h4>
                </div>
                <button
                  onClick={generateAIInsights}
                  disabled={loadingAI}
                  className="text-sm text-purple-600 hover:text-purple-700 disabled:opacity-50"
                >
                  {loadingAI ? 'Analisando...' : 'Recarregar'}
                </button>
              </div>

              {loadingAI ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  <span className="ml-3 text-slate-600 dark:text-slate-300">Gerando insights...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {aiInsights.map((insight) => (
                    <div key={insight.id} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <div className={`p-2 rounded-lg ${getInsightColor(insight.category)}`}>
                        {getInsightIcon(insight.category)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="font-medium text-slate-900 dark:text-white">{insight.title}</h5>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            insight.impact === 'high' ? 'bg-red-100 text-red-800' :
                            insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {insight.impact === 'high' ? 'Alto Impacto' :
                             insight.impact === 'medium' ? 'Médio Impacto' :
                             'Baixo Impacto'}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{insight.description}</p>
                        {/* Optional action items could be rendered here if available */}
                        <div className="mt-2">
                          <div className="flex items-center justify-end text-xs">
                            <span className="text-slate-500 dark:text-slate-400">Insight gerado automaticamente</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chart */}
      <div className="p-6">
        <div style={{ height: `${height}px` }}>
          <ResponsiveContainer width="100%" height="100%" key={chartKey}>
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer Stats */}
      {data.length > 0 && (
        <div className="px-6 pb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {data.length}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300">Pontos de Dados</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {Math.max(...data.map(d => d.value)).toLocaleString()}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300">Valor Máximo</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {(data.reduce((sum, d) => sum + d.value, 0) / data.length).toFixed(0)}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300">Média</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
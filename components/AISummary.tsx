'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, AlertTriangle, Info, RefreshCw, X } from 'lucide-react';

interface AIInsight {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  timestamp: Date;
}

interface AISummaryProps {
  insights: AIInsight[];
  module: string;
  onRefresh?: () => void;
  onClose?: () => void;
}

export function AISummary({ insights, module, onRefresh, onClose }: AISummaryProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high':
        return <TrendingUp className="h-4 w-4" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4" />;
      case 'low':
        return <Info className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'tendencia': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'performance': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'otimizacao': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'alerta': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'oportunidade': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  };

  if (!insights || insights.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 border-blue-200 dark:border-blue-700 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Brain className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Análise de IA - {module.charAt(0).toUpperCase() + module.slice(1)}
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Insights gerados por inteligência artificial
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {onRefresh && (
                    <Button
                      variant="outline"
                      onClick={onRefresh}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => setIsExpanded(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.map((insight, index) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedInsight === insight.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedInsight(
                      selectedInsight === insight.id ? null : insight.id
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${getImpactColor(insight.impact)}`}>
                        {getImpactIcon(insight.impact)}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {insight.title}
                          </h3>
                          <Badge className={`text-xs ${getImpactColor(insight.impact)}`}>
                            {insight.impact === 'high' ? 'Alto Impacto' : 
                             insight.impact === 'medium' ? 'Médio Impacto' : 'Baixo Impacto'}
                          </Badge>
                          <Badge className={`text-xs ${getCategoryColor(insight.category)}`}>
                            {insight.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {insight.description}
                        </p>
                        {selectedInsight === insight.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pt-3 border-t border-gray-200"
                          >
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Gerado em: {insight.timestamp.toLocaleString('pt-BR')}
                            </div>
                            <div className="mt-2 flex gap-2">
                              <Button variant="outline" className="text-xs">
                                Ver Detalhes
                              </Button>
                              <Button variant="outline" className="text-xs">
                                Compartilhar
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Brain className="h-3 w-3" />
                    <span>Powered by OpenAI GPT-4</span>
                  </div>
                  <div>
                    {insights.length} insight{insights.length !== 1 ? 's' : ''} gerado{insights.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
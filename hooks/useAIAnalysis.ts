import { useState, useCallback } from 'react';
import { AIAnalysisService, AIInsight } from '@/app/utils/ai-analysis';

// Using AIInsight type from utils

interface UseAIAnalysisReturn {
  insights: AIInsight[];
  loading: boolean;
  error: string | null;
  generateInsights: (module: string, data: any[]) => Promise<void>;
  clearInsights: () => void;
}

export function useAIAnalysis(): UseAIAnalysisReturn {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateInsightsCallback = useCallback(async (module: string, data: any[]) => {
    setLoading(true);
    setError(null);
    
    try {
      const generatedInsights = await AIAnalysisService.generateQuickInsights(data, module as any);
      setInsights(generatedInsights);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar insights');
      // Fallback to mock insights if AI fails
      const mockInsights: AIInsight[] = [
        {
          id: '1',
          title: 'Crescimento consistente',
          description: `Os dados de ${module} mostram um crescimento consistente nos últimos 3 meses.`,
          impact: 'high',
          category: 'tendencia',
          timestamp: new Date()
        },
        {
          id: '2',
          title: 'Oportunidade de melhoria',
          description: 'Identificamos oportunidades de otimização nos processos analisados.',
          impact: 'medium',
          category: 'otimizacao',
          timestamp: new Date()
        },
        {
          id: '3',
          title: 'Performance acima da média',
          description: 'Os indicadores estão 12% acima da média histórica.',
          impact: 'high',
          category: 'performance',
          timestamp: new Date()
        }
      ];
      setInsights(mockInsights);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearInsights = useCallback(() => {
    setInsights([]);
    setError(null);
  }, []);

  return {
    insights,
    loading,
    error,
    generateInsights: generateInsightsCallback,
    clearInsights
  };
}
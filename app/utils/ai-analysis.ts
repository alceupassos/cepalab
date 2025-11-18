export class AIAnalysisService {
  static async analyze(data: any, type: string) {
    return generateInsights(data, type);
  }

  static async generateReport(data: any, context: string) {
    const insights = await generateInsights(data, context);
    return {
      title: `Relatório de ${context}`,
      insights,
      generatedAt: new Date().toISOString()
    };
  }

  static async generateQuickInsights(data: any[], module: 'vendas' | 'estoque' | 'financeiro' | 'comercial' | 'comissoes' | 'ecommerce'): Promise<AIInsight[]> {
    const now = new Date();
    const base: AIInsight[] = [
      {
        id: 'trend-1',
        title: 'Tendência positiva recente',
        description: 'Os últimos pontos mostram crescimento consistente no módulo selecionado.',
        impact: 'medium',
        category: 'tendencia',
        timestamp: now
      },
      {
        id: 'anomaly-1',
        title: 'Variação fora do padrão',
        description: 'Foi detectada uma variação atípica comparada à média dos últimos meses.',
        impact: 'high',
        category: 'alerta',
        timestamp: now
      },
      {
        id: 'recommendation-1',
        title: 'Otimizar foco operacional',
        description: 'Concentre esforços nos itens com maior impacto para aumentar eficiência.',
        impact: 'low',
        category: 'otimizacao',
        timestamp: now
      }
    ];
    return base;
  }
}

export async function generateInsights(data: any, context: string) {
  // Mock AI analysis function for now
  // In a real implementation, this would call OpenAI API
  
  const insights = {
    summary: `Análise de ${context} realizada com sucesso.`,
    recommendations: [
      'Aumentar o foco em produtos de alta margem',
      'Otimizar o estoque para reduzir custos',
      'Melhorar a conversão de vendas'
    ],
    trends: [
      'Crescimento positivo nas últimas semanas',
      'Estacionalidade influenciando resultados'
    ],
    alerts: [
      'Estoque baixo em produtos principais',
      'Contas a receber acima do esperado'
    ]
  };

  return insights;
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  timestamp: Date;
}

export function analyzeData(data: any, type: 'sales' | 'stock' | 'financial' | 'commissions') {
  const analysis = {
    sales: {
      total: data.reduce((sum: number, item: any) => sum + (item.value || 0), 0),
      average: data.length > 0 ? data.reduce((sum: number, item: any) => sum + (item.value || 0), 0) / data.length : 0,
      trend: 'stable',
      insights: ['Vendas estáveis no período', 'Boa performance geral']
    },
    stock: {
      total: data.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0),
      lowStock: data.filter((item: any) => item.quantity < 10).length,
      alerts: data.filter((item: any) => item.quantity < 5).map((item: any) => `${item.name} com estoque baixo`)
    },
    financial: {
      revenue: data.reduce((sum: number, item: any) => sum + (item.revenue || 0), 0),
      expenses: data.reduce((sum: number, item: any) => sum + (item.expenses || 0), 0),
      profit: data.reduce((sum: number, item: any) => sum + (item.revenue || 0), 0) - data.reduce((sum: number, item: any) => sum + (item.expenses || 0), 0)
    },
    commissions: {
      total: data.reduce((sum: number, item: any) => sum + (item.commission || 0), 0),
      average: data.length > 0 ? data.reduce((sum: number, item: any) => sum + (item.commission || 0), 0) / data.length : 0,
      topPerformer: data.length > 0 ? data.reduce((max: any, item: any) => item.commission > (max.commission || 0) ? item : max, data[0]) : null
    }
  };

  return analysis[type] || analysis.sales;
}
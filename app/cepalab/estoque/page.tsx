'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, DollarSign, AlertTriangle, TrendingDown, Layers, Download, Filter, RefreshCw, Plus, Minus } from 'lucide-react';
import { EstoqueFilter } from '@/app/components/filters/EstoqueFilter';
import { AnimatedCard } from '@/app/components/AnimatedCard';
import { DataExporter } from '@/app/utils/export';
import useSWR from 'swr';

interface EstoqueItem {
  id: string;
  codigo_produto: string;
  nome_produto: string;
  categoria: string;
  fornecedor: string;
  quantidade_atual: number;
  quantidade_minima: number;
  quantidade_maxima: number;
  valor_unitario: number;
  valor_total: number;
  localizacao: string;
  ultima_movimentacao: string;
  status: 'low-stock' | 'out-of-stock' | 'overstock' | 'normal';
}

interface EstoqueSummary {
  total_produtos: number;
  valor_total: number;
  produtos_baixo_estoque: number;
  produtos_sem_estoque: number;
  produtos_excesso_estoque: number;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function EstoquePage() {
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Fetch estoque data with filters
  const queryString = new URLSearchParams(filters as any).toString();
  const { data: estoque, error, mutate } = useSWR<EstoqueItem[]>(
    `/api/cepalab/estoque${queryString ? `?${queryString}` : ''}`,
    fetcher,
    { refreshInterval: autoRefresh ? 30000 : 0 }
  );

  // Fetch summary data
  const { data: summary } = useSWR<EstoqueSummary>('/api/cepalab/estoque/summary', fetcher);

  useEffect(() => {
    mutate();
  }, [filters, mutate]);

  const handleExport = (format: 'csv' | 'json' | 'pdf' | 'excel') => {
    if (!estoque) return;

    const exportData = estoque.map(item => ({
      'Código': item.codigo_produto,
      'Produto': item.nome_produto,
      'Categoria': item.categoria,
      'Fornecedor': item.fornecedor,
      'Qtd. Atual': item.quantidade_atual,
      'Qtd. Mínima': item.quantidade_minima,
      'Qtd. Máxima': item.quantidade_maxima,
      'Valor Unit.': item.valor_unitario,
      'Valor Total': item.valor_total,
      'Localização': item.localizacao,
      'Últ. Mov.': new Date(item.ultima_movimentacao).toLocaleDateString('pt-BR'),
      'Status': item.status
    }));

    DataExporter.export(exportData, format, 'estoque_report');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'low-stock':
        return <TrendingDown className="w-4 h-4 text-warning" />;
      case 'out-of-stock':
        return <AlertTriangle className="w-4 h-4 text-danger" />;
      case 'overstock':
        return <Layers className="w-4 h-4 text-info" />;
      default:
        return <Package className="w-4 h-4 text-success" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'low-stock':
        return 'warning';
      case 'out-of-stock':
        return 'danger';
      case 'overstock':
        return 'info';
      default:
        return 'success';
    }
  };

  const handleItemSelect = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Controle de Estoque
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Gerencie seu inventário com análises detalhadas e alertas inteligentes
          </p>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AnimatedCard
            icon={<Package className="w-6 h-6" />}
            title="Total de Produtos"
            value={summary?.total_produtos || 0}
            subtitle="em estoque"
            change={{ value: 5.2, trend: 'up' }}
            variant="info"
            loading={!summary}
          >
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total de produtos cadastrados
            </div>
          </AnimatedCard>
          <AnimatedCard
            icon={<DollarSign className="w-6 h-6" />}
            title="Valor Total do Estoque"
            value={`R$ ${(summary?.valor_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            subtitle="valor total em estoque"
            change={{ value: 3.8, trend: 'up' }}
            variant="success"
            loading={!summary}
          >
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Valor total do inventário
            </div>
          </AnimatedCard>
          <AnimatedCard
            icon={<TrendingDown className="w-6 h-6" />}
            title="Baixo Estoque"
            value={summary?.produtos_baixo_estoque || 0}
            subtitle="produtos com estoque baixo"
            change={{ value: -12.5, trend: 'down' }}
            variant="warning"
            loading={!summary}
            glow={summary?.produtos_baixo_estoque > 0}
          >
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Requer atenção para reposição
            </div>
          </AnimatedCard>
          <AnimatedCard
            icon={<AlertTriangle className="w-6 h-6" />}
            title="Sem Estoque"
            value={summary?.produtos_sem_estoque || 0}
            subtitle="produtos em falta"
            change={{ value: summary?.produtos_sem_estoque > 0 ? -25.0 : 0, trend: 'down' }}
            variant="danger"
            loading={!summary}
            glow={summary?.produtos_sem_estoque > 0}
          >
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Urgente: requer reposição imediata
            </div>
          </AnimatedCard>
        </div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filtros
              </button>
              <button
                onClick={() => mutate()}
                className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Atualizar
              </button>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autoRefresh"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded border-slate-300"
                />
                <label htmlFor="autoRefresh" className="text-sm text-slate-600 dark:text-slate-300">
                  Atualização automática (30s)
                </label>
              </div>
              {selectedItems.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 bg-info-100 dark:bg-info-900 text-info-800 dark:text-info-200 rounded-lg">
                  <span className="text-sm font-medium">
                    {selectedItems.length} selecionado(s)
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleExport('csv')}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                CSV
              </button>
              <button
                onClick={() => handleExport('excel')}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Excel
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="mt-6"
              >
                <EstoqueFilter
                  onFilterChange={setFilters}
                  initialFilters={filters}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Estoque Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Produtos em Estoque
            </h2>
          </div>

          {error && (
            <div className="p-6 text-center text-red-600 dark:text-red-400">
              Erro ao carregar estoque: {error.message}
            </div>
          )}

          {!estoque && !error && (
            <div className="p-6 text-center text-slate-500 dark:text-slate-400">
              Carregando estoque...
            </div>
          )}

          {estoque && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {estoque.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`border rounded-lg p-4 transition-all duration-200 ${
                      selectedItems.includes(item.id) 
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                    onClick={() => handleItemSelect(item.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <span className={`text-sm font-medium ${
                          item.status === 'low-stock' ? 'text-warning' :
                          item.status === 'out-of-stock' ? 'text-danger' :
                          item.status === 'overstock' ? 'text-info' :
                          'text-success'
                        }`}>
                          {item.codigo_produto}
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleItemSelect(item.id)}
                        className="rounded border-slate-300"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                      {item.nome_produto}
                    </h3>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-300">Categoria:</span>
                        <span className="text-slate-900 dark:text-white">{item.categoria}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-300">Fornecedor:</span>
                        <span className="text-slate-900 dark:text-white">{item.fornecedor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-300">Localização:</span>
                        <span className="text-slate-900 dark:text-white">{item.localizacao}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-300">Quantidade:</span>
                        <span className={`font-medium ${
                          item.status === 'out-of-stock' ? 'text-danger' :
                          item.status === 'low-stock' ? 'text-warning' :
                          'text-success'
                        }`}>
                          {item.quantidade_atual} un
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-300">Valor Unitário:</span>
                        <span className="text-slate-900 dark:text-white">
                          R$ {item.valor_unitario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-300">Valor Total:</span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          R$ {item.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Última movimentação:
                        </span>
                        <span className="text-xs text-slate-600 dark:text-slate-300">
                          {new Date(item.ultima_movimentacao).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>

                    {item.status !== 'normal' && (
                      <div className={`mt-3 p-2 rounded-lg text-xs font-medium ${
                        item.status === 'low-stock' ? 'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200' :
                        item.status === 'out-of-stock' ? 'bg-danger-100 text-danger-800 dark:bg-danger-900 dark:text-danger-200' :
                        'bg-info-100 text-info-800 dark:bg-info-900 dark:text-info-200'
                      }`}>
                        {item.status === 'low-stock' && '⚠️ Estoque abaixo do mínimo'}
                        {item.status === 'out-of-stock' && '🚨 Produto sem estoque'}
                        {item.status === 'overstock' && '📦 Excesso de estoque'}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
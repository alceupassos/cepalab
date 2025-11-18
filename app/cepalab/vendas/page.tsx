'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, TrendingUp, Users, Package, Download, Filter, RefreshCw } from 'lucide-react';
import { VendasFilter } from '@/app/components/filters/VendasFilter';
import { AnimatedCard } from '@/app/components/AnimatedCard';
import { DataExporter } from '@/app/utils/export';
import useSWR from 'swr';

interface Venda {
  id: string;
  numero_venda: string;
  data_venda: string;
  cliente_nome: string;
  vendedor_nome: string;
  valor_total: number;
  status: string;
  forma_pagamento: string;
  parcelas: number;
}

interface VendasSummary {
  total_vendas: number;
  total_valor: number;
  media_valor: number;
  total_clientes: number;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function VendasPage() {
  const [filters, setFilters] = useState({
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    },
    status: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Fetch vendas data with filters
  const queryString = new URLSearchParams(filters as any).toString();
  const { data: vendas, error, mutate } = useSWR<Venda[]>(
    `/api/cepalab/vendas${queryString ? `?${queryString}` : ''}`,
    fetcher,
    { refreshInterval: autoRefresh ? 30000 : 0 }
  );

  // Fetch summary data
  const { data: summary } = useSWR<VendasSummary>('/api/cepalab/vendas/summary', fetcher);

  useEffect(() => {
    mutate();
  }, [filters, mutate]);

  const handleExport = (format: 'csv' | 'json' | 'pdf' | 'excel') => {
    if (!vendas) return;

    const exportData = vendas.map(venda => ({
      'Número da Venda': venda.numero_venda,
      'Data': new Date(venda.data_venda).toLocaleDateString('pt-BR'),
      'Cliente': venda.cliente_nome,
      'Vendedor': venda.vendedor_nome,
      'Valor Total': venda.valor_total,
      'Status': venda.status,
      'Forma de Pagamento': venda.forma_pagamento,
      'Parcelas': venda.parcelas
    }));

    DataExporter.export(exportData, format, 'vendas_report');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'concluída':
      case 'finalizada':
        return 'success';
      case 'pendente':
        return 'warning';
      case 'cancelada':
        return 'danger';
      default:
        return 'default';
    }
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
            Gestão de Vendas
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Acompanhe e gerencie suas vendas com filtros avançados e análises em tempo real
          </p>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AnimatedCard
            icon={<DollarSign className="w-6 h-6" />}
            title="Total de Vendas"
            value={summary?.total_vendas || 0}
            subtitle="no período"
            change={{ value: 12.5, trend: 'up' }}
            variant="info"
            loading={!summary}
          >
            <div className="text-sm text-gray-600 dark:text-gray-400">Quantidade de vendas</div>
          </AnimatedCard>
          <AnimatedCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Valor Total"
            value={`R$ ${(summary?.total_valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            subtitle="soma no período"
            change={{ value: 8.3, trend: 'up' }}
            variant="success"
            loading={!summary}
          >
            <div className="text-sm text-gray-600 dark:text-gray-400">Receita total</div>
          </AnimatedCard>
          <AnimatedCard
            icon={<Users className="w-6 h-6" />}
            title="Clientes Atendidos"
            value={summary?.total_clientes || 0}
            subtitle="no período"
            change={{ value: 5.2, trend: 'up' }}
            variant="info"
            loading={!summary}
          >
            <div className="text-sm text-gray-600 dark:text-gray-400">Atendimento realizado</div>
          </AnimatedCard>
          <AnimatedCard
            icon={<Package className="w-6 h-6" />}
            title="Ticket Médio"
            value={`R$ ${(summary?.media_valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            subtitle="por venda"
            change={{ value: -2.1, trend: 'down' }}
            variant="warning"
            loading={!summary}
          >
            <div className="text-sm text-gray-600 dark:text-gray-400">Valor médio por pedido</div>
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
                <VendasFilter
                  onFilterChange={(f) => setFilters({
                    ...filters,
                    ...f,
                    status: f.status ?? 'all'
                  })}
                  initialFilters={filters as any}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Vendas Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Vendas Recentes
            </h2>
          </div>

          {error && (
            <div className="p-6 text-center text-red-600 dark:text-red-400">
              Erro ao carregar vendas: {error.message}
            </div>
          )}

          {!vendas && !error && (
            <div className="p-6 text-center text-slate-500 dark:text-slate-400">
              Carregando vendas...
            </div>
          )}

          {vendas && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                      Número
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                      Vendedor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                      Valor Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                      Pagamento
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                  {vendas.map((venda, index) => (
                    <motion.tr
                      key={venda.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                        {venda.numero_venda}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                        {new Date(venda.data_venda).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                        {venda.cliente_nome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                        {venda.vendedor_nome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                        R$ {venda.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          getStatusColor(venda.status) === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                          getStatusColor(venda.status) === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                          getStatusColor(venda.status) === 'danger' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' :
                          'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-100'
                        }`}>
                          {venda.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                        {venda.forma_pagamento} {venda.parcelas > 1 && `(${venda.parcelas}x)`}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
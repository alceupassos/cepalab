'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, Calendar, Download, Filter, RefreshCw, AlertCircle } from 'lucide-react';
import { AnimatedCard } from '@/app/components/AnimatedCard';
import { DataExporter } from '@/app/utils/export';
import useSWR from 'swr';

interface ContaReceber {
  id: string;
  numero_documento: string;
  cliente_nome: string;
  valor_original: number;
  valor_recebido: number;
  valor_saldo: number;
  data_emissao: string;
  data_vencimento: string;
  data_recebimento: string | null;
  status: 'aberto' | 'parcial' | 'quitado' | 'atrasado';
  dias_atraso: number;
  forma_pagamento: string;
}

interface CaixaSituacao {
  id: string;
  data_movimento: string;
  saldo_inicial: number;
  total_entradas: number;
  total_saidas: number;
  saldo_final: number;
  status: 'aberto' | 'fechado';
  usuario: string;
}

interface FinanceiroSummary {
  total_receber: number;
  total_recebido: number;
  total_atrasado: number;
  total_saldo_caixa: number;
  contas_aberto: number;
  contas_atrasadas: number;
  contas_quitadas: number;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function FinanceiroPage() {
  const [activeTab, setActiveTab] = useState<'contas' | 'caixa' | 'analise'>('contas');
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Fetch contas a receber data
  const queryString = new URLSearchParams(filters as any).toString();
  const { data: contasReceber, error: contasError, mutate: mutateContas } = useSWR<ContaReceber[]>(
    `/api/cepalab/financeiro/contas${queryString ? `?${queryString}` : ''}`,
    fetcher,
    { refreshInterval: autoRefresh ? 30000 : 0 }
  );

  // Fetch caixa data
  const { data: caixaData, error: caixaError, mutate: mutateCaixa } = useSWR<CaixaSituacao[]>(
    `/api/cepalab/financeiro/caixa`,
    fetcher,
    { refreshInterval: autoRefresh ? 30000 : 0 }
  );

  // Fetch summary data
  const { data: summary } = useSWR<FinanceiroSummary>('/api/cepalab/financeiro/summary', fetcher);

  useEffect(() => {
    mutateContas();
  }, [filters, mutateContas]);

  const handleExport = (format: 'csv' | 'json' | 'pdf' | 'excel', type: 'contas' | 'caixa') => {
    let exportData;
    
    if (type === 'contas' && contasReceber) {
      exportData = {
        title: 'Relatório de Contas a Receber',
        headers: [
          'Número Documento',
          'Cliente',
          'Valor Original',
          'Valor Recebido',
          'Valor Saldo',
          'Data Emissão',
          'Data Vencimento',
          'Data Recebimento',
          'Status',
          'Dias Atraso',
          'Forma Pagamento'
        ],
        data: contasReceber.map(conta => [
          conta.numero_documento,
          conta.cliente_nome,
          conta.valor_original,
          conta.valor_recebido,
          conta.valor_saldo,
          new Date(conta.data_emissao).toLocaleDateString('pt-BR'),
          new Date(conta.data_vencimento).toLocaleDateString('pt-BR'),
          conta.data_recebimento ? new Date(conta.data_recebimento).toLocaleDateString('pt-BR') : '',
          conta.status,
          conta.dias_atraso,
          conta.forma_pagamento
        ]),
        metadata: {
          generatedAt: new Date().toISOString(),
          filters: filters,
          totalRecords: contasReceber.length
        }
      };
    } else if (type === 'caixa' && caixaData) {
      exportData = {
        title: 'Relatório de Caixa',
        headers: [
          'Data Movimento',
          'Saldo Inicial',
          'Total Entradas',
          'Total Saídas',
          'Saldo Final',
          'Status',
          'Usuário'
        ],
        data: caixaData.map(caixa => [
          new Date(caixa.data_movimento).toLocaleDateString('pt-BR'),
          caixa.saldo_inicial,
          caixa.total_entradas,
          caixa.total_saidas,
          caixa.saldo_final,
          caixa.status,
          caixa.usuario
        ]),
        metadata: {
          generatedAt: new Date().toISOString(),
          totalRecords: caixaData.length
        }
      };
    }

    if (exportData) {
      DataExporter.export(exportData, format, 'financeiro_report');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'quitado':
        return 'success';
      case 'aberto':
        return 'info';
      case 'parcial':
        return 'warning';
      case 'atrasado':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'quitado':
        return <TrendingUp className="w-4 h-4 text-success" />;
      case 'atrasado':
        return <AlertCircle className="w-4 h-4 text-danger" />;
      case 'parcial':
        return <TrendingDown className="w-4 h-4 text-warning" />;
      default:
        return <DollarSign className="w-4 h-4 text-info" />;
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
            Gestão Financeira
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Controle de contas a receber, caixa e análises financeiras detalhadas
          </p>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AnimatedCard
            icon={<DollarSign className="w-6 h-6" />}
            title="Total a Receber"
            value={`R$ ${(summary?.total_receber || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            subtitle="títulos em aberto"
            change={{ value: 8.5, trend: 'up' }}
            variant="info"
            loading={!summary}
          >
            <div className="text-sm text-gray-600 dark:text-gray-400">Valores pendentes a receber</div>
          </AnimatedCard>
          <AnimatedCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Total Recebido"
            value={`R$ ${(summary?.total_recebido || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            subtitle="no período"
            change={{ value: 12.3, trend: 'up' }}
            variant="success"
            loading={!summary}
          >
            <div className="text-sm text-gray-600 dark:text-gray-400">Recebimentos consolidados</div>
          </AnimatedCard>
          <AnimatedCard
            icon={<AlertCircle className="w-6 h-6" />}
            title="Contas Atrasadas"
            value={summary?.contas_atrasadas || 0}
            subtitle="títulos vencidos"
            change={{ value: -15.2, trend: 'down' }}
            variant="danger"
            loading={!summary}
            glow={summary?.contas_atrasadas > 0}
          >
            <div className="text-sm text-gray-600 dark:text-gray-400">Atenção imediata necessária</div>
          </AnimatedCard>
          <AnimatedCard
            icon={<Calendar className="w-6 h-6" />}
            title="Saldo em Caixa"
            value={`R$ ${(summary?.total_saldo_caixa || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            subtitle="saldo consolidado"
            change={{ value: 5.7, trend: 'up' }}
            variant="info"
            loading={!summary}
          >
            <div className="text-sm text-gray-600 dark:text-gray-400">Liquidez disponível</div>
          </AnimatedCard>
        </div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 mb-6"
        >
          <div className="border-b border-slate-200 dark:border-slate-700">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'contas', name: 'Contas a Receber', icon: DollarSign },
                { id: 'caixa', name: 'Situação do Caixa', icon: Calendar },
                { id: 'analise', name: 'Análise Financeira', icon: TrendingUp }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Controls */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
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
                  onClick={() => {
                    if (activeTab === 'contas') mutateContas();
                    if (activeTab === 'caixa') mutateCaixa();
                  }}
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
                  onClick={() => handleExport('csv', activeTab as any)}
                  className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  CSV
                </button>
                <button
                  onClick={() => handleExport('excel', activeTab as any)}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  Excel
                </button>
                <button
                  onClick={() => handleExport('pdf', activeTab as any)}
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Período
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="date"
                          className="flex-1 rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-700"
                          onChange={(e) => setFilters(prev => ({ ...prev, dataInicio: e.target.value }))}
                        />
                        <input
                          type="date"
                          className="flex-1 rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-700"
                          onChange={(e) => setFilters(prev => ({ ...prev, dataFim: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Status
                      </label>
                      <select
                        className="w-full rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-700"
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                      >
                        <option value="">Todos</option>
                        <option value="aberto">Aberto</option>
                        <option value="quitado">Quitado</option>
                        <option value="atrasado">Atrasado</option>
                        <option value="parcial">Parcial</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Cliente
                      </label>
                      <input
                        type="text"
                        placeholder="Nome do cliente"
                        className="w-full rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-700"
                        onChange={(e) => setFilters(prev => ({ ...prev, cliente: e.target.value }))}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'contas' && (
              <div>
                {contasError && (
                  <div className="text-center text-red-600 dark:text-red-400 py-8">
                    Erro ao carregar contas: {contasError.message}
                  </div>
                )}

                {!contasReceber && !contasError && (
                  <div className="text-center text-slate-500 dark:text-slate-400 py-8">
                    Carregando contas...
                  </div>
                )}

                {contasReceber && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                      <thead className="bg-slate-50 dark:bg-slate-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                            Documento
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                            Cliente
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                            Valor Original
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                            Saldo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                            Vencimento
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                            Atraso
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                        {contasReceber.map((conta, index) => (
                          <motion.tr
                            key={conta.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                              {conta.numero_documento}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                              {conta.cliente_nome}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                              R$ {conta.valor_original.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                              R$ {conta.valor_saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                              {new Date(conta.data_vencimento).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(conta.status)}
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  conta.status === 'quitado' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                                  conta.status === 'aberto' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' :
                                  conta.status === 'atrasado' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' :
                                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                                }`}>
                                  {conta.status}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                              {conta.dias_atraso > 0 ? `${conta.dias_atraso} dias` : '-'}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'caixa' && (
              <div>
                {caixaError && (
                  <div className="text-center text-red-600 dark:text-red-400 py-8">
                    Erro ao carregar dados do caixa: {caixaError.message}
                  </div>
                )}

                {!caixaData && !caixaError && (
                  <div className="text-center text-slate-500 dark:text-slate-400 py-8">
                    Carregando dados do caixa...
                  </div>
                )}

                {caixaData && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                      <thead className="bg-slate-50 dark:bg-slate-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                            Data
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                            Saldo Inicial
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                            Entradas
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                            Saídas
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                            Saldo Final
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                            Usuário
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                        {caixaData.map((caixa, index) => (
                          <motion.tr
                            key={caixa.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                              {new Date(caixa.data_movimento).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                              R$ {caixa.saldo_inicial.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-success">
                              R$ {caixa.total_entradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-danger">
                              R$ {caixa.total_saidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                              R$ {caixa.saldo_final.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                caixa.status === 'aberto' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                                'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-100'
                              }`}>
                                {caixa.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                              {caixa.usuario}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'analise' && (
              <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  Análise Financeira
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  Em breve: gráficos interativos e análises detalhadas do fluxo de caixa
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                    <div className="text-2xl font-bold text-primary-600 mb-2">
                      {summary?.contas_aberto || 0}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      Contas em Aberto
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                    <div className="text-2xl font-bold text-success-600 mb-2">
                      {summary?.contas_quitadas || 0}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      Contas Quitadas
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                    <div className="text-2xl font-bold text-danger-600 mb-2">
                      {summary?.contas_atrasadas || 0}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      Contas Atrasadas
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
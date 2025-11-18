'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Filter, X, ChevronDown, User, DollarSign, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VendasFilterProps {
  onFilterChange: (filters: VendasFilters) => void;
  initialFilters?: VendasFilters;
}

export interface VendasFilters {
  dateRange: {
    start: string;
    end: string;
  };
  vendedor?: string;
  cliente?: string;
  minValue?: number;
  maxValue?: number;
  status?: 'all' | 'completed' | 'pending' | 'cancelled';
}

export function VendasFilter({ onFilterChange, initialFilters }: VendasFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<VendasFilters>({
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    },
    status: 'all',
    ...initialFilters
  });

  const [vendedores, setVendedores] = useState<string[]>([]);
  const [clientes, setClientes] = useState<string[]>([]);

  useEffect(() => {
    // Fetch distinct vendedores and clientes from API
    fetchVendedores();
    fetchClientes();
  }, []);

  const fetchVendedores = async () => {
    try {
      const response = await fetch('/api/cepalab/sales');
      const data = await response.json();
      const uniqueVendedores = [...new Set(data.bySeller?.map((item: any) => String(item.vendedor)) || [])];
      setVendedores(uniqueVendedores as string[]);
    } catch (error) {
      console.error('Error fetching vendedores:', error);
    }
  };

  const fetchClientes = async () => {
    try {
      const response = await fetch('/api/cepalab/sales');
      const data = await response.json();
      const uniqueClientes = [...new Set(data.topClients?.map((item: any) => String(item.cliente)) || [])];
      setClientes((uniqueClientes as string[]).slice(0, 20)); // Limit to top 20
    } catch (error) {
      console.error('Error fetching clientes:', error);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDateRangeChange = (type: 'start' | 'end', value: string) => {
    const newDateRange = { ...filters.dateRange, [type]: value };
    handleFilterChange('dateRange', newDateRange);
  };

  const clearFilters = () => {
    const clearedFilters = {
      dateRange: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
      },
      status: 'all' as const
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'dateRange') return false; // Don't count default date range
    if (key === 'status') return value !== 'all';
    return value !== undefined && value !== '';
  }).length;

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200",
          "bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300",
          "shadow-sm hover:shadow-md"
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Filter className="w-4 h-4" />
        <span className="font-medium">Filtros</span>
        {activeFilterCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-primary text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center"
          >
            {activeFilterCount}
          </motion.span>
        )}
        <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-20 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full left-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Filtros de Vendas</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Date Range */}
                <div className="mb-6">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                    <Calendar className="w-4 h-4" />
                    Período
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Data Inicial</label>
                      <input
                        type="date"
                        value={filters.dateRange.start}
                        onChange={(e) => handleDateRangeChange('start', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Data Final</label>
                      <input
                        type="date"
                        value={filters.dateRange.end}
                        onChange={(e) => handleDateRangeChange('end', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Vendedor Filter */}
                <div className="mb-6">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                    <User className="w-4 h-4" />
                    Vendedor
                  </label>
                  <select
                    value={filters.vendedor || ''}
                    onChange={(e) => handleFilterChange('vendedor', e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value="">Todos os vendedores</option>
                    {vendedores.map((vendedor) => (
                      <option key={vendedor} value={vendedor}>
                        {vendedor}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cliente Filter */}
                <div className="mb-6">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                    <TrendingUp className="w-4 h-4" />
                    Cliente
                  </label>
                  <select
                    value={filters.cliente || ''}
                    onChange={(e) => handleFilterChange('cliente', e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value="">Todos os clientes</option>
                    {clientes.map((cliente) => (
                      <option key={cliente} value={cliente}>
                        {cliente}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Value Range */}
                <div className="mb-6">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                    <DollarSign className="w-4 h-4" />
                    Valor da Venda
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Mínimo</label>
                      <input
                        type="number"
                        placeholder="0,00"
                        value={filters.minValue || ''}
                        onChange={(e) => handleFilterChange('minValue', e.target.value ? parseFloat(e.target.value) : undefined)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Máximo</label>
                      <input
                        type="number"
                        placeholder="999999,99"
                        value={filters.maxValue || ''}
                        onChange={(e) => handleFilterChange('maxValue', e.target.value ? parseFloat(e.target.value) : undefined)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Status Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Status</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'all', label: 'Todos' },
                      { value: 'completed', label: 'Concluído' },
                      { value: 'pending', label: 'Pendente' },
                      { value: 'cancelled', label: 'Cancelado' }
                    ].map((option) => (
                      <motion.button
                        key={option.value}
                        onClick={() => handleFilterChange('status', option.value)}
                        className={cn(
                          "px-3 py-2 rounded-lg border text-sm font-medium transition-all",
                          filters.status === option.value
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                        )}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {option.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <motion.button
                    onClick={clearFilters}
                    className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Limpar
                  </motion.button>
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Aplicar
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
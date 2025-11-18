'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Filter, X, ChevronDown, AlertTriangle, TrendingDown, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EstoqueFilterProps {
  onFilterChange: (filters: EstoqueFilters) => void;
  initialFilters?: EstoqueFilters;
}

export interface EstoqueFilters {
  categoria?: string;
  fornecedor?: string;
  localizacao?: string;
  minQuantity?: number;
  maxQuantity?: number;
  minValue?: number;
  maxValue?: number;
  status?: 'all' | 'low-stock' | 'out-of-stock' | 'overstock';
  sortBy?: 'name' | 'quantity' | 'value' | 'category';
  sortOrder?: 'asc' | 'desc';
}

export function EstoqueFilter({ onFilterChange, initialFilters }: EstoqueFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<EstoqueFilters>({
    status: 'all',
    sortBy: 'name',
    sortOrder: 'asc',
    ...initialFilters
  });

  const [categorias, setCategorias] = useState<string[]>([]);
  const [fornecedores, setFornecedores] = useState<string[]>([]);
  const [localizacoes, setLocalizacoes] = useState<string[]>([]);

  useEffect(() => {
    // Fetch distinct categories, suppliers, and locations from API
    fetchCategorias();
    fetchFornecedores();
    fetchLocalizacoes();
  }, []);

  const fetchCategorias = async () => {
    try {
      const response = await fetch('/api/cepalab/stock');
      const data = await response.json();
      const uniqueCategorias = [...new Set(data.products?.map((item: any) => String(item.categoria)) || [])];
      setCategorias(uniqueCategorias.filter(Boolean) as string[]);
    } catch (error) {
      console.error('Error fetching categorias:', error);
    }
  };

  const fetchFornecedores = async () => {
    try {
      const response = await fetch('/api/cepalab/stock');
      const data = await response.json();
      const uniqueFornecedores = [...new Set(data.products?.map((item: any) => String(item.fornecedor)) || [])];
      setFornecedores(uniqueFornecedores.filter(Boolean) as string[]);
    } catch (error) {
      console.error('Error fetching fornecedores:', error);
    }
  };

  const fetchLocalizacoes = async () => {
    try {
      const response = await fetch('/api/cepalab/stock');
      const data = await response.json();
      const uniqueLocalizacoes = [...new Set(data.products?.map((item: any) => String(item.localizacao)) || [])];
      setLocalizacoes(uniqueLocalizacoes.filter(Boolean) as string[]);
    } catch (error) {
      console.error('Error fetching localizacoes:', error);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      status: 'all' as const,
      sortBy: 'name' as const,
      sortOrder: 'asc' as const
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'sortBy' || key === 'sortOrder') return false;
    if (key === 'status') return value !== 'all';
    return value !== undefined && value !== '';
  }).length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'low-stock':
        return <TrendingDown className="w-4 h-4 text-warning" />;
      case 'out-of-stock':
        return <AlertTriangle className="w-4 h-4 text-danger" />;
      case 'overstock':
        return <Layers className="w-4 h-4 text-info" />;
      default:
        return <Package className="w-4 h-4 text-gray-500" />;
    }
  };

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
                  <h3 className="text-lg font-semibold text-gray-900">Filtros de Estoque</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Status Filter */}
                <div className="mb-6">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                    <Package className="w-4 h-4" />
                    Situação do Estoque
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'all', label: 'Todos', icon: <Package className="w-4 h-4" /> },
                      { value: 'low-stock', label: 'Baixo', icon: <TrendingDown className="w-4 h-4 text-warning" /> },
                      { value: 'out-of-stock', label: 'Zerado', icon: <AlertTriangle className="w-4 h-4 text-danger" /> },
                      { value: 'overstock', label: 'Excesso', icon: <Layers className="w-4 h-4 text-info" /> }
                    ].map((option) => (
                      <motion.button
                        key={option.value}
                        onClick={() => handleFilterChange('status', option.value)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all",
                          filters.status === option.value
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                        )}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {option.icon}
                        {option.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Categoria</label>
                  <select
                    value={filters.categoria || ''}
                    onChange={(e) => handleFilterChange('categoria', e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value="">Todas as categorias</option>
                    {categorias.map((categoria) => (
                      <option key={categoria} value={categoria}>
                        {categoria}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Supplier Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Fornecedor</label>
                  <select
                    value={filters.fornecedor || ''}
                    onChange={(e) => handleFilterChange('fornecedor', e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value="">Todos os fornecedores</option>
                    {fornecedores.map((fornecedor) => (
                      <option key={fornecedor} value={fornecedor}>
                        {fornecedor}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Localização</label>
                  <select
                    value={filters.localizacao || ''}
                    onChange={(e) => handleFilterChange('localizacao', e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value="">Todas as localizações</option>
                    {localizacoes.map((localizacao) => (
                      <option key={localizacao} value={localizacao}>
                        {localizacao}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Quantidade em Estoque</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Mínima</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={filters.minQuantity || ''}
                        onChange={(e) => handleFilterChange('minQuantity', e.target.value ? parseFloat(e.target.value) : undefined)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Máxima</label>
                      <input
                        type="number"
                        placeholder="999999"
                        value={filters.maxQuantity || ''}
                        onChange={(e) => handleFilterChange('maxQuantity', e.target.value ? parseFloat(e.target.value) : undefined)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Value Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Valor Total em Estoque</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Mínimo</label>
                      <input
                        type="number"
                        placeholder="0,00"
                        step="0.01"
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
                        step="0.01"
                        value={filters.maxValue || ''}
                        onChange={(e) => handleFilterChange('maxValue', e.target.value ? parseFloat(e.target.value) : undefined)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Sort Options */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Ordenar por</label>
                  <div className="flex gap-2">
                    <select
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                      <option value="name">Nome</option>
                      <option value="quantity">Quantidade</option>
                      <option value="value">Valor</option>
                      <option value="category">Categoria</option>
                    </select>
                    <motion.button
                      onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                      className={cn(
                        "px-3 py-2 border border-gray-200 rounded-lg transition-all",
                        "hover:bg-gray-50 focus:ring-2 focus:ring-primary focus:border-transparent"
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      title={filters.sortOrder === 'asc' ? 'Ordem Crescente' : 'Ordem Decrescente'}
                    >
                      <motion.div
                        animate={{ rotate: filters.sortOrder === 'desc' ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        ↓
                      </motion.div>
                    </motion.button>
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
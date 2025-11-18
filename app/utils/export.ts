export class DataExporter {
  static export(data: any[], format: 'csv' | 'json' | 'pdf' | 'excel', filename: string) {
    switch (format) {
      case 'csv':
        ExportUtil.toCSV(data, filename);
        break;
      case 'json':
        ExportUtil.toJSON(data, filename);
        break;
      case 'pdf':
        ExportUtil.toPDF(data, filename);
        break;
      case 'excel':
        ExportUtil.toExcel(data, filename);
        break;
      default:
        ExportUtil.toCSV(data, filename);
    }
  }

  static exportData(data: any, options: { format: string; filename: string }) {
    this.export(data, options.format as any, options.filename.replace(/\.[^/.]+$/, ""));
  }

  static prepareSalesData(sales: any, dateRange: any) {
    return sales?.monthlyData?.map((item: any) => ({
      Mês: item.month,
      Vendas: item.sales,
      Pedidos: item.orders,
      Ticket_Médio: item.avgTicket
    })) || [];
  }

  static prepareStockData(stock: any) {
    return stock?.summary ? [
      { Categoria: 'Total Disponível', Valor: stock.summary.total_disponivel },
      { Categoria: 'Produtos', Valor: stock.summary.produtos },
      { Categoria: 'Valor Total', Valor: stock.summary.valor_total }
    ] : [];
  }

  static prepareFinancialData(financial: any) {
    return financial?.overdue ? [
      { Tipo: 'Contas Vencidas', Valor: financial.overdue.total, Quantidade: financial.overdue.qtd },
      { Tipo: 'Contas a Pagar', Valor: financial.payable?.total || 0, Quantidade: financial.payable?.qtd || 0 },
      { Tipo: 'Contas a Receber', Valor: financial.receivable?.total || 0, Quantidade: financial.receivable?.qtd || 0 }
    ] : [];
  }
}

export class ExportUtil {
  static toCSV(data: any[], filename: string) {
    if (!data || data.length === 0) return;
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    const csv = [headers, ...rows].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  static toJSON(data: any[], filename: string) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  static toPDF(data: any[], filename: string) {
    // Basic PDF export implementation
    console.warn('PDF export not implemented yet, falling back to CSV');
    this.toCSV(data, filename);
  }

  static toExcel(data: any[], filename: string) {
    // Basic Excel export implementation
    console.warn('Excel export not implemented yet, falling back to CSV');
    this.toCSV(data, filename);
  }
}
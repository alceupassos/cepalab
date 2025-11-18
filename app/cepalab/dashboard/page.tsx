"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { AIReport } from "@/components/AIReport";

export default function CepalabDashboard() {
  const [sales, setSales] = useState<any>(null);
  const [stock, setStock] = useState<any>(null);
  const [financial, setFinancial] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    (async () => {
      const s = await fetch("/api/cepalab/sales");
      const sj = await s.json();
      setSales(sj);
      const st = await fetch("/api/cepalab/stock");
      const stj = await st.json();
      setStock(stj);
      const f = await fetch("/api/cepalab/financial");
      const fj = await f.json();
      setFinancial(fj);
    })();
  }, []);

  async function runAI() {
    setLoadingAI(true);
    try {
      const res = await fetch("/api/cepalab/analyze", { method: "POST" });
      const j = await res.json();
      setAnalysis(j);
    } finally {
      setLoadingAI(false);
    }
  }

  const monthlyData = (sales?.monthly || []).map((m: any) => ({
    label: `${String(m.mes).padStart(2, "0")}/${m.ano}`,
    vendas: Number(m.valor_total || 0),
    pedidos: Number(m.total_vendas || 0)
  })).reverse();

  const receivablesStatus = (financial?.receivables || []).reduce((acc: Record<string, number>, r: any) => {
    const key = r.Sit_nome || "N/A";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const receivablesPie = Object.entries(receivablesStatus).map(([name, value]) => ({ name, value }));
  const pieColors = ["#10b981", "#f59e0b", "#ef4444", "#6366f1", "#6b7280"]; 

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold glow-orange">Dashboard CEPALAB</h2>
        <button onClick={runAI} className="px-3 py-2 text-sm rounded-lg transition-colors bg-primary text-primary-foreground glow-border hover:bg-[#ff8a1f]">
          Analisar com IA
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="neu-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium glow-orange">Vendas Totais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold glow-orange">R$ {Number(sales?.totalSales || 0).toLocaleString("pt-BR")}</div>
            <div className="text-xs text-muted-foreground">{Number(sales?.totalOrders || 0)} pedidos</div>
          </CardContent>
        </Card>
        <Card className="neu-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium glow-orange">Estoque Disponível</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold glow-orange">{Number(stock?.summary?.total_disponivel || 0).toLocaleString("pt-BR")}</div>
            <div className="text-xs text-muted-foreground">{Number(stock?.summary?.produtos || 0)} produtos</div>
          </CardContent>
        </Card>
        <Card className="neu-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium glow-orange">Contas Vencidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold glow-orange">R$ {Number(financial?.overdue?.total || 0).toLocaleString("pt-BR")}</div>
            <div className="text-xs text-muted-foreground">{Number(financial?.overdue?.qtd || 0)} títulos</div>
          </CardContent>
        </Card>
        <Card className="neu-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium glow-orange">Estoque Negativo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold glow-orange">{Number(stock?.negatives?.length || 0)}</div>
            <div className="text-xs text-muted-foreground">produtos com falta</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">Vendas por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="vendas" stroke="#3b82f6" />
                <Line type="monotone" dataKey="pedidos" stroke="#10b981" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">Contas por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={receivablesPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                  {receivablesPie.map((entry: any, index: number) => (
                    <Cell key={index} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={(sales?.topClients || []).map((c: any) => ({ name: c.nome_cliente, valor: Number(c.valor_total || 0) }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" hide />
                <YAxis />
                <Tooltip />
                <Bar dataKey="valor" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Caixas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(financial?.cashboxes || []).map((c: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium">{c.nome}</div>
                    <div className="text-xs text-gray-500">{c.situacao}</div>
                  </div>
                  <Badge className={Number(c.saldo_atual_total) < 0 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                    R$ {Number(c.saldo_atual_total || 0).toLocaleString("pt-BR")}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <AIReport
          aiSummary={analysis?.aiSummary || ""}
          analysis={analysis?.analysis || null}
          vulns={analysis?.vulns || null}
          kpis={analysis?.kpis || null}
          securityMetrics={analysis?.securityMetrics || null}
          performanceMetrics={analysis?.performanceMetrics || null}
          onRegenerate={runAI}
          isLoading={loadingAI}
        />
      </div>
    </div>
  );
}
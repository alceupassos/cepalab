import { NextResponse } from "next/server";
import sql from "mssql";
import { readMdCreds } from "@/lib/mdCreds";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function envCreds() {
  const server = process.env.MSSQL_SERVER;
  const port = process.env.MSSQL_PORT ? Number(process.env.MSSQL_PORT) : undefined;
  const database = process.env.MSSQL_DATABASE;
  const user = process.env.MSSQL_USER;
  const password = process.env.MSSQL_PASSWORD;
  if (server && port && database && user && password) {
    return { server, port, database, user, password };
  }
  const md = readMdCreds();
  if (md) return md;
  return null;
}

export async function GET() {
  try {
    const creds = envCreds();
    if (!creds) return NextResponse.json({ error: "Credenciais MSSQL não configuradas" }, { status: 400 });
    const config: sql.config = {
      server: creds.server,
      port: Number(creds.port),
      user: creds.user,
      password: (creds as any).password,
      database: creds.database,
      options: { encrypt: false, trustServerCertificate: true },
      connectionTimeout: 15000,
      requestTimeout: 20000,
      pool: { max: 5, min: 0, idleTimeoutMillis: 30000 }
    };
    const pool = await sql.connect(config);

    const totals = await pool.request().query(
      `SELECT COUNT(*) AS total_vendas, SUM(valor_total) AS valor_total FROM v_venda WITH (NOLOCK)`
    );

    const monthly = await pool.request().query(
      `SELECT YEAR(data) AS ano, MONTH(data) AS mes, COUNT(*) AS total_vendas, SUM(valor_total) AS valor_total
       FROM v_venda WITH (NOLOCK)
       WHERE data >= DATEADD(MONTH, -12, GETDATE())
       GROUP BY YEAR(data), MONTH(data)
       ORDER BY ano DESC, mes DESC`
    );

    const topClients = await pool.request().query(
      `SELECT TOP 10 codigo_cliente, nome_cliente, COUNT(*) AS total_compras, SUM(valor_total) AS valor_total
       FROM v_venda WITH (NOLOCK)
       GROUP BY codigo_cliente, nome_cliente
       ORDER BY valor_total DESC`
    );

    const bySeller = await pool.request().query(
      `SELECT nome_vendedor, COUNT(*) AS total_vendas, SUM(valor_total) AS valor_total
       FROM v_venda WITH (NOLOCK)
       GROUP BY nome_vendedor
       ORDER BY valor_total DESC`
    );

    await pool.close();

    return NextResponse.json({
      totalSales: Number(totals.recordset?.[0]?.valor_total || 0),
      totalOrders: Number(totals.recordset?.[0]?.total_vendas || 0),
      monthly: monthly.recordset,
      topClients: topClients.recordset,
      bySeller: bySeller.recordset
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? String(e) }, { status: 500 });
  }
}
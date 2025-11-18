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

    const summary = await pool.request().query(
      `SELECT COUNT(*) AS produtos,
              SUM(qtd_fisica) AS total_fisico,
              SUM(qtd_reservada) AS total_reservado,
              SUM(qtd_disponivel) AS total_disponivel
       FROM v_estoque WITH (NOLOCK)`
    );

    const negatives = await pool.request().query(
      `SELECT TOP 50 prod_codigo, qtd_fisica, qtd_reservada, qtd_disponivel
       FROM v_estoque WITH (NOLOCK)
       WHERE qtd_disponivel < 0
       ORDER BY qtd_disponivel ASC`
    );

    const byProduct = await pool.request().query(
      `SELECT TOP 50 prod_codigo, qtd_fisica, qtd_reservada, qtd_disponivel
       FROM v_estoque WITH (NOLOCK)
       ORDER BY qtd_disponivel DESC`
    );

    await pool.close();

    return NextResponse.json({
      summary: summary.recordset?.[0] || {},
      negatives: negatives.recordset,
      byProduct: byProduct.recordset
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? String(e) }, { status: 500 });
  }
}
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

    const receivables = await pool.request().query(
      `SELECT cod_cliente, clif_nome, valor, data_vencimento,
              DATEDIFF(DAY, data_vencimento, GETDATE()) AS dias_atraso,
              Sit_nome
       FROM v_conta_receber WITH (NOLOCK)`
    );

    const overdue = await pool.request().query(
      `SELECT COUNT(*) AS qtd, SUM(valor) AS total
       FROM v_conta_receber WITH (NOLOCK)
       WHERE data_vencimento < GETDATE()`
    );

    const cashboxes = await pool.request().query(
      `SELECT nome, situacao, data_abertura, saldo_inicial_total, saldo_atual_total
       FROM v_situacao_caixa WITH (NOLOCK)`
    );

    await pool.close();

    return NextResponse.json({
      receivables: receivables.recordset,
      overdue: overdue.recordset?.[0] || {},
      cashboxes: cashboxes.recordset
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? String(e) }, { status: 500 });
  }
}
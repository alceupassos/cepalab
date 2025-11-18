import { NextResponse } from "next/server";
import { inspectSqlServer } from "@/lib/sqlInspector";
import { computeVulnerabilityMetrics, computeStructuralKpis } from "@/lib/metrics";
import { describeSchemaWithAI } from "@/lib/ai";
import { inspectSecurity } from "@/lib/securityInspector";
import { inspectPerformance } from "@/lib/performanceInspector";
import sql from "mssql";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const server = process.env.MSSQL_SERVER;
    const port = process.env.MSSQL_PORT ? Number(process.env.MSSQL_PORT) : undefined;
    const user = process.env.MSSQL_USER;
    const password = process.env.MSSQL_PASSWORD;
    const database = process.env.MSSQL_DATABASE;
    if (!server || !port || !user || !password || !database) {
      return NextResponse.json({ error: "MSSQL não configurado" }, { status: 400 });
    }

    const analysis = await inspectSqlServer({ server, port, user, password, database });
    const vulns = computeVulnerabilityMetrics(analysis);
    const kpis = computeStructuralKpis(analysis);

    const config: sql.config = {
      server,
      port,
      user,
      password,
      database,
      options: { encrypt: false, trustServerCertificate: true },
      connectionTimeout: 15000,
      requestTimeout: 15000,
      pool: { max: 5, min: 0, idleTimeoutMillis: 30000 }
    };
    const pool = await sql.connect(config);

    let securityAnalysis: any = {
      securityMetrics: {
        sensitiveDataScore: 0,
        userAccessScore: 0,
        securityConfigurationScore: 0,
        encryptionScore: 0,
        overallSecurityScore: 0,
        totalSensitiveColumns: 0,
        highRiskUsers: 0,
        dangerousFeaturesEnabled: 0
      },
      sensitiveData: [],
      userPermissions: [],
      auditConfig: null
    };
    try {
      securityAnalysis = await inspectSecurity(pool, database);
    } catch {}

    let performanceAnalysis: any = {
      performanceMetrics: {
        indexEfficiency: 0,
        queryPerformanceScore: 0,
        fragmentationScore: 0,
        memoryUsageScore: 0,
        overallPerformanceScore: 0,
        missingIndexes: 0,
        unusedIndexes: 0,
        fragmentedIndexes: 0,
        slowQueries: 0,
        avgQueryTime: 0,
        maxQueryTime: 0,
        totalQueries: 0
      },
      indexAnalysis: [],
      queryPerformance: [],
      recommendations: []
    };
    try {
      performanceAnalysis = await inspectPerformance(pool);
    } catch {}

    await pool.close();

    const aiSummary = await describeSchemaWithAI({
      analysis,
      vulns,
      kpis,
      securityMetrics: securityAnalysis.securityMetrics,
      performanceMetrics: performanceAnalysis.performanceMetrics
    } as any);

    return NextResponse.json({
      analysis,
      vulns,
      kpis,
      securityMetrics: securityAnalysis.securityMetrics,
      sensitiveData: securityAnalysis.sensitiveData,
      userPermissions: securityAnalysis.userPermissions,
      auditConfig: securityAnalysis.auditConfig,
      performanceMetrics: performanceAnalysis.performanceMetrics,
      indexAnalysis: performanceAnalysis.indexAnalysis,
      queryPerformance: performanceAnalysis.queryPerformance,
      recommendations: performanceAnalysis.recommendations,
      aiSummary
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
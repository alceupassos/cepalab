exports.id=3473,exports.ids=[3473],exports.modules={87529:()=>{},26729:(e,t,a)=>{"use strict";async function s(e){if(!process.env.OPENAI_API_KEY)return"API key da OpenAI (OPENAI_API_KEY) n\xe3o configurada. Configure para habilitar a an\xe1lise generativa de vulnerabilidades e oportunidades.";let{analysis:t,vulns:a,kpis:s}=e,i=Number(s?.avgColumnsPerTable??0).toFixed(2),n=Number(s?.avgRowCount??0).toFixed(2),r=Number(s?.maxRowCount??0),o=Number(s?.fkPerTableAvg??0).toFixed(2),c=`
Voc\xea \xe9 um arquiteto de dados e especialista em seguran\xe7a para ERPs de sa\xfade e gest\xe3o, usando SQL Server.
Voc\xea recebeu uma radiografia de um banco de dados do ERP ULTRA, com tabelas, finalidades heur\xedsticas, m\xe9tricas estruturais e indicadores de vulnerabilidade.

Sua miss\xe3o:
1. Descrever, em portugu\xeas t\xe9cnico mas claro, como parece ser a arquitetura l\xf3gica deste ERP (m\xf3dulos, relacionamentos impl\xedcitos).
2. Apontar vulnerabilidades potenciais do ponto de vista de modelagem de dados, seguran\xe7a, LGPD e governan\xe7a (com foco em chaves prim\xe1rias ausentes, aus\xeancia de FKs, colunas sens\xedveis etc.).
3. Propor KPIs de sa\xfade do banco (data health KPIs) e o que cada um significa para o CFO, para o Diretor M\xe9dico (se aplic\xe1vel) e para o time de TI.
4. Sugerir oportunidades de uso de IA (como or\xe1culos de gest\xe3o, alertas, fluxos autom\xe1ticos) baseadas nessa fotografia.
5. Descrever como voc\xea desenharia um painel de vulnerabilidades: se\xe7\xf5es, gr\xe1ficos, fluxogramas e narrativa.

Dados do banco:
- Servidor: ${t.server}:${t.port}
- Database: ${t.database}
- Total de tabelas: ${t.tables.length}

M\xe9tricas estruturais:
- M\xe9dia de colunas por tabela: ${i}
- M\xe9dia de linhas por tabela: ${n}
- M\xe1ximo de linhas em uma tabela: ${r}
- FKs por tabela (m\xe9dia): ${o}

M\xe9tricas de vulnerabilidade (heur\xedsticas):
- Propor\xe7\xe3o de tabelas sem chave prim\xe1ria definida: ${(100*a.missingPrimaryKeyRatio).toFixed(1)}%
- Propor\xe7\xe3o de tabelas sem nenhuma foreign key: ${(100*a.tablesWithoutForeignKeysRatio).toFixed(1)}%
- Colunas com cara de identificador pessoal (CPF/CNPJ/email/etc.) que s\xe3o nulas: \xedndice ${(100*a.nullableKeyLikeColumnsRatio).toFixed(1)}% relativo ao n\xfamero de tabelas
- Quantidade de colunas potencialmente sens\xedveis (senha/token/documentos/dados de sa\xfade): ${a.potentialSensitiveColumns}

Algumas tabelas mapeadas:
${t.tables.slice(0,40).map(e=>`- ${e.schema}.${e.name} | finalidade: ${e.purpose} | linhas: ${e.rowCount} | PK: ${e.primaryKey.length?e.primaryKey.join(","):"N/A"} | FKs: ${e.foreignKeys.length}`).join("\n")}

Agora fa\xe7a uma an\xe1lise profunda e criativa, como se estivesse preparando um relat\xf3rio executivo e t\xe9cnico ao mesmo tempo, incluindo se\xe7\xf5es, bullet points, e sugest\xf5es de fluxos/diagramas que poderiam virar gr\xe1ficos no front-end.
`,d=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{Authorization:`Bearer ${process.env.OPENAI_API_KEY}`,"Content-Type":"application/json"},body:JSON.stringify({model:"gpt-5.1",input:c})});if(!d.ok)return`Falha ao chamar Angra DB Manager: ${d.status} ${d.statusText}`;let l=await d.json();return l.output?.[0]?.content?.[0]?.text??l.content?.[0]?.text??JSON.stringify(l,null,2)}a.d(t,{J:()=>s})},12936:(e,t,a)=>{"use strict";function s(e){let t=e.tables.length||1,a=e.tables.filter(e=>0===e.primaryKey.length).length,s=e.tables.filter(e=>0===e.foreignKeys.length).length,i=e.tables.flatMap(e=>e.columns.filter(e=>{let t=e.column_name.toLowerCase();return(t.includes("cpf")||t.includes("cnpj")||t.includes("documento")||t.includes("email")||t.includes("telefone")||t.includes("celular")||t.includes("address")||t.includes("endereco"))&&e.is_nullable})),n=e.tables.flatMap(e=>e.columns.filter(e=>{let t=e.column_name.toLowerCase();return t.includes("senha")||t.includes("password")||t.includes("token")||t.includes("cpf")||t.includes("cnpj")||t.includes("cartao")||t.includes("health")||t.includes("saude")||t.includes("hepatite")||t.includes("diagnostico")}));return{missingPrimaryKeyRatio:a/t,tablesWithoutForeignKeysRatio:s/t,nullableKeyLikeColumnsRatio:i.length/(t||1),potentialSensitiveColumns:n.length,totalTables:e.tables.length}}function i(e){let t=e.tables.length||1,a=e.tables.reduce((e,t)=>e+t.columns.length,0);return{avgColumnsPerTable:a/t,avgRowCount:e.tables.reduce((e,t)=>e+t.rowCount,0)/t,maxRowCount:e.tables.reduce((e,t)=>t.rowCount>e?t.rowCount:e,0),fkPerTableAvg:e.tables.reduce((e,t)=>e+t.foreignKeys.length,0)/t}}a.d(t,{Z:()=>s,b:()=>i})},62140:(e,t,a)=>{"use strict";async function s(e){let t=await i(e),a=await n(e),s=await r(e,t,a),o=function(e,t){let a=[],s=e.filter(e=>e.fragmentationPercent>30);s.length>0&&a.push(`Reorganizar ou recriar ${s.length} \xedndices com alta fragmenta\xe7\xe3o (>30%)`);let i=e.filter(e=>"UNUSED"===e.efficiency);i.length>0&&a.push(`Considerar remo\xe7\xe3o de ${i.length} \xedndices n\xe3o utilizados para economizar espa\xe7o`);let n=t.filter(e=>"CRITICAL"===e.performanceClass);n.length>0&&a.push(`Revisar ${n.length} queries cr\xedticas que consomem mais de 5 segundos em m\xe9dia`);let r=t.filter(e=>"SLOW"===e.performanceClass);return r.length>0&&a.push(`Otimizar ${r.length} queries lentas (1-5 segundos)`),(t.length>0?t.reduce((e,t)=>e+t.avgExecutionTime,0)/t.length:0)>1e3&&a.push("Considerar revis\xe3o geral de performance - tempo m\xe9dio de execu\xe7\xe3o elevado"),a}(t,a);return{performanceMetrics:s,indexAnalysis:t,queryPerformance:a,recommendations:o}}async function i(e){return(await e.request().query(`
    SELECT 
      t.name AS table_name,
      i.name AS index_name,
      i.type_desc AS index_type,
      i.is_unique,
      i.is_primary_key,
      ips.avg_fragmentation_in_percent AS fragmentation_percent,
      ips.page_count,
      ius.user_seeks,
      ius.user_scans,
      ius.user_lookups,
      ius.user_updates,
      ius.last_user_seek,
      (ips.page_count * 8.0) / 1024.0 AS size_mb
    FROM sys.tables t
    INNER JOIN sys.indexes i ON t.object_id = i.object_id
    INNER JOIN sys.dm_db_index_physical_stats(DB_ID(), NULL, NULL, NULL, 'DETAILED') ips
      ON i.object_id = ips.object_id AND i.index_id = ips.index_id
    LEFT JOIN sys.dm_db_index_usage_stats ius
      ON i.object_id = ius.object_id AND i.index_id = ius.index_id AND ius.database_id = DB_ID()
    WHERE t.is_ms_shipped = 0
      AND i.type_desc IN ('CLUSTERED', 'NONCLUSTERED')
    ORDER BY ips.avg_fragmentation_in_percent DESC, ius.user_seeks + ius.user_scans + ius.user_lookups DESC
  `)).recordset.map(e=>{var t,a,s,i;let n=(t=(e.user_seeks||0)+(e.user_scans||0)+(e.user_lookups||0),a=e.user_updates||0,s=e.fragmentation_percent||0,e.page_count,0===t?"UNUSED":s>30?"LOW":t>2*a&&s<10?"HIGH":t>a&&s<20?"MEDIUM":"LOW");return{tableName:e.table_name,indexName:e.index_name,indexType:e.index_type,isUnique:e.is_unique,isPrimaryKey:e.is_primary_key,fragmentationPercent:e.fragmentation_percent||0,pageCount:e.page_count||0,userSeeks:e.user_seeks||0,userScans:e.user_scans||0,userLookups:e.user_lookups||0,userUpdates:e.user_updates||0,lastUserSeek:e.last_user_seek,sizeMB:e.size_mb||0,efficiency:n}})}async function n(e){return(await e.request().query(`
    SELECT TOP 50
      st.text AS query_text,
      qs.execution_count,
      qs.avg_elapsed_time / 1000.0 AS avg_execution_time_ms,
      qs.total_elapsed_time / 1000.0 AS total_execution_time_ms,
      qs.avg_worker_time / 1000.0 AS avg_cpu_time_ms,
      qs.avg_logical_reads,
      qs.creation_time,
      qs.last_execution_time,
      CASE 
        WHEN qs.avg_elapsed_time < 100000 THEN 'FAST'
        WHEN qs.avg_elapsed_time < 1000000 THEN 'MEDIUM'
        WHEN qs.avg_elapsed_time < 5000000 THEN 'SLOW'
        ELSE 'CRITICAL'
      END AS performance_class
    FROM sys.dm_exec_query_stats qs
    CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) st
    WHERE st.text IS NOT NULL
      AND st.text NOT LIKE '%sys.%'
    ORDER BY qs.avg_elapsed_time DESC
  `)).recordset.map(e=>({queryText:e.query_text.substring(0,500),executionCount:e.execution_count,avgExecutionTime:e.avg_execution_time_ms,totalExecutionTime:e.total_execution_time_ms,avgCpuTime:e.avg_cpu_time_ms,avgLogicalReads:e.avg_logical_reads,creationTime:e.creation_time,lastExecutionTime:e.last_execution_time,performanceClass:e.performance_class}))}async function r(e,t,a){let s=await o(e),i=t.filter(e=>"UNUSED"===e.efficiency).length,n=t.filter(e=>e.fragmentationPercent>30).length,r=a.filter(e=>"SLOW"===e.performanceClass||"CRITICAL"===e.performanceClass).length,d=a.length,l=d>0?a.reduce((e,t)=>e+t.avgExecutionTime,0)/d:0,u=d>0?Math.max(...a.map(e=>e.avgExecutionTime)):0,_=function(e){if(0===e.length)return 100;let t=e.filter(e=>"HIGH"===e.efficiency).length,a=e.filter(e=>"UNUSED"!==e.efficiency).length;return 0===a?0:Math.round(t/a*100)}(t),m=function(e){if(0===e.length)return 100;let t=e.filter(e=>"FAST"===e.performanceClass).length,a=e.filter(e=>"CRITICAL"===e.performanceClass).length;return Math.max(0,Math.round(t/e.length*100-a/e.length*50))}(a),p=0===t.length?100:Math.max(0,Math.round(100-t.reduce((e,t)=>e+t.fragmentationPercent,0)/t.length)),b=await c(e);return{indexEfficiency:_,queryPerformanceScore:m,fragmentationScore:p,memoryUsageScore:b,overallPerformanceScore:Math.round((_+m+p+b)/4),missingIndexes:s,unusedIndexes:i,fragmentedIndexes:n,slowQueries:r,totalQueries:d,avgQueryTime:Math.round(100*l)/100,maxQueryTime:Math.round(100*u)/100}}async function o(e){let t=await e.request().query(`
    SELECT COUNT(*) AS missing_index_count
    FROM sys.dm_db_missing_index_details mid
    INNER JOIN sys.dm_db_missing_index_groups mig ON mid.index_handle = mig.index_handle
    INNER JOIN sys.dm_db_missing_index_group_stats migs ON mig.index_group_handle = migs.group_handle
  `);return t.recordset[0]?.missing_index_count||0}async function c(e){try{let t=(await e.request().query(`
      SELECT 
        (physical_memory_in_use_kb / 1024.0) AS memory_usage_mb,
        (locked_page_allocations_kb / 1024.0) AS locked_pages_mb,
        (virtual_address_space_committed_kb / 1024.0) AS vas_committed_mb
      FROM sys.dm_os_process_memory
    `)).recordset[0];if(!t)return 50;let a=t.memory_usage_mb||0;if(a<2048)return 100;if(a>8192)return 20;return Math.round(100-(a-2048)/6144*80)}catch(e){return console.error("Erro ao calcular score de mem\xf3ria:",e),50}}a.d(t,{m:()=>s})},95782:(e,t,a)=>{"use strict";async function s(e,t){let a=await i(e),s=await n(e),c=await r(e,t);return{securityMetrics:await o(e,a,s),sensitiveData:a,userPermissions:s,auditConfig:c}}async function i(e){let t=[{pattern:/cpf|cgc|cadastro.*federal/i,type:"CPF",risk:"CRITICAL"},{pattern:/rg|registro.*geral/i,type:"RG",risk:"HIGH"},{pattern:/cnpj|cadastro.*nacional.*pessoa.*jur[ií]dica/i,type:"CNPJ",risk:"CRITICAL"},{pattern:/email|e-mail|mail/i,type:"EMAIL",risk:"MEDIUM"},{pattern:/telefone|celular|fone/i,type:"PHONE",risk:"MEDIUM"},{pattern:/endereco|address|logradouro/i,type:"ADDRESS",risk:"LOW"},{pattern:/cartao|card|credito|debito/i,type:"CARD",risk:"CRITICAL"},{pattern:/banco|agencia|conta.*bancaria/i,type:"BANK_ACCOUNT",risk:"HIGH"},{pattern:/salario|salary|remuneracao/i,type:"SALARY",risk:"HIGH"},{pattern:/paciente|patient|medico|doctor/i,type:"HEALTH",risk:"CRITICAL"},{pattern:/diagnostico|diagnosis|tratamento|treatment/i,type:"MEDICAL",risk:"CRITICAL"},{pattern:/senha|password|pass|pwd/i,type:"PASSWORD",risk:"CRITICAL"},{pattern:/token|api.*key|secret/i,type:"API_KEY",risk:"CRITICAL"}],a=await e.request().query(`
    SELECT 
      t.name AS table_name,
      c.name AS column_name,
      ty.name AS data_type,
      c.max_length,
      c.is_nullable,
      CAST(p.rows AS BIGINT) AS row_count
    FROM sys.tables t
    JOIN sys.columns c ON t.object_id = c.object_id
    JOIN sys.types ty ON c.user_type_id = ty.user_type_id
    JOIN sys.partitions p ON t.object_id = p.object_id AND p.index_id IN (0,1)
    WHERE t.is_ms_shipped = 0
    ORDER BY t.name, c.column_id
  `),s=[];return a.recordset.forEach(e=>{let a=e.column_name,i=e.table_name;t.forEach(t=>{t.pattern.test(a)&&s.push({tableName:i,columnName:a,dataType:e.data_type,sensitiveType:t.type,riskLevel:t.risk,rowCount:e.row_count,isNullable:e.is_nullable,maxLength:e.max_length})})}),s}async function n(e){let t=await e.request().query(`
    SELECT 
      dp.name AS principal_name,
      dp.type_desc AS principal_type,
      perm.permission_name,
      perm.state_desc AS permission_state,
      obj.name AS object_name,
      obj.type_desc AS object_type
    FROM sys.database_permissions perm
    JOIN sys.database_principals dp ON perm.grantee_principal_id = dp.principal_id
    LEFT JOIN sys.objects obj ON perm.major_id = obj.object_id
    WHERE dp.name NOT IN ('public', 'guest')
    ORDER BY dp.name, obj.name, perm.permission_name
  `),a={};return t.recordset.forEach(e=>{let t=e.principal_name;a[t]||(a[t]={userName:t,principalType:e.principal_type,permissions:[],riskScore:0}),a[t].permissions.push({permissionName:e.permission_name,state:e.permission_state,objectName:e.object_name,objectType:e.object_type})}),Object.values(a).forEach(e=>{e.riskScore=e.permissions.reduce((e,t)=>(["CONTROL","ALTER","DELETE","INSERT","UPDATE"].includes(t.permissionName)&&(e+="GRANT"===t.state?3:2),"SELECT"===t.permissionName&&"USER_TABLE"===t.objectType&&(e+=1),e),0)}),Object.values(a)}async function r(e,t){var a,s,i;let n;let r=await e.request().query(`
    SELECT 
      audit_id,
      name AS audit_name,
      is_state_enabled,
      create_date,
      modify_date
    FROM sys.server_audits
    WHERE is_state_enabled = 1
  `),o=await e.request().query(`
    SELECT 
      s.name AS audit_specification_name,
      s.is_state_enabled,
      d.audit_action_name,
      d.audited_principal_name
    FROM sys.database_audit_specifications s
    JOIN sys.database_audit_specification_details d ON s.database_specification_id = d.database_specification_id
    WHERE s.is_state_enabled = 1
  `),c=await e.request().query(`
    SELECT 
      name AS table_name,
      is_tracked_by_cdc
    FROM sys.tables
    WHERE is_tracked_by_cdc = 1
  `);return{serverAuditEnabled:r.recordset.length>0,databaseAuditEnabled:o.recordset.length>0,cdcEnabled:c.recordset.length>0,auditTables:c.recordset.map(e=>e.table_name),complianceScore:(a=r.recordset,s=o.recordset,i=c.recordset,n=0,a.length>0&&(n+=30),s.length>0&&(n+=30),i.length>0&&(n+=20),a.length>1&&(n+=10),s.length>2&&(n+=10),Math.min(100,n))}}async function o(e,t,a){let s=t.filter(e=>"CRITICAL"===e.riskLevel).length,i=t.filter(e=>"HIGH"===e.riskLevel).length,n=t.filter(e=>"MEDIUM"===e.riskLevel).length,r=a.filter(e=>e.riskScore>10).length,o=a.length,d=(await e.request().query(`
    SELECT 
      name AS config_name,
      value AS config_value,
      value_in_use AS current_value
    FROM sys.configurations
    WHERE name IN ('xp_cmdshell', 'Database Mail XPs', 'Ole Automation Procedures', 'cross db ownership chaining')
  `)).recordset.filter(e=>1===e.current_value).length;return{sensitiveDataScore:0===s+i+n?100:Math.max(0,100-Math.min(100,10*s+5*i+2*n)),userAccessScore:0===o?100:Math.max(0,100-r/o*100),securityConfigurationScore:Math.max(0,100-25*d),encryptionScore:await c(e),overallSecurityScore:0,totalSensitiveColumns:t.length,criticalRiskColumns:s,highRiskUsers:r,dangerousFeaturesEnabled:d}}async function c(e){return(await e.request().query(`
    SELECT 
      db.name,
      db.is_encrypted,
      dm.encryption_state
    FROM sys.databases db
    LEFT JOIN sys.dm_database_encryption_keys dm ON db.database_id = dm.database_id
    WHERE db.name = DB_NAME()
  `)).recordset.some(e=>e.is_encrypted||3===e.encryption_state)?100:0}a.d(t,{x:()=>s})},65082:(e,t,a)=>{"use strict";a.d(t,{l:()=>n});var s=a(59924),i=a.n(s);async function n(e){let{server:t,port:a,user:s,password:n,database:r}=e,o=await i().connect({server:t,port:a,user:s,password:n,database:r,options:{encrypt:!1,trustServerCertificate:!0},connectionTimeout:15e3,requestTimeout:15e3,pool:{max:5,min:0,idleTimeoutMillis:3e4}});try{await o.request().query(`USE [${r}]`);let e=await o.request().query(`
      SELECT 
        t.object_id,
        s.name AS schema_name,
        t.name AS table_name
      FROM sys.tables t
      JOIN sys.schemas s ON t.schema_id = s.schema_id
      ORDER BY s.name, t.name;
    `),s=await o.request().query(`
      SELECT 
        t.object_id,
        SUM(p.rows) AS row_count
      FROM sys.tables t
      JOIN sys.partitions p ON t.object_id = p.object_id
      WHERE p.index_id IN (0, 1)
      GROUP BY t.object_id;
    `),i=await o.request().query(`
      SELECT 
        c.object_id,
        c.column_id,
        c.name AS column_name,
        ty.name AS data_type,
        c.max_length,
        c.is_nullable,
        c.is_identity
      FROM sys.columns c
      JOIN sys.types ty ON c.user_type_id = ty.user_type_id
      ORDER BY c.object_id, c.column_id;
    `),n=await o.request().query(`
      SELECT 
        kc.parent_object_id AS object_id,
        col.name AS column_name
      FROM sys.key_constraints kc
      JOIN sys.index_columns ic 
        ON kc.parent_object_id = ic.object_id 
        AND kc.unique_index_id = ic.index_id
      JOIN sys.columns col
        ON col.object_id = ic.object_id 
        AND col.column_id = ic.column_id
      WHERE kc.type = 'PK';
    `),c=await o.request().query(`
      SELECT 
        fk.name AS fk_name,
        fk.parent_object_id,
        fk.referenced_object_id,
        p.name   AS parent_table,
        r.name   AS referenced_table
      FROM sys.foreign_keys fk
      JOIN sys.tables p ON fk.parent_object_id = p.object_id
      JOIN sys.tables r ON fk.referenced_object_id = r.object_id;
    `),d={};s.recordset.forEach(e=>{d[e.object_id]=e.row_count});let l={};i.recordset.forEach(e=>{l[e.object_id]||(l[e.object_id]=[]),l[e.object_id].push(e)});let u={};n.recordset.forEach(e=>{u[e.object_id]||(u[e.object_id]=[]),u[e.object_id].push(e.column_name)});let _={};c.recordset.forEach(e=>{_[e.parent_object_id]||(_[e.parent_object_id]=[]),_[e.parent_object_id].push(e)});let m=e.recordset.map(e=>{let t=l[e.object_id]||[],a=u[e.object_id]||[],s=_[e.object_id]||[],i=d[e.object_id]||0,n=function(e){let t=e.toLowerCase();return t.includes("usuario")||t.includes("user")||t.includes("login")?"Usu\xe1rios / Acesso":t.includes("cliente")||t.includes("paciente")||t.includes("cli")?"Clientes / Pacientes":t.includes("fornecedor")||t.includes("forn")?"Fornecedores":t.includes("produto")||t.includes("item")||t.includes("servico")?"Produtos / Servi\xe7os":t.includes("pedido")||t.includes("orcamento")||t.includes("venda")?"Vendas / Pedidos":t.includes("titulo")||t.includes("contas")||t.includes("pagar")||t.includes("receber")?"Financeiro (t\xedtulos / contas)":t.includes("estoque")||t.includes("movesto")||t.includes("mov_esto")?"Estoque / Movimenta\xe7\xe3o":t.includes("nota")||t.includes("nf")||t.includes("fiscal")?"Documentos fiscais":t.includes("funcionario")||t.includes("colaborador")||t.includes("rh")?"RH / Funcion\xe1rios":t.includes("config")||t.includes("param")||t.includes("parametro")?"Configura\xe7\xf5es / Par\xe2metros":"Outras / N\xe3o classificada"}(e.table_name);return{schema:e.schema_name,name:e.table_name,objectId:e.object_id,rowCount:i,primaryKey:a,columns:t.map(e=>({column_name:e.column_name,data_type:e.data_type,max_length:e.max_length,is_nullable:!!e.is_nullable,is_identity:!!e.is_identity})),foreignKeys:s.map(e=>({fk_name:e.fk_name,parent_table:e.parent_table,referenced_table:e.referenced_table})),purpose:n}});return{server:t,port:a,database:r,tables:m}}finally{o.close()}}}};
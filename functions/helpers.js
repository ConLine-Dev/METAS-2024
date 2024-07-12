const { executeQuerySQL } = require('../connect/headCargo');
const { executeQuery } = require('../connect/mysql');
const { executeQuerySirius } = require('../connect/siriusDBO');

let anoAtual = 2024;
let anoAnterior = 2023

const helpers = {
   resultados_ano_anterior: async function () {
      const result = await executeQuerySQL(`SELECT * FROM vis_Fluxo_Caixa_Novas_Metas WHERE ANO = ${anoAnterior}`);

      return result;
   },

   resultados_ano_atual: async function () {
      const result = await executeQuerySQL(`SELECT * FROM vis_Fluxo_Caixa_Novas_Metas WHERE ANO = ${anoAtual}`);

      return result;
   },

   processos_ano_anterior: async function () {
      const result = await executeQuerySQL(`SELECT * FROM vis_Metas_Processo_Nova WHERE ANO = ${anoAnterior}`);

      return result;
   },

   processos_ano_atual: async function () {
      const result = await executeQuerySQL(`SELECT * FROM vis_Metas_Processo_Nova WHERE ANO = ${anoAtual}`);

      return result;
   },

   ultimos_9_processos: async function () {
      const result = await executeQuerySQL(`SET LANGUAGE Portuguese SELECT TOP 9 * FROM vis_Metas_Processo_Nova ORDER BY IdLogistica_House DESC`);

      return result;
   },

   ultimo_processo_por_modal: async function (modalidade) {
      const result = await executeQuerySQL(`SET LANGUAGE Portuguese SELECT TOP 1 * FROM vis_Metas_Processo_Nova WHERE MODALIDADE = '${modalidade}' ORDER BY IdLogistica_House DESC`);
      return result;
   },

   ultimo_processo_gerado: async function () {
      const result = await executeQuerySQL(`SET LANGUAGE Portuguese SELECT TOP 1 * FROM vis_Metas_Processo_Nova ORDER BY IdLogistica_House DESC`);

      return result;
   },

   teus_tons_ano_anterior: async function () {
      const result = await executeQuerySQL(`SELECT * FROM vis_Metas_Tons_Teus_Nova WHERE ANO = ${anoAnterior}`);

      return result;
   },

   teus_tons_ano_atual: async function () {
      const result = await executeQuerySQL(`SELECT * FROM vis_Metas_Tons_Teus_Nova WHERE ANO = ${anoAtual}`);

      return result;
   },

   nivel_acesso: async function (nivel, email) {
      const id_acesso = await executeQuery(`
         SELECT
            *
         FROM
            departamento
         WHERE
            referencia = '${nivel}'
      `)

      const result = await executeQuerySQL(`
         SELECT
            Psa.IdPessoa,
            Psa.Nome,
            Psa.Email
         FROM
            cad_Equipe_Tarefa Etf
         JOIN
            cad_Equipe_Tarefa_Membro Etm ON Etm.IdEquipe_Tarefa = Etf.IdEquipe_Tarefa
         JOIN
            cad_Pessoa Psa ON Psa.IdPessoa = Etm.IdFuncionario
         WHERE
            Etf.IdEquipe_Tarefa = ${id_acesso[0].id_equipe_tarefa} AND Psa.Email = '${email}'`
      )

      return result;
   },

   comerciais: async function () {
      const result = await executeQuerySQL(`
         SELECT
            Psa.IdPessoa,
            Psa.Nome,
            Psa.Email
         FROM
            cad_Equipe_Tarefa Etf
         JOIN
            cad_Equipe_Tarefa_Membro Etm ON Etm.IdEquipe_Tarefa = Etf.IdEquipe_Tarefa
         JOIN
            cad_Pessoa Psa ON Psa.IdPessoa = Etm.IdFuncionario
         WHERE
            Etf.IdEquipe_Tarefa = 75 /*COMERCIAL*/`
      )

      return result;
   },

   admin_comerciais: async function () {
      const result = await executeQuerySQL(`
         SELECT
            Psa.IdPessoa,
            Psa.Nome,
            Psa.Email
         FROM
            cad_Equipe_Tarefa Etf
         JOIN
            cad_Equipe_Tarefa_Membro Etm ON Etm.IdEquipe_Tarefa = Etf.IdEquipe_Tarefa
         JOIN
            cad_Pessoa Psa ON Psa.IdPessoa = Etm.IdFuncionario
         WHERE
            Etf.IdEquipe_Tarefa = 76 /*ADMIN COMERCIAL*/`
      )

      return result;
   },

   admin_cards_comerciais: async function () {
      const result = await executeQuerySQL(`
         WITH Lucro_Vendedor AS (
            SELECT
               Lhs.IdVendedor,
               CASE
                  WHEN Lms.Tipo_Operacao = 1 THEN COALESCE(Lms.Data_Embarque, Lms.Data_Previsao_Embarque)
                  WHEN Lms.Tipo_Operacao = 2 THEN COALESCE(Lms.Data_Desembarque, Lms.Data_Previsao_Desembarque)
                  ELSE COALESCE(Lms.Data_Embarque, Lms.Data_Previsao_Embarque)
               END AS Data_Compensacao,
               Lmd.Lucro_Estimado,
               Lmd.Lucro_Efetivo
            FROM
               mov_Logistica_Moeda Lmd
            LEFT OUTER JOIN
               mov_Logistica_House Lhs ON Lhs.IdLogistica_House = Lmd.IdLogistica_House
            LEFT OUTER JOIN
               mov_Logistica_Master Lms ON Lms.IdLogistica_Master = Lhs.IdLogistica_Master
            WHERE
               Lhs.Numero_Processo NOT LIKE '%test%'
               AND Lhs.Numero_Processo NOT LIKE '%DEMU%'
               AND Lhs.Situacao_Agenciamento NOT IN (7 /* CANCELADOS */)
               AND Lhs.Agenciamento_Carga = 1
               AND Lmd.IdMoeda = 110
      )
      
      SELECT
         Lhs.IdVendedor,
         Ven.Nome,
         Ven.EMail,
         COALESCE(Lhs.Processos, 0) AS Processos,
         COALESCE(Pfr.Propostas, 0) AS Propostas,
         COALESCE(Lmd.Lucro_Estimado, 0) AS Lucro_Estimado,
         COALESCE(Lmd.Lucro_Efetivo, 0) AS Lucro_Efetivo
      FROM (
         SELECT
            Lhs.idVendedor,
            COUNT(Lhs.IdLogistica_House) AS Processos
         FROM
            mov_Logistica_House Lhs
         WHERE
            Lhs.Numero_Processo NOT LIKE '%test%'
            and Lhs.Numero_Processo NOT LIKE '%DEMU%'
            and Lhs.Situacao_Agenciamento NOT IN (7 /* CANCELADOS */)
            AND Lhs.Agenciamento_Carga = 1
            and DATEPART(YEAR, Lhs.Data_Abertura_Processo) = ${anoAtual}
         GROUP BY
            Lhs.IdVendedor
      ) Lhs
      LEFT OUTER JOIN (
         SELECT
            IdVendedor,
            SUM(Lucro_Estimado) AS Lucro_Estimado,
            SUM(Lucro_Efetivo) AS Lucro_Efetivo
         FROM
            Lucro_Vendedor
         WHERE
            YEAR(Data_Compensacao) = ${anoAtual}
            AND Data_Compensacao < GETDATE()
         GROUP BY
            IdVendedor
      ) Lmd ON Lmd.IdVendedor = Lhs.IdVendedor
      LEFT OUTER JOIN (
         SELECT
            Pfr.IdVendedor,
            COUNT(Pfr.IdProposta_Frete) AS Propostas
         FROM
            mov_Oferta_Frete Ofr
         LEFT OUTER JOIN
            mov_Proposta_Frete Pfr ON Pfr.IdProposta_Frete = Ofr.IdProposta_Frete
         WHERE
            Pfr.Numero_Proposta NOT LIKE '%test%'
            AND Pfr.Situacao = 2 /* APROVADA */
            AND DATEPART(YEAR, Pfr.Data_Proposta) = ${anoAtual}
         GROUP BY
            Pfr.IdVendedor
      ) Pfr ON Pfr.IdVendedor = Lhs.IdVendedor
      LEFT OUTER JOIN
         cad_Pessoa Ven ON Ven.IdPessoa = Lhs.IdVendedor
      LEFT OUTER JOIN
         cad_Equipe_Tarefa_Membro Etm ON Etm.IdFuncionario = Ven.IdPessoa
      WHERE
         Etm.IdEquipe_Tarefa = 75 /*COMERCIAL*/
      ORDER BY
         Ven.Nome`
      )

      return result;
   },

   admin_modal_valores_comerciais: async function (IdVendedor) {
      // Consulta no banco da head
      const result_Head = await executeQuerySQL(`
         WITH Lucro_Estimado_Vendedor AS (
            SELECT
               Lhs.IdVendedor,
               CASE
                  WHEN Lms.Tipo_Operacao = 1 THEN COALESCE(Lms.Data_Embarque, Lms.Data_Previsao_Embarque)
                  WHEN Lms.Tipo_Operacao = 2 THEN COALESCE(Lms.Data_Desembarque, Lms.Data_Previsao_Desembarque)
                  ELSE COALESCE(Lms.Data_Embarque, Lms.Data_Previsao_Embarque)
               END AS Data_Compensacao,
               Lmd.Lucro_Estimado,
               Lmd.Lucro_Efetivo
            FROM
               mov_Logistica_Moeda Lmd
            LEFT OUTER JOIN
               mov_Logistica_House Lhs ON Lhs.IdLogistica_House = Lmd.IdLogistica_House
            LEFT OUTER JOIN
               mov_Logistica_Master Lms ON Lms.IdLogistica_Master = Lhs.IdLogistica_Master
            WHERE
               Lhs.Numero_Processo NOT LIKE '%test%'
               AND Lhs.Numero_Processo NOT LIKE '%DEMU%'
               AND Lhs.Situacao_Agenciamento NOT IN (7 /* CANCELADOS */)
               AND Lhs.Agenciamento_Carga = 1
               AND Lmd.IdMoeda = 110
         )
         
         SELECT
            Lhs.IdVendedor,
            Lmd.Mes,
            Lmd.Mes_numero,
            Ven.Nome,
            Ven.EMail,
            COALESCE(Lmd.Lucro_Estimado, 0) AS Lucro_Estimado,
            COALESCE(Lmd.Lucro_Efetivo, 0) AS Lucro_Efetivo
         FROM (
            SELECT
               Lhs.idVendedor,
               COUNT(Lhs.IdLogistica_House) AS Processos
            FROM
               mov_Logistica_House Lhs
            WHERE
               Lhs.Numero_Processo NOT LIKE '%test%'
               and Lhs.Numero_Processo NOT LIKE '%DEMU%'
               and Lhs.Situacao_Agenciamento NOT IN (7 /* CANCELADOS */)
               and DATEPART(YEAR, Lhs.Data_Abertura_Processo) = ${anoAtual}
            GROUP BY
               Lhs.IdVendedor
         ) Lhs
         LEFT OUTER JOIN (
            SELECT
               Lmd.IdVendedor,
               CASE DATEPART(MONTH, Lmd.Data_Compensacao)
                  WHEN 1 THEN 'Janeiro'
                  WHEN 2 THEN 'Fevereiro'
                  WHEN 3 THEN 'Março'
                  WHEN 4 THEN 'Abril'
                  WHEN 5 THEN 'Maio'
                  WHEN 6 THEN 'Junho'
                  WHEN 7 THEN 'Julho'
                  WHEN 8 THEN 'Agosto'
                  WHEN 9 THEN 'Setembro'
                  WHEN 10 THEN 'Outubro'
                  WHEN 11 THEN 'Novembro'
                  WHEN 12 THEN 'Dezembro'
               END AS Mes,
               DATEPART(MONTH, Lmd.Data_Compensacao) AS Mes_numero,
               SUM(Lmd.Lucro_Estimado) AS Lucro_Estimado,
               SUM(Lmd.Lucro_Efetivo) AS Lucro_Efetivo
            FROM
               Lucro_Estimado_Vendedor Lmd
            WHERE
               YEAR(Data_Compensacao) = ${anoAtual}
               AND Data_Compensacao < GETDATE()
            GROUP BY
               Lmd.IdVendedor,
               DATEPART(MONTH, Lmd.Data_Compensacao)
         ) Lmd ON Lmd.IdVendedor = Lhs.IdVendedor
         LEFT OUTER JOIN
            cad_Pessoa Ven ON Ven.IdPessoa = Lhs.IdVendedor
         LEFT OUTER JOIN
            cad_Equipe_Tarefa_Membro Etm ON Etm.IdFuncionario = Ven.IdPessoa
         WHERE
            Etm.IdEquipe_Tarefa = 75 /*COMERCIAL*/
            AND Lhs.IdVendedor = ${IdVendedor}
         ORDER BY
            Ven.Nome`
      );

      // Consulta no banco do sirius
      const result_meta_sirius = await executeQuery(`
         SELECT * FROM meta_comercial WHERE id_comercial = ? AND ano = ?`, [IdVendedor, anoAtual]
      );

      // Cria um array de objeto para armazenar os processos
      const result_valores_comercial = [];

      // Faz um for na consulta da Head e um find na consulta do sirius passando mes a mes
      for (let i = 0; i < result_Head.length; i++) {
         const item = result_Head[i];

         const meta = result_meta_sirius.find(element => element.mes == item.Mes_numero);

         // Se existir meta na consulta do sirius envia para o array de objeto. Se nao envia uma meta com valor = a zero
         if (meta) {
            result_valores_comercial.push({
               Comercial: item.Nome,
               Mes: item.Mes,
               Lucro_Efetivo: item.Lucro_Efetivo,
               Lucro_Estimado: item.Lucro_Estimado,
               Meta: meta.valor_meta
            })
         } else {
            result_valores_comercial.push({
               Comercial: item.Nome,
               Mes: item.Mes,
               Lucro_Efetivo: item.Lucro_Efetivo,
               Lucro_Estimado: item.Lucro_Estimado,
               Meta: 0
            })
         }
      }

      return result_valores_comercial;
   },

   inserir_meta_comercial: async function (body) {
      // Faz uma verificação no banco do sirius para ver se localiza algum meta ja lançada para aquele mes, ano ou comercial
      const verificacao = await executeQuery(`SELECT * FROM meta_comercial WHERE id_comercial = ? AND mes = ? AND ano = ?`, [body.id_comercial, body.mes, body.ano])

      // Se o retorno for maior ou igual a 1 significa que encontrou alguma coisa. Entao faz um UPDATE na meta que ja existe
      if (verificacao.length >= 1) {
         // Caso encontre alguma coisa, ele atualiza a meta
         const result = await executeQuery(`UPDATE meta_comercial SET valor_meta = ? WHERE id_comercial = ? AND mes = ? AND ano = ?`, [body.valor_meta, body.id_comercial, body.mes, body.ano]
         )
         return {
            status: true,
            mensagem: `Meta de ${body.nome_comercial} foi atualizada com sucesso!`,
            result: result,
            id_comercial: body.id_comercial
         }
      } else {
         // Caso não encontre nada ele faz um INSERT da nova meta
         const result = await executeQuery(`INSERT INTO meta_comercial 
                  (id_comercial, nome_comercial, mes, ano, valor_meta) 
               VALUES (?, ?, ?, ?, ?)`,
            // Passa os valores por parametros
            [body.id_comercial, body.nome_comercial, body.mes, body.ano, body.valor_meta]
         )

         return {
            status: true,
            mensagem: `Meta inserida com sucesso para o comercial ${body.nome_comercial}!`,
            result: result,
            id_comercial: body.id_comercial
         }
      }
   },

   operacionais: async function () {
      const result = await executeQuerySQL(`
         SELECT
            Psa.IdPessoa,
            Psa.Nome,
            Psa.Email
         FROM
            cad_Equipe_Tarefa Etf
         JOIN
            cad_Equipe_Tarefa_Membro Etm ON Etm.IdEquipe_Tarefa = Etf.IdEquipe_Tarefa
         JOIN
            cad_Pessoa Psa ON Psa.IdPessoa = Etm.IdFuncionario
         WHERE
            Etf.IdEquipe_Tarefa = 80 /*OPERACIONAL*/`
      )

      return result;
   },

   admin_operacionais: async function () {
      const result = await executeQuerySQL(`
         SELECT
            Psa.IdPessoa,
            Psa.Nome,
            Psa.Email
         FROM
            cad_Equipe_Tarefa Etf
         JOIN
            cad_Equipe_Tarefa_Membro Etm ON Etm.IdEquipe_Tarefa = Etf.IdEquipe_Tarefa
         JOIN
            cad_Pessoa Psa ON Psa.IdPessoa = Etm.IdFuncionario
         WHERE
            Etf.IdEquipe_Tarefa = 81 /*ADMIN OPERACIONAL*/`
      )

      return result;
   },

   meta_financeira_comercial: async function (IdVendedor, email) {
      const where_vendedor = IdVendedor ? `and Lhs.IdVendedor = ${IdVendedor}` : '';
      const where_email = email ? `and Fnc.EMail = '${email}'` : '';
      const result = await executeQuerySQL(`
         WITH Lucro_Vendedor AS (
            SELECT
               Lhs.IdVendedor,
               Lhs.IdLogistica_House,
               CASE
                  WHEN Lms.Tipo_Operacao = 1 THEN COALESCE(Lms.Data_Embarque, Lms.Data_Previsao_Embarque)
                  WHEN Lms.Tipo_Operacao = 2 THEN COALESCE(Lms.Data_Desembarque, Lms.Data_Previsao_Desembarque)
                  ELSE COALESCE(Lms.Data_Embarque, Lms.Data_Previsao_Embarque)
               END AS Data_Compensacao,
               Lmd.Total_Pagamento,
               Lmd.Total_Recebimento,
               Lmd.Lucro_Estimado,
               Lmd.Lucro_Efetivo
            FROM
               mov_Logistica_Moeda Lmd
            LEFT OUTER JOIN
               mov_Logistica_House Lhs ON Lhs.IdLogistica_House = Lmd.IdLogistica_House
            LEFT OUTER JOIN
               mov_Logistica_Master Lms ON Lms.IdLogistica_Master = Lhs.IdLogistica_Master
            WHERE
               Lhs.Numero_Processo NOT LIKE '%test%'
               AND Lhs.Numero_Processo NOT LIKE '%DEMU%'
               AND Lhs.Situacao_Agenciamento NOT IN (7 /* CANCELADOS */)
               AND Lhs.Agenciamento_Carga = 1
               AND Lmd.IdMoeda = 110
         )
         
         SELECT
            Lhs.IdLogistica_House AS ID_LOGISTICA_HOUSE,
         
            Lhs.Numero_Processo AS NUMERO_PROCESSO,
            Cli.IdPessoa AS ID_CLIENTE,
            Cli.nome AS CLIENTE,
         
            DATEPART(YEAR, Lmd.Data_Compensacao) AS ANO,
            DATEPART(MONTH, Lmd.Data_Compensacao) AS MES,
         
            CASE Lhs.Situacao_Agenciamento
               WHEN 7 THEN 'CANCELADO'
               ELSE 'PROCESSO'
            END AS Situacao,
         
            Lhs.IdVendedor AS ID_VENDEDOR,
            Fnc.Nome AS VENDEDOR,
            Fnc.EMail AS EMAIL_VENDEDOR,
         
            COALESCE(Lmd.Total_Pagamento, 0) AS TOTAL_PAGAMENTO,
            COALESCE(Lmd.Total_Recebimento, 0) AS TOTAL_RECEBIMENTO,
         
            COALESCE(Lmd.Lucro_Estimado, 0) AS LUCRO_ESTIMADO,
            COALESCE(Lmd.Lucro_Efetivo, 0) AS LUCRO_EFETIVO
         
         FROM
            mov_Logistica_House Lhs
         LEFT OUTER JOIN
            cad_Pessoa Cli ON Cli.IdPessoa = Lhs.IdCliente
         LEFT OUTER JOIN
            vis_Funcionario Fnc ON Fnc.IdPessoa = Lhs.IdVendedor
         LEFT OUTER JOIN
            Lucro_Vendedor Lmd ON Lmd.IdLogistica_House = Lhs.IdLogistica_House
         WHERE
            YEAR(Data_Compensacao) = ${anoAtual}
            AND Data_Compensacao < GETDATE()
            AND Lhs.Numero_Processo NOT LIKE '%test%'
            ${where_vendedor}
            ${where_email}
      `)

      return result;
   },

   meta_financeira_comercial_datatables_data_abertura: async function (IdVendedor, email) {
      const where_vendedor = IdVendedor ? `and Lhs.IdVendedor = ${IdVendedor}` : '';
      const where_email = email ? `and Fnc.EMail = '${email}'` : '';
      const result = await executeQuerySQL(`         
         SELECT
            TOP 100
            Lhs.IdLogistica_House AS ID_LOGISTICA_HOUSE,
         
            Lhs.Numero_Processo AS NUMERO_PROCESSO,
            Cli.IdPessoa AS ID_CLIENTE,
            Cli.nome AS CLIENTE,
         
            DATEPART(YEAR, Lhs.Data_Abertura_Processo) AS ANO,
            DATEPART(MONTH, Lhs.Data_Abertura_Processo) AS MES,
         
            CASE Lhs.Situacao_Agenciamento
               WHEN 7 THEN 'CANCELADO'
               ELSE 'PROCESSO'
            END AS Situacao,
         
            Lhs.IdVendedor AS ID_VENDEDOR,
            Fnc.Nome AS VENDEDOR,
            Fnc.EMail AS EMAIL_VENDEDOR,
         
            COALESCE(Lmd.Total_Pagamento, 0) AS TOTAL_PAGAMENTO,
            COALESCE(Lmd.Total_Recebimento, 0) AS TOTAL_RECEBIMENTO,
         
            COALESCE(Lmd.Lucro_Estimado, 0) AS LUCRO_ESTIMADO,
            COALESCE(Lmd.Lucro_Efetivo, 1) AS LUCRO_EFETIVO
         
         FROM
            mov_Logistica_House Lhs
         LEFT OUTER JOIN
            cad_Pessoa Cli ON Cli.IdPessoa = Lhs.IdCliente
         LEFT OUTER JOIN
            vis_Funcionario Fnc ON Fnc.IdPessoa = Lhs.IdVendedor
         LEFT OUTER JOIN
            mov_Logistica_Moeda Lmd ON Lmd.IdLogistica_House = Lhs.IdLogistica_House
         WHERE
            YEAR(Lhs.Data_Abertura_Processo) = ${anoAtual}
            AND Lhs.Numero_Processo NOT LIKE '%test%'
            ${where_vendedor}
            ${where_email}
      `)

      return result;
   },

   proposta_meta_comercial: async function (IdVendedor, email) {
      const where_vendedor = IdVendedor ? `and Pfr.IdVendedor = ${IdVendedor}` : '';
      const where_email = email ? `and Fnc.EMail = '${email}'` : '';
      const result = await executeQuerySQL(`
         SELECT
            Pfr.IdProposta_Frete,

            DATEPART(YEAR, Pfr.Data_Proposta) AS ANO,
            DATEPART(MONTH, Pfr.Data_Proposta) AS MES,

            Pfr.IdVendedor AS ID_VENDEDOR,
            Fnc.EMail,
            Fnc.Nome AS VENDEDOR,

            CASE Pfr.Situacao
               WHEN 1 THEN 'AGUARDANDO APROVACAO'
               WHEN 2 THEN 'APROVADA'
               WHEN 3 THEN 'NAO APROVADA'
               WHEN 4 THEN 'NAO ENVIADA'
               WHEN 5 THEN 'PRE-PROPOSTA'
               WHEN 6 THEN 'ENVIADA'
            END AS Situacao
         FROM
            mov_Proposta_Frete Pfr
         LEFT OUTER JOIN
            mov_Oferta_Frete Ofr ON Ofr.IdProposta_Frete = Pfr.IdProposta_Frete
         LEFT OUTER JOIN
            cad_Pessoa Fnc ON Fnc.IdPessoa = Pfr.IdVendedor
         WHERE
            DATEPART(YEAR, Pfr.Data_Proposta) = ${anoAtual}
            AND Pfr.Numero_Proposta NOT LIKE '%test%'
            ${where_vendedor}
            ${where_email}
      `)

      return result;
   },

   processos_meta_comercial: async function (IdVendedor, email) {
      const where_vendedor = IdVendedor ? `and Lhs.IdVendedor = ${IdVendedor}` : '';
      const where_email = email ? `and Fnc.EMail = '${email}'` : '';
      const result = await executeQuerySQL(`
         SELECT
            Lhs.IdLogistica_House AS ID_LOGISTICA_HOUSE,
            Lhs.IdVendedor AS ID_VENDEDOR,
            Fnc.EMail,

            CASE Lhs.Situacao_Agenciamento
               WHEN 7 THEN 'CANCELADO'
               ELSE 'PROCESSO'
            END AS Situacao
         
         FROM
            mov_Logistica_House Lhs
         LEFT OUTER JOIN
            cad_Pessoa Fnc ON Fnc.IdPessoa = Lhs.IdVendedor
         WHERE
            DATEPART(YEAR, Lhs.Data_Abertura_Processo) = ${anoAtual}
            AND Lhs.Numero_Processo NOT LIKE '%test%'
            AND Lhs.Numero_Processo NOT LIKE '%DEMU%'
            ${where_vendedor}
            ${where_email}
      `)

      return result;
   },

   meta_mes_atual: async function (IdVendedor) {
      const result = await executeQuery(`
         SELECT
            *
         FROM 
            meta_comercial 
         WHERE 
            id_comercial = ?`, [IdVendedor])

      return result;
   },

   operacional_por_processo: async function (numero_processo) {
      const result = await executeQuerySQL(`
      select lhs.Numero_Processo as 'Numero_do_Processo'
      , pss.IdPessoa

      from mov_logistica_House lhs

      join mov_Projeto_Atividade_Responsavel par on par.IdProjeto_Atividade = lhs.IdProjeto_Atividade
      join cad_Pessoa pss on pss.IdPessoa = par.IdResponsavel

      where lhs.Numero_Processo like '%${numero_processo}%'
      and par.IdPapel_Projeto = 2
      `)

      return result;
   },

   cadastrar_operacional_por_processo: async function (numero_processo, id_operacional, id_moeda, valor, descricao) {
      let query = `INSERT INTO recompra_operacional
    (numero_processo, id_operacional, id_moeda, valor, descricao) VALUES
    ("${numero_processo}", ${id_operacional}, ${id_moeda}, ${valor}, "${descricao}")`

      await executeQuery(query);
   },

   recompras_operacional: async function () {
      const result = await executeQuery(
         `SELECT * FROM recompra_operacional;
         `)

      return result;
   },

   divergencias_financeiras: async function () {
      const result = await executeQuerySQL(
         `SELECT
            Lhs.IdLogistica_House,
            Lhs.Numero_Processo,
            Par.IdResponsavel,
            pss.Nome,
            Ctr.Caminho_Tarefa
         FROM
            mov_Atividade Atv
         LEFT OUTER JOIN
            mov_Atividade_Historico Ath ON Ath.IdAtividade = Atv.IdAtividade
         LEFT OUTER JOIN
            mov_Logistica_House Lhs ON Lhs.IdProjeto_Atividade = Atv.IdProjeto_Atividade
         LEFT OUTER JOIN
            mov_Projeto_Atividade_Responsavel Par ON Par.IdProjeto_Atividade = Lhs.IdProjeto_Atividade
         LEFT OUTER JOIN
            cad_Pessoa pss ON pss.IdPessoa = Par.IdResponsavel
         LEFT OUTER JOIN (
            SELECT
               Atv.IdProjeto_Atividade,
               Ctr.Descricao AS Caminho_Tarefa
            FROM
               mov_Atividade Atv
            LEFT OUTER JOIN
               cad_Caminho_Tarefa Ctr ON Ctr.IdCaminho_Tarefa = Atv.IdCaminho_Tarefa_Escolha
            WHERE
               Atv.IdTarefa = 1629 /*Conferir valores operacional*/
         ) Ctr ON Ctr.IdProjeto_Atividade = Atv.IdProjeto_Atividade
         WHERE
            Atv.IdTarefa = 1625 /*Conferir Valores*/
            AND Ath.Situacao = 3 /*Paralisada*/
            AND Par.IdPapel_Projeto = 2 /*Operacional*/
            AND DATEPART(year, Lhs.Data_Abertura_Processo) = 2024
         `)

      return result;
   },

   divergencias_ce_mercante: async function () {
      const result = await executeQuerySQL(
         `select dce.Divergencia, dce.Retificacao, dce.Setor, pss.Nome as 'Operacional',
         lhs.Numero_Processo as 'Processo', dce.IdResponsavel from vis_Divergencias_CE dce
         
         join cad_Pessoa pss on pss.IdPessoa = dce.IdResponsavel
         join mov_Logistica_House lhs on lhs.IdLogistica_House = dce.IdLogistica_House
         join mov_Logistica_Master lmt on lmt.IdLogistica_Master = lhs.IdLogistica_Master

         where lhs.Numero_Processo not like '%DEMU%'
         and DATEPART(year, lhs.Data_Abertura_Processo) = 2024
         `)

      return result;
   },

   quantidade_processos: async function () {
      const result = await executeQuerySQL(
         `select lhs.Numero_Processo as 'processo',
         case lhs.Situacao_Agenciamento
         when 1 then 'Aberto'
         when 2 then 'Em andamento'
         when 3 then 'Liberado faturamento'
           when 4 then 'Faturado'
           when 5 then 'Finalizado'
           when 6 then 'Auditado'
           when 7 then 'Cancelado'
           end as 'situacao',
           fnc.IdPessoa as 'funcionario',
             lhs.Data_Abertura_Processo as 'data'
         from mov_Logistica_House lhs
         
             join cad_Pessoa pss on pss.IdPessoa = lhs.IdCliente join mov_Logistica_Master lgm on lgm.IdLogistica_Master = lhs.IdLogistica_Master
             left outer join mov_Projeto_Atividade_Responsavel par on par.IdProjeto_Atividade = lhs.IdProjeto_Atividade and (par.IdPapel_Projeto = 2)
             full join cad_Pessoa fnc on fnc.IdPessoa = par.IdResponsavel
         
         where DATEPART(year, lhs.Data_Abertura_Processo) = 2023
         and lhs.Numero_Processo not like '%DEMU%'
         and lhs.Numero_Processo not like '%test%'
         and lgm.Tipo_Operacao = 2
             and lgm.Modalidade_Processo = 2
             
             or DATEPART(year, lhs.Data_Abertura_Processo) = 2024
             and lhs.Numero_Processo not like '%DEMU%'
             and lhs.Numero_Processo not like '%test%'
             and lgm.Tipo_Operacao = 2
             and lgm.Modalidade_Processo = 2
         `)

      return result;
   },

   emails_enviados_recebidos: async function () {
      const result = await executeQuerySirius(
         `SELECT * FROM SIRIUS.email_metrics;
         `)

      return result;
   },

   total_ce_lancados: async function () {
      const result = await executeQuerySQL(
         `select lhs.Numero_Processo, lmm.Numero_CE, lmm.Data_CE
         from mov_Logistica_Maritima_Master lmm
         join mov_Logistica_House lhs on lhs.IdLogistica_Master = lmm.IdLogistica_Master
         where DATEPART(year, lmm.Data_CE) = 2024
         `)

      return result;
   },

   taxas_conversao: async function () {
      const result = await executeQuerySQL(
         `SELECT
         Cmf.IdMoeda_Origem,
         Cmf.Fator
     From
         cad_Conversao_Moeda_Fator Cmf
     Where
         Cmf.IdConversao_Moeda = 2
     and CONVERT(varchar, Cmf.Data, 103) = CONVERT(varchar, GETDATE(), 103)
     `)
      return result;
   },

   formato_apresentacao_MBL: async function () {
      const result = await executeQuerySQL(
         `SELECT
         CASE Clv.Valor_Tipo_Fixo
            WHEN 1 THEN 'Enviado Courrier'
            WHEN 2 THEN 'Emissão destino'
            WHEN 3 THEN 'e-BL'
         END AS Valor_Tipo_Fixo,
         Lhs.Numero_Processo,
         Lhs.Data_Abertura_Processo
      FROM
         mov_Logistica_House Lhs
      LEFT OUTER JOIN
         mov_Logistica_Campo_Livre Lcl ON Lcl.IdLogistica_House = Lhs.IdLogistica_House
      LEFT OUTER JOIN
         mov_Campo_Livre Clv ON Clv.IdCampo_Livre = Lcl.IdCampo_Livre
      LEFT OUTER JOIN
         cad_Configuracao_Campo_Livre Cgl ON Cgl.IdConfiguracao_Campo_Livre = Clv.IdConfiguracao_Campo_Livre
      WHERE
         Cgl.IdConfiguracao_Campo_Livre = 162 --OMBL
     `)
      return result;
   },

   liberacoes_feitas: async function () {
      const result = await executeQuerySQL(
         `SELECT
         Cgl.Descricao,
         Clv.Valor_Data,
         Lhs.Numero_Processo,
         Lhs.Data_Abertura_Processo
     FROM
         mov_Logistica_House Lhs
     LEFT OUTER JOIN
         mov_Logistica_Campo_Livre Lcl ON Lcl.IdLogistica_House = Lhs.IdLogistica_House
     LEFT OUTER JOIN
         mov_Campo_Livre Clv ON Clv.IdCampo_Livre = Lcl.IdCampo_Livre
     LEFT OUTER JOIN
         cad_Configuracao_Campo_Livre Cgl ON Cgl.IdConfiguracao_Campo_Livre = Clv.IdConfiguracao_Campo_Livre
     WHERE
         Cgl.IdGrupo_Campo_Livre = 13 --Liberação CE
     AND Lhs.Numero_Processo NOT LIKE '%DEMU%'
     AND Lhs.Numero_Processo NOT LIKE '%test%'
     `)
      return result;
   },

   taxas_conversao: async function () {
      const result = await executeQuerySQL(
         `SELECT
         Cmf.IdMoeda_Origem,
         Cmf.Fator
     From
         cad_Conversao_Moeda_Fator Cmf
     Where
         Cmf.IdConversao_Moeda = 2
     and CONVERT(varchar, Cmf.Data, 103) = CONVERT(varchar, GETDATE(), 103)
     `)
      return result;
   },

   quantidade_prospeccao: async function (emailVendedor) {
      const result = await executeQuerySQL(`
         SELECT 
            Cli.IdPessoa AS IdCliente,
            Ven.Email AS Email_Vendedor
         FROM 
            cad_Cliente Cli
         LEFT OUTER JOIN
            cad_Pessoa Ven ON Ven.IdPessoa = Cli.IdVendedor_Responsavel
         WHERE 
            Cli.Tipo_Cliente = 1
            AND Ven.Email = '${emailVendedor}'`
      );

      return result;
   },

   quantidade_clientes_ativos: async function (emailVendedor) {
      const result = await executeQuerySQL(`
         SELECT DISTINCT
            CASE DATEPART(MONTH, Lhs.Data_Abertura_Processo)
               WHEN 1 THEN 'Janeiro'
               WHEN 2 THEN 'Fevereiro'
               WHEN 3 THEN 'Março'
               WHEN 4 THEN 'Abril'
               WHEN 5 THEN 'Maio'
               WHEN 6 THEN 'Junho'
               WHEN 7 THEN 'Julho'
               WHEN 8 THEN 'Agosto'
               WHEN 9 THEN 'Setembro'
               WHEN 10 THEN 'Outubro'
               WHEN 11 THEN 'Novembro'
               WHEN 12 THEN 'Dezembro'
            END AS MES,
         
            COUNT(Lhs.IdCliente) AS QUANT_CLIENTE
         FROM
            mov_Logistica_House Lhs
         LEFT OUTER JOIN
            cad_Pessoa Ven ON Ven.IdPessoa = Lhs.IdVendedor
         WHERE
            DATEPART(YEAR, Lhs.Data_Abertura_Processo) = 2024
            AND Ven.Email = '${emailVendedor}'
         GROUP BY
            DATEPART(MONTH, Lhs.Data_Abertura_Processo)`
      );

      return result;
   },

   atualizar_status_recompra: async function (idRecompra) {
      const result = await executeQuery(
         `UPDATE
            recompra_operacional SET status_recompra = '0'
         WHERE (id = ${idRecompra})`
      );

      return result;
   },

   propostas_pricing: async function () {
      const result = await executeQuerySQL(
         `select pft.Numero_Proposta as 'proposta', case pft.situacao when 1 then 'Aguardando Aprovação'
         when 2 then 'Aprovada' when 3 then 'Não Aprovada' when 4 then 'Não Enviada' when 5 then 'Pré-Proposta'
         when 6 then 'Enviada' end as 'status', case pfc.Tipo_Carga when 1 then 'Aéreo' when 2 then 'Break-Bulk'
         when 3 then 'FCL' when 4 then 'LCL' when 5 then 'RO-RO' when 6 then 'Rodoviário' end as 'tipo', pft.Data_Proposta as 'data'
         , DATEPART(month, pft.Data_Proposta) as 'mes', pss.Nome as 'agente', org.Nome as 'origem', dst.Nome as 'destino', arm.Nome as 'armador'
         , rep.Descricao as 'motivo_reprovacao', pft.Detalhes_Nao_Aprovacao as 'detalhe_reprovacao' from mov_Proposta_Frete pft

         left outer join mov_Proposta_Frete_Carga pfc on pfc.IdProposta_Frete = pft.IdProposta_Frete
         left outer join mov_Oferta_Frete oft on oft.IdProposta_Frete = pft.IdProposta_Frete
         left outer join cad_Origem_Destino org on org.IdOrigem_Destino = oft.IdOrigem
         left outer join cad_Origem_Destino dst on dst.IdOrigem_Destino = oft.IdDestino
         left outer join cad_Pessoa pss on pss.IdPessoa = oft.IdAgente_Origem
         left outer join cad_Motivo_Nao_Aprovacao_Proposta rep on rep.IdMotivo_Nao_Aprovacao_Proposta = pft.IdMotivo_Nao_Aprovacao_Proposta
         left outer join cad_Pessoa arm on arm.IdPessoa = oft.IdCompanhia_Transporte

         where DATEPART(year, pft.Data_Proposta) = 2024 and oft.Tipo_Operacao = 2`
      );

      return result;
   },

   fretes_china_fcl: async function (){
      const result = await executeQuerySQL(
         `SELECT
            Oft.Valor_Pagamento_Unitario as 'frete',
            Prf.Data_Proposta,
            Ofr.Data_Validade,
            DATEPART(month, Ofr.Data_Validade) as 'mes_validade',
            Ori.Nome AS origem,
            Des.Nome AS destino,
            Prf.Numero_Proposta,
            Eqp.Descricao
         FROM
            mov_Proposta_Frete Prf
         LEFT OUTER JOIN 
            mov_Proposta_Frete_Carga Pfc ON Pfc.IdProposta_Frete = Prf.IdProposta_Frete
         LEFT OUTER JOIN
            mov_Oferta_Frete Ofr ON Ofr.IdProposta_Frete = Prf.IdProposta_Frete
         LEFT OUTER JOIN
            mov_Oferta_Frete_Taxa Oft ON Oft.IdOferta_Frete = Ofr.IdOferta_Frete
         LEFT OUTER JOIN
            cad_Origem_Destino Ori ON Ori.IdOrigem_Destino = Ofr.IdOrigem
         LEFT OUTER JOIN
            cad_Origem_Destino Des ON Des.IdOrigem_Destino = Ofr.IdDestino
         LEFT OUTER JOIN
            cad_Equipamento_Maritimo Eqp ON Eqp.IdEquipamento_Maritimo = Oft.IdEquipamento_Maritimo
         WHERE
            DATEPART(YEAR, Prf.Data_Proposta) = 2024
         AND
            Ofr.IdOrigem IN (596/*NGB*/,78/*SHA*/,85/*YAN*/,645/*SHEN*/,658/*SHEK*/,162/*HK*/,79/*QING*/)
         AND
            Ofr.IdDestino IN (43/*NVT*/,45/*PNG*/,594/*IOA*/,50/*SSZ*/)
         AND
            Oft.IdTaxa_Logistica_Exibicao IN (2 /*FCL*/)
         -- AND 
         --     Prf.Situacao = 2 /*Aprovada*/
         AND
            Pfc.Tipo_Carga = 3 /*FCL*/
         AND
            Ofr.Tipo_Operacao = 2 /*Importação*/
         AND
            Ofr.Modalidade_Processo = 2 /*Maritima*/
         AND
            Prf.Numero_Proposta NOT LIKE '%test%'
         AND
            Ofr.Data_Validade <= GETDATE()`
      );

      return result;
   },

   incoterms_pricing_lcl: async function (){
      const result = await executeQuerySQL(
         `SELECT
            Prf.Numero_Proposta,
            Inc.Nome as 'incoterm',
            Prf.Data_Proposta,
            DATEPART(month, Prf.Data_Proposta) as 'mes',
            Pri.Nome as 'pricing'
         FROM
            mov_Proposta_Frete Prf
         LEFT OUTER JOIN 
            mov_Proposta_Frete_Carga Pfc ON Pfc.IdProposta_Frete = Prf.IdProposta_Frete
         LEFT OUTER JOIN
            mov_Oferta_Frete Ofr ON Ofr.IdProposta_Frete_Carga = Pfc.IdProposta_Frete_Carga
         LEFT OUTER JOIN
            cad_Incoterm Inc ON Inc.IdIncoterm = Ofr.IdIncoterm
         LEFT OUTER JOIN
            mov_Projeto_Atividade_Responsavel Par ON Par.IdProjeto_Atividade = Prf.IdProjeto_Atividade AND (Par.IdPapel_Projeto = 5) /*Pricing*/
         LEFT OUTER JOIN
            Cad_Pessoa Pri ON Pri.IdPessoa = Par.IdResponsavel
         WHERE
            DATEPART(YEAR,Prf.Data_Proposta) = 2024
         AND
            Pfc.Tipo_Carga = 4 /*LCL*/
         AND
            Ofr.Tipo_Operacao = 2 /*Importação*/
         AND
            Prf.Numero_Proposta NOT LIKE '%test%'`
      );

      return result;
   }

}

module.exports = {
   helpers: helpers
};
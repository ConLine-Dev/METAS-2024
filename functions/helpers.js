const { executeQuerySQL } = require('../connect/headCargo');
const { executeQuery } = require('../connect/mysql');

let anoAtual = 2024;
let anoAnterior = 2023

const helpers = {
   resultados_ano_anterior: async function() {
      const result = await executeQuerySQL(`SELECT * FROM vis_Fluxo_Caixa_Novas_Metas WHERE ANO = ${anoAnterior}`);

      return result;
   },

   resultados_ano_atual: async function() {
      const result = await executeQuerySQL(`SELECT * FROM vis_Fluxo_Caixa_Novas_Metas WHERE ANO = ${anoAtual}`);

      return result;
   },

   processos_ano_anterior: async function() {
      const result = await executeQuerySQL(`SELECT * FROM vis_Metas_Processo_Nova WHERE ANO = ${anoAnterior}`);

      return result;
   },

   processos_ano_atual: async function() {
      const result = await executeQuerySQL(`SELECT * FROM vis_Metas_Processo_Nova WHERE ANO = ${anoAtual}`);

      return result;
   },

   ultimos_9_processos: async function() {
      const result = await executeQuerySQL(`SET LANGUAGE Portuguese SELECT TOP 9 * FROM vis_Metas_Processo_Nova ORDER BY IdLogistica_House DESC`);

      return result;
   },

   ultimo_processo_por_modal: async function(modalidade) {
      const result = await executeQuerySQL(`SET LANGUAGE Portuguese SELECT TOP 1 * FROM vis_Metas_Processo_Nova WHERE MODALIDADE = '${modalidade}' ORDER BY IdLogistica_House DESC`);
      return result;
  },
  
   ultimo_processo_gerado: async function() {
      const result = await executeQuerySQL(`SET LANGUAGE Portuguese SELECT TOP 1 * FROM vis_Metas_Processo_Nova ORDER BY IdLogistica_House DESC`);

      return result;
   },

   teus_tons_ano_anterior: async function() {
      const result = await executeQuerySQL(`SELECT * FROM vis_Metas_Tons_Teus_Nova WHERE ANO = ${anoAnterior}`);

      return result;
   },

   teus_tons_ano_atual: async function() {
      const result = await executeQuerySQL(`SELECT * FROM vis_Metas_Tons_Teus_Nova WHERE ANO = ${anoAtual}`);

      return result;
   },

   nivel_acesso: async function(nivel, email) {
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

   comerciais: async function() {
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

   admin_comerciais: async function() {
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

   meta_financeira_comercial: async function() {
      const result = await executeQuerySQL(`
         SELECT
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
         
            Lmd.Total_Pagamento AS TOTAL_PAGAMENTO,
            Lmd.Total_Recebimento AS TOTAL_RECEBIMENTO,
         
            Lmd.Lucro_Estimado AS LUCRO_ESTIMADO,
            Lmd.Lucro_Efetivo AS LUCRO_EFETIVO
         
         FROM
            mov_Logistica_House Lhs
         LEFT OUTER JOIN
            cad_Pessoa Cli ON Cli.IdPessoa = Lhs.IdCliente
         LEFT OUTER JOIN
            vis_Funcionario Fnc ON Fnc.IdPessoa = Lhs.IdVendedor
         LEFT OUTER JOIN
            mov_Logistica_Moeda Lmd ON Lmd.IdLogistica_House = Lhs.IdLogistica_House
         WHERE
            DATEPART(YEAR, Lhs.Data_Abertura_Processo) = ${anoAtual}
            AND Lhs.Numero_Processo NOT LIKE '%test%'
            AND Lhs.Numero_Processo NOT LIKE '%DEMU%'
            AND Lmd.IdMoeda = 110
      `)

      return result;
   },

   proposta_meta_comercial: async function() {
      const result = await executeQuerySQL(`
         SELECT
            Pfr.IdProposta_Frete,

            DATEPART(YEAR, Pfr.Data_Proposta) AS ANO,
            DATEPART(MONTH, Pfr.Data_Proposta) AS MES,

            Pfr.IdVendedor AS ID_VENDEDOR,
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
      `)

      return result;
   },

   operacional_por_processo: async function(numero_processo) {
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

   cadastrar_operacional_por_processo: async function(numero_processo, id_operacional, id_moeda, valor, descricao){
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
         Par.IdResponsavel
      FROM
         mov_Atividade Atv
      LEFT OUTER JOIN
         mov_Atividade_Historico Ath ON Ath.IdAtividade = Atv.IdAtividade
      LEFT OUTER JOIN
         mov_Logistica_House Lhs ON Lhs.IdProjeto_Atividade = Atv.IdProjeto_Atividade
      LEFT OUTER JOIN
         mov_Projeto_Atividade_Responsavel Par ON Par.IdProjeto_Atividade = Lhs.IdProjeto_Atividade
      WHERE
         Atv.IdTarefa = 1625 /*Conferir Valores*/
         AND Ath.Situacao = 3 /*Paralisada*/
         AND Par.IdPapel_Projeto = 2 /*Operacional*/;
         `)

      return result;
   },

   divergencias_ce_mercante: async function () {
      const result = await executeQuerySQL(
         `SELECT * FROM vis_Divergencias_CE;
         `)

      return result;
   }


}

module.exports = {
   helpers: helpers
};
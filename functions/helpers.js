const { executeQuerySQL } = require('../connect/headCargo');

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


}




module.exports = {
   helpers: helpers
};
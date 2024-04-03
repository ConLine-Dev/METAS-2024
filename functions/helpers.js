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

   admin_cards_comerciais: async function() {
      const result = await executeQuerySQL(`
         SELECT
            Lhs.IdVendedor,
            Ven.Nome,
            Ven.EMail,
            COALESCE(Lhs.Processos, 0) AS Processos,
            COALESCE(Pfr.Propostas, 0) AS Propostas,
            COALESCE(Lmd.Lucro_Estimado, 0) AS Lucro_Estimado
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
               Lhs.IdVendedor,
               SUM(Lmd.Lucro_Estimado) AS Lucro_Estimado
            FROM
               mov_Logistica_Moeda Lmd
            LEFT OUTER JOIN
               mov_Logistica_House Lhs ON Lhs.IdLogistica_House = Lmd.IdLogistica_House
            WHERE
               Lhs.Numero_Processo NOT LIKE '%test%'
               AND Lhs.Numero_Processo NOT LIKE '%DEMU%'
               AND Lhs.Situacao_Agenciamento NOT IN (7 /* CANCELADOS */)
               AND DATEPART(YEAR, Lhs.Data_Abertura_Processo) = ${anoAtual}
               AND Lmd.IdMoeda = 110
            GROUP BY
               Lhs.IdVendedor
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

   admin_modal_valores_comerciais: async function(IdVendedor) {
      // Consulta no banco da head
      const result_Head = await executeQuerySQL(`
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
               Lhs.IdVendedor,
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
               END AS Mes,
               DATEPART(MONTH, Lhs.Data_Abertura_Processo) AS Mes_numero,
               SUM(Lmd.Lucro_Estimado) AS Lucro_Estimado,
               SUM(Lmd.Lucro_Efetivo) AS Lucro_Efetivo
            FROM
               mov_Logistica_Moeda Lmd
            LEFT OUTER JOIN
               mov_Logistica_House Lhs ON Lhs.IdLogistica_House = Lmd.IdLogistica_House
            WHERE
               Lhs.Numero_Processo NOT LIKE '%test%'
               AND Lhs.Numero_Processo NOT LIKE '%DEMU%'
               AND Lhs.Situacao_Agenciamento NOT IN (7 /* CANCELADOS */)
               AND DATEPART(YEAR, Lhs.Data_Abertura_Processo) = ${anoAtual}
               AND Lmd.IdMoeda = 110
            GROUP BY
               Lhs.IdVendedor,
               DATEPART(MONTH, Lhs.Data_Abertura_Processo)
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
               Mes: item.Mes,
               Lucro_Efetivo: item.Lucro_Efetivo,
               Lucro_Estimado: item.Lucro_Estimado,
               Meta: meta.valor_meta
            })
         } else {
            result_valores_comercial.push({
               Mes: item.Mes,
               Lucro_Efetivo: item.Lucro_Efetivo,
               Lucro_Estimado: item.Lucro_Estimado,
               Meta: 0
            })
         }
      }

      return result_valores_comercial;
   },

   inserir_meta_comercial: async function(body) {
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

   operacionais: async function() {
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

   admin_operacionais: async function() {
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

   meta_financeira_comercial: async function(IdVendedor, email) {
      const where_vendedor = IdVendedor ? `and Lhs.IdVendedor = ${IdVendedor}` : '';
      const where_email = email ? `and Fnc.EMail = '${email}'` : '';
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
            Fnc.EMail AS EMAIL_VENDEDOR,
         
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
            AND Lhs.Situacao_Agenciamento NOT IN (7 /* CANCELADOS */)
            AND Lmd.IdMoeda = 110
            ${where_vendedor}
            ${where_email}
      `)

      return result;
   },

   proposta_meta_comercial: async function(IdVendedor, email) {
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

   processos_meta_comercial: async function(IdVendedor, email) {
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
   }

}

module.exports = {
   helpers: helpers
};
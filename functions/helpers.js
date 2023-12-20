const { executeQuerySQL } = require('../connect/headCargo');

const helpers = {
   resultados_ano_anterior: async function() {
      const result = await executeQuerySQL(`SELECT * FROM vis_Fluxo_Caixa_Novas_Metas WHERE ANO = 2022`);

      return result;
   },

   resultados_ano_atual: async function() {
      const result = await executeQuerySQL(`SELECT * FROM vis_Fluxo_Caixa_Novas_Metas WHERE ANO = 2023`);

      return result;
   },

   processos_ano_anterior: async function() {
      const result = await executeQuerySQL(`SELECT * FROM vis_Metas_Processo_Nova WHERE ANO = 2022`);

      return result;
   },

   processos_ano_atual: async function() {
      const result = await executeQuerySQL(`SELECT * FROM vis_Metas_Processo_Nova WHERE ANO = 2023`);

      return result;
   },

   teus_tons_ano_anterior: async function() {
      const result = await executeQuerySQL(`SELECT * FROM vis_Metas_Tons_Teus_Nova WHERE ANO = 2022`);

      return result;
   },

   teus_tons_ano_atual: async function() {
      const result = await executeQuerySQL(`SELECT * FROM vis_Metas_Tons_Teus_Nova WHERE ANO = 2023`);

      return result;
   }

}






module.exports = {
   helpers: helpers
};
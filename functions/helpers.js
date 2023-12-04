const { executeQuerySQL } = require('../connect/headCargo');

const helpers = {
   resultados_ano_anterior: async function() {
      const result = await executeQuerySQL(`SELECT * FROM vis_Fluxo_Caixa_Ano_Anterior_Ao_Ano_Atual`);

      return result;
   },

}






module.exports = {
   helpers: helpers
};
// helper-functions.js
const funcoesExportadas = {
   remover_loading: async function () {
      let corpoDashboard = document.querySelector('.corpo-dashboard');
      let loading = document.querySelector('.loading');

      loading.style.display = 'none';
      corpoDashboard.style.display = 'block';
   },
};

export default funcoesExportadas;
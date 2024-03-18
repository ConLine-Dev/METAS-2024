const meta_financeira_comercial = await Thefetch('/api/meta-financeira-comercial');
const comerciais = await Thefetch('/api/comerciais');

let lucro_estimado_por_processo;

async function usuario_logado(consulta) {
   const dados_login = JSON.parse(localStorage.getItem('metasUser'));

   for (let i = 0; i < consulta.length; i++) {
      const item = consulta[i];
      if (item.Email === dados_login.email) {
         return item.IdPessoa;
      }
   }
}

async function lucro_estimado_mes_atual(consulta) {
   const data_atual = new Date();
   const mes_atual = data_atual.getMonth() + 1;

   const idUsuarioLogado = await usuario_logado(comerciais);


   // Usa o reduce para somar os valores de lucro estimado do mes atual
   const lucro_estimado = consulta.reduce((total, item) => {
      // Verifica se o usuario logado é um vendedor e se existe registros de valores para o mes atual para somar
      if (mes_atual === item.MES && idUsuarioLogado == item.ID_VENDEDOR) {
         return total + item.LUCRO_ESTIMADO;
      }
      return total;
   }, 0);

   const html_lucro_estimado = document.getElementById('lucro-estimado');
   html_lucro_estimado.textContent = lucro_estimado.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})
}

async function faturamento_processo(consulta) {
   const id_usuario_logado = await usuario_logado(comerciais);
   const lucratividade_processos = {};

   for (let i = 0; i < consulta.length; i++) {
      const item = consulta[i];
      if (item.ID_VENDEDOR === id_usuario_logado) {
         const numero_processo = item.NUMERO_PROCESSO;
         lucratividade_processos[numero_processo] = {
            numero_processo: item.NUMERO_PROCESSO,
            pagamento: item.TOTAL_PAGAMENTO,
            recebimento: item.TOTAL_RECEBIMENTO,
            lucro: item.LUCRO_ESTIMADO
         };
      }
   }

   // Converter o objeto em um array de objetos
   const resultados = Object.values(lucratividade_processos);

   lucro_estimado_por_processo = $('.table').DataTable({
      "data": resultados,
      "columns": [
            { "data": "numero_processo" },
            { 
               "data": "recebimento",
               "className": "recebimento",
               "render": function (data, type, row) {
                  return `<span class="badge bg-success-transparent">${data.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'})}</span>`;
               }
            },
            { 
               "data": "pagamento",
               "className": "pagamento",
               "render": function (data, type, row) {
                  return `<span class="badge bg-danger-transparent">${data.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'})}</span>`;
               }
            },
            { 
               "data": "lucro",
               "className": "lucro",
               "render": function (data, type, row) {
                  return `<span>${data.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'})}</span>`;
               }
            }
      ],
      "language": {
            url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/pt-BR.json' // Tradução para o português do Brasil
      },
      "order": [[3, 'desc']],
      "lengthMenu": [[8], [8]],
      "pageLenght": 8
   });
}

async function eventos_cliques() {
   const input_pesquisa_processo = document.querySelector('#pesquisar-processos');
   input_pesquisa_processo.addEventListener('keyup', function (e) {
      e.preventDefault();

      const valor_texto = this.value.toUpperCase();
      lucro_estimado_por_processo.search(valor_texto).draw();
   });


}


async function mostrar_loading() {
   let img = document.getElementById('loading-img');

   // Define o caminho do gif
   img.src = "/assets/images/brand-logos/SLOGAN VERMELHO.gif";
}

async function remover_loading() {
   let corpoDashboard = document.querySelector('.corpo-dashboard');
   let loading = document.querySelector('.loading');

   loading.style.display = 'none';
   corpoDashboard.style.display = 'block';
}



async function main() {
   await mostrar_loading();
   await lucro_estimado_mes_atual(meta_financeira_comercial)
   await faturamento_processo(meta_financeira_comercial)
   await eventos_cliques();
   await remover_loading();
}

await main();
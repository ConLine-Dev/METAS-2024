const meta_financeira_comercial = await Thefetch('/api/meta-financeira-comercial');
const proposta_meta_comercial = await Thefetch('/api/proposta-meta-comercial');
const comerciais = await Thefetch('/api/comerciais');

const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

let lucro_estimado_por_processo;

async function usuario_logado(consulta) {
   const dados_login = JSON.parse(localStorage.getItem('metasUser'));

   for (let i = 0; i < consulta.length; i++) {
      const item = consulta[i];
      if (item.Email === dados_login.email) {
         return item.IdPessoa;
      }
   }
};

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
};

// Retorna o total de processo, proposta o que for passado na consulta, mas tem que tem o ID_VENDEDOR e o MES na consulta
async function quantidade_itens_mes_atual(consulta, situacao) {
   const id_usuario_logado = await usuario_logado(comerciais);

   // Retorna os itens do mes atual e do usuario logado
   const total =  consulta.filter(item => item.Situacao === situacao && id_usuario_logado === item.ID_VENDEDOR);

   return total;
};

async function grafico_proposta_processo() {
   const propostas_aprovadas = await quantidade_itens_mes_atual(proposta_meta_comercial, 'APROVADA');
   const propostas_nao_aprovadas = await quantidade_itens_mes_atual(proposta_meta_comercial, 'NAO APROVADA');
   const processos = await quantidade_itens_mes_atual(meta_financeira_comercial, 'PROCESSO');
   const processos_cancelados = await quantidade_itens_mes_atual(meta_financeira_comercial, 'CANCELADO');

   const propostas_aprovadas_html = document.getElementById('propostas-aprovadas');
   const propostas_nao_aprovadas_html = document.getElementById('propostas-nao-aprovadas');
   const processos_html = document.getElementById('processos');
   const processos_cancelados_html = document.getElementById('processos-cancelados');

   // Caso nao retorno nada, ele vai inserir zero
   propostas_aprovadas_html.textContent = Math.max(propostas_aprovadas.length, 0);
   propostas_nao_aprovadas_html.textContent = Math.max(propostas_nao_aprovadas.length, 0);
   processos_html.textContent = Math.max(processos.length, 0);
   processos_cancelados_html.textContent = Math.max(processos_cancelados.length, 0);

   const dados_grafico_propostas = [
      propostas_aprovadas.length,
      propostas_nao_aprovadas.length,
   ];

   const dados_grafico_processos = [
      processos.length,
      processos_cancelados.length
   ];

   var options_propostas = {
      series: dados_grafico_propostas,
      chart: {
         type: 'pie',
         width: '100%',
      },
      labels: ['Prop. Aprovadas.', 'Prop. Não Aprovadas'],
      dataLabels: {
         formatter(val, opts) {
           const name = opts.w.globals.labels[opts.seriesIndex]
           return [name, val.toFixed(1) + '%']
         }
      },
      legend: {
         show: false
      }
   };

   var options_processos = {
      series: dados_grafico_processos,
      chart: {
         type: 'pie',
         width: '100%',
      },
      labels: ['Processos', 'Processo Cancelados'],
      dataLabels: {
         formatter(val, opts) {
           const name = opts.w.globals.labels[opts.seriesIndex]
           return [name, val.toFixed(1) + '%']
         }
      },
      legend: {
         show: false
      }
   };

   var grafico_propostas = new ApexCharts(document.querySelector("#grafico-propostas"), options_propostas);
   grafico_propostas.render();

   var grafico_processos = new ApexCharts(document.querySelector("#grafico-processos"), options_processos);
   grafico_processos.render();

};

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
};

async function lucro_estimado_mes_a_mes(consulta) {
   const id_usuario_logado = await usuario_logado(comerciais);
   const soma_por_mes = [];

   for (let i = 0; i < consulta.length; i++) {
      const item = consulta[i];
      const mes_existente = soma_por_mes.find(mes => mes.MES === item.MES); // Encontra o mes na consulta do banco e salva na variavel

      if (item.ID_VENDEDOR === id_usuario_logado) {
         if (mes_existente) {
            mes_existente.LUCRO_ESTIMADO += item.LUCRO_ESTIMADO; // Se o mes existir na variavel ele concatena o novo valor localizado
         } else {
            soma_por_mes.push({
               MES: item.MES,
               LUCRO_ESTIMADO: item.LUCRO_ESTIMADO
            });
         }
      }
   }

   soma_por_mes.sort((a, b) => a.MES - b.MES); // Ordena os meses em ordem crescendo, ou seja, de Janeiro a Dezembro.
   return soma_por_mes
};

async function grafico_lucro_estimado(consulta) {
   const lucro_estimado = await lucro_estimado_mes_a_mes(consulta);

   const valores_arrecadados = lucro_estimado.map(item => (item.LUCRO_ESTIMADO).toFixed(2));
   
   const metas_mensais = [30000,35000,40000,0,0,0,0,0,0,0,0,0]
   
   var options = {
      series: [{
         name: 'Lucro Estimado',
         data: valores_arrecadados
      }, {
         name: 'Meta',
         data: metas_mensais
      }],

      chart: {
         type: 'bar',
         height: 200,
         toolbar: {
            show: false
         },
      },

      colors: ['#F9423A', '#3F2021'],

      plotOptions: {
         bar: {
            borderRadius: 5,
            columnWidth: '70%',
            horizontal: false,
            dataLabels: {
               position: 'top',
            },
         }
      },
      dataLabels: {
         enabled: false,
      },
       
      stroke: {
         show: true,
         width: 1,
         colors: ['#fff']
      },

      tooltip: {
         shared: true,
         enabled: true,
         intersect: false,
         y: {
           formatter: function (val) {
             return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
           }
         }
       },
       

      xaxis: {
         categories: meses,
         labels: {
            show: true,
         }
      },

      yaxis: {
         show: false,
      },

   };

   const chart = new ApexCharts(document.querySelector("#lucro-estimado-mes-a-mes"), options);
   chart.render();
}
await grafico_lucro_estimado(meta_financeira_comercial)



async function eventos_cliques() {
   const input_pesquisa_processo = document.querySelector('#pesquisar-processos');
   input_pesquisa_processo.addEventListener('keyup', function (e) {
      e.preventDefault();

      const valor_texto = this.value.toUpperCase();
      lucro_estimado_por_processo.search(valor_texto).draw();
   });


};


async function mostrar_loading() {
   let img = document.getElementById('loading-img');

   // Define o caminho do gif
   img.src = "/assets/images/brand-logos/SLOGAN VERMELHO.gif";
};

async function remover_loading() {
   let corpoDashboard = document.querySelector('.corpo-dashboard');
   let loading = document.querySelector('.loading');

   loading.style.display = 'none';
   corpoDashboard.style.display = 'block';
};



async function main() {
   await mostrar_loading();
   await lucro_estimado_mes_atual(meta_financeira_comercial);
   await faturamento_processo(meta_financeira_comercial);
   await eventos_cliques();
   await grafico_proposta_processo();
   await remover_loading();
}

await main();
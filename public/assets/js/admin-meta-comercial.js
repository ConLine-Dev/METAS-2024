const admin_cards_comerciais = await Thefetch('/api/admin-cards-comerciais');
let lucro_estimado_por_processo;
const meses_grafico = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

const meses = [
   {label: 'Janeiro', value: 1},
   {label: 'Fevereiro', value: 2},
   {label: 'Março', value: 3},
   {label: 'Abril', value: 4},
   {label: 'Maio', value: 5},
   {label: 'Junho', value: 6},
   {label: 'Julho', value: 7},
   {label: 'Agosto', value: 8},
   {label: 'Setembro', value: 9},
   {label: 'Outubro', value: 10},
   {label: 'Novembro', value: 11},
   {label: 'Dezembro', value: 12},
];

// Insere as opções dentro do select de meses
const opcoes_meses = new Choices(
   '#meses',
   {
      allowHTML: true,
      choices: meses,
      sorter: function(a, b) {
         return a.value - b.value;
      },
      noResultsText: 'Não há opções disponíveis',
      placeholder: false,
   }
);

// Adiciona o regex no input de valor de meta
new Cleave('#input-meta', {
   prefix: 'R$ ',
   numeral: true,
   numeralIntegerScale: 7,
   numeralDecimalScale: 2,
   numeralDecimalMark: ',',
   delimiter: '.',
});

// Função para inserir os vendedores
async function vendedores(consulta) {
   const time_vendedores = document.querySelector('#time-vendedores');

   for (let i = 0; i < consulta.length; i++) {
      const item = consulta[i];
      
      const card_html = `
         <div type="button" class="btn col-xxl-4 col-xl-6 col-lg-6 col-md-6 col-sm-12 modal-vendedor" style="border: none;" data-IdVendedor="${item.IdVendedor}">
            <div class="card custom-card team-member-card">

               <div class="teammember-cover-image my-4">
                  <span class="avatar avatar-xl avatar-rounded">
                        <img src="https://cdn.conlinebr.com.br/colaboradores/${item.IdVendedor}" alt="">
                  </span>
               </div>

               <div class="card-body p-0">
                  <div class="d-flex flex-wrap align-item-center mt-sm-0 mt-5 justify-content-between border-bottom border-block-end-dashed p-3" style="margin-top: -25px !important;">
                        <div class="team-member-details flex-fill">
                           <p class="mb-0 fw-semibold fs-16 text-truncate">
                              <a href="javascript:void(0);">${item.Nome}</a>
                           </p>
                           <p class="mb-0 fs-12 text-muted text-break">${item.EMail}</p>
                        </div>
                  </div>

                  <div class="team-member-stats d-sm-flex justify-content-evenly">
                        <div class="text-center p-3 my-auto">
                           <p class="fw-semibold mb-0">Propostas Aprovadas</p><span class="text-muted fs-12">${item.Propostas}</span>
                        </div>
                        <div class="text-center p-3 my-auto">
                           <p class="fw-semibold mb-0">Processos</p><span class="text-muted fs-12">${item.Processos}</span>
                        </div>
                        <div class="text-center p-3 my-auto">
                           <p class="fw-semibold mb-0">Lucro Estimado</p><span class="text-muted fs-12">${item.Lucro_Estimado.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span>
                        </div>
                  </div>
               </div>
            </div>
         </div>
      `

      // Adiciona a string HTML ao array
      time_vendedores.insertAdjacentHTML('beforeend', card_html);
   }
};

// Pega o lucro estimado do vendedor no mes atual
async function lucro_estimado_mes_atual(consulta) {
   const data_atual = new Date();
   const mes_atual = data_atual.getMonth() + 1;

   // Usa o reduce para somar os valores de lucro estimado do mes atual
   const lucro_estimado = consulta.reduce((total, item) => {
      // Verifica se o usuario logado é um vendedor e se existe registros de valores para o mes atual para somar
      if (mes_atual === item.MES) {
         return total + item.LUCRO_ESTIMADO;
      }
      return total;
   }, 0);

   const html_lucro_estimado = document.getElementById('lucro-estimado');
   html_lucro_estimado.textContent = lucro_estimado.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})
};

// Retorna o total de processo, proposta o que for passado na consulta, mas tem que tem o ID_VENDEDOR e o MES na consulta
async function quantidade_itens_mes_atual(consulta, situacao) {
   // Retorna os itens do mes atual e do usuario logado
   const total =  consulta.filter(item => item.Situacao === situacao);

   return total;
};

// Cria o grafico com o total de propostas e processos aprovados e cancelados
async function grafico_proposta_processo(proposta_meta_comercial, processos_meta_comercial) {
   const propostas_aprovadas = await quantidade_itens_mes_atual(proposta_meta_comercial, 'APROVADA');
   const propostas_nao_aprovadas = await quantidade_itens_mes_atual(proposta_meta_comercial, 'NAO APROVADA');
   const processos = await quantidade_itens_mes_atual(processos_meta_comercial, 'PROCESSO');
   const processos_cancelados = await quantidade_itens_mes_atual(processos_meta_comercial, 'CANCELADO');

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

// Cria a tabela com os processos e o total de recebimento, pagamento e lucro de cada um
async function faturamento_processo(consulta) {
   const lucratividade_processos = {};

   for (let i = 0; i < consulta.length; i++) {
      const item = consulta[i];
      const numero_processo = item.NUMERO_PROCESSO;
      lucratividade_processos[numero_processo] = {
         numero_processo: item.NUMERO_PROCESSO,
         pagamento: item.TOTAL_PAGAMENTO,
         recebimento: item.TOTAL_RECEBIMENTO,
         lucro: item.LUCRO_ESTIMADO
      };
   }

   // Converter o objeto em um array de objetos
   const resultados = Object.values(lucratividade_processos);

   // Se a tabela do datatable ja existir, destroi
   if (lucro_estimado_por_processo) {
      lucro_estimado_por_processo.destroy();
   }

   lucro_estimado_por_processo = $('.table').DataTable({
      "data": resultados,
      "columns": [
            { "data": "numero_processo" },
            { 
               "data": "recebimento",
               "className": "recebimento",
               "render": function (data, type, row) {
                  return `<span class="badge bg-success-transparent">${data ? data.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'}) : ''}</span>`;
               }
            },
            { 
               "data": "pagamento",
               "className": "pagamento",
               "render": function (data, type, row) {
                  return `<span class="badge bg-danger-transparent">${data ? data.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'}) : ''}</span>`;
               }
            },
            { 
               "data": "lucro",
               "className": "lucro",
               "render": function (data, type, row) {
                  return `<span>${data ? data.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'}) : ''}</span>`;
               }
            }
      ],
      "language": {
            url: '/assets/libs/dataTables/dataTables.plugins.pt-br.json' // Tradução para o português do Brasil
      },
      "order": [[3, 'desc']],
      "lengthMenu": [[8], [8]],
      "pageLenght": 8
   });
};

// Retonar um array com o lucro estimado de cada mes
async function lucro_estimado_mes_a_mes(consulta) {
   const soma_por_mes = [];

   for (let i = 0; i < consulta.length; i++) {
      const item = consulta[i];
      const mes_existente = soma_por_mes.find(mes => mes.MES === item.MES); // Encontra o mes na consulta do banco e salva na variavel

      if (mes_existente) {
         mes_existente.LUCRO_ESTIMADO += item.LUCRO_ESTIMADO; // Se o mes existir na variavel ele concatena o novo valor localizado
      } else {
         soma_por_mes.push({
            MES: item.MES,
            LUCRO_ESTIMADO: item.LUCRO_ESTIMADO
         });
      }
   }

   soma_por_mes.sort((a, b) => a.MES - b.MES); // Ordena os meses em ordem crescendo, ou seja, de Janeiro a Dezembro.
   return soma_por_mes
};

// Cria os graficos de lucro estimado de cada mes
async function grafico_lucro_estimado(consulta) {
   const lucro_estimado = await lucro_estimado_mes_a_mes(consulta);

   const valores_arrecadados = lucro_estimado.map(item => Number((item.LUCRO_ESTIMADO).toFixed(2)));
   
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
            columnWidth: '60%',
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
         categories: meses_grafico,
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
};

async function carrega_indicadores_comercial(IdVendedor) {

   await limparModal();

   let meta_financeira_comercial = await Thefetch(`/api/meta-financeira-comercial?IdVendedor=${IdVendedor}`);
   let proposta_meta_comercial = await Thefetch(`/api/proposta-meta-comercial?IdVendedor=${IdVendedor}`);
   let processos_meta_comercial = await Thefetch(`/api/processos-meta-comercial?IdVendedor=${IdVendedor}`);

   // Inserir o nome do comercial no modal
   const nome_comercial = document.querySelector('.nome-comercial');
   nome_comercial.textContent = meta_financeira_comercial[0].VENDEDOR;
   // Insere o lucro estimado do mes atual
   await lucro_estimado_mes_atual(meta_financeira_comercial);

   // Insere o grafico de processos e proposta
   await grafico_proposta_processo(proposta_meta_comercial, processos_meta_comercial);

   // Cria tabela com datatables com o faturamento estimado de cada processo
   await faturamento_processo(meta_financeira_comercial);

   // Cria o grafico mes a mes do lucro estimado
   await grafico_lucro_estimado(meta_financeira_comercial);
};

async function limparModal() {
   // Remove todas as divs filhas da div grafico-propostas
   const graficoPropostas = document.querySelector('#grafico-propostas');
   const filhosGraficoPropostas = graficoPropostas.querySelectorAll('div');
   filhosGraficoPropostas.forEach(divFilha => {
      divFilha.remove();
   });

   // Remove todas as divs filhas da div grafico-processos
   const graficoProcessos = document.querySelector('#grafico-processos');
   const filhosGraficoProcessos = graficoProcessos.querySelectorAll('div');
   filhosGraficoProcessos.forEach(divFilha => {
      divFilha.remove();
   });

   // Remove todas as divs filhas da div grafico-processos
   const grafico_lucro_estimado = document.querySelector('#lucro-estimado-mes-a-mes');
   const filhos_grafico_lucro_estimado = grafico_lucro_estimado.querySelectorAll('div');
   filhos_grafico_lucro_estimado.forEach(divFilha => {
      divFilha.remove();
   });

}

async function eventos_cliques() {
   // Pega todas as classes
   const vendedor_clicado = document.querySelectorAll('.imagem-vendedores');
   // Faz um forEach em todas as tags capturadas
   vendedor_clicado.forEach(elemento => {
      elemento.addEventListener('click', function() {
         // Ao clicar em qualquer outro vendedor, vai remover a classe do que estava selecionado e inserir no clicado
         vendedor_clicado.forEach(selecionado => {
            selecionado.classList.remove('vendedor-selecionado')
         });

         elemento.classList.add('vendedor-selecionado')
      })
   });

   document.querySelectorAll('.modal-vendedor').forEach(element => {
      element.addEventListener('click', async function(e) {
         const IdVendedor = this.getAttribute('data-IdVendedor');
         await mostrar_loading_modal(); // Adiciona o loading ao abrir o modal
         await carrega_indicadores_comercial(IdVendedor);
         await remover_loading(); // remove o loading ao fechar o modal
         $('#exampleModalXl').modal('show');
      })
   });

   const input_pesquisa_processo = document.querySelector('#pesquisar-processos');
   input_pesquisa_processo.addEventListener('keyup', function (e) {
   e.preventDefault();

      const valor_texto = this.value.toUpperCase();
      lucro_estimado_por_processo.search(valor_texto).draw();
   });

};

async function mostrar_loading_modal() {
   let loading_modal = document.querySelector('.loading-modal');

   loading_modal.style.display = 'flex';
};

async function remover_loading() {
   let loading = document.querySelector('.loading');
   let loading_modal = document.querySelector('.loading-modal');

   loading.style.display = 'none';

   setTimeout(() => {
      loading_modal.style.display = 'none';   
   }, 750);
};

async function main() {
   await vendedores(admin_cards_comerciais);
   await eventos_cliques();
   await remover_loading();
};

await main();
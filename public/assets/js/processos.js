import funcoesExportadas from "./helper-functions.js";

const processos_ano_anterior = await Thefetch('/api/processos-ano-anterior');
const processos_ano_atual = await Thefetch('/api/processos-ano-atual')
console.log(processos_ano_anterior);
const meta = 1.15;

const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']


// Função que insere os cards anuais
async function cards_anuais() {
   // Dados ano anterior
   const IM_ano_anterior = processos_ano_anterior.filter(palavra => palavra.MODALIDADE === 'IM');
   const EM_ano_anterior = processos_ano_anterior.filter(palavra => palavra.MODALIDADE === 'EM');
   const IA_ano_anterior = processos_ano_anterior.filter(palavra => palavra.MODALIDADE === 'IA');
   const EA_ano_anterior = processos_ano_anterior.filter(palavra => palavra.MODALIDADE === 'EA');

   const IM_meta = parseInt(IM_ano_anterior.length * meta);
   const EM_meta = parseInt(EM_ano_anterior.length * meta);
   const IA_meta = parseInt(IA_ano_anterior.length * meta);
   const EA_meta = parseInt(EA_ano_anterior.length * meta);

   // Dados ano atual
   const IM_ano_atual = processos_ano_atual.filter(palavra => palavra.MODALIDADE === 'IM');
   const EM_ano_atual = processos_ano_atual.filter(palavra => palavra.MODALIDADE === 'EM');
   const IA_ano_atual = processos_ano_atual.filter(palavra => palavra.MODALIDADE === 'IA');
   const EA_ano_atual = processos_ano_atual.filter(palavra => palavra.MODALIDADE === 'EA');

   const IM_total_atual = parseInt(IM_ano_atual.length);
   const EM_total_atual = parseInt(EM_ano_atual.length);
   const IA_total_atual = parseInt(IA_ano_atual.length);
   const EA_total_atual = parseInt(EA_ano_atual.length);

   // Porcentagens meta anual
   const IM_porcentagem = (IM_total_atual / IM_meta) * 100;
   const EM_porcentagem = (EM_total_atual / EM_meta) * 100;
   const IA_porcentagem = (IA_total_atual / IA_meta) * 100;
   const EA_porcentagem = (EA_total_atual / EA_meta) * 100;

   const card_IM = document.querySelector('#card-IM');
   const card_IA = document.querySelector('#card-IA');
   const card_EM = document.querySelector('#card-EM');
   const card_EA = document.querySelector('#card-EA');

   card_IM.textContent = IM_porcentagem.toFixed(2) + '%';
   card_EM.textContent = EM_porcentagem.toFixed(2) + '%';
   card_IA.textContent = IA_porcentagem.toFixed(2) + '%';
   card_EA.textContent = EA_porcentagem.toFixed(2) + '%';


   // Mapeia o array por IdCliente unicos
   const clientes_ano_anterior = Array.from(new Set(processos_ano_anterior.map(obj => obj.IdCliente)));
   const clientes_ano_atual = Array.from(new Set(processos_ano_atual.map(obj => obj.IdCliente)));

   // Obtém a contagem de Clientes Unicos
   const quantidade_clientes_ano_anterior = clientes_ano_anterior.length;
   const meta_clientes = parseInt(quantidade_clientes_ano_anterior * meta);
   const quantidade_clientes_ano_atual = clientes_ano_atual.length;
   const CLI_porcentagem = (quantidade_clientes_ano_atual / meta_clientes) * 100;

   const card_CLI = document.querySelector('#card-CLI');
   card_CLI.textContent = CLI_porcentagem.toFixed(2) + '%';
}


// Função que obtem a quantidade de processo, por modal e por mes
async function contagem_processos_mes(consulta, modalidade) {
   // Inicializa um objeto para armazenar a contagem por mes
   const contagem_por_mes = {};

   // Filtra os obejtos na consulta pela modalidade desejada
   const objetos_filtrados = consulta.filter(item => item.MODALIDADE === modalidade);

   // Item sobre os objetos filtrados
   for (const item of objetos_filtrados) {
      const { MES } = item;

      // Incrementa a contagem para o mes correspondente
      contagem_por_mes[MES] = (contagem_por_mes[MES] || 0 ) + 1;
   }

   // Inicializa um array para armazenar a contagem total por mês
   const contagem_total_por_mes = Array.from({ length: 12 }, (_, index) => {
      const mes = index + 1;
      // Obtém a contagem para o mês atual
      return contagem_por_mes[mes] || 0;
   });

   return contagem_total_por_mes;
}

// Função que cria os graficos
async function graficos_mensais(modalidade) {
   const processos_anterior = await contagem_processos_mes(processos_ano_anterior, modalidade);
   const processos_atual = await contagem_processos_mes(processos_ano_atual, modalidade);

   const meta_processos = processos_anterior.map(valor => parseInt(valor * meta));

   // Porcentagem da meta
   const porcentagens = [];

   // Passado o ano atual, pois se passar o ano anterior pode dar erro ao comparar os dois, visto que no inicio do ano tem poucos meses de registro e nao os 12
   for (let i = 0; i < processos_atual.length; i++) {
      const item1 = processos_atual[i];
      const item2 = meta_processos[i];

      // Calcular porcentagem  e adicionar ao array de porcentagens
      const porcentagem = (item1 / item2) * 100;
      porcentagens.push(porcentagem.toFixed(2));
   }

   var options = {
      series: [{
         name: 'Ano Atual',
         data: processos_atual
      }, {
         name: 'Meta',
         data: meta_processos
      }],

      chart: {
         type: 'bar',
         height: 460,
         toolbar: {
            show: false
         },
      },

      colors: ['#F9423A', '#3F2021'],

      plotOptions: {
         bar: {
            borderRadius: 2,
            columnWidth: '25%',
            horizontal: true,
            dataLabels: {
               position: 'top',
            },
         }
      },
       dataLabels: {
         enabled: true,
         enabledOnSeries: [0],
         formatter: function (val, opts) {
            return porcentagens[opts.dataPointIndex] + "%";
          },
         offsetX: 35,
         style: {
           fontSize: '12px',
           colors: ["#3F2021"],
         },
       },
       
      stroke: {
         show: true,
         width: 1,
         colors: ['#fff']
      },

      tooltip: {
         shared: true,
         enabled: false,
         intersect: false
      },

      xaxis: {
         categories: meses,
         labels: {
            show: false,
         }
      },

   };

   var grafico_meta_anual = {
      series: [{
         data: processos_atual
      }],
   
      colors: ['rgba(249, 66, 58, 0.1)'],
   
      chart: {
         height: 80,
         type: 'line',
         stacked: false,
         toolbar: {
            show: false
          },
      },
   
      stroke: {
         curve: 'smooth',
         width: 2
      },
   

   
       dataLabels: {
         enabled: false
       },
   
       xaxis: {
         labels: {
            show: false,
         },
         axisBorder: {
            show: false,
         },
         axisTicks: {
            show: false,
         },
       },
   
      yaxis: {
         show: false,
      },
   
      grid: {
         show: false,
      },
   
      tooltip: {
         enabled: false,
      }
   }

   var chart = new ApexCharts(document.getElementById(modalidade), options);
   chart.render();

   var meta_anual_grafico_card = new ApexCharts(document.getElementById('grafico_card_' + modalidade), grafico_meta_anual);
   meta_anual_grafico_card.render();
}

// Função que pega a quantidade de cliente por mes
async function quantidade_clientes_por_mes(consulta) {
   // Armazena a quantidade de cliente por mes
   const contagem_por_mes = [];

   for (let i = 0; i < consulta.length; i++) {
      const item = consulta[i];
      const { MES, IdCliente } = item;

      if(!contagem_por_mes[MES]) {
         contagem_por_mes[MES] = new Set();
      }

      contagem_por_mes[MES].add(IdCliente);
   }

   // Convertendo em um array
   const array_cliente = Object.entries(contagem_por_mes).map(([MES, IdCliente]) => (IdCliente.size));

   return array_cliente;
}

// Função que insere os graficos de clientes
async function grafico_mensais_cliente() {
   const clientes_ano_anterior = await quantidade_clientes_por_mes(processos_ano_anterior);
   const cliente_ano_atual = await quantidade_clientes_por_mes(processos_ano_atual);

   const meta_cliente = clientes_ano_anterior.map(valor => parseInt(valor * meta));

   const porcentagens = [];

   for (let i = 0; i < cliente_ano_atual.length; i++) {
      const item1 = cliente_ano_atual[i];
      const item2 = meta_cliente[i];

      console.log(item1, 'atual');
      console.log(item2, 'meta');

      // Calcular porcentagem  e adicionar ao array de porcentagens
      const porcentagem = (item1 / item2) * 100;
      porcentagens.push(porcentagem.toFixed(2));
   }

   var options = {
      series: [{
         name: 'Ano Atual',
         data: cliente_ano_atual
      }, {
         name: 'Meta',
         data: meta_cliente
      }],

      chart: {
         type: 'bar',
         height: 460,
         toolbar: {
            show: false
         },
      },

      colors: ['#F9423A', '#3F2021'],

      plotOptions: {
         bar: {
            borderRadius: 2,
            columnWidth: '25%',
            horizontal: true,
            dataLabels: {
               position: 'top',
            },
         }
      },
       dataLabels: {
         enabled: true,
         enabledOnSeries: [0],
         formatter: function (val, opts) {
            return porcentagens[opts.dataPointIndex] + "%";
          },
         offsetX: 35,
         style: {
           fontSize: '12px',
           colors: ["#3F2021"],
         },
       },
       
      stroke: {
         show: true,
         width: 1,
         colors: ['#fff']
      },

      tooltip: {
         shared: true,
         enabled: false,
         intersect: false
      },

      xaxis: {
         categories: meses,
         labels: {
            show: false,
         }
      },

   };

   var grafico_meta_anual = {
      series: [{
         data: cliente_ano_atual
      }],
   
      colors: ['rgba(249, 66, 58, 0.1)'],
   
      chart: {
         height: 80,
         type: 'line',
         stacked: false,
         toolbar: {
            show: false
          },
      },
   
      stroke: {
         curve: 'smooth',
         width: 2
      },
   

   
       dataLabels: {
         enabled: false
       },
   
       xaxis: {
         labels: {
            show: false,
         },
         axisBorder: {
            show: false,
         },
         axisTicks: {
            show: false,
         },
       },
   
      yaxis: {
         show: false,
      },
   
      grid: {
         show: false,
      },
   
      tooltip: {
         enabled: false,
      }
   }

   var chart = new ApexCharts(document.getElementById('CLIENTES'), options);
   chart.render();

   var meta_anual_grafico_card = new ApexCharts(document.getElementById('grafico_card_CLIENTE'), grafico_meta_anual);
   meta_anual_grafico_card.render();
}
// Função para organizar a execução das demais
async function main() {
   await cards_anuais();
   await graficos_mensais('IM')
   await graficos_mensais('IA')
   await graficos_mensais('EM')
   await graficos_mensais('EA')
   await grafico_mensais_cliente()
   await funcoesExportadas.remover_loading();
}

main()
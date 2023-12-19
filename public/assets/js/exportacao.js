import funcoesExportadas from "./helper-functions.js";

const teus_tons_ano_anterior = await Thefetch('/api/teus_tons_ano_anterior');
const teus_tons_ano_atual = await Thefetch('/api/teus_tons_ano_atual');
const meta = 1.15;

const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

// Função que lista os dados mes a mes por modal, tipo carga e campo
async function soma_dados_mes_mes(consulta, modalidade, tipoCarga, campo) {
   // Filtra os objetos com a modalidade e tipo de carga
   const objetos_filtrados = consulta.filter(obj => obj.MODALIDADE === modalidade && obj.TIPO_CARGA === tipoCarga);

   // Inicializa um array para armazenar a soma por mês
   const soma_por_mes = Array.from( { length: 12 }, () => 0);
   
   // Soma os valores para cada mês
   objetos_filtrados.forEach(item => {
      const mes = item.MES - 1; // Ajusta para o indice do array (0 a 11)
      soma_por_mes[mes] += item[campo];
   });

   // Apresenta somente duas casas decimais em cada item
   for (let i = 0; i < soma_por_mes.length; i++) {
      soma_por_mes[i] = parseInt(soma_por_mes[i])
   }

   return soma_por_mes;
}

// Função que filtra e soma por tipo de carga e modal
async function soma_dados_modalidade(consulta, modalidade, tipoCarga, campo) {
   // FIltra os objetos com a modalidade desejada
   const objetos_filtrados = consulta.filter(obj => obj.MODALIDADE === modalidade && obj.TIPO_CARGA === tipoCarga);

   // Usa reduce para somar o valor do campo especifico
   const soma = objetos_filtrados.reduce((acc, obj) => acc + obj[campo], 0);

   return soma;
}

// Função que insere os valores nos cards anuais
async function cards_anuais(modalidade, tipoCarga, campo) {
   const dados_modal_ano_anterior = await soma_dados_modalidade(teus_tons_ano_anterior, modalidade, tipoCarga, campo);
   const dados_modal_ano_atual = await soma_dados_modalidade(teus_tons_ano_atual, modalidade, tipoCarga, campo);

   // Multiplica os valores do ano anterior com o valor da meta para termos a meta
   const meta_por_modal = dados_modal_ano_anterior * meta;
   
   // Divide o total até agora pela meta para termos a porcentagem
   const porcentagem_resultado_alcançado = (dados_modal_ano_atual / meta_por_modal) * 100;
   const porcentagem = porcentagem_resultado_alcançado.toFixed(2) + '%'

   // Insere na tela com textContent
   const meta_anual = document.getElementById('meta-anual-' + tipoCarga + '-' + modalidade);
   meta_anual.textContent = porcentagem;
}

// Função que trás os resultados mes a mes
async function graficos_mensais(modalidade, tipoCarga, campo) {
   const dados_ano_anterior = await soma_dados_mes_mes(teus_tons_ano_anterior, modalidade, tipoCarga, campo);
   const dados_ano_atual = await soma_dados_mes_mes(teus_tons_ano_atual, modalidade, tipoCarga, campo);

   const meta_modal_campo = dados_ano_anterior.map(valor => parseInt(valor * meta));

   // Armazena as porcentagem do atingido da meta até hoje
   const porcentagens = [];

   for (let i = 0; i < dados_ano_atual.length; i++) {
      const item1 = dados_ano_atual[i];
      const item2 = meta_modal_campo[i];

      const porcentagem = (item1 / item2) * 100;
      porcentagens.push(porcentagem.toFixed(2));
      
   }

   var options = {
      series: [{
         name: 'Ano Atual',
         data: dados_ano_atual
      }, {
         name: 'Meta',
         data: meta_modal_campo
      }],

      chart: {
         type: 'bar',
         height: 450,
         toolbar: {
            show: false
         },
      },

      colors: ['#F9423A', '#3F2021'],

      plotOptions: {
         bar: {
            borderRadius: 2,
            columnWidth: '70%',
            horizontal: false,
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
         offsetY: -35,
         style: {
           fontSize: '12px',
           colors: ["#F9423A"],
         },
         background: {
            enabled: true,
            foreColor: '#fff',
            borderRadius: 2,
            padding: 4,
            opacity: 0.9,
            borderWidth: 1,
            borderColor: '#F9423A'
          }
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

      yaxis: {
         show: false,
      },

   };

   var grafico_meta_anual = {
      series: [{
         data: dados_ano_atual
      }],
   
      colors: ['#F9423A'],
   
      chart: {
         height: 80,
         width: 180,
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

   var chart = new ApexCharts(document.getElementById('grafico-mes-' + modalidade + '-' + tipoCarga), options);
   chart.render();

   var grafico_anual = new ApexCharts(document.querySelector('.grafico-anual-' + modalidade + '-' + tipoCarga), grafico_meta_anual);
   grafico_anual.render();
}

async function main() {
   await cards_anuais('EM', 'FCL', 'TEUS');
   await cards_anuais('EM', 'LCL', 'TONS');
   await cards_anuais('EA', 'AÉREO', 'TONS');
   await graficos_mensais('EM', 'FCL', 'TEUS')
   await graficos_mensais('EM', 'LCL', 'TONS')
   await graficos_mensais('EA', 'AÉREO', 'TONS')
   await funcoesExportadas.remover_loading();
}

main();
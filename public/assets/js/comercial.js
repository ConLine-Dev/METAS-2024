import funcoesExportadas from "./helper-functions.js";

const processos_ano_anterior = await Thefetch('/api/processos-ano-anterior');
const processos_ano_atual = await Thefetch('/api/processos-ano-atual')
const meta = 1.15;

const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

// Função insere os valores nos cards anuais
async function cards_anuais() {
   // Dados ano anterior
   const IM_ano_anterior = processos_ano_anterior.filter(item => item.MODALIDADE === 'IM');
   const EM_ano_anterior = processos_ano_anterior.filter(item => item.MODALIDADE === 'EM');
   const IA_ano_anterior = processos_ano_anterior.filter(item => item.MODALIDADE === 'IA');
   const EA_ano_anterior = processos_ano_anterior.filter(item => item.MODALIDADE === 'EA');

   const IM_meta = parseInt(IM_ano_anterior.length * meta);
   const EM_meta = parseInt(EM_ano_anterior.length * meta);
   const IA_meta = parseInt(IA_ano_anterior.length * meta);
   const EA_meta = parseInt(EA_ano_anterior.length * meta);

   // Dados ano atual
   const IM_ano_atual = processos_ano_atual.filter(item => item.MODALIDADE === 'IM');
   const EM_ano_atual = processos_ano_atual.filter(item => item.MODALIDADE === 'EM');
   const IA_ano_atual = processos_ano_atual.filter(item => item.MODALIDADE === 'IA');
   const EA_ano_atual = processos_ano_atual.filter(item => item.MODALIDADE === 'EA');

   const IM_total_atual = parseInt(IM_ano_atual.length);
   const EM_total_atual = parseInt(EM_ano_atual.length);
   const IA_total_atual = parseInt(IA_ano_atual.length);
   const EA_total_atual = parseInt(EA_ano_atual.length);

   const IM_porcentagem = (IM_total_atual / IM_meta) * 100;
   const EM_porcentagem = (EM_total_atual / EM_meta) * 100;
   const IA_porcentagem = (IA_total_atual / IA_meta) * 100;
   const EA_porcentagem = (EA_total_atual / EA_meta) * 100;

   const card_IM = document.querySelector('#card-IM');
   const card_EM = document.querySelector('#card-EM');
   const card_IA = document.querySelector('#card-IA');
   const card_EA = document.querySelector('#card-EA');

   card_IM.textContent = IM_porcentagem.toFixed(2) + '%'
   card_EM.textContent = EM_porcentagem.toFixed(2) + '%'
   card_IA.textContent = IA_porcentagem.toFixed(2) + '%'
   card_EA.textContent = EA_porcentagem.toFixed(2) + '%'
}

async function contagem_processos_mes(consulta) {
   // Inicializa um objeto para armazenar a contagem por mes
   const contagem_por_mes = {};

   for (const item of consulta) {
      const { MES } = item;

      // Incrementa a contagem para o mes correspondente
      contagem_por_mes[MES] = (contagem_por_mes[MES] || 0) + 1;
   }

   // Inicializa um array para armazenar a contagem total por mês
   const contagem_total_por_mes = Array.from({ length: 12 }, (_, index) => {
      const mes = index + 1;
      // Obtém a contagem para o mês atual
      return contagem_por_mes[mes] || 0;
   });

   return contagem_total_por_mes;
}

async function graficos_mensais() {
   const processos_anterior = await contagem_processos_mes(processos_ano_anterior);
   const processos_atual = await contagem_processos_mes(processos_ano_atual);

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
         type: 'line',  // Altere 'bar' para 'line'
         data: processos_atual
      }, {
         name: 'Meta',
         type: 'line',  // Altere 'area' para 'line'
         data: meta_processos
      }],
   
      colors: ['#F9423A', '#3F2021'],
   
      chart: {
         height: 455,
         type: 'line',  // Altere 'bar' e 'area' para 'line'
         toolbar: {
            show: false
         },
         dropShadow: {
            enabled: true,
            top: 0,
            left: 0,
            blur: 3,
            opacity: 0.2
          }
      },
   
      stroke: {
         width: [3, 3],  // Ajuste a largura da linha
         curve: 'smooth'
      },
   
      fill: {
         type: 'solid',  // Altere de 'gradient' para 'solid'
         opacity: 1
      },
   
      dataLabels: {
         enabled: true,
         enabledOnSeries: [0],
         formatter: function (val, opts) {
            return porcentagens[opts.dataPointIndex] + "%";
          },
         offsetY: -15,
         style: {
           fontSize: '12px',
           colors: ["#F9423A"],
         },
       },
   
       xaxis: {
         categories: meses,
         position: 'bottom',
         axisBorder: {
           show: false
         },
         axisTicks: {
           show: false
         },
         crosshairs: {
           fill: {
             type: 'solid',  // Altere de 'gradient' para 'solid'
             color: '#D8E3F0',
             opacity: 0.4
           }
         },
       },
   
      yaxis: {
         show: true,
      },
   
      tooltip: {
         enabled: false,
      }
   };
   
   var chart = new ApexCharts(document.getElementById('grafico-mensal'), options);
   chart.render();
}

// Função para agrupar as outras e executar cada uma na hora certa
async function main() {
   await cards_anuais();
   await graficos_mensais();
   await funcoesExportadas.remover_loading();
}

main();
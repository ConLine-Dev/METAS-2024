const funcoesExportadas = require('./helper-functions.js');

const fluxo_ano_anterior = await Thefetch('/api/ano-anterior');
const fluxo_ano_atual = await Thefetch('/api/ano-atual')
const meta = 1.15;
// const megaMeta = 1.3;

const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

// Apresenta o valor total por ano
async function total_ano(consulta) {
  const somaPorAno = consulta.reduce((acumulador, item) => {
    return acumulador + item.VALOR_CONVERTIDO_REAL;
  }, 0);

  return somaPorAno;
}

// Resultado Mes a Mes
async function soma_mes_a_mes(consulta) {
   const somaPorMes = []; // Armazena o valor total por mes

   // Soma de valores por mes
   for (let index = 0; index < consulta.length; index++) {
      const item = consulta[index];
      const mesExistente = somaPorMes.find(mes => mes.MES === item.MES); // Verifica se no array ja existe o mes da consulta

      if(mesExistente) {
         mesExistente.VALOR_CONVERTIDO_REAL += item.VALOR_CONVERTIDO_REAL;
      } else {
         somaPorMes.push({
            MES: item.MES,
            VALOR_CONVERTIDO_REAL: item.VALOR_CONVERTIDO_REAL
         });
      }
   }

   // Ordena os meses usando a função de comparação
   somaPorMes.sort((a, b) => a.MES - b.MES);
   return somaPorMes
}

// Soma os valores até o dia atual separando por mes e dia
async function somarValoresAteDiaAtual(dados) {
   const dataAtual = new Date();
   const diaAtual = dataAtual.getDate();
 
   const somaPorDia = {};
 
   for (const item of dados) {
     const dataPagamento = new Date(item.Data_Pagamento);
 
     const isDataAnterior =
       dataPagamento.getFullYear() < dataAtual.getFullYear() ||
       (dataPagamento.getFullYear() === dataAtual.getFullYear() &&
         dataPagamento.getMonth() < dataAtual.getMonth()) ||
       (dataPagamento.getFullYear() === dataAtual.getFullYear() &&
         dataPagamento.getMonth() === dataAtual.getMonth() &&
         dataPagamento.getDate() <= diaAtual);
 
     if (isDataAnterior) {
       const chaveDia = `${dataPagamento.getMonth() + 1}-${dataPagamento.getDate()}`;
 
       const isDataAnteriorMesAtual =
         dataPagamento.getMonth() < dataAtual.getMonth() ||
         (dataPagamento.getMonth() === dataAtual.getMonth() && dataPagamento.getDate() <= diaAtual);
 
       if (isDataAnteriorMesAtual) {
         somaPorDia[chaveDia] = (somaPorDia[chaveDia] || 0) + item.VALOR_CONVERTIDO_REAL;
       }
     }
   }
 
   return somaPorDia;
}
 
// Função para somar o total dos valores do ano anterior ate o dia atual
async function total_valores_ate_dia_atual_ano_anterior(consulta) {
   const resultadoSomaPorDia = await somarValoresAteDiaAtual(consulta);
 
   const somaTotal = Object.values(resultadoSomaPorDia).reduce((total, valor) => total + valor, 0);
 
   return somaTotal;
} 

// Cards de META ANUAL, MEGA META ANUAL, META HOJE, MEGA META HOJE
async function cardMetasAnuais() {
   const total_ano_anterior = await total_ano(fluxo_ano_anterior);
   const total_ano_atual = await total_ano(fluxo_ano_atual);

   const total_ano_anterior_ate_hoje = await total_valores_ate_dia_atual_ano_anterior(fluxo_ano_anterior)

   const meta_anual = ((total_ano_atual) / (total_ano_anterior * meta)) * 100;
   // const mega_meta_anual = ((total_ano_atual) / (total_ano_anterior * megaMeta)) * 100;
   const meta_hoje = ((total_ano_atual) / (total_ano_anterior_ate_hoje * meta)) * 100;
   // const mega_meta_hoje = ((total_ano_atual) / (total_ano_anterior_ate_hoje * megaMeta)) * 100;


   const card_meta_anual = document.querySelector('#cardMetaAnual');
   // const card_mega_meta_anual = document.querySelector('#cardMegaMetaAnual');
   const card_meta_hoje = document.querySelector('#cardMetaHoje');
   // const card_mega_meta_hoje = document.querySelector('#cardMegaMetaHoje');

   card_meta_anual.textContent = meta_anual.toFixed(2) + '%';
   // card_mega_meta_anual.textContent = mega_meta_anual.toFixed(2) + '%';
   card_meta_hoje.textContent = meta_hoje.toFixed(2) + '%';
   // card_mega_meta_hoje.textContent = mega_meta_hoje.toFixed(2) + '%';
}

// Cria o grafico mes a mes
async function grafico_financeiro_mes_mes() {
   const total_ano_anterior = await total_ano(fluxo_ano_anterior);
   const total_ano_atual = await total_ano(fluxo_ano_atual);
   const soma_mes_mes_anterior = await soma_mes_a_mes(fluxo_ano_anterior);
   const soma_mes_mes_atual = await soma_mes_a_mes(fluxo_ano_atual);
   
   // Meta para o ano todo
   const meta_anual = total_ano_anterior * meta;
   
   // Calcular meta de janeiro
   const meta_janeiro = meta_anual / 12;
   
   // Inicializar um array para armazenar as metas mensais
   const metas_mensais = [meta_janeiro];
   
   // Armazena o que foi arrecadado a cada mês
   let arrecadacao_acumulada = 0;

   const valor_arrecadado_meta = [Math.max(soma_mes_mes_atual[0].VALOR_CONVERTIDO_REAL, 0)]; // Adicionado valor arrecadado em janeiro
   const porcentagem_em_relacao_a_meta_janeiro = meta_janeiro !== 0 ? (valor_arrecadado_meta[0] / meta_janeiro) * 100 : 0; // Calculado a porcentagem para janeiro
   const porcentagens_meta = [porcentagem_em_relacao_a_meta_janeiro.toFixed(2)]; // Adicionado a porcentagem de janeiro
   
   // Calcular as metas mensais para os meses restantes
   for (let i = 1; i < 12; i++) {
      // Adicionar a arrecadação do mês anterior à arrecadação acumulada
      arrecadacao_acumulada += soma_mes_mes_atual[i -1].VALOR_CONVERTIDO_REAL;
      
      // Calcular a meta mensal ajustada para o mês atual
      const meta_mensal_ajustada = i === 0 ? meta_janeiro : (meta_anual - arrecadacao_acumulada) / (12 - i);
      
      // Adicionar a meta mensal ajustada no array
      metas_mensais.push(meta_mensal_ajustada);
      
      // Calcular a porcentagem em relação à meta para o mês atual
      const valor_arrecadado = soma_mes_mes_atual[i].VALOR_CONVERTIDO_REAL;
      valor_arrecadado_meta.push(Math.max(valor_arrecadado, 0)); // Replace negative values with zero

      const porcentagem_em_relacao_a_meta = meta_mensal_ajustada !== 0 ? (valor_arrecadado / meta_mensal_ajustada) * 100 : 0;
      // Armazenar a porcentagem no array
      porcentagens_meta.push(porcentagem_em_relacao_a_meta.toFixed(2));
   }


   const newSomaMesAnterior = []
   for (let index = 0; index < soma_mes_mes_anterior.length; index++) {
      const element = soma_mes_mes_anterior[index];
      newSomaMesAnterior.push(element.VALOR_CONVERTIDO_REAL)
   }

   var options = {
      series: [{
         name: 'Ano Atual',
         type: 'bar',
         data: valor_arrecadado_meta
      }, {
         name: 'Meta',
         type: 'area',
         data: metas_mensais
      }],

      colors: ['#F9423A', '#3F2021'],

      chart: {
         height: 500,
         type: 'bar',
      },

      chart: {
         height: 500,
         type: 'area',
         stacked: false,
         toolbar: {
            show: false
          },
      },

      stroke: {
         width: [0, 2],
         curve: 'smooth'
      },

      plotOptions: {
         bar: {
            borderRadius: 7,
            columnWidth: '25%',
         },
      },

      fill: {
         type: ['solid', 'gradient'],
         gradient: {
           shadeIntensity: 1,
           opacityFrom: 0.5,
           opacityTo: 0.0,
           stops: [0, 100]
         }
       },

       dataLabels: {
         enabled: true,
         enabledOnSeries: [0],
         formatter: function (val, opts) {
            const percentage = porcentagens_meta[opts.dataPointIndex];
            return Math.max(percentage, 0) + "%";
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
             type: 'gradient',
             gradient: {
               colorFrom: '#D8E3F0',
               colorTo: '#BED1E6',
               stops: [0, 100],
               opacityFrom: 0.4,
               opacityTo: 0.5,
             }
           }
         },
       },

      yaxis: {
         show: false,
      },

      tooltip: {
         enabled: false,
      }
   }

   var grafico_meta_anual = {
      series: [{
         data: valor_arrecadado_meta
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
   
   var chart = new ApexCharts(document.querySelector("#meta-mes-a-mes"), options);
   chart.render();

   var meta_anual_grafico_card = new ApexCharts(document.querySelector("#meta_anual_grafico_card"), grafico_meta_anual);
   meta_anual_grafico_card.render();

   var meta_hoje_grafico_card = new ApexCharts(document.querySelector("#meta_hoje_grafico_card"), grafico_meta_anual);
   meta_hoje_grafico_card.render();
}

// Cria grafico de participação por modal
async function soma_valores_modais(dados) {
   return dados.reduce((acumulador, item) => {
      const modalidade = item.MODALIDADE;
      acumulador[modalidade] = (acumulador[modalidade] || 0) + item.VALOR_CONVERTIDO_REAL;
      return acumulador;
   }, {});
}

async function grafico_modais() {
   const total_valores_modais = await soma_valores_modais(fluxo_ano_atual);
   const total_valores_ano_atual = await total_ano(fluxo_ano_atual);

   // Calcular porcentagem para cada modalidade
   const porcentagens = [];
   for (const modalidade in total_valores_modais) {
      const valor_modalidade = total_valores_modais[modalidade];
      const porcentagem = (valor_modalidade / total_valores_ano_atual) * 100;
      porcentagens[modalidade] = Number(porcentagem.toFixed(2));
   }
   
   // Tirando o modal e deixando somente os valores do objeto
   const porcentagens_somente_numero = Object.values(porcentagens);

   const porcentagem_IM = document.querySelector('#porcentagem_IM');
   const porcentagem_EM = document.querySelector('#porcentagem_EM');
   const porcentagem_IA = document.querySelector('#porcentagem_IA');
   const porcentagem_EA = document.querySelector('#porcentagem_EA');
   const porcentagem_OUTROS = document.querySelector('#porcentagem_OUTROS');

   porcentagem_IM.textContent = porcentagens_somente_numero[0] + '%'
   porcentagem_EM.textContent = porcentagens_somente_numero[1] + '%'
   porcentagem_IA.textContent = porcentagens_somente_numero[2] + '%'
   porcentagem_EA.textContent = porcentagens_somente_numero[3] + '%'
   porcentagem_OUTROS.textContent = porcentagens_somente_numero[4] + '%'

   var options = {
      series: porcentagens_somente_numero,
      chart: {
      type: 'donut',
      width: '123%',
    },
    labels: ['IM', 'EM', 'IA', 'EA', 'OUTROS'],
    legend: {
      show: true,
      position: 'bottom',
    },
    
    };

    var chart = new ApexCharts(document.querySelector("#modais"), options);
    chart.render();
}

async function main() {
   await cardMetasAnuais();
   await grafico_financeiro_mes_mes();
   await grafico_modais();
   await funcoesExportadas.remover_loading();
}

main()
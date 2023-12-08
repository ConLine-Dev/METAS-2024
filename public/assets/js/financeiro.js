import conversao from "./helper-functions.js";
// console.log(conversao.get_mes(0));

const fluxo_ano_anterior = await Thefetch('/api/ano-anterior');
const fluxo_ano_atual = await Thefetch('/api/ano-atual')
const meta = 1.15;
const megaMeta = 1.3;

const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

// Apresenta o valor total por ano
async function total_ano(consulta) {
   let somaPorAno = 0;

   for (let index = 0; index < consulta.length; index++) {
      const item = consulta[index];
      
      somaPorAno += item.VALOR_CONVERTIDO_REAL
   }

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
   // Obtém a data atual
   const dataAtual = new Date();
   const diaAtual = dataAtual.getDate(); // Obtém o dia atual
 
   // Inicializa um objeto para armazenar a soma por dia
   const somaPorDia = {};
 
   for (const item of dados) {
      // Converte a data do pagamento para um objeto Date
      const dataPagamento = new Date(item.Data_Pagamento);
    
      // Verifica se a data do pagamento é até a data atual e não posterior ao dia atual do mês atual
      if (
        dataPagamento.getFullYear() < dataAtual.getFullYear() ||
        (dataPagamento.getFullYear() === dataAtual.getFullYear() &&
          dataPagamento.getMonth() < dataAtual.getMonth()) ||
        (dataPagamento.getFullYear() === dataAtual.getFullYear() &&
          dataPagamento.getMonth() === dataAtual.getMonth() &&
          dataPagamento.getDate() <= diaAtual )
      ) {
        // Obtém a chave para o dia (ignorando ano)
        const chaveDia = `${dataPagamento.getMonth() + 1}-${dataPagamento.getDate()}`;
    
        // Verifica se a data do pagamento é anterior ao dia atual do mês atual
        if (
          (dataPagamento.getMonth() < dataAtual.getMonth() ||
            (dataPagamento.getMonth() === dataAtual.getMonth() &&
              dataPagamento.getDate() <= diaAtual ))
        ) {
          // Inicializa a soma para o dia, se ainda não existir
          somaPorDia[chaveDia] = somaPorDia[chaveDia] || 0;
    
          // Soma o valor convertido em real para o dia
          somaPorDia[chaveDia] += item.VALOR_CONVERTIDO_REAL;
        }
      }
    }
 
   return somaPorDia;
}

// Função para somar o total dos valores do ano anterior ate o dia atual
async function total_valores_ate_dia_atual_ano_anterior(consulta) {
   // Chama a função e obtém os valores somados
   const resultadoSomaPorDia = await somarValoresAteDiaAtual(consulta)

   // Inicializa a variável para armazenar a soma total
   let somaTotal = 0;

   // Itera sobre os valores somados e acumula a soma total
   for (const chaveDia in resultadoSomaPorDia) {
      somaTotal += resultadoSomaPorDia[chaveDia];
   }

   return somaTotal;
}


// Cards de META ANUAL, MEGA META ANUAL, META HOJE, MEGA META HOJE
async function cardMetasAnuais() {
   const total_ano_anterior = await total_ano(fluxo_ano_anterior);
   const total_ano_atual = await total_ano(fluxo_ano_atual);

   const total_ano_anterior_ate_hoje = await total_valores_ate_dia_atual_ano_anterior(fluxo_ano_anterior)

   const meta_anual = ((total_ano_atual) / (total_ano_anterior * meta)) * 100;
   const mega_meta_anual = ((total_ano_atual) / (total_ano_anterior * megaMeta)) * 100;
   const meta_hoje = ((total_ano_atual) / (total_ano_anterior_ate_hoje * meta)) * 100;
   const mega_meta_hoje = ((total_ano_atual) / (total_ano_anterior_ate_hoje * megaMeta)) * 100;

   const card_meta_anual = document.querySelector('#cardMetaAnual');
   const card_mega_meta_anual = document.querySelector('#cardMegaMetaAnual');
   const card_meta_hoje = document.querySelector('#cardMetaHoje');
   const card_mega_meta_hoje = document.querySelector('#cardMegaMetaHoje');

   card_meta_anual.textContent = meta_anual.toFixed(2) + '%';
   card_mega_meta_anual.textContent = mega_meta_anual.toFixed(2) + '%';
   card_meta_hoje.textContent = meta_hoje.toFixed(2) + '%';
   card_mega_meta_hoje.textContent = mega_meta_hoje.toFixed(2) + '%';
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
   
   const valor_arrecadado_meta = [];
   const porcentagens_meta = [];
   
   // Calcular as metas mensais para os meses restantes
   for (let i = 0; i < 12; i++) {
      // Adicionar a arrecadação do mês anterior à arrecadação acumulada
      arrecadacao_acumulada += soma_mes_mes_atual[i].VALOR_CONVERTIDO_REAL;
      
      // Calcular a meta mensal ajustada para o mês atual
      const meta_mensal_ajustada = i === 0 ? meta_janeiro : (meta_anual - arrecadacao_acumulada) / (12 - i);
      
      // Adicionar a meta mensal ajustada no array
      metas_mensais.push(meta_mensal_ajustada);
      console.log(meta_mensal_ajustada, 'meta');
      
      // Calcular a porcentagem em relação à meta para o mês atual
      const valor_arrecadado = soma_mes_mes_atual[i].VALOR_CONVERTIDO_REAL;
      valor_arrecadado_meta.push(valor_arrecadado)
      console.log(valor_arrecadado, 'valor_arrecadado');
      const porcentagem_em_relacao_a_meta = meta_mensal_ajustada !== 0 ? (valor_arrecadado / meta_mensal_ajustada) * 100 : 0;
      // Armazenar a porcentagem no array
      porcentagens_meta.push(porcentagem_em_relacao_a_meta.toFixed(2));
      // console.log(porcentagem_em_relacao_a_meta, 'aqui');
   }


   const newSomaMesAnterior = []
   for (let index = 0; index < soma_mes_mes_anterior.length; index++) {
      const element = soma_mes_mes_anterior[index];
      newSomaMesAnterior.push(element.VALOR_CONVERTIDO_REAL)
   }

   // const newSomaMesAtual = []
   // for (let index = 0; index < soma_mes_mes_atual.length; index++) {
   //    const element = soma_mes_mes_atual[index];
   //    newSomaMesAtual.push(element.VALOR_CONVERTIDO_REAL)
   // }

   var options = {
      series: [{
         name: 'Ano Atual',
         type: 'bar',
         data: valor_arrecadado_meta
      }, {
         name: 'Meta',
         type: 'area',
         data: newSomaMesAnterior
      }],

      colors: ['#F9423A', '#3F2021'],

      chart: {
         height: 350,
         type: 'bar',
      },

      chart: {
         height: 350,
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
            return porcentagens_meta[opts.dataPointIndex] + "%";
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

   var chart = new ApexCharts(document.querySelector("#meta-mes-a-mes"), options);
   chart.render();
}


grafico_financeiro_mes_mes();
cardMetasAnuais();
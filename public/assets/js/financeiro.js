const meta = 1.15;
const time_new_process = 8000
let new_process = false;


const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

// Apresenta o valor total por ano
async function total_ano(consulta) {
  const somaPorAno = consulta.reduce((acumulador, item) => {
    return acumulador + item.VALOR_CONVERTIDO_REAL;
  }, 0);

  return somaPorAno;
}

// // Resultado Mes a Mes
async function soma_mes_a_mes(consulta) {
   const somaPorMes = [];

   for (let index = 0; index < consulta.length; index++) {
      const item = consulta[index];
      const mesExistente = somaPorMes.find(mes => mes.MES === item.MES);

      if(mesExistente) {
         mesExistente.VALOR_CONVERTIDO_REAL += item.VALOR_CONVERTIDO_REAL;
      } else {
         somaPorMes.push({
            MES: item.MES,
            VALOR_CONVERTIDO_REAL: item.VALOR_CONVERTIDO_REAL
         });
      }
   }

   somaPorMes.sort((a, b) => a.MES - b.MES);
   return somaPorMes;
}

// Soma os valores do ano passado até o dia atual
async function somarValoresAteDiaAtual(dados) {
   const dataAtual = new Date();
   const diaAtual = dataAtual.getDate();
 
   const somaPorDia = {};
 
   // Inicializa todos os dias do ano até o dia atual com 0
   for (let mes = 1; mes <= dataAtual.getMonth() + 1; mes++) {
     for (let dia = 1; dia <= 31; dia++) {
       if (mes === dataAtual.getMonth() + 1 && dia > diaAtual) {
         break;
       }
       somaPorDia[`${mes}-${dia}`] = 0;
     }
   }
 
   for (const item of dados) {
     const dataPagamentoParts = item.Data_Pagamento.split('T')[0].split('-');
     const dataPagamento = new Date(dataPagamentoParts[0], dataPagamentoParts[1] - 1, dataPagamentoParts[2]);
 
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
         somaPorDia[chaveDia] += item.VALOR_CONVERTIDO_REAL;
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

// Cards de META ANUAL, META HOJE
async function card_metas_anuais(fluxo_ano_anterior, fluxo_ano_atual) {
   const total_ano_anterior = await total_ano(fluxo_ano_anterior);
   const total_ano_atual = await total_ano(fluxo_ano_atual);

   const total_ano_anterior_ate_hoje = await total_valores_ate_dia_atual_ano_anterior(fluxo_ano_anterior)

   const meta_anual = Math.max(((total_ano_atual) / (total_ano_anterior * meta)) * 100, 0);
   const meta_hoje = Math.max(((total_ano_atual) / (total_ano_anterior_ate_hoje * meta)) * 100, 0);

   const card_meta_anual = document.querySelector('#cardMetaAnual');
   const card_meta_hoje = document.querySelector('#cardMetaHoje');

   card_meta_anual.textContent = meta_anual.toFixed(2) + '%';
   card_meta_hoje.textContent = meta_hoje.toFixed(2) + '%';
}

// Pega o valor arrecadado do mes atual e vai acrescentando ou diminuindo a meta do proximo mes
async function ajustarMetasComBaseEmResultadosAutomatico(metasMensais, resultadosMensais) {
   for (let i = 0; i < resultadosMensais.length; i++) {
      const valorArrecadado = resultadosMensais[i].VALOR_CONVERTIDO_REAL;

      if (valorArrecadado > metasMensais[i]) {
         const excedente = valorArrecadado - metasMensais[i];

         if (i < metasMensais.length - 1) {
         metasMensais[i + 1] -= excedente;
         }
      } else {
         if (i < metasMensais.length - 1) {
         metasMensais[i + 1] += metasMensais[i] - valorArrecadado;
         }
      }
   }

   return metasMensais;
}

let atualizacao_chart = null;
// Cria o grafico mes a mes
async function grafico_financeiro_mes_mes(fluxo_ano_anterior, fluxo_ano_atual) {
   const total_ano_anterior = await total_ano(fluxo_ano_anterior);
   const soma_mes_mes_atual = await soma_mes_a_mes(fluxo_ano_atual);

   // Obtenha os resultados mensais usando a sua função
   const resultadosMensais = await soma_mes_a_mes(fluxo_ano_atual);

   // Meta para o ano todo
   const meta_anual = total_ano_anterior * meta;
   
   // Meta por mes
   const meta_por_mes = meta_anual / 12;

   // Cria um array de 12 linhas com o mesmo valor de meta para cada mes
   let metas_mensais = Array(12).fill(meta_por_mes);

   // Ajusta a meta para o proximo mes de acordo com o valor arrecadado no mes atual
   metas_mensais = await ajustarMetasComBaseEmResultadosAutomatico(metas_mensais, resultadosMensais);

   // Extrai apenas os valores de VALOR_CONVERTIDO_REAL
   // const valores_arrecadados = soma_mes_mes_atual.map(item => Math.max(item.VALOR_CONVERTIDO_REAL, 0));
   const valores_arrecadados = soma_mes_mes_atual.map(item => item.VALOR_CONVERTIDO_REAL);

   const porcentagens = metas_mensais.map((meta, index) => {
      const valorArrecadado = valores_arrecadados[index];

      // Evita a divisão por zero
      const porcentagem = meta !== 0 ? (valorArrecadado / meta) * 100 : 0;

      return Number(porcentagem.toFixed(2))
   })

   var options = {
      series: [{
         name: 'Ano Atual',
         type: 'column',
         data: valores_arrecadados
      }, {
         name: 'Meta',
         type: 'area',
         data: metas_mensais
      }],
      colors: ['#F9423A', '#3F2021'],

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
            const percentage = porcentagens[opts.dataPointIndex];
            return Math.max(percentage, 0) + "%";
            // return percentage + "%";
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
      
      yaxis: [
         {
            seriesName: 'Ano Atual',
            show: false,
            // Define o intervalo do eixo Y para os valores arrecadados
            min: 0,  // Defina o mínimo como 0 ou um valor específico, se necessário
            max: Math.max(2500000)  // Ajuste o máximo para ser um pouco maior que o valor máximo dos valores arrecadados
         },
         {
            seriesName: 'Meta',
            show: false,
            min: 0, // Defina o mínimo do eixo Y para 0
            max: Math.max(2500000), // Defina o máximo do eixo Y para o maior valor em metas_mensais
         }
      ],

      tooltip: {
         enabled: false,
      }
   }

   // Verifique se o gráfico já existe
   if (atualizacao_chart) {
      // Atualize as porcentagens
      options.dataLabels.formatter = function (val, opts) {
         const percentage = porcentagens[opts.dataPointIndex];
         return Math.max(percentage, 0) + "%";
         // return percentage + "%";
      };
      // Se existir, atualize os dados e renderize novamente
      atualizacao_chart.updateOptions(options);
   } else {
      // Se não existir, crie um novo gráfico
      atualizacao_chart = new ApexCharts(document.querySelector("#meta-mes-a-mes"), options);
      atualizacao_chart.render();
   }

}

// Cria grafico de participação por modal
async function soma_valores_modais(dados) {
   return dados.reduce((acumulador, item) => {
      const modalidade = item.MODALIDADE;
      acumulador[modalidade] = (acumulador[modalidade] || 0) + item.VALOR_CONVERTIDO_REAL;
      return acumulador;
   }, {});
}

let atualizacao_chart_2 = null;
async function grafico_modais(fluxo_ano_atual) {
   const total_valores_modais = await soma_valores_modais(fluxo_ano_atual);
   const total_valores_ano_atual = await total_ano(fluxo_ano_atual);

   // Verifique se a modalidade "OUTROS" existe, caso contrário, defina como zero
   if (!total_valores_modais['OUTROS']) {
      total_valores_modais['OUTROS'] = 0;
   }

   // Calcular porcentagem para cada modalidade
   let porcentagens = [];
   let totalPorcentagem = 0;
   for (const modalidade in total_valores_modais) {
      let valor_modalidade = total_valores_modais[modalidade];

      
      // Se o valor for indefinido ou menor que zero, defina como zero
      if (valor_modalidade < 0) {
         valor_modalidade = 0;
      }
      
      const porcentagem = (valor_modalidade / total_valores_ano_atual) * 100;
      porcentagens[modalidade] = Math.max(Number(porcentagem.toFixed(2)), 0);
      totalPorcentagem += porcentagens[modalidade];
   }

   // Ajustar as porcentagens se a soma total exceder 100%
   if (totalPorcentagem > 100) {
      const fatorAjuste = totalPorcentagem / 100;
      for (const modalidade in porcentagens) {
         porcentagens[modalidade] = Number((porcentagens[modalidade] / fatorAjuste).toFixed(2));
      }
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
      dataLabels: {
         formatter: function(val, opts) {
            return opts.w.config.series[opts.seriesIndex].toFixed(2) + '%';
         }
      }
   };
   // Verifique se o gráfico já existe
   if (atualizacao_chart_2) {
      // Se existir, atualize os dados e renderize novamente
      atualizacao_chart_2.updateSeries(porcentagens_somente_numero);
      porcentagem_IM.textContent = porcentagens_somente_numero[0] + '%'
      porcentagem_EM.textContent = porcentagens_somente_numero[1] + '%'
      porcentagem_IA.textContent = porcentagens_somente_numero[2] + '%'
      porcentagem_EA.textContent = porcentagens_somente_numero[3] + '%'
      porcentagem_OUTROS.textContent = porcentagens_somente_numero[4] + '%'
   } else {
      // Se não existir, crie um novo gráfico
      atualizacao_chart_2 = new ApexCharts(document.querySelector("#modais"), options);
      atualizacao_chart_2.render();
   }
   
   
}

async function mostrar_loading() {
   let img = document.getElementById('loading-img');

   // Define o caminho do gif
   img.src = "/assets/images/brand-logos/SLOGAN VERMELHO.gif";
}

async function remover_loading () {
   let corpoDashboard = document.querySelector('.corpo-dashboard');
   let loading = document.querySelector('.loading');

   loading.style.display = 'none';
   corpoDashboard.style.display = 'block';
}


// GEra o modal
function obter_cores_icone_por_modalidade(modalidade) {
   switch (modalidade) {
      case 'IM':
         return { cor: '#f9423a', background: 'rgba(249, 66, 58, 0.2)', icon: 'ti-ship' };
      case 'EM':
         return { cor: '#3F2021', background: 'rgba(63, 32, 33, 0.2)', icon: 'ti-ship'};
      case 'IA':
         return { cor: '#23b7e5', background: 'rgba(35, 183, 229, 0.2)', icon: 'ti-plane-inflight' };
      default:
         return { cor: '#26bf94', background: 'rgba(38, 191, 148, 0.2)', icon: 'ti-plane-inflight' };
   }
}

function ultimo_processo_modal(data) {
   const audio_palmas = new Audio('/assets/audios/palmas.mp3');

   // Adiciona um event listener para o clique
   document.addEventListener('click', () => {
      // Inicia a reprodução do áudio ao clicar
      audio_palmas.play()
   });

   // const ultimo_processo_gerado = await Thefetch('/api/ultimo_processo_gerado');

   const sale_name = document.querySelector('#sale_name');
   const inside_sales_name = document.querySelector('#inside_sales_name');
   const modal_id = document.querySelector('#modal_id');
   const date_open_modal = document.querySelector('#date_open_modal');
   
   sale_name.textContent = data.VENDEDOR;
   inside_sales_name.textContent = data.INSIDE_SALES;
   modal_id.textContent = data.Numero_Processo;
   date_open_modal.textContent = data.Data_Abertura_Processo;

   // Obter cores com base na modalidade
   const { cor, background, icon } = obter_cores_icone_por_modalidade(data.MODALIDADE);
   date_open_modal.style.color = cor;
   date_open_modal.style.background = background;

   const sale_img = document.querySelector('#sale_img');
   const inside_img = document.querySelector('#inside_img');
   sale_img.setAttribute('src', `https://cdn.conlinebr.com.br/colaboradores/${data.ID_VENDEDOR}`);
   inside_img.setAttribute('src', `https://cdn.conlinebr.com.br/colaboradores/${data.ID_INSIDE_SALES}`);


   // adiciona o modal
   const modaldemo8 = document.querySelector('#modaldemo8');
   modaldemo8.classList.add('effect-scale', 'show');
   modaldemo8.style.display = 'block';

   setTimeout(() => {
      modaldemo8.classList.remove('effect-scale', 'show');
      modaldemo8.style.display = 'none';
      audio_palmas.pause()
      new_process = false;
   }, time_new_process);
}


async function main() {
   const fluxo_ano_anterior = await Thefetch('/api/ano-anterior');
   const fluxo_ano_atual = await Thefetch('/api/ano-atual')
   await mostrar_loading();
   await card_metas_anuais(fluxo_ano_anterior, fluxo_ano_atual);
   await grafico_financeiro_mes_mes(fluxo_ano_anterior, fluxo_ano_atual);
   await grafico_modais(fluxo_ano_atual);
   await remover_loading();
}

await main();



// Escurta um novo processo
const socket = io();

const lista_fechamento = []

socket.on('NewProcess', async function(msg){
   // console.log(msg)
   main();
   lista_fechamento.push(msg)
});

socket.on('NewInvoice', async function(msg){
   // console.log(msg)
   main();
});

setInterval(() => {
   if(lista_fechamento.length > 0 && new_process == false) {
      new_process = true;
      ultimo_processo_modal(lista_fechamento[0]);
      lista_fechamento.splice(0, 1);
   }
}, 1000);
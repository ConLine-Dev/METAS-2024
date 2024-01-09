const meta = 1.15;
const time_new_process = 8000
let new_process = false;

const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

// Função insere os valores nos cards anuais
async function cards_anuais(processos_ano_anterior, processos_ano_atual) {
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

let atualizacao_chart = null;
async function graficos_mensais(processos_ano_anterior, processos_ano_atual) {
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

   // Verifique se o gráfico já existe
   if (atualizacao_chart) {
      // Atualize as porcentagens
      options.dataLabels.formatter = function (val, opts) {
         const percentage = porcentagens[opts.dataPointIndex];
         // return Math.max(percentage, 0) + "%";
         return percentage + "%";
      };
      // Se existir, atualize os dados e renderize novamente
      atualizacao_chart.updateOptions(options);
   } else {
      // Se não existir, crie um novo gráfico
      atualizacao_chart = new ApexCharts(document.querySelector("#grafico-mensal"), options);
      atualizacao_chart.render();
   }
}

function obter_cores_por_modalidade(modalidade) {
   switch (modalidade) {
      case 'IM':
         return { cor: '#f9423a', background: 'rgba(249, 66, 58, 0.2)' };
      case 'EM':
         return { cor: '#3F2021', background: 'rgba(63, 32, 33, 0.2)' };
      case 'IA':
         return { cor: '#23b7e5', background: 'rgba(35, 183, 229, 0.2)' };
      default:
         return { cor: '#26bf94', background: 'rgba(38, 191, 148, 0.2)' };
   }
}

async function ultimos_processos(ultimos_9_processos) {
   const cards_ultimos_processos = document.querySelector('.cards_ultimos_processos');

   // Array para armazenar as strings HTML
   const itemsHTML = [];

   // Passando sobre cada objeto do array
   for (let i = 0; i < ultimos_9_processos.length; i++) {
      const item = ultimos_9_processos[i];

      // Obter cores com base na modalidade
      const { cor, background } = obter_cores_por_modalidade(item.MODALIDADE);

      // Criação da string HTML para cada item
      const item_html =                     
                     `<li class="list-group-item border-top-0 border-start-0 border-end-0"> 
                        <div class="d-flex align-items-center">
                           <div class="me-2 lh-1"> 
                              <div class="avatar-list-stacked">
                                 <span class="avatar avatar-rounded">
                                 <img src="https://cdn.conlinebr.com.br/colaboradores/${item.ID_VENDEDOR}" alt="img">
                                 </span>
                                 <span class="avatar avatar-rounded">
                                 <img src="https://cdn.conlinebr.com.br/colaboradores/${item.ID_INSIDE_SALES}" alt="img">
                                 </span>
                              </div>
                           </div>
                           <div class="flex-fill">
                              <p class="mb-0 fw-semibold" style="white-space: nowrap; max-width: 19ch; overflow: hidden;">${item.VENDEDOR}</p>
                              <p class="fs-12 text-muted mb-0" style="white-space: nowrap; max-width: 19ch; overflow: hidden;">${item.INSIDE_SALES}</p>
                           </div>
                           <div class="text-end">
                              <p class="mb-0 fs-12">${item.Numero_Processo}</p>
                              <span class="badge" style="color: ${cor} !important; background-color: ${background};">${item.Data_Abertura_Processo}</span>
                           </div>
                        </div>
                     </li>`;

      // Adiciona a string HTML ao array
      itemsHTML.push(item_html);
   }

   // Junta as strings HTML e as insere no innerHTML
   cards_ultimos_processos.innerHTML = itemsHTML.join('');
}

async function obter_ultimo_processo_por_modal(modalidade) {
   const url = `/api/ultimo_processo_por_modal/${modalidade}`;
   return await Thefetch(url);
}

// Busca o ultimo processo fechado do processo que for inserido no parametro
async function ultimo_fechamento_modal(modalidade) {
   const ultimo_processo_por_modal = await obter_ultimo_processo_por_modal(modalidade);

   const sale = document.getElementById(`sale_${modalidade}`);
   const inside = document.getElementById(`inside_${modalidade}`);
   const img_sale = document.getElementById(`img_sale_${modalidade}`);
   const img_inside = document.getElementById(`img_inside_${modalidade}`);
   const processo = document.getElementById(`processo_${modalidade}`);
   const data = document.getElementById(`data_${modalidade}`);

   sale.textContent = ultimo_processo_por_modal[0].VENDEDOR;
   inside.textContent = ultimo_processo_por_modal[0].INSIDE_SALES;
   img_sale.src = `https://cdn.conlinebr.com.br/colaboradores/${ultimo_processo_por_modal[0].ID_VENDEDOR}`;
   img_inside.src = `https://cdn.conlinebr.com.br/colaboradores/${ultimo_processo_por_modal[0].ID_INSIDE_SALES}`;
   processo.textContent = ultimo_processo_por_modal[0].Numero_Processo;
   data.textContent = ultimo_processo_por_modal[0].Data_Abertura_Processo;
}

// Gera o modal
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

   // Inicia a reprodução do áudio ao clicar
   audio_palmas.play()

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


// Função para agrupar as outras e executar cada uma na hora certa
async function main() {
   const processos_ano_anterior = await Thefetch('/api/processos-ano-anterior');
   const processos_ano_atual = await Thefetch('/api/processos-ano-atual');
   const ultimos_9_processos = await Thefetch('/api/ultimos_9_processos');
   await mostrar_loading();
   await cards_anuais(processos_ano_anterior, processos_ano_atual);
   await graficos_mensais(processos_ano_anterior, processos_ano_atual);
   await ultimos_processos(ultimos_9_processos);
   await ultimo_fechamento_modal('IM');
   await ultimo_fechamento_modal('EM');
   await ultimo_fechamento_modal('IA');
   await ultimo_fechamento_modal('EA');
   await remover_loading();
}

await main();


// Escurta um novo processo
const socket = io('wss://dashboard.conlinebr.com.br');

const lista_fechamento = []

socket.on('NewProcess', async function(msg){
   // console.log(msg)
   await main();
   lista_fechamento.push(msg)
});

setInterval(() => {
   if(lista_fechamento.length > 0 && new_process == false) {
      new_process = true;
      ultimo_processo_modal(lista_fechamento[0]);
      lista_fechamento.splice(0, 1);
   }
}, 1000);
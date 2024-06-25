const admin_cards_comerciais = await Thefetch('/api/admin-cards-comerciais');
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
const opcoes_meses = new Choices('#meses',
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
   numeralDecimalScale: 0,
   numeralDecimalMark: ',',
   delimiter: '.',
});

const meses_para_selecionar = document.getElementById('meses');
const input_meta = document.getElementById('input-meta');
const botao_adicionar_meta = document.getElementById('adicionar-meta');

function limpar_inputs() {
   const valor_atual = input_meta.value;
   const valor_sem_numeros_pontos = valor_atual.replace(/[0-9.]/g, ''); 
   input_meta.value = valor_sem_numeros_pontos; // Define o valor do input-meta como o valor sem números e pontos
   opcoes_meses.setChoiceByValue(''); // Reseta a opção selecionada para a primeira opção no select

   const vendedor_selecionado = document.querySelectorAll('.vendedor-selecionado');
   vendedor_selecionado.forEach(item => {
      item.classList.remove('vendedor-selecionado')
   });
}

// Função para verificar e habilitar/desabilitar o botão
function verificar_habilitacao() {
   const mes_selecionado = meses_para_selecionar.options[meses_para_selecionar.selectedIndex].value;
   const valor_numerico = input_meta.value.replace(/[R$.,]/g, '');
   const numero_float = parseFloat(valor_numerico);
   const vendedor_selecionado = document.querySelector('.vendedor-selecionado');

   if (mes_selecionado > 0 && numero_float >= 0 && vendedor_selecionado) {
      botao_adicionar_meta.disabled = false; // Habilita o botao
   } else {
      botao_adicionar_meta.disabled = true; // Desablita o botao
   }
};

// Adiciona o evento de escuta para o evento 'change' no meses_para_selecionar
meses_para_selecionar.addEventListener('change', verificar_habilitacao);

// Adiciona o evento de escuta para o evento 'input' no input_meta
input_meta.addEventListener('input', verificar_habilitacao);

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
                           <p class="fw-semibold mb-0">Prop. Aprovadas</p><span class="text-muted fs-12">${item.Propostas}</span>
                        </div>
                        <div class="text-center p-3 my-auto">
                           <p class="fw-semibold mb-0">Processos</p><span class="text-muted fs-12">${item.Processos}</span>
                        </div>
                        <div class="text-center p-3 my-auto">
                           <p class="fw-semibold mb-0">Lucro Estimado</p><span class="text-muted fs-12">${item.Lucro_Estimado.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span>
                        </div>
                        <div class="text-center p-3 my-auto">
                           <p class="fw-semibold mb-0">Lucro Efetivo</p><span class="text-muted fs-12">${item.Lucro_Efetivo.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span>
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

async function selecionar_vendedores(consulta) {
   const selecionar_vendedores = document.querySelector('.selecionar-vendedores');

   for (let i = 0; i < consulta.length; i++) {
      const item = consulta[i];
      
      const card_html = `<div class="card custom-card" style="display: flex !important; justify-content: center; align-items: center; margin-top: 2rem; box-shadow: none;">
                           <div class="avatar avatar-xl avatar-rounded imagem-vendedores" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="${item.Nome}" style="position: relative; outline: 0.25rem solid rgba(0, 0, 0, 0.075); cursor: pointer;" data-IdVendedor="${item.IdVendedor}">
                              <img src="https://cdn.conlinebr.com.br/colaboradores/${item.IdVendedor}" alt="${item.Nome}">
                           </div>
                        </div>`

      // Adiciona a string HTML ao array
      selecionar_vendedores.insertAdjacentHTML('beforeend', card_html);
   }
};

async function ativar_tooltip() {
   
   const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    const tooltipList = [...tooltipTriggerList].map(
      (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
    );
};

// Pega o lucro estimado do vendedor no mes atual
async function card_lucro_estimado_mes_atual(consulta) {
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

// Pega o lucro estimado do vendedor no mes atual
async function card_lucro_efetivo_mes_atual(consulta) {
   const data_atual = new Date();
   const mes_atual = data_atual.getMonth() + 1;

   // Usa o reduce para somar os valores de lucro estimado do mes atual
   const Lucro_Efetivo = consulta.reduce((total, item) => {
      // Verifica se o usuario logado é um vendedor e se existe registros de valores para o mes atual para somar
      if (mes_atual === item.MES) {
         return total + item.LUCRO_EFETIVO;
      }
      return total;
   }, 0);

   const html_Lucro_Efetivo = document.getElementById('lucro-efetivo');
   html_Lucro_Efetivo.textContent = Lucro_Efetivo.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})
};

// Pega o lucro estimado do vendedor no mes atual
async function card_meta_comercial(consulta) {
   const data_atual = new Date();
   const mes_atual = data_atual.getMonth() + 1;

   let valor_meta = 0; // Inicializa a variável valor_meta como 0

   for (let i = 0; i < consulta.length; i++) {
      const item = consulta[i];

      // Verifica se o usuario logado é um vendedor e se existe registros de valores para o mes atual para somar
      if (mes_atual === item.mes) {
         valor_meta = item.valor_meta;
      }
   }

   const html_valor_meta = document.getElementById('meta-mensal');
   if (valor_meta !== undefined) {
      html_valor_meta.textContent = valor_meta.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
   } else {
      html_valor_meta.textContent = 'R$ 0,00'; // Define um valor padrão se não houver valor_meta
   }
};

// Retorna o total de processo, proposta o que for passado na consulta, mas tem que tem o ID_VENDEDOR e o MES na consulta
async function quantidade_itens_mes_atual(consulta, situacao) {
   // Retorna os itens do mes atual e do usuario logado
   const total =  consulta.filter(item => item.Situacao === situacao);

   return total;
};
let grafico_processos_intancia, grafico_propostas_intancia;
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

   grafico_propostas_intancia = new ApexCharts(document.querySelector("#grafico-propostas"), options_propostas);
   grafico_propostas_intancia.render();
   grafico_processos_intancia = new ApexCharts(document.querySelector("#grafico-processos"), options_processos);
   grafico_processos_intancia.render();

};

let lucro_por_processo;
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
         lucro_est: item.LUCRO_ESTIMADO,
         lucro_efe: item.LUCRO_EFETIVO
      };
   }

   // Converter o objeto em um array de objetos
   const resultados = Object.values(lucratividade_processos);

   // Se a tabela do datatable ja existir, destroi
   if ($.fn.DataTable.isDataTable('.tabela-faturamento-processo')) {
      lucro_por_processo.destroy();
      $('.tabela-faturamento-processo').empty(); // Limpar o HTML da tabela
   }

   lucro_por_processo = $('.tabela-faturamento-processo').DataTable({
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
            "data": "lucro_est",
            "className": "lucro_est",
            "render": function (data, type, row) {
               return `<span>${data ? data.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'}) : ''}</span>`;
            }
         },
         { 
            "data": "lucro_efe",
            "className": "lucro_efe",
            "render": function (data, type, row) {
               return `<span>${data ? data.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'}) : ''}</span>`;
            }
         }
      ],
      "language": {
         url: '/assets/libs/dataTables/dataTables.plugins.pt-br.json' // Tradução para o português do Brasil
      },
      "order": [[4, 'desc']],
      "lengthMenu": [[8], [8]],
      "pageLength": 8
   });
}

// Retonar um array com o lucro estimado de cada mes
async function lucro_efetivo_mes_a_mes(consulta) {
   const soma_por_mes = [];

   for (let i = 0; i < consulta.length; i++) {
      const item = consulta[i];
      const mes_existente = soma_por_mes.find(mes => mes.MES === item.MES); // Encontra o mes na consulta do banco e salva na variavel

      if (mes_existente) {
         mes_existente.LUCRO_EFETIVO += item.LUCRO_EFETIVO; // Se o mes existir na variavel ele concatena o novo valor localizado
      } else {
         soma_por_mes.push({
            MES: item.MES,
            LUCRO_EFETIVO: item.LUCRO_EFETIVO
         });
      }
   }

   soma_por_mes.sort((a, b) => a.MES - b.MES); // Ordena os meses em ordem crescendo, ou seja, de Janeiro a Dezembro.
   return soma_por_mes
};

async function array_metas(consulta_metas) {
   // Inicia um array com 12 posições e com zeros em todas
   const array_metas = new Array(12).fill(0);

   consulta_metas.forEach(item => {
      const index = item.mes - 1 // Calcula o indice correto baseado no mes (0 - base do index)
      array_metas[index] = item.valor_meta; // Atualiza o array com o valor_meta para a posição do array respectiva ao mes
   });

   return array_metas;
};

let grafico_lucro_efetivo_instancia;
// Cria os graficos de lucro estimado de cada mes
async function grafico_lucro_efetivo(consulta, consulta_metas) {
   const lucro_efetivo = await lucro_efetivo_mes_a_mes(consulta); // Recebe a consulta do head para criar o array de lucro estimado
   const metas_mensais = await array_metas(consulta_metas); // Recebe a consulta do Sirius para criar o array de metas

   const array_lucro = new Array(12).fill(0); // Inicializa um array com zeros para 12 meses

   // Filtra os dados do ano atual e preenche o array de lucro
   lucro_efetivo.forEach(item => {
      array_lucro[item.MES - 1] = Number(item.LUCRO_EFETIVO); // Subtrai 1 do mês para ajustar o índice do array (Janeiro = 0, Fevereiro = 1, etc.)
   });
   
   var options = {
      series: [{
         name: 'Lucro Efetivo',
         data: array_lucro
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
             return val !== undefined ? val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'}) : '';
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

   grafico_lucro_efetivo_instancia = new ApexCharts(document.querySelector("#lucro-efetivo-mes-a-mes"), options);
   grafico_lucro_efetivo_instancia.render();
};

async function carrega_indicadores_comercial(IdVendedor) {

   await limparModal();

   let meta_financeira_comercial = await Thefetch(`/api/meta-financeira-comercial?IdVendedor=${IdVendedor}`);
   let meta_financeira_comercial_datatables_data_abertura = await Thefetch(`/api/meta_financeira_comercial_datatables_data_abertura?IdVendedor=${IdVendedor}`);
   let proposta_meta_comercial = await Thefetch(`/api/proposta-meta-comercial?IdVendedor=${IdVendedor}`);
   let processos_meta_comercial = await Thefetch(`/api/processos-meta-comercial?IdVendedor=${IdVendedor}`);
   let meta_mes_atual = await Thefetch(`/api/meta-mes-atual?IdVendedor=${IdVendedor}`);

   // Inserir o nome do comercial no modal
   const nome_comercial = document.querySelector('.nome-comercial');
   nome_comercial.textContent = meta_financeira_comercial[0].VENDEDOR;
   // Insere o lucro estimado do mes atual
   await card_lucro_estimado_mes_atual(meta_financeira_comercial);
   // Insere o lucro efetivo do mes atual
   await card_lucro_efetivo_mes_atual(meta_financeira_comercial);
   // Insere a meta do mes atual
   // await card_meta_comercial(meta_mes_atual);

   // Insere o grafico de processos e proposta
   await grafico_proposta_processo(proposta_meta_comercial, processos_meta_comercial);

   // Cria tabela com datatables com o faturamento estimado e efetivo de cada processo
   await faturamento_processo(meta_financeira_comercial_datatables_data_abertura);

   // Cria o grafico mes a mes do lucro estimado e metas
   await grafico_lucro_efetivo(meta_financeira_comercial, meta_mes_atual);
};

// Card de adição de metas ao vendedor
async function carrega_faturamento_mes_comercial_modal(IdVendedor) {
   const admin_modal_valores_comerciais = await Thefetch(`/api/admin-modal-valores-comerciais?IdVendedor=${IdVendedor}`);

   const nome_comercial = document.getElementById('nome-comercial');
   nome_comercial.textContent = admin_modal_valores_comerciais[0].Comercial;

   const faturamento_mes_vendedor = document.querySelector('.faturamento-mes-vendedor');
   let linhas_html = [];

   for (let i = 0; i < admin_modal_valores_comerciais.length; i++) {
      const item = admin_modal_valores_comerciais[i];

      const cor_lucro_efetivo = item.Lucro_Efetivo < 0 ? 'bg-danger-transparent' : 'bg-success-transparent';
      const cor_lucro_estimado = item.Lucro_Estimado < 0 ? 'bg-danger-transparent' : 'bg-success-transparent';
      const cor_meta = item.Meta < 0 ? 'bg-secondary-transparent' : 'bg-secondary-transparent';
      
      const item_html = `<tr>
                           <td> <span class="fw-semibold">${item.Mes}</span> </td>
                           <td> <span class="badge ${cor_lucro_estimado}">${item.Lucro_Estimado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'})}</span> </td>
                           <td> <span class="badge ${cor_lucro_efetivo}">${item.Lucro_Efetivo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'})}</span> </td>
                           <td> <span class="badge ${cor_meta}">${item.Meta.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'})}</span> </td>
                        </tr>`
      
      linhas_html.push(item_html);
   }

   // Serve para juntar todos os itens
   const linhas_html_completo = linhas_html.join('');

   faturamento_mes_vendedor.innerHTML = linhas_html_completo;
};

async function inserir_valores() {

   // Obtem o IdVendedor
   const data_IdVendedor = document.querySelector('.vendedor-selecionado').getAttribute('data-IdVendedor');

   // Obtem o nome do vendedor
   const nome_vendedor = document.querySelector('.vendedor-selecionado').getAttribute('data-bs-title');

   // Obtem o valor selecionado no select
   const meses = document.getElementById('meses');
   const mes_selecionado = meses.options[meses.selectedIndex].value;

   const data = new Date();
   const ano = data.getFullYear();

   // Obtem o valor da meta digitado no input
   const valor_meta = input_meta.value.replace(/[R$.,]/g, '');
   const numero_float = parseFloat(valor_meta);

   // Criar o objeto para enviar para a função inserir_valores
   const body = {
      id_comercial: data_IdVendedor,
      nome_comercial: nome_vendedor,
      mes: mes_selecionado,
      ano: ano,
      valor_meta: numero_float,
   };

   // Envia os valores do body para o servidor
   const result = await Thefetch('/api/inserir-meta-comercial', 'POST', body)
   if(result.status && result.status == true) {
      const toast_sucesso = document.querySelector('.toast-sucesso');
      toast_sucesso.textContent = result.mensagem;

      const successToast = document.getElementById('successToast');
      const toast = new bootstrap.Toast(successToast)
      toast.show();

      // Se o resultado da consulta for true, significa que deu certo e faz um INSERT ou UPDATE
      await carrega_faturamento_mes_comercial_modal(result.id_comercial);

   } else {
      console.log(result.mensagem)
   }
   
};

async function limparModal() {
   // Destruir instâncias dos gráficos ApexCharts, se existirem
   if (grafico_propostas_intancia) {
       grafico_propostas_intancia.destroy();
       grafico_propostas_intancia = null;
   }

   if (grafico_processos_intancia) {
       grafico_processos_intancia.destroy();
       grafico_processos_intancia = null;
   }

   if (grafico_lucro_efetivo_instancia) {
       grafico_lucro_efetivo_instancia.destroy();
       grafico_lucro_efetivo_instancia = null;
   }

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

   // Remove todas as divs filhas da div lucro-estimado-mes-a-mes
   const graficoLucroEfetivo = document.querySelector('#lucro-efetivo-mes-a-mes');
   const filhosGraficoLucroEfetivo = graficoLucroEfetivo.querySelectorAll('div');
   filhosGraficoLucroEfetivo.forEach(divFilha => {
       divFilha.remove();
   });
};

async function eventos_cliques() {
   // Seleciona o vendedor
   const vendedor_clicado = document.querySelectorAll('.imagem-vendedores');
   vendedor_clicado.forEach(elemento => {
      elemento.addEventListener('click', async function() {
         // Ao clicar em qualquer outro vendedor, vai remover a classe do que estava selecionado e inserir no clicado
         vendedor_clicado.forEach(selecionado => {
            selecionado.classList.remove('vendedor-selecionado')
         });

         // Carrega o faturamento do vendedor
         elemento.classList.add('vendedor-selecionado')
         const IdVendedor = this.getAttribute('data-IdVendedor');
         await carrega_faturamento_mes_comercial_modal(IdVendedor); // Carrega o faturamento do vendedor selecionado
         verificar_habilitacao(); // Verifica se te um vendedor selecionado para chamar a função
      })
   });

   // Ao clicar no card do comercial, abre o modal do mesmo com os respectivos dados
   document.querySelectorAll('.modal-vendedor').forEach(element => {
      element.addEventListener('click', async function(e) {
         $('#exampleModalXl').modal('show');
         
         const IdVendedor = this.getAttribute('data-IdVendedor');
         await mostrar_loading_modal(); // Adiciona o loading ao abrir o modal
         await carrega_indicadores_comercial(IdVendedor);
         await remover_loading(); // remove o loading ao fechar o modal
      })
   });

   // Faz uma pesquisa dentro do dataTables
   const input_pesquisa_processo = document.querySelector('#pesquisar-processos');
   input_pesquisa_processo.addEventListener('keyup', function (e) {
   e.preventDefault();

      const valor_texto = this.value.toUpperCase();
      lucro_por_processo.search(valor_texto).draw();
   });

   // Enviar os dados da meta para inserir no banco de dados
   const botao_adicionar_meta = document.getElementById('adicionar-meta');
   botao_adicionar_meta.addEventListener('click', function() {
      inserir_valores();
      limpar_inputs();
      verificar_habilitacao();
   })

   // ========== FECHA MODAL ========== // 
   // Adiciona evento ao modal para limpar o DataTable ao fechar o modal
   $('#exampleModalXl').on('hidden.bs.modal', async function () {
      await limparModal();
      if ($.fn.DataTable.isDataTable('.table-metas')) {
         lucro_por_processo.destroy();
         $('.table-metas').empty(); // Limpar o HTML da tabela
      }
   });
   
   // ========== FECHA MODAL ========== // 

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
   await selecionar_vendedores(admin_cards_comerciais);
   await eventos_cliques();
   await ativar_tooltip();
   await remover_loading();
};

await main();
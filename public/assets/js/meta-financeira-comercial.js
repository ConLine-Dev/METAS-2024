const dados_login = JSON.parse(localStorage.getItem('metasUser'));
async function usuario_logado(consulta) {
   for (let i = 0; i < consulta.length; i++) {
      const item = consulta[i];
      if (item.EMAIL_VENDEDOR === dados_login.email) {
         return item.ID_VENDEDOR;
      }
   }
};

const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

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
// async function card_meta_comercial(consulta, id_usuario_logado) {
//    const data_atual = new Date();
//    const mes_atual = data_atual.getMonth() + 1;

//    let valor_meta = 0; // Inicializa a variável valor_meta fora do loop

//    for (let i = 0; i < consulta.length; i++) {
//       const item = consulta[i];

//       // Verifica se o usuario logado é um vendedor e se existe registros de valores para o mes atual para somar
//       if (mes_atual === item.mes && item.id_comercial === id_usuario_logado) {
//          valor_meta = item.valor_meta
//       }
//    }

//    const html_valor_meta = document.getElementById('meta-mensal');
//    html_valor_meta.textContent = valor_meta.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})
// };

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

let lucro_efetivo_por_processo;
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

   lucro_efetivo_por_processo = $('.tabela-faturamento-processo').DataTable({
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
      "pageLenght": 8
   });
};

// Retonar um array com o lucro efetivo de cada mes
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

// Cria os graficos de lucro estimado de cada mes
async function grafico_lucro_estimado(consulta, consulta_metas) {
   const lucro_efetivo = await lucro_efetivo_mes_a_mes(consulta);
   const metas_mensais = await array_metas(consulta_metas);

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

   const chart = new ApexCharts(document.querySelector("#lucro-efetivo-mes-a-mes"), options);
   chart.render();
};

// Nesta função crio todos os eventos de cliques como pesquisa etc
async function eventos_cliques() {
   const input_pesquisa_processo = document.querySelector('#pesquisar-processos');
   input_pesquisa_processo.addEventListener('keyup', function (e) {
      e.preventDefault();

      const valor_texto = this.value.toUpperCase();
      lucro_efetivo_por_processo.search(valor_texto).draw();
   });
};

async function remover_loading() {
   let loading = document.querySelector('.loading');

   loading.style.display = 'none';
};

async function main() {
   const meta_financeira_comercial = await Thefetch(`/api/meta-financeira-comercial?email=${dados_login.email}`);
   const meta_financeira_comercial_datatables_data_abertura = await Thefetch(`/api/meta_financeira_comercial_datatables_data_abertura?email=${dados_login.email}`);
   const proposta_meta_comercial = await Thefetch(`/api/proposta-meta-comercial?email=${dados_login.email}`);
   const processos_meta_comercial = await Thefetch(`/api/processos-meta-comercial?email=${dados_login.email}`);
   const id_usuario_logado = await usuario_logado(meta_financeira_comercial);
   const meta_mes_atual = await Thefetch(`/api/meta-mes-atual?IdVendedor=${id_usuario_logado}`);

   await card_lucro_estimado_mes_atual(meta_financeira_comercial);
   await card_lucro_efetivo_mes_atual(meta_financeira_comercial);
   await faturamento_processo(meta_financeira_comercial_datatables_data_abertura);
   await grafico_lucro_estimado(meta_financeira_comercial, meta_mes_atual);
   // await card_meta_comercial(meta_mes_atual, id_usuario_logado)
   await eventos_cliques();
   await grafico_proposta_processo(proposta_meta_comercial, processos_meta_comercial);
   await remover_loading();
}

await main();
const listaOperacionais = await Thefetch('/api/operacionais');
const recompras_operacional = await Thefetch('/api/recompras_operacional');
const conversao_taxas = await Thefetch('/api/taxas_conversao');
const quantidade_processos = await Thefetch('/api/quantidade_processos');
const quantidade_emails = await Thefetch('/api/emails_enviados_recebidos');

let lucro_estimado_por_processo;

let recompraUSD = 0;
let recompraBRL = 0;
let recompraEUR = 0;
let recompraGBP = 0;
let totalConvertidoBRL = 0;
let totalProcessos = 0;
let arrayEmailsEnviados = [];
let arrayEmailsRecebidos = [];
const dadosOperacional = ['IdPessoa', 'Nome', 'Email'];
var nfLista = [0, 0, 0, 0, 0, 0];

async function criarArrayEmails(IdOperacional) {

  for (let i = 0; i < listaOperacionais.length; i++) {
    if (listaOperacionais[i].IdPessoa == IdOperacional) {
      dadosOperacional['IdPessoa'] = listaOperacionais[i].IdPessoa;
      dadosOperacional['Nome'] = listaOperacionais[i].Nome;
      dadosOperacional['Email'] = listaOperacionais[i].Email;
    }
  }

  for (let i = 0; i < quantidade_emails.length; i++) {
    if (quantidade_emails[i].email == dadosOperacional['Email']) {

      if (i == 0) {
        arrayEmailsEnviados[quantidade_emails[i].mes] = quantidade_emails[i].enviados;
        arrayEmailsRecebidos[quantidade_emails[i].mes] = quantidade_emails[i].recebidos;
      }
      else if (i != 0) {
        arrayEmailsEnviados[(quantidade_emails[i].mes) - 1] = quantidade_emails[i].enviados;
        arrayEmailsRecebidos[(quantidade_emails[i].mes) - 1] = quantidade_emails[i].recebidos;
      }
    }
  }
}

async function iniciarPagina() {
  const divCards = document.getElementById('divCards')

  let printDivCards = '';

  mostrar_loading();

  for (let i = 0; i < listaOperacionais.length; i++) {
    for (let j = 0; j < recompras_operacional.length; j++) {
      if (recompras_operacional[j].id_moeda == 1 && recompras_operacional[j].id_operacional == listaOperacionais[i].IdPessoa) {
        recompraUSD = recompraUSD + recompras_operacional[j].valor;
        for (let k = 0; k < conversao_taxas.length; k++) {
          if (conversao_taxas[k].IdMoeda_Origem == 31) {
            totalConvertidoBRL = totalConvertidoBRL + (recompras_operacional[j].valor * conversao_taxas[k].Fator);
          }
        }
      } else if (recompras_operacional[j].id_moeda == 2 && recompras_operacional[j].id_operacional == listaOperacionais[i].IdPessoa) {
        recompraBRL = recompraBRL + recompras_operacional[j].valor;
        totalConvertidoBRL = totalConvertidoBRL + recompras_operacional[j].valor;
      } else if (recompras_operacional[j].id_moeda == 3 && recompras_operacional[j].id_operacional == listaOperacionais[i].IdPessoa) {
        recompraEUR = recompraEUR + recompras_operacional[j].valor;
        for (let k = 0; k < conversao_taxas.length; k++) {
          if (conversao_taxas[k].IdMoeda_Origem == 52) {
            totalConvertidoBRL = totalConvertidoBRL + (recompras_operacional[j].valor * conversao_taxas[k].Fator);
          }
        }
      } else if (recompras_operacional[j].id_moeda == 4 && recompras_operacional[j].id_operacional == listaOperacionais[i].IdPessoa) {
        recompraGBP = recompraGBP + recompras_operacional[j].valor;
        totalConvertidoBRL = totalConvertidoBRL + (recompras_operacional[j].valor * 6);
      }
    }

    for (let j = 0; j < quantidade_processos.length; j++) {
      if (quantidade_processos[j].funcionario == listaOperacionais[i].IdPessoa && quantidade_processos[j].situacao != 'Finalizado'
        && quantidade_processos[j].situacao != 'Cancelado' && quantidade_processos[j].situacao != 'Auditado' && quantidade_processos[j].situacao != 'Faturado'
        && quantidade_processos[j].situacao != 'Liberado faturamento'){
        totalProcessos++;
      }
    }

    printDivCards += `<div type="button" class="btn col-xxl-4 col-xl-6 col-lg-6 col-md-6 col-sm-12 modal-operacional"
        data-bs-toggle="modal" data-bs-target="#exampleModalXl" style="border: none;" data-IdOperacional="${listaOperacionais[i].IdPessoa}">
        <div class="card custom-card team-member-card">

           <div class="teammember-cover-image my-4">
              <span class="avatar avatar-xl avatar-rounded">
                 <img src="https://cdn.conlinebr.com.br/colaboradores/${listaOperacionais[i].IdPessoa}" alt="">
              </span>
           </div>

           <div class="card-body p-0">
              <div
                 class="d-flex flex-wrap align-item-center mt-sm-0 mt-5 justify-content-between border-bottom border-block-end-dashed p-3"
                 style="margin-top: -25px !important;">
                 <div class="team-member-details flex-fill">
                    <p class="mb-0 fw-semibold fs-16 text-truncate">
                       <a href="javascript:void(0);">${listaOperacionais[i].Nome}</a>
                    </p>
                    <p class="mb-0 fs-12 text-muted text-break">${listaOperacionais[i].Email}</p>
                 </div>
              </div>

              <div class="team-member-stats d-sm-flex justify-content-evenly">
                 <div class="text-center p-3 my-auto">
                    <p class="fw-semibold mb-0">Processos</p><span class="text-muted fs-12">${totalProcessos}</span>
                 </div>
                 <div class="text-center p-3 my-auto">
                    <p class="fw-semibold mb-0">Não Conformidades</p><span class="text-muted fs-12">?</span>
                 </div>
                 <div class="text-center p-3 my-auto">
                    <p class="fw-semibold mb-0">Recompra Total</p><span class="text-muted fs-12">R$
                       ${totalConvertidoBRL.toFixed(2)}</span>
                 </div>
              </div>
           </div>
        </div>
     </div>`;

    recompraUSD = 0;
    recompraBRL = 0;
    recompraEUR = 0;
    recompraGBP = 0;
    totalConvertidoBRL = 0;
    totalProcessos = 0;

  }
  divCards.innerHTML = printDivCards;

  remover_loading();

}

async function recomprasCalculo(IdOperacional) {

  for (let index = 0; index < recompras_operacional.length; index++) {
    if (recompras_operacional[index].id_moeda == 1 && recompras_operacional[index].id_operacional == IdOperacional) {
      recompraUSD = recompraUSD + recompras_operacional[index].valor;
      totalConvertidoBRL = totalConvertidoBRL + (recompras_operacional[index].valor * 5);
    } else if (recompras_operacional[index].id_moeda == 2 && recompras_operacional[index].id_operacional == IdOperacional) {
      recompraBRL = recompraBRL + recompras_operacional[index].valor;
      totalConvertidoBRL = totalConvertidoBRL + recompras_operacional[index].valor;
    } else if (recompras_operacional[index].id_moeda == 3 && recompras_operacional[index].id_operacional == IdOperacional) {
      recompraEUR = recompraEUR + recompras_operacional[index].valor;
      totalConvertidoBRL = totalConvertidoBRL + (recompras_operacional[index].valor * 7);
    } else if (recompras_operacional[index].id_moeda == 4 && recompras_operacional[index].id_operacional == IdOperacional) {
      recompraGBP = recompraGBP + recompras_operacional[index].valor;
      totalConvertidoBRL = totalConvertidoBRL + (recompras_operacional[index].valor * 9);
    }
  }

  return { recompraUSD, recompraBRL, recompraEUR, recompraGBP, totalConvertidoBRL };
}

async function criarGraficos(IdOperacional) {

  const arrayRecompras = await recomprasCalculo(IdOperacional);
  criarArrayEmails(IdOperacional);
  const graficoRecompras = [arrayRecompras.recompraUSD, arrayRecompras.recompraBRL, arrayRecompras.recompraEUR, arrayRecompras.recompraGBP];
  var options = {

    series: [{
      data: arrayEmailsEnviados,
      name: 'Enviados'
    }, {
      data: arrayEmailsRecebidos,
      name: 'Recebidos'
    }],

    colors: ["#F9423A", "#3F2021"],

    chart: {
      height: 470,
      type: 'bar',
      stacked: false,
      toolbar: {
        show: false
      },
    },

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
      enabledOnSeries: [0, 1],
      offsetX: 30,
      style: {
        fontSize: '12px',
        colors: ["#F9423A", "#3F2021"]
      },
      background: {
        enabled: true,
        foreColor: '#fff',
        borderRadius: 2,
        padding: 4,
        opacity: 0.9,
        borderWidth: 1,
        borderColor: '#fff'
      }
    },
    xaxis: {
      categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    },
    tooltip: {
      enabled: false,
    }
  }

  var mailChart = new ApexCharts(document.querySelector("#mail-chart"), options);
  mailChart.render();
  mailChart.updateSeries([arrayEmailsEnviados, arrayEmailsRecebidos], true);

  var options = {

    series: [{
      data: nfLista,
      name: 'Não Conformidades',
    }],

    colors: ["#F9423A"],

    chart: {
      height: 470,
      type: 'bar',
      stacked: false,
      toolbar: {
        show: false
      }
    },

    plotOptions: {
      bar: {
        borderRadius: 2,
        columnWidth: '25%',
        horizontal: true,
        barHeight: '45%',
        dataLabels: {
          position: 'top',
        },
      }
    },
    dataLabels: {
      enabled: true,
      offsetX: 30,
      style: {
        fontSize: '12px',
        colors: ["#F9423A"]
      },
      background: {
        enabled: true,
        foreColor: '#fff',
        borderRadius: 2,
        padding: 4,
        opacity: 0.9,
        borderWidth: 1,
        borderColor: '#fff'
      }
    },
    xaxis: {
      categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    },
    tooltip: {
      enabled: false,
    }
  }

  var nfChart = new ApexCharts(document.querySelector("#nf-chart"), options);
  nfChart.render();
  // nfChart.updateSeries(nfLista, true);

  var options = {
    series: graficoRecompras,
    labels: ['USD', 'BRL', 'EUR', 'GBP'],
    chart: {
      type: 'pie',
      width: 500
    },

    plotOptions: {
      pie: {
        expandOnClick: false
      }
    },
    colors: ['#F9423A', '#2D2926', '#D0CFCD', '#3F2021'],
    fill: {
      type: 'gradient',
      opacity: 0.85,
    },
    legend: {
      show: false
    }
  };

  var recompraChart = new ApexCharts(document.querySelector("#recompra-chart"), options);
  
  recompraChart.render();
  recompraChart.updateSeries(graficoRecompras, true);
}

async function clickModal() {
  document.querySelectorAll('.modal-operacional').forEach(element => {
    element.addEventListener('click', async function (e) {
      e.preventDefault();
      const IdOperacional = this.getAttribute('data-IdOperacional');

      await iniciarModal(IdOperacional);
      await criarGraficos(IdOperacional);
      await criarTabelaRecompras(recompras_operacional);
    })
  });
}

async function mostrar_loading() {
  let img = document.getElementById('loading-img');

  // Define o caminho do gif
  img.src = "/assets/images/brand-logos/SLOGAN VERMELHO.gif";
};

async function remover_loading() {
  let loading = document.querySelector('.loading');
  loading.style.display = 'none';
};

async function iniciarModal(IdOperacional) {
  const divModalTitulo = document.getElementById('divModalTitulo');

  for (let i = 0; i < listaOperacionais.length; i++) {
    if (listaOperacionais[i].IdPessoa == IdOperacional) {
      dadosOperacional['IdPessoa'] = listaOperacionais[i].IdPessoa;
      dadosOperacional['Nome'] = listaOperacionais[i].Nome;
      dadosOperacional['Email'] = listaOperacionais[i].Email;
    }
  }

  var DivergenciasCE = await Thefetch('/api/divergencias_ce_mercante');
  var totalDivergenciasCE = 0;
  var DivergenciasFinanceiras = await Thefetch('/api/divergencias_financeiras');
  var totalDivergenciasFinanceiras = 0;
  var recompraTotalConvertida = 302.32;
  var totalProcessosAbertos = 0;
  var totalProcessosCancelados = 0;

  var divProcessos = document.getElementById('divProcessos');
  var divProcessosCancelados = document.getElementById('divProcessosCancelados');
  var divFinanceiro = document.getElementById('divFinanceiro');
  var divCE = document.getElementById('divCE');
  var divRecompraTotal = document.getElementById('divRecompraTotal');

  let printProcessos = '';
  let printProcessosCancelados = '';
  let printDivFinanceiro = '';
  let printDivCE = '';
  let printRecompraTotal = '';

  for (let index = 0; index < totalProcessos.length; index++) {
    if (totalProcessos[index].situacao == 'Em andamento' && totalProcessos[index].funcionario == IdOperacional) {
      totalProcessosAbertos++;
    } else if (totalProcessos[index].situacao == 'Aberto' && totalProcessos[index].funcionario == IdOperacional) {
      totalProcessosAbertos++;
    } else if (totalProcessos[index].situacao == 'Cancelado' && totalProcessos[index].funcionario == IdOperacional) {
      totalProcessosCancelados++;
    }
  }

  for (let index = 0; index < DivergenciasFinanceiras.length; index++) {
    if (DivergenciasFinanceiras[index].IdResponsavel == IdOperacional) {
      totalDivergenciasFinanceiras++;
    }
  }

  for (let index = 0; index < DivergenciasCE.length; index++) {
    if (DivergenciasCE[index].IdResponsavel == IdOperacional) {
      totalDivergenciasCE++;
    }
  }

  if (IdOperacional == 49993) {
    totalDivergenciasFinanceiras = DivergenciasFinanceiras.length;
    totalDivergenciasCE = DivergenciasCE.length;

    for (let index = 0; index < totalProcessos.length; index++) {
      if (totalProcessos[index].situacao == 'Em andamento') {
        totalProcessosAbertos++;
      } else if (totalProcessos[index].situacao == 'Aberto') {
        totalProcessosAbertos++;
      } else if (totalProcessos[index].situacao == 'Cancelado') {
        totalProcessosCancelados++;
      }
    }

  }

  printProcessos = `<div class="mb-2">Processos</div>
  <div class="text-muted mb-1 fs-12"> 
     <span class="text-dark fw-semibold fs-20 lh-1 vertical-bottom"> ${totalProcessosAbertos} </span> 
  </div>
  <div> 
     <span class="fs-12 mb-0">Número de processos abertos para coordenação</span>
  </div>`

  divProcessos.innerHTML = printProcessos;

  printProcessosCancelados = `<div class="mb-2">Processos Cancelados</div>
  <div class="text-muted mb-1 fs-12"> 
     <span class="text-dark fw-semibold fs-20 lh-1 vertical-bottom"> ${totalProcessosCancelados} </span> 
  </div>
  <div> 
     <span class="fs-12 mb-0">Número de processos que foram cancelados</span>
  </div>`

  divProcessosCancelados.innerHTML = printProcessosCancelados;

  printDivFinanceiro = `<div class="mb-2">Divergências Financeiras</div>
  <div class="text-muted mb-1 fs-12"> 
     <span class="text-dark fw-semibold fs-20 lh-1 vertical-bottom"> ${totalDivergenciasFinanceiras} </span> 
  </div>
  <div> 
     <span class="fs-12 mb-0">Número de divergências informadas pelo financeiro</span>
  </div>`

  divFinanceiro.innerHTML = printDivFinanceiro;

  printDivCE = `<div class="mb-2">Divergências CE</div>
  <div class="text-muted mb-1 fs-12"> <span
        class="text-dark fw-semibold fs-20 lh-1 vertical-bottom"> ${totalDivergenciasCE} </span> </div>
  <div> 
     <span class="fs-12 mb-0">Número de divergências no CE Mercante</span>
  </div>`

  divCE.innerHTML = printDivCE;

  printRecompraTotal = `<span class="d-block fs-16 fw-semibold" style="color: black;">BRL ${recompraTotalConvertida.toFixed(2)}</span>`

  divRecompraTotal.innerHTML = printRecompraTotal;

}

async function criarTabelaRecompras(consulta) {
  const lucratividade_processos = {};

  for (let i = 0; i < consulta.length; i++) {
    const item = consulta[i];
    let moeda = '';
    if (item.id_operacional === dadosOperacional['IdPessoa']) {
      const numero_processo = item.numero_processo;
      if (item.id_moeda == 1) {
        moeda = 'USD';
      } else if (item.id_moeda == 2) {
        moeda = 'BRL';
      } else if (item.id_moeda == 3) {
        moeda = 'EUR';
      } else if (item.id_moeda == 4) {
        moeda = 'GBP';
      }
      lucratividade_processos[numero_processo] = {
        numero_processo: item.numero_processo,
        id_moeda: moeda,
        valor: item.valor,
        data: item.data
      };
    }
  }

  const resultados = Object.values(lucratividade_processos);

  if (lucro_estimado_por_processo) {
    lucro_estimado_por_processo.destroy();
 }

  lucro_estimado_por_processo = $('.table').DataTable({
    "data": resultados,
    "columns": [
      { "data": "numero_processo" },
      {
        "data": "id_moeda",
        "className": "id_moeda",
        "render": function (data, type, row) {
          return `<span>${data}</span>`;
        }
      },
      {
        "data": "valor",
        "className": "valor",
        "render": function (data, type, row) {
          return `<span>${data.toFixed(2).toLocaleString('pt-BR')}</span>`;
        }
      }
    ],
    "language": {
      url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/pt-BR.json' // Tradução para o português do Brasil
    },
    "order": [[0, 'desc']],
    "lengthMenu": [[7], [7]],
    "pageLenght": 8
  });
};

async function main() {
  await iniciarPagina();
  await remover_loading();
  await clickModal();
}

await main();
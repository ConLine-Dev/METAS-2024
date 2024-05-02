const listaOperacionais = await Thefetch('/api/operacionais');
const recompras_operacional = await Thefetch('/api/recompras_operacional');
const conversao_taxas = await Thefetch('/api/taxas_conversao');
const quantidade_processos = await Thefetch('/api/quantidade_processos');

let arrayEmailsEnviados = [511, 718, 794, 226];
let arrayEmailsRecebidos = [349, 272, 385, 121];

let recompraUSD = 0;
let recompraBRL = 0;
let recompraEUR = 0;
let recompraGBP = 0;
let totalConvertidoBRL = 0;
let totalProcessos = 0;

async function criarArrayEmails() {

  for (let i = 0; i < quantidade_emails.length; i++) {
    if (quantidade_emails[i].email == dadosLogin.email) {

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

  let quantidade_NFs = 1;

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
        && quantidade_processos[j].situacao != 'Cancelado' && quantidade_processos[j].situacao != 'Auditado') {
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

  var options = {

    series: [{
      data: [1, 2, 1, 1]
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
}

async function clickModal() {
  document.querySelectorAll('.modal-operacional').forEach(element => {
    element.addEventListener('click', async function (e) {
      const IdOperacional = this.getAttribute('data-IdOperacional');
      await iniciarModal(IdOperacional);
      await criarGraficos(IdOperacional);
      $('#exampleModalXl').modal('show');
    })
  });
}

async function remover_loading() {
  let loading = document.querySelector('.loading');
  loading.style.display = 'none';
};

async function iniciarModal(IdOperacional) {
  const divModalTitulo = document.getElementById('divModalTitulo');
  const dadosOperacional = ['IdPessoa', 'Nome', 'Email'];

  for (let i = 0; i < listaOperacionais.length; i++) {
    if (listaOperacionais[i].IdPessoa == IdOperacional) {
      dadosOperacional['IdPessoa'] = listaOperacionais[i].IdPessoa;
      dadosOperacional['Nome'] = listaOperacionais[i].Nome;
      dadosOperacional['Email'] = listaOperacionais[i].Email;
    }
  }

  var notaFinal = 5;
  var DivergenciasCE = await Thefetch('/api/divergencias_ce_mercante');
  var totalDivergenciasCE = 0;
  var DivergenciasFinanceiras = await Thefetch('/api/divergencias_financeiras');
  var totalDivergenciasFinanceiras = 0;
  var recompraTotalConvertida = 302.32;

  var divNotaOperacional = document.getElementById('divNotaOperacional');
  var divProcessos = document.getElementById('divProcessos');
  var divFinanceiro = document.getElementById('divFinanceiro');
  var divCE = document.getElementById('divCE');
  var divRecompraTotal = document.getElementById('divRecompraTotal');

  let printNotaOperacional = '';
  let printProcessos = '';
  let printDivFinanceiro = '';
  let printDivCE = '';
  let printRecompraTotal = '';

  var totalProcessosAbertos = 0;

  for (let index = 0; index < quantidade_processos.length; index++) {
    if (quantidade_processos[index].situacao == 'Em andamento' && quantidade_processos[index].funcionario == IdOperacional) {
      totalProcessosAbertos++;
    } else if (quantidade_processos[index].situacao == 'Aberto' && quantidade_processos[index].funcionario == IdOperacional) {
      totalProcessosAbertos++;
    } else if (quantidade_processos[index].situacao == 'Faturado' && quantidade_processos[index].funcionario == IdOperacional) {
      totalProcessosAbertos++;
    }
  }

  for (let index = 0; index < DivergenciasCE.length; index++) {
    if (DivergenciasCE[index].IdResponsavel == IdOperacional && DivergenciasCE[index].Setor == "Operacional") {
      totalDivergenciasCE++;
    }
  }

  for (let index = 0; index < DivergenciasFinanceiras.length; index++) {
    if (DivergenciasFinanceiras[index].IdResponsavel == IdOperacional) {
      totalDivergenciasFinanceiras++;
    }
  }

  if (notaFinal < 0) {
    notaFinal = 0;
  }

  printNotaOperacional = `<div class="mb-2">Nota Operacional</div>
    <div class="text-muted mb-1 fs-12"> 
       <span class="text-dark fw-semibold fs-20 lh-1 vertical-bottom"> ${notaFinal.toFixed(2)} </span> 
    </div>
    <div> 
       <span class="fs-12 mb-0">Nota com base nas métricas estipuladas</span>
    </div>`

  divNotaOperacional.innerHTML = printNotaOperacional;

  printProcessos = `<div class="mb-2">Processos</div>
    <div class="text-muted mb-1 fs-12"> 
       <span class="text-dark fw-semibold fs-20 lh-1 vertical-bottom"> ${totalProcessosAbertos} </span> 
    </div>
    <div> 
       <span class="fs-12 mb-0">Processos em aberto para coordenação</span>
    </div>`

  divProcessos.innerHTML = printProcessos;

  printDivFinanceiro = `<div class="mb-2">Divergências Financeiras</div>
    <div class="text-muted mb-1 fs-12"> 
       <span class="text-dark fw-semibold fs-20 lh-1 vertical-bottom"> ${totalDivergenciasFinanceiras} </span> 
    </div>
    <div> 
       <span class="fs-12 mb-0">Divergências informadas pelo financeiro</span>
    </div>`

  divFinanceiro.innerHTML = printDivFinanceiro;

  printDivCE = `<div class="mb-2">Divergências CE</div>
    <div class="text-muted mb-1 fs-12"> <span
          class="text-dark fw-semibold fs-20 lh-1 vertical-bottom"> ${totalDivergenciasCE} </span> </div>
    <div> 
       <span class="fs-12 mb-0">Divergências informadas pelo documental</span>
    </div>`

  divCE.innerHTML = printDivCE;

  printRecompraTotal = `<span class="d-block fs-16 fw-semibold" style="color: black;">BRL ${recompraTotalConvertida.toFixed(2)}</span>`

  divRecompraTotal.innerHTML = printRecompraTotal;

  let printModalTitulo = '';

  printModalTitulo = `<h6 class="modal-title" id="exampleModalXlLabel">${dadosOperacional['Nome']}</h6> <button type="button"
    class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`;

  divModalTitulo.innerHTML = printModalTitulo;

}

async function main() {
  await iniciarPagina();
  await iniciarModal(null);
  await clickModal();
  await remover_loading();
}

await main();
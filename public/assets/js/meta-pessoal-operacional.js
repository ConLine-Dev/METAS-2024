const listaOperacionais = await Thefetch('/api/operacionais');
const dadosLogin = JSON.parse(localStorage.getItem('metasUser'));
const recompras_operacional = await Thefetch('/api/recompras_operacional');
const quantidade_emails = await Thefetch('/api/emails_enviados_recebidos');
const taxas_coversao = await Thefetch('/api/taxas_conversao');
const divergencias_financeiras = await Thefetch('/api/divergencias_financeiras');
const divergencias_CE = await Thefetch('/api/divergencias_ce_mercante');
const totalProcessos = await Thefetch('/api/quantidade_processos');

let tabelaRecompras;
let tabelaDivFinanceiras;
let tabelaDivCEMercante;

let arrayEmailsEnviados = [];
let arrayEmailsRecebidos = [];

async function usuario_logado(consulta) {
  for (let i = 0; i < consulta.length; i++) {
    const item = consulta[i];
    if (item.Email === dadosLogin.email) {
      return item.IdPessoa;
    }
  }
};

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

async function recomprasCalculo() {

  const idUsuarioLogado = await usuario_logado(listaOperacionais);
  var recompraUSD = 0;
  var recompraBRL = 0;
  var recompraEUR = 0;
  var recompraGBP = 0;
  var totalConvertidoBRL = 0;
  var taxaDolar = 0;
  var taxaEuro = 0;
  var taxaLibra = 0;
  var trimestreUSD = [];
  var trimestreBRL = [];
  var trimestreEUR = [];
  var trimestreGBP = [];

  for (let index = 0; index < taxas_coversao.length; index++) {
    if (taxas_coversao[index].IdMoeda_Origem == 31) {
      taxaDolar = taxas_coversao[index].Fator;
    }
    if (taxas_coversao[index].IdMoeda_Origem == 52) {
      taxaEuro = taxas_coversao[index].Fator;
    }
    if (taxas_coversao[index].IdMoeda_Origem == 81) {
      taxaLibra = taxas_coversao[index].Fator;
    }
  }

  for (let index = 0; index < recompras_operacional.length; index++) {
    if (recompras_operacional[index].status_recompra == 1){
      if (recompras_operacional[index].id <= 365) {
        if (recompras_operacional[index].id_moeda == 1 && recompras_operacional[index].id_operacional == idUsuarioLogado) {
          recompraUSD = recompraUSD + recompras_operacional[index].valor;
          trimestreUSD[0] = recompraUSD.toFixed(2);
          totalConvertidoBRL = totalConvertidoBRL + (recompras_operacional[index].valor * taxaDolar);
        } else if (recompras_operacional[index].id_moeda == 2 && recompras_operacional[index].id_operacional == idUsuarioLogado) {
          recompraBRL = recompraBRL + recompras_operacional[index].valor;
          trimestreBRL[0] = recompraBRL.toFixed(2);
          totalConvertidoBRL = totalConvertidoBRL + recompras_operacional[index].valor;
        } else if (recompras_operacional[index].id_moeda == 3 && recompras_operacional[index].id_operacional == idUsuarioLogado) {
          recompraEUR = recompraEUR + recompras_operacional[index].valor;
          trimestreEUR[0] = recompraEUR.toFixed(2);
          totalConvertidoBRL = totalConvertidoBRL + (recompras_operacional[index].valor * taxaEuro);
        } else if (recompras_operacional[index].id_moeda == 4 && recompras_operacional[index].id_operacional == idUsuarioLogado) {
          recompraGBP = recompraGBP + recompras_operacional[index].valor;
          totalConvertidoBRL = totalConvertidoBRL + (recompras_operacional[index].valor * taxaLibra);
          trimestreGBP[0] = recompraGBP.toFixed(2);
        }
      }
    }
  }

  recompraUSD = 0;
  recompraBRL = 0;
  recompraEUR = 0;
  recompraGBP = 0;
  totalConvertidoBRL = 0;

  for (let index = 0; index < recompras_operacional.length; index++) {
    if (recompras_operacional[index].status_recompra == 1){
      if (recompras_operacional[index].id > 365 && recompras_operacional[index].id < 896) {
        if (recompras_operacional[index].id_moeda == 1 && recompras_operacional[index].id_operacional == idUsuarioLogado) {
          recompraUSD = recompraUSD + recompras_operacional[index].valor;
          trimestreUSD[1] = recompraUSD.toFixed(2);
          totalConvertidoBRL = totalConvertidoBRL + (recompras_operacional[index].valor * taxaDolar);
        } else if (recompras_operacional[index].id_moeda == 2 && recompras_operacional[index].id_operacional == idUsuarioLogado) {
          recompraBRL = recompraBRL + recompras_operacional[index].valor;
          trimestreBRL[1] = recompraBRL.toFixed(2);
          totalConvertidoBRL = totalConvertidoBRL + recompras_operacional[index].valor;
        } else if (recompras_operacional[index].id_moeda == 3 && recompras_operacional[index].id_operacional == idUsuarioLogado) {
          recompraEUR = recompraEUR + recompras_operacional[index].valor;
          trimestreEUR[1] = recompraEUR.toFixed(2);
          totalConvertidoBRL = totalConvertidoBRL + (recompras_operacional[index].valor * taxaEuro);
        } else if (recompras_operacional[index].id_moeda == 4 && recompras_operacional[index].id_operacional == idUsuarioLogado) {
          recompraGBP = recompraGBP + recompras_operacional[index].valor;
          trimestreGBP[1] = recompraGBP.toFixed(2);
          totalConvertidoBRL = totalConvertidoBRL + (recompras_operacional[index].valor * taxaLibra);
        }
      }
    }
  }

  recompraUSD = 0;
  recompraBRL = 0;
  recompraEUR = 0;
  recompraGBP = 0;
  totalConvertidoBRL = 0;

  for (let index = 0; index < recompras_operacional.length; index++) {
    if (recompras_operacional[index].status_recompra == 1){
      if (recompras_operacional[index].id > 898) {
        if (recompras_operacional[index].id_moeda == 1 && recompras_operacional[index].id_operacional == idUsuarioLogado) {
          recompraUSD = recompraUSD + recompras_operacional[index].valor;
          trimestreUSD[2] = recompraUSD.toFixed(2);
          totalConvertidoBRL = totalConvertidoBRL + (recompras_operacional[index].valor * taxaDolar);
        } else if (recompras_operacional[index].id_moeda == 2 && recompras_operacional[index].id_operacional == idUsuarioLogado) {
          recompraBRL = recompraBRL + recompras_operacional[index].valor;
          trimestreBRL[2] = recompraBRL.toFixed(2);
          totalConvertidoBRL = totalConvertidoBRL + recompras_operacional[index].valor;
        } else if (recompras_operacional[index].id_moeda == 3 && recompras_operacional[index].id_operacional == idUsuarioLogado) {
          recompraEUR = recompraEUR + recompras_operacional[index].valor;
          trimestreEUR[2] = recompraEUR.toFixed(2);
          totalConvertidoBRL = totalConvertidoBRL + (recompras_operacional[index].valor * taxaEuro);
        } else if (recompras_operacional[index].id_moeda == 4 && recompras_operacional[index].id_operacional == idUsuarioLogado) {
          recompraGBP = recompraGBP + recompras_operacional[index].valor;
          trimestreGBP[2] = recompraGBP.toFixed(2);
          totalConvertidoBRL = totalConvertidoBRL + (recompras_operacional[index].valor * taxaLibra);
        }
      }
    }
  }

  if (idUsuarioLogado == 49993) {
    for (let index = 0; index < recompras_operacional.length; index++) {
      if (recompras_operacional[index].status_recompra == 1){
        if (recompras_operacional[index].id <= 365) {
          if (recompras_operacional[index].id_moeda == 1) {
            recompraUSD = recompraUSD + recompras_operacional[index].valor;
            trimestreUSD[0] = recompraUSD.toFixed(2);
            totalConvertidoBRL = totalConvertidoBRL + (recompras_operacional[index].valor * taxaDolar);
          } else if (recompras_operacional[index].id_moeda == 2) {
            recompraBRL = recompraBRL + recompras_operacional[index].valor;
            trimestreBRL[0] = recompraBRL.toFixed(2);
            totalConvertidoBRL = totalConvertidoBRL + recompras_operacional[index].valor;
          } else if (recompras_operacional[index].id_moeda == 3) {
            recompraEUR = recompraEUR + recompras_operacional[index].valor;
            trimestreEUR[0] = recompraEUR.toFixed(2);
            totalConvertidoBRL = totalConvertidoBRL + (recompras_operacional[index].valor * taxaEuro);
          } else if (recompras_operacional[index].id_moeda == 4) {
            recompraGBP = recompraGBP + recompras_operacional[index].valor;
            totalConvertidoBRL = totalConvertidoBRL + (recompras_operacional[index].valor * taxaLibra);
            trimestreGBP[0] = recompraGBP.toFixed(2);
          }
        }
      }
    }

    recompraUSD = 0;
    recompraBRL = 0;
    recompraEUR = 0;
    recompraGBP = 0;
    totalConvertidoBRL = 0;
  
    for (let index = 0; index < recompras_operacional.length; index++) {
      if (recompras_operacional[index].status_recompra == 1){
        if (recompras_operacional[index].id > 365 && recompras_operacional[index].id <= 896) {
          if (recompras_operacional[index].id_moeda == 1) {
            recompraUSD = recompraUSD + recompras_operacional[index].valor;
            trimestreUSD[1] = recompraUSD.toFixed(2);
            totalConvertidoBRL = totalConvertidoBRL + (recompras_operacional[index].valor * taxaDolar);
          } else if (recompras_operacional[index].id_moeda == 2) {
            recompraBRL = recompraBRL + recompras_operacional[index].valor;
            trimestreBRL[1] = recompraBRL.toFixed(2);
            totalConvertidoBRL = totalConvertidoBRL + recompras_operacional[index].valor;
          } else if (recompras_operacional[index].id_moeda == 3) {
            recompraEUR = recompraEUR + recompras_operacional[index].valor;
            trimestreEUR[1] = recompraEUR.toFixed(2);
            totalConvertidoBRL = totalConvertidoBRL + (recompras_operacional[index].valor * taxaEuro);
          } else if (recompras_operacional[index].id_moeda == 4) {
            recompraGBP = recompraGBP + recompras_operacional[index].valor;
            trimestreGBP[1] = recompraGBP.toFixed(2);
            totalConvertidoBRL = totalConvertidoBRL + (recompras_operacional[index].valor * taxaLibra);
          }
        }
      }
    }

    recompraUSD = 0;
    recompraBRL = 0;
    recompraEUR = 0;
    recompraGBP = 0;
    totalConvertidoBRL = 0;
  
    for (let index = 0; index < recompras_operacional.length; index++) {
      if (recompras_operacional[index].status_recompra == 1){
        if (recompras_operacional[index].id > 898) {
          if (recompras_operacional[index].id_moeda == 1) {
            recompraUSD = recompraUSD + recompras_operacional[index].valor;
            trimestreUSD[2] = recompraUSD.toFixed(2);
            totalConvertidoBRL = totalConvertidoBRL + (recompras_operacional[index].valor * taxaDolar);
          } else if (recompras_operacional[index].id_moeda == 2) {
            recompraBRL = recompraBRL + recompras_operacional[index].valor;
            trimestreBRL[2] = recompraBRL.toFixed(2);
            totalConvertidoBRL = totalConvertidoBRL + recompras_operacional[index].valor;
          } else if (recompras_operacional[index].id_moeda == 3) {
            recompraEUR = recompraEUR + recompras_operacional[index].valor;
            trimestreEUR[2] = recompraEUR.toFixed(2);
            totalConvertidoBRL = totalConvertidoBRL + (recompras_operacional[index].valor * taxaEuro);
          } else if (recompras_operacional[index].id_moeda == 4) {
            recompraGBP = recompraGBP + recompras_operacional[index].valor;
            trimestreGBP[2] = recompraGBP.toFixed(2);
            totalConvertidoBRL = totalConvertidoBRL + (recompras_operacional[index].valor * taxaLibra);
          }
        }
      }
    }
  }

  return { trimestreUSD, trimestreBRL, trimestreEUR, trimestreGBP, totalConvertidoBRL };
}

async function iniciarPagina() {

  const idUsuarioLogado = await usuario_logado(listaOperacionais);

  recomprasCalculo();
  const arrayRecompras = await recomprasCalculo();
  const recompraTotalConvertida = arrayRecompras.totalConvertidoBRL;

  var totalDivergenciasCE = 0;
  var totalDivergenciasFinanceiras = 0;

  var totalProcessosAbertos = 0;
  var totalProcessosCancelados = 0;

  for (let index = 0; index < totalProcessos.length; index++) {
    if (totalProcessos[index].situacao == 'Em andamento' && totalProcessos[index].funcionario == idUsuarioLogado) {
      totalProcessosAbertos++;
    } else if (totalProcessos[index].situacao == 'Aberto' && totalProcessos[index].funcionario == idUsuarioLogado) {
      totalProcessosAbertos++;
    } else if (totalProcessos[index].situacao == 'Cancelado' && totalProcessos[index].funcionario == idUsuarioLogado) {
      totalProcessosCancelados++;
    }
  }

  for (let index = 0; index < divergencias_financeiras.length; index++) {
    if (divergencias_financeiras[index].IdResponsavel == idUsuarioLogado) {
      totalDivergenciasFinanceiras++;
    }
  }

  for (let index = 0; index < divergencias_CE.length; index++) {
    if (divergencias_CE[index].IdResponsavel == idUsuarioLogado) {
      totalDivergenciasCE++;
    }
  }

  if (idUsuarioLogado == 49993) {
    totalDivergenciasFinanceiras = divergencias_financeiras.length;
    totalDivergenciasCE = divergencias_CE.length;

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

function openSwal(){

    Swal.fire({
      icon: "success",
      title: "Pronto!",
      text: "A recompra foi cadastrada.",
    });
}


function confirmar() {
  const numero_processo = document.getElementById("numeroProcesso").value;
  const id_moeda = document.getElementById("tipoMoeda").value;
  const valor = document.getElementById("valorRecompra").value;
  const descricao = document.getElementById("campoLivre").value;

  let url = `/api/operacional_por_processo?numero_processo=${numero_processo}&id_moeda=${id_moeda}&valor=${valor}&descricao=${descricao}`
  fetch(url).then(data => console.log(data));

 openSwal();

}

async function criarGraficos() {

  const arrayRecompras = await recomprasCalculo();

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
    yaxis: {
      categories: ['10', '20']
    },
    tooltip: {
      enabled: false,
    }
  }

  var mailChart = new ApexCharts(document.querySelector("#mail-chart"), options);

  mailChart.render();

  var options = {

    series: [{
      data: [0, 0, 0, 0, 0]
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
        fontSize: '15px',
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

    series: [{
      data: arrayRecompras.trimestreUSD,
      name: 'USD'
    }, {
      data: arrayRecompras.trimestreBRL,
      name: 'BRL'
    }, {
      data: arrayRecompras.trimestreEUR,
      name: 'EUR'
    }, {
      data: arrayRecompras.trimestreGBP,
      name: 'GBP'
    }],

    labels: ['Jan/Fev/Mar', 'Abr/Mai/Jun', 'Jul/Ago/Set', 'Out/Nov/Dez'],

    chart: {
      type: 'bar',
      height: 410,
      stacked: false,
      toolbar: {
        show: false
      },
    },

    dataLabels: {
      enabled: true,
      enabledOnSeries: [0, 1, 2, 3],
      offsetX: 0,
      offsetY: -25,
      style: {
        fontSize: '12px',
        colors: ['#F9423A', '#2D2926', '#D0CFCD', '#3F2021']
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

    plotOptions: {
      bar: {
        borderRadius: 2,
        columnWidth: '55%',
        horizontal: false,
        dataLabels: {
          position: 'top',
        },
      }
    },

    yaxis: {
      show: false,
    },

    colors: ['#F9423A', '#2D2926', '#D0CFCD', '#3F2021'],

    legend: {
      show: true,
      data: ['USD', 'BRL', 'EUR', 'GBP']
    },

    tooltip: {
      enabled: false,
    },

  };

  var recompraChart = new ApexCharts(document.querySelector("#recompra-chart"), options);

  recompraChart.render();
}

async function criar_tabelas_divergencias(){

  const idUsuarioLogado = await usuario_logado(listaOperacionais);
  const listaDivFinanceiro = [];
  const listaDivCEMercante = [];

  for (let index = 0; index < divergencias_financeiras.length; index++) {
    const item = divergencias_financeiras[index];

    if(idUsuarioLogado === 49993){
      listaDivFinanceiro.push({
        numero_processo: item.Numero_Processo,
        responsavel: item.Nome,
        caminho: item.Caminho_Tarefa
      });
    }
    else if(item.IdResponsavel === idUsuarioLogado){
      listaDivFinanceiro.push({
        numero_processo: item.Numero_Processo,
        responsavel: item.Nome,
        caminho: item.Caminho_Tarefa
      });
    }
  }

  tabelaDivFinanceiras = $('#tabelaDivFinanceiro').DataTable({
    "data": listaDivFinanceiro,
    "columns": [
      { "data": "numero_processo" },
      { "data": "responsavel" },
      { "data": "caminho"}
    ],
    "language": {
      url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/pt-BR.json' // Tradução para o português do Brasil
    },
    "order": [[0, 'desc']],
    "lengthMenu": [[13], [13]],
    "pageLenght": 8,
    "searching": true,
    "dom": 'fBrtip',
    "buttons": ['excel']
  });

  $('#searchBox2').on('keyup', function() {
    tabelaDivFinanceiras.search(this.value).draw();
  });

  for (let index = 0; index < divergencias_CE.length; index++) {
    const item = divergencias_CE[index];
    let tipo = '';
    let inconsistencia = '';

    if (divergencias_CE[index].Divergencia == null) {
      tipo = 'Retificação';
      inconsistencia = divergencias_CE[index].Retificacao;
    } else {
      tipo = 'Divergência';
      inconsistencia = divergencias_CE[index].Divergencia;
    }

    if(idUsuarioLogado === 49993){
      listaDivCEMercante.push({
        numero_processo: item.Processo,
        tipo: tipo,
        setor: item.Setor,
        inconsistencia: inconsistencia
      });
    }
    else if(item.IdResponsavel === idUsuarioLogado){
      listaDivCEMercante.push({
        numero_processo: item.Processo,
        tipo: item.Tipo,
        setor: item.Setor,
        inconsistencia: inconsistencia
      });
    }
  }

  tabelaDivCEMercante = $('#tabelaDivCE').DataTable({
    "data": listaDivCEMercante,
    "columns": [
      { "data": "numero_processo" },
      { "data": "tipo" },
      { "data": "setor" },
      { "data": "inconsistencia" }
    ],
    "language": {
      url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/pt-BR.json' // Tradução para o português do Brasil
    },
    "order": [[0, 'desc']],
    "lengthMenu": [[13], [13]],
    "pageLenght": 8,
    "searching": true,
    "dom": 'fBrtip',
    "buttons": ['excel']
  });

  $('#searchBox3').on('keyup', function() {
    tabelaDivCEMercante.search(this.value).draw();
  });

}

async function FormattedDateTime(time) {
  const date = new Date(time);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // meses começam de 0 a 11, então adicionamos 1
  const day = String(date.getDate()).padStart(2, '0');

  return `${day}/${month}/${year}`;
}

async function faturamento_processo(consulta) {

  const idUsuarioLogado = await usuario_logado(listaOperacionais);
  const lucratividade_processos = [];

  for (let i = 0; i < consulta.length; i++) {
    const item = consulta[i];

    let dataFormatada;

    dataFormatada = await FormattedDateTime(item.data);

    let moeda = '';
    if (item.status_recompra == 1) {
      if (idUsuarioLogado === 49993) {
        if (item.id_moeda == 1) {
          moeda = 'USD';
        } else if (item.id_moeda == 2) {
          moeda = 'BRL';
        } else if (item.id_moeda == 3) {
          moeda = 'EUR';
        } else if (item.id_moeda == 4) {
          moeda = 'GBP';
        }
        lucratividade_processos.push({
          id: item.id,
          numero_processo: item.numero_processo,
          id_moeda: moeda,
          valor: item.valor,
          data: dataFormatada
        });
      }
      else if (item.id_operacional === idUsuarioLogado) {
        if (item.id_moeda == 1) {
          moeda = 'USD';
        } else if (item.id_moeda == 2) {
          moeda = 'BRL';
        } else if (item.id_moeda == 3) {
          moeda = 'EUR';
        } else if (item.id_moeda == 4) {
          moeda = 'GBP';
        }
        lucratividade_processos.push({
          id: item.id,
          numero_processo: item.numero_processo,
          id_moeda: moeda,
          valor: item.valor,
          data: dataFormatada
        });
      }
    }
  }

  tabelaRecompras = $('#tabelaRecompras').DataTable({
    "data": lucratividade_processos,
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
      },
      { "data": "data" },
      {
        "data": "id",
        "className": "button-column",
        "render": function (data, type, row) {
          return `<button type="button" id="${data}" class="btn btn-primary deletebutton">X</button>`;
        }
      }
    ],
    "language": {
      url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/pt-BR.json' // Tradução para o português do Brasil
    },
    "order": [[0, 'desc']],
    "lengthMenu": [[4], [4]],
    "pageLenght": 8,
    "searching": true,
    "dom": 'fBrtip',
    "buttons": ['excel']
  });

  $(document).on('click', '.deletebutton', function () {
    const id = this.id;

    const row = this.closest('tr');
    const cells = row.querySelectorAll('td');

    cells.forEach(cell => {
      cell.style.setProperty('color', '#F9243A', 'important');
    });

    let url = `/api/atualizar_status_recompra?idRecompra=${id}`
    fetch(url).then(data => console.log(data));

  });
  
  $('#searchBox').on('keyup', function() {
    tabelaRecompras.search(this.value).draw();
  });
};

async function mostrar_loading() {
  let img = document.getElementById('loading-img');

  // Define o caminho do gif
  img.src = "/assets/images/brand-logos/SLOGAN VERMELHO.gif";
};

async function remover_loading() {
  let corpoDashboard = document.querySelector('.corpo-dashboard');
  let loading = document.querySelector('.loading');

  loading.style.display = 'none';
  corpoDashboard.style.display = 'block';
};

async function eventos_clique(){
  const botaoConfirmar = document.querySelectorAll('.botaoConfirmar')[0];
  botaoConfirmar.addEventListener('click', function(e){
    e.preventDefault();
    confirmar();
    $('#meuModal').modal('hide');
  })
};

async function main() {
  await mostrar_loading();
  await iniciarPagina();
  await faturamento_processo(recompras_operacional);
  await criarGraficos();
  await remover_loading();
  await criarArrayEmails();
  await eventos_clique();
  await criar_tabelas_divergencias();
}

await main();
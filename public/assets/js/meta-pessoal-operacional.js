const listaOperacionais = await Thefetch('/api/operacionais');
const dadosLogin = JSON.parse(localStorage.getItem('metasUser'));
const recompras_operacional = await Thefetch('/api/recompras_operacional');
const quantidade_emails = await Thefetch('/api/emails_enviados_recebidos');
const taxas_coversao = await Thefetch('/api/taxas_conversao');

let lucro_estimado_por_processo;

var notaFinal = 0;
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
    if (recompras_operacional[index].id_moeda == 1 && recompras_operacional[index].id_operacional == idUsuarioLogado) {
      recompraUSD = recompraUSD + recompras_operacional[index].valor;
      totalConvertidoBRL = totalConvertidoBRL + (recompras_operacional[index].valor * taxaDolar);
    } else if (recompras_operacional[index].id_moeda == 2 && recompras_operacional[index].id_operacional == idUsuarioLogado) {
      recompraBRL = recompraBRL + recompras_operacional[index].valor;
      totalConvertidoBRL = totalConvertidoBRL + recompras_operacional[index].valor;
    } else if (recompras_operacional[index].id_moeda == 3 && recompras_operacional[index].id_operacional == idUsuarioLogado) {
      recompraEUR = recompraEUR + recompras_operacional[index].valor;
      totalConvertidoBRL = totalConvertidoBRL + (recompras_operacional[index].valor * taxaEuro);
    } else if (recompras_operacional[index].id_moeda == 4 && recompras_operacional[index].id_operacional == idUsuarioLogado) {
      recompraGBP = recompraGBP + recompras_operacional[index].valor;
      totalConvertidoBRL = totalConvertidoBRL + (recompras_operacional[index].valor * taxaLibra);
    }
  }

  if (idUsuarioLogado == 49993) {
    for (let index = 0; index < recompras_operacional.length; index++) {
      if (recompras_operacional[index].id_moeda == 1) {
        recompraUSD = recompraUSD + recompras_operacional[index].valor;
        totalConvertidoBRL = totalConvertidoBRL + (recompras_operacional[index].valor * taxaDolar);
      } else if (recompras_operacional[index].id_moeda == 2) {
        recompraBRL = recompraBRL + recompras_operacional[index].valor;
        totalConvertidoBRL = totalConvertidoBRL + recompras_operacional[index].valor;
      } else if (recompras_operacional[index].id_moeda == 3) {
        recompraEUR = recompraEUR + recompras_operacional[index].valor;
        totalConvertidoBRL = totalConvertidoBRL + (recompras_operacional[index].valor * taxaEuro);
      } else if (recompras_operacional[index].id_moeda == 4) {
        recompraGBP = recompraGBP + recompras_operacional[index].valor;
        totalConvertidoBRL = totalConvertidoBRL + (recompras_operacional[index].valor * taxaLibra);
      }
    }
  }

  return { recompraUSD, recompraBRL, recompraEUR, recompraGBP, totalConvertidoBRL };
}

async function iniciarPagina() {

  const idUsuarioLogado = await usuario_logado(listaOperacionais);

  recomprasCalculo();
  const arrayRecompras = await recomprasCalculo();
  const recompraTotalConvertida = arrayRecompras.totalConvertidoBRL;

  const retorno_divCE = await fetch('/api/divergencias_ce_mercante');
  const divergencias_CE = await retorno_divCE.json();
  var totalDivergenciasCE = 0;

  const retorno_divFinanceiro = await fetch('/api/divergencias_financeiras');
  const divergencias_financeiras = await retorno_divFinanceiro.json();
  var totalDivergenciasFinanceiras = 0;

  const retorno_processos = await fetch('/api/quantidade_processos');
  const totalProcessos = await retorno_processos.json();
  var totalProcessosAbertos = 0;
  var totalProcessosCancelados = 0;

  for (let index = 0; index < totalProcessos.length; index++) {
    if (totalProcessos[index].situacao == 'Liberado faturamento' && totalProcessos[index].funcionario == idUsuarioLogado) {
      // totalProcessosAbertos++;
    } else if (totalProcessos[index].situacao == 'Em andamento' && totalProcessos[index].funcionario == idUsuarioLogado) {
      totalProcessosAbertos++;
    } else if (totalProcessos[index].situacao == 'Aberto' && totalProcessos[index].funcionario == idUsuarioLogado) {
      totalProcessosAbertos++;
      // } else if(totalProcessos[index].situacao == 'Faturado' && totalProcessos[index].funcionario == idUsuarioLogado){
      //   totalProcessosAbertos++;
    } else if (totalProcessos[index].situacao == 'Cancelado' && totalProcessos[index].funcionario == idUsuarioLogado) {
      totalProcessosCancelados++;
    }
  }

  for (let index = 0; index < divergencias_financeiras.length; index++) {
    if (divergencias_financeiras[index].IdResponsavel == idUsuarioLogado) {
      totalDivergenciasFinanceiras++;
      // notaFinal = notaFinal - 0.5;
    }
  }

  for (let index = 0; index < divergencias_CE.length; index++) {
    if (divergencias_CE[index].IdResponsavel == idUsuarioLogado) {
      totalDivergenciasCE++;
      // notaFinal = notaFinal - 0.5;
    }
  }

  if (idUsuarioLogado == 49993) {
    totalDivergenciasFinanceiras = divergencias_financeiras.length;
    totalDivergenciasCE = divergencias_CE.length;

    for (let index = 0; index < totalProcessos.length; index++) {
      if (totalProcessos[index].situacao == 'Liberado faturamento') {
        // totalProcessosAbertos++;
      } else if (totalProcessos[index].situacao == 'Em andamento') {
        totalProcessosAbertos++;
      } else if (totalProcessos[index].situacao == 'Aberto') {
        totalProcessosAbertos++;
        // } else if(totalProcessos[index].situacao == 'Faturado'){
        //   totalProcessosAbertos++;
      } else if (totalProcessos[index].situacao == 'Cancelado') {
        totalProcessosCancelados++;
      }
    }

  }

  // if(divergencias_CE.length == 0 && divergencias_financeiras.length == 0){
  //   notaFinal = notaFinal + 2;
  // }
  // if(totalNaoConformidades == 0){
  //   notaFinal = notaFinal + 5;
  // }
  // if(recompraTotalConvertida > 3000){
  //   notaFinal = notaFinal + 0.5;
  // }if(recompraTotalConvertida > 6000){
  //   notaFinal = notaFinal + 0.5;
  // }if(recompraTotalConvertida > 9000){
  //   notaFinal = notaFinal + 0.5;
  // }if(recompraTotalConvertida > 12000){
  //   notaFinal = notaFinal + 0.5;
  // }if(recompraTotalConvertida > 15000){
  //   notaFinal = notaFinal + 0.5;
  // }if(recompraTotalConvertida > 18000){
  //   notaFinal = notaFinal + 0.5;
  // }

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

  if (notaFinal < 0) {
    notaFinal = 0;
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

function confirmar() {
  const numero_processo = document.getElementById("numeroProcesso").value;
  const id_moeda = document.getElementById("tipoMoeda").value;
  const valor = document.getElementById("valorRecompra").value;
  const descricao = document.getElementById("campoLivre").value;

  console.log(numero_processo, id_moeda, valor, descricao);
  let url = `/api/operacional_por_processo?numero_processo=${numero_processo}&id_moeda=${id_moeda}&valor=${valor}&descricao=${descricao}`
  fetch(url).then(data => console.log(data));
}

async function criarGraficos() {

  const arrayRecompras = await recomprasCalculo();
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

async function eventos_cliques() {
  const input_pesquisa_processo = document.querySelector('#pesquisar-processos');
  input_pesquisa_processo.addEventListener('keyup', function (e) {
    e.preventDefault();

    const valor_texto = this.value.toUpperCase();
    lucro_estimado_por_processo.search(valor_texto).draw();
  });

};

async function faturamento_processo(consulta) {
  const idUsuarioLogado = await usuario_logado(listaOperacionais);
  const lucratividade_processos = {};

  for (let i = 0; i < consulta.length; i++) {
    const item = consulta[i];
    let moeda = '';
    if (item.id_operacional === idUsuarioLogado) {
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
    console.log('teste');
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
}

await main();
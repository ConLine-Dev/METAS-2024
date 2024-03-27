const listaOperacionais = await Thefetch('/api/operacionais');
const dadosLogin = JSON.parse(localStorage.getItem('metasUser'));

async function usuario_logado(consulta) {
  for (let i = 0; i < consulta.length; i++) {
     const item = consulta[i];
     if (item.Email === dadosLogin.email) {
        return item.IdPessoa;
     }
  }
};

async function recomprasCalculo(){
  const retorno_recompras = await fetch('/api/recompras_operacional');
  const recompras_operacional = await retorno_recompras.json();
  var recompraUSD = 0;
  var recompraBRL = 0;
  var recompraEUR = 0;
  var recompraGBP = 0;
  var totalConvertidoBRL = 0;

  for (let index = 0; index < recompras_operacional.length; index++) {
    if(recompras_operacional[index].id_moeda == 1){
      recompraUSD = recompraUSD + recompras_operacional[index].valor;
      totalConvertidoBRL = totalConvertidoBRL + (recompras_operacional[index].valor*5);
    }else if(recompras_operacional[index].id_moeda == 2){
      recompraBRL = recompraBRL + recompras_operacional[index].valor;
      totalConvertidoBRL = totalConvertidoBRL + recompras_operacional[index].valor;
    }else if(recompras_operacional[index].id_moeda == 3){
      recompraEUR = recompraEUR + recompras_operacional[index].valor;
      totalConvertidoBRL = totalConvertidoBRL + (recompras_operacional[index].valor*7);
    }else if(recompras_operacional[index].id_moeda == 4){
      recompraGBP = recompraGBP + recompras_operacional[index].valor;
      totalConvertidoBRL = totalConvertidoBRL + (recompras_operacional[index].valor*9);
    }
  }

  return {recompraUSD, recompraBRL, recompraEUR, recompraGBP, totalConvertidoBRL};

}

async function iniciarPagina(){

  const idUsuarioLogado = await usuario_logado(comerciais);

  recomprasCalculo();
  const arrayRecompras = await recomprasCalculo();
  const recompraTotalConvertida = arrayRecompras.totalConvertidoBRL;

  const retorno_divCE = await fetch('/api/divergencias_ce_mercante');
  const divergencias_CE = await retorno_divCE.json();

  const retorno_divFinanceiro = await fetch('/api/divergencias_financeiras');
  const divergencias_financeiras = await retorno_divFinanceiro.json();

  const retorno_processos = await fetch('/api/quantidade_processos');
  const totalProcessos = await retorno_processos.json();
  var totalProcessosAbertos = 0;

  for (let index = 0; index < totalProcessos.length; index++) {
    if(totalProcessos[index].situacao == 'Liberado faturamento' && totalProcessos[index].IdPessoa == idUsuarioLogado){
      totalProcessosAbertos++;
    } else if(totalProcessos[index].situacao == 'Em andamento' && totalProcessos[index].IdPessoa == idUsuarioLogado){
      totalProcessosAbertos++;
    } else if(totalProcessos[index].situacao == 'Aberto' && totalProcessos[index].IdPessoa == idUsuarioLogado){
      totalProcessosAbertos++;
    } else if(totalProcessos[index].situacao == 'Faturado' && totalProcessos[index].IdPessoa == idUsuarioLogado){
      totalProcessosAbertos++;
    }
  }

  var divNotaOperacional = document.getElementById('divNotaOperacional');
  var divProcessos = document.getElementById('divProcessos');
  var divFinanceiro = document.getElementById('divFinanceiro');
  var divCE = document.getElementById('divCE');
  var divRecompraTotal = document.getElementById('divRecompraTotal');

  var nota = 8.5;

  let printNotaOperacional = '';
  let printProcessos = '';
  let printDivFinanceiro = '';
  let printDivCE = '';
  let printRecompraTotal = '';

  printNotaOperacional = `<div class="mb-2">Nota Operacional</div>
  <div class="text-muted mb-1 fs-12"> 
     <span class="text-dark fw-semibold fs-20 lh-1 vertical-bottom"> ${nota.toFixed(2)} </span> 
  </div>
  <div> 
     <span class="fs-12 mb-0">Nota definida com base nas métricas estipuladas</span>
  </div>`

  divNotaOperacional.innerHTML = printNotaOperacional;

  printProcessos = `<div class="mb-2">Processos</div>
  <div class="text-muted mb-1 fs-12"> 
     <span class="text-dark fw-semibold fs-20 lh-1 vertical-bottom"> ${totalProcessosAbertos} </span> 
  </div>
  <div> 
     <span class="fs-12 mb-0">Número de processos abertos para coordenação</span>
  </div>`

  divProcessos.innerHTML = printProcessos;

  printDivFinanceiro = `<div class="mb-2">Divergências Financeiras</div>
  <div class="text-muted mb-1 fs-12"> 
     <span class="text-dark fw-semibold fs-20 lh-1 vertical-bottom"> ${divergencias_financeiras.length} </span> 
  </div>
  <div> 
     <span class="fs-12 mb-0">Número de divergências informadas pelo financeiro</span>
  </div>`

  divFinanceiro.innerHTML = printDivFinanceiro;

  printDivCE = `<div class="mb-2">Divergências CE</div>
  <div class="text-muted mb-1 fs-12"> <span
        class="text-dark fw-semibold fs-20 lh-1 vertical-bottom"> ${divergencias_CE.length} </span> </div>
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

async function criarGraficos(){

  const arrayRecompras = await recomprasCalculo();
  const graficoRecompras = [arrayRecompras.recompraUSD, arrayRecompras.recompraBRL, arrayRecompras.recompraEUR, arrayRecompras.recompraGBP];

  var options = {
  
    series: [{
      data: [30, 40, 35, 50, 49, 60, 70, 91, 125, 93, 39, 56],
      name: 'Enviados'
    }, {
      data: [45, 60, 40, 32, 60, 90, 20, 123, 64, 84, 95, 23],
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
      data: [30, 40, 35, 50, 49, 60, 70, 81, 25, 90, 85, 102]
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

async function main(){
  await mostrar_loading();
  await iniciarPagina();
  await criarGraficos();
  await remover_loading();
}

main();
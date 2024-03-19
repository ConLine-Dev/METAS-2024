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
  series: [513.45, 554.45, 410, 171],
  labels: ['USD', 'BRL', 'EUR', 'GBP'],
  chart: {
    type: 'donut',
    width: 500
  },
  plotOptions: {
    pie: {
      expandOnClick: false
    }
  },
  legend: {
    show: false
  }
};

var recompraChart = new ApexCharts(document.querySelector("#recompra-chart"), options);

recompraChart.render();

function iniciarPagina(){
  var divNotaOperacional = document.getElementById('divNotaOperacional');
  var divProcessos = document.getElementById('divProcessos');
  var divFinanceiro = document.getElementById('divFinanceiro');
  var divCE = document.getElementById('divCE');

  var nota = 8.5;
  var totalProcessos = 100;
  var divergenciasFinanceiras = 5;
  var divergenciasCE = 5;

  let printNotaOperacional = '';
  let printProcessos = '';
  let printDivFinanceiro = '';
  let printDivCE = '';

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
     <span class="text-dark fw-semibold fs-20 lh-1 vertical-bottom"> ${totalProcessos} </span> 
  </div>
  <div> 
     <span class="fs-12 mb-0">Número de processos abertos para coordenação</span>
  </div>`

  divProcessos.innerHTML = printProcessos;

  printDivFinanceiro = `<div class="mb-2">Divergências Financeiras</div>
  <div class="text-muted mb-1 fs-12"> 
     <span class="text-dark fw-semibold fs-20 lh-1 vertical-bottom"> ${divergenciasFinanceiras} </span> 
  </div>
  <div> 
     <span class="fs-12 mb-0">Número de divergências informadas pelo financeiro</span>
  </div>`

  divFinanceiro.innerHTML = printDivFinanceiro;

  printDivCE = `<div class="mb-2">Divergências CE</div>
  <div class="text-muted mb-1 fs-12"> <span
        class="text-dark fw-semibold fs-20 lh-1 vertical-bottom"> ${divergenciasCE} </span> </div>
  <div> 
     <span class="fs-12 mb-0">Número de divergências no CE Mercante</span>
  </div>`

  divCE.innerHTML = printDivCE;
}

iniciarPagina();
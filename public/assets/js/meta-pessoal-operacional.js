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

var options = options = {
  series: [
    {
      data: [
        {
          x: 'USD',
          y: 518.20
        },
        {
          x: 'BRL',
          y: 349.55
        },
        {
          x: 'EUR',
          y: 184.00
        },
        {
          x: 'GBP',
          y: 125.09
        },
      ]
    }
  ],
  legend: {
    show: false
  },
  dataLabels: {
    enabled: true,
    style: {
      fontSize: '20px',
    },
    formatter: function (text, op) {
      return [text, op.value]
    }
  },
  chart: {
    height: 400,
    width: 450,
    type: 'treemap',
    toolbar: {
      show: false
    }
  },
  colors: [
    '#F9423A',
    '#3F2021',
    '#D0CFCD',
    '#2D2926',
  ],
  plotOptions: {
    treemap: {
      distributed: true,
      enableShades: false
    }
  }
};

var recompraChart = new ApexCharts(document.querySelector("#recompra-chart"), options);
recompraChart.render();
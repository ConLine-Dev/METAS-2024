const dadosLogin = JSON.parse(localStorage.getItem('metasUser'));
const taxas_coversao = await Thefetch('/api/taxas_conversao');
const propostas_pricing = await Thefetch('/api/propostas_pricing')

let aprovadasLCL = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
let reprovadasLCL = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
let pendentesLCL = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
let aprovadasFCL = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
let reprovadasFCL = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
let pendentesFCL = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
let aprovadasAir = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
let reprovadasAir = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
let pendentesAir = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
let arraysPropostasLCL = [aprovadasLCL, reprovadasLCL, pendentesLCL]
let arraysPropostasFCL = [aprovadasFCL, reprovadasFCL, pendentesFCL]
let arraysPropostasAir = [aprovadasAir, reprovadasAir, pendentesAir]

async function criarArraysPropostas() {
    for (let index = 0; index < propostas_pricing.length; index++) {
        if (propostas_pricing[index].status == 'Aprovada') {
            if (propostas_pricing[index].tipo == 'LCL') {
                aprovadasLCL[propostas_pricing[index].mes - 1]++;
            }
            if (propostas_pricing[index].tipo == 'FCL') {
                aprovadasFCL[propostas_pricing[index].mes - 1]++;
            }
            if (propostas_pricing[index].tipo == 'Aéreo') {
                aprovadasAir[propostas_pricing[index].mes - 1]++;
            }
        } else if (propostas_pricing[index].status == 'Não Aprovada') {
            if (propostas_pricing[index].tipo == 'LCL') {
                reprovadasLCL[propostas_pricing[index].mes - 1]++;
            }
            if (propostas_pricing[index].tipo == 'FCL') {
                reprovadasFCL[propostas_pricing[index].mes - 1]++;
            }
            if (propostas_pricing[index].tipo == 'Aéreo') {
                reprovadasAir[propostas_pricing[index].mes - 1]++;
            }
        } else {
            if (propostas_pricing[index].tipo == 'LCL') {
                pendentesLCL[propostas_pricing[index].mes - 1]++;
            }
            if (propostas_pricing[index].tipo == 'FCL') {
                pendentesFCL[propostas_pricing[index].mes - 1]++;
            }
            if (propostas_pricing[index].tipo == 'Aéreo') {
                pendentesAir[propostas_pricing[index].mes - 1]++;
            }
        }
    }
}

async function iniciarPagina() {

    var divLCL = document.getElementById('divLCL');
    var divFCL = document.getElementById('divFCL');
    var divAereo = document.getElementById('divAereo');

    let printDivLCL = '';
    let printDivFCL = '';
    let printDivAereo = '';

    printDivLCL = `<div class="mb-2">Tempo de Resposta - LCL</div>
  <div class="text-muted mb-1 fs-12"> 
     <span class="text-dark fw-semibold fs-20 lh-1 vertical-bottom"> ? </span> 
  </div>
  <div> 
     <span class="fs-12 mb-0">Tempo entre a solicitação da cotação e o retorno do pricing</span>
  </div>`

    divLCL.innerHTML = printDivLCL;

    printDivFCL = `<div class="mb-2">Tempo de Resposta - FCL</div>
  <div class="text-muted mb-1 fs-12"> 
     <span class="text-dark fw-semibold fs-20 lh-1 vertical-bottom"> ? </span> 
  </div>
  <div> 
     <span class="fs-12 mb-0">Tempo entre a solicitação da cotação e o retorno do pricing</span>
  </div>`

    divFCL.innerHTML = printDivFCL;

    printDivAereo = `<div class="mb-2">Tempo de Resposta - Aéreo</div>
  <div class="text-muted mb-1 fs-12"> 
     <span class="text-dark fw-semibold fs-20 lh-1 vertical-bottom"> ? </span> 
  </div>
  <div> 
     <span class="fs-12 mb-0">Tempo entre a solicitação da cotação e o retorno do pricing</span>
  </div>`

    divAereo.innerHTML = printDivAereo;

}

async function criarGraficos() {

    var options = {
        series: [{
            name: 'Aprovadas',
            data: aprovadasLCL
        }, {
            name: 'Pendentes',
            data: pendentesLCL
        }, {
            name: 'Reprovadas',
            data: reprovadasLCL
        }],
        colors: ["#F9423A", "#3F2021", "#D0CFCD"],
        chart: {
            type: 'bar',
            height: 490,
            stacked: true,
            stackType: '100%',
            toolbar: {
                show: false
            }
        },
        xaxis: {
            categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
        },
        yaxis: {
            show: false
        }
    };

    var lclChart = new ApexCharts(document.querySelector("#lcl-chart"), options);

    lclChart.render();

    var options = {
        series: [{
            name: 'Aprovadas',
            data: aprovadasFCL
        }, {
            name: 'Pendentes',
            data: pendentesFCL
        }, {
            name: 'Reprovadas',
            data: reprovadasFCL
        }],
        colors: ["#F9423A", "#3F2021", "#D0CFCD"],
        chart: {
            type: 'bar',
            height: 490,
            stacked: true,
            stackType: '100%',
            toolbar: {
                show: false
            }
        },
        xaxis: {
            categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
        },
        yaxis: {
            show: false
        },
    };

    var fclChart = new ApexCharts(document.querySelector("#fcl-chart"), options);

    fclChart.render();

    var options = {
        series: [{
            name: 'Aprovadas',
            data: aprovadasAir
        }, {
            name: 'Pendentes',
            data: pendentesAir
        }, {
            name: 'Reprovadas',
            data: reprovadasAir
        }],
        colors: ["#F9423A", "#3F2021", "#D0CFCD"],
        chart: {
            type: 'bar',
            height: 490,
            stacked: true,
            stackType: '100%',
            toolbar: {
                show: false
            }
        },
        xaxis: {
            categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
        },
        yaxis: {
            show: false
        }
    };

    var airChart = new ApexCharts(document.querySelector("#air-chart"), options);

    airChart.render();

}

async function FormattedDateTime(time) {
    const date = new Date(time);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // meses começam de 0 a 11, então adicionamos 1
    const day = String(date.getDate()).padStart(2, '0');

    return `${day}/${month}/${year}`;
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

async function main() {
    await mostrar_loading();
    await iniciarPagina();
    await criarGraficos();
    await remover_loading();
    await criarArraysPropostas();
}

await main();
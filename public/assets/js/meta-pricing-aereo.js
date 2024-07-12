const dadosLogin = JSON.parse(localStorage.getItem('metasUser'));
const propostas_pricing = await Thefetch('/api/propostas_pricing');
const propostas_aereo = await Thefetch('/api/propostas_aereo_pais');

let totalAprovadas = 0;
let totalReprovadas = 0;
let totalPendentes = 0;
let tabelaReprovadas;
let tabelaTotais;

async function iniciarPagina() {

    for (let index = 0; index < propostas_pricing.length; index++) {
        if(propostas_pricing[index].tipo == 'Aéreo'){
            if(propostas_pricing[index].status == 'Aprovada'){
                totalAprovadas++;
            } else if(propostas_pricing[index].status == 'Não Aprovada'){
                totalReprovadas++;
            }else{
                totalPendentes++;
            }
        }
    }

    var totalPropostas = document.getElementById('totalPropostas');
    let printTotalPropostas = '';

    printTotalPropostas = `
    <div class="row" style="display: flex; justify-content: space-around;">
        <div class="col-xl-3" style="background-color: #F9423A; border-radius: 10px;">
            <span class="d-block fs-16 fw-semibold" style="color: white;">Aprovadas</span>
            <span class="d-block fs-16 fw-semibold" style="color: white;">${totalAprovadas}</span>
        </div>
        <div class="col-xl-3" style="background-color: #3F2021; border-radius: 10px;">
            <span class="d-block fs-16 fw-semibold" style="color: white;">Reprovadas</span>
            <span class="d-block fs-16 fw-semibold" style="color: white;">${totalReprovadas}</span>
        </div>
        <div class="col-xl-3" style="background-color: #D0CFCD; border-radius: 10px;">
            <span class="d-block fs-16 fw-semibold" style="color: white;">Pendentes</span>
            <span class="d-block fs-16 fw-semibold" style="color: white;">${totalPendentes}</span>
        </div>
    </div>`

    totalPropostas.innerHTML = printTotalPropostas;

}

async function criarGraficos() {

    let propostaCHN = [];
    let propostaEUA = [];
    let propostaITA = [];
    let propostaALE = [];

    for (let index = 0; index < propostas_aereo.length; index++) {
        if (propostas_aereo[index].pais == 'CHINA' && propostas_aereo[index].courier == null){
            if (propostaCHN[propostas_aereo[index].mes-1] === undefined){
                propostaCHN[propostas_aereo[index].mes-1] = 0;
            }
            propostaCHN[propostas_aereo[index].mes-1]++;
        }
        if (propostas_aereo[index].pais == 'ESTADOS UNIDOS' && propostas_aereo[index].courier == null){
            if (propostaEUA[propostas_aereo[index].mes-1] === undefined){
                propostaEUA[propostas_aereo[index].mes-1] = 0;
            }
            propostaEUA[propostas_aereo[index].mes-1]++;
        }
        if (propostas_aereo[index].pais == 'ITALIA' && propostas_aereo[index].courier == null){
            if (propostaITA[propostas_aereo[index].mes-1] === undefined){
                propostaITA[propostas_aereo[index].mes-1] = 0;
            }
            propostaITA[propostas_aereo[index].mes-1]++;
        }
        if (propostas_aereo[index].pais == 'ALEMANHA' && propostas_aereo[index].courier == null){
            if (propostaALE[propostas_aereo[index].mes-1] === undefined){
                propostaALE[propostas_aereo[index].mes-1] = 0;
            }
            propostaALE[propostas_aereo[index].mes-1]++;
        }
    }

    var options = {
        series: [{
            name: 'China',
            data: propostaCHN
        }, {
            name: 'EUA',
            data: propostaEUA
        }, {
            name: 'Italia',
            data: propostaITA
        }, {
            name: 'Alemanha',
            data: propostaALE
        }],
        colors: ['#F9423A', '#2D2926', '#D0CFCD', '#F9423A99'],
        chart: {
            height: 265,
            type: 'bar',
            toolbar: {
                show: false
            }
        },
        dataLabels: {
            enabled: true,
            enabledOnSeries: [0, 1, 2, 3],
            offsetY: 50,
            style: {
                fontSize: '12px',
                colors: ['#F9423A', '#2D2926', '#D0CFCD', '#F9423A99']
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
            show: false
        },
        tooltip: {
            enabled: false
        }
    };

    var b2bChart = new ApexCharts(document.querySelector("#b2bChart"), options);

    b2bChart.render();

    let courierCHN = [];
    let courierEUA = [];
    let courierITA = [];
    let courierALE = [];

    for (let index = 0; index < propostas_aereo.length; index++) {
        if (propostas_aereo[index].pais == 'CHINA' && propostas_aereo[index].courier != null){
            if (courierCHN[propostas_aereo[index].mes-1] === undefined){
                courierCHN[propostas_aereo[index].mes-1] = 0;
            }
            courierCHN[propostas_aereo[index].mes-1]++;
        }
        if (propostas_aereo[index].pais == 'ESTADOS UNIDOS' && propostas_aereo[index].courier != null){
            if (courierEUA[propostas_aereo[index].mes-1] === undefined){
                courierEUA[propostas_aereo[index].mes-1] = 0;
            }
            courierEUA[propostas_aereo[index].mes-1]++;
        }
        if (propostas_aereo[index].pais == 'ITALIA' && propostas_aereo[index].courier != null){
            if (courierITA[propostas_aereo[index].mes-1] === undefined){
                courierITA[propostas_aereo[index].mes-1] = 0;
            }
            courierITA[propostas_aereo[index].mes-1]++;
        }
        if (propostas_aereo[index].pais == 'ALEMANHA' && propostas_aereo[index].courier != null){
            if (courierALE[propostas_aereo[index].mes-1] === undefined){
                courierALE[propostas_aereo[index].mes-1] = 0;
            }
            courierALE[propostas_aereo[index].mes-1]++;
        }
    }

    var options = {
        series: [{
            name: 'China',
            data: courierCHN
        }, {
            name: 'EUA',
            data: courierEUA
        }, {
            name: 'Italia',
            data: courierITA
        }, {
            name: 'Alemanha',
            data: courierALE
        }],
        colors: ['#F9423A', '#2D2926', '#D0CFCD', '#F9423A99'],
        chart: {
            height: 265,
            type: 'bar',
            toolbar: {
                show: false
            }
        },
        dataLabels: {
            enabled: true,
            enabledOnSeries: [0, 1, 2, 3],
            offsetY: 50,
            style: {
                fontSize: '12px',
                colors: ['#F9423A', '#2D2926', '#D0CFCD', '#F9423A99']
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
            show: false
        },
        tooltip: {
            enabled: false
        }
    };

    var courierChart = new ApexCharts(document.querySelector("#courierChart"), options);

    courierChart.render();

    var options = {
        series: [totalAprovadas, totalReprovadas, totalPendentes],
        chart: {
            width: 500,
            type: 'pie',
        },
        plotOptions: {
            pie: {
                expandOnClick: false
            }
        },
        colors: ["#F9423A", "#3F2021", "#D0CFCD"],
        labels: ['Propostas Aprovadas', 'Propostas Reprovadas', 'Propostas Pendentes'],
        fill: {
            type: 'gradient',
            opacity: 0.85,
        },
        legend: {
            show: false
        },
        tooltip: {
            enabled: false
        }
    };

    var offerChart = new ApexCharts(document.querySelector("#offerChart"), options);
    offerChart.render();

}

async function criarTabelas(){
    const listaPropostasReprovadas = [];
    const listaPropostasTotais = [];
  
    for (let index = 0; index < propostas_pricing.length; index++) {
      const item = propostas_pricing[index];
      if (item.tipo == 'Aéreo') {
        listaPropostasTotais.push({
            numero_proposta: item.proposta,
            coloader: item.armador,
            origem: item.origem,
            destino: item.destino,
            situacao: item.status,
            peso_taxado: item.Peso_Taxado,
          });
      }
      if (item.tipo == 'Aéreo' && item.status == 'Não Aprovada') {
        listaPropostasReprovadas.push({
            numero_proposta: item.proposta,
            coloader: item.armador,
            origem: item.origem,
            destino: item.destino,
            motivo_reprovacao: item.motivo_reprovacao,
            detalhe_reprovacao: item.detalhe_reprovacao,
        });
      }
    }
  
    tabelaTotais = $('#tabelaTotais').DataTable({
      "data": listaPropostasTotais,
      "columns": [
        { "data": "numero_proposta" },
        { "data": "coloader" },
        { "data": "origem"},
        { "data": "destino"},
        { "data": "situacao"},
        { "data": "peso_taxado"},
      ],
      "language": {
        url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/pt-BR.json' // Tradução para o português do Brasil
      },
      "order": [[0, 'desc']],
      "lengthMenu": [[8], [8]],
      "pageLenght": 5
    });
  
    tabelaReprovadas = $('#tabelaReprovadas').DataTable({
      "data": listaPropostasReprovadas,
      "columns": [
        { "data": "numero_proposta" },
        { "data": "coloader" },
        { "data": "origem"},
        { "data": "destino"},
        { "data": "motivo_reprovacao"},
        { "data": "detalhe_reprovacao"},
      ],
      "language": {
        url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/pt-BR.json' // Tradução para o português do Brasil
      },
      "order": [[0, 'desc']],
      "lengthMenu": [[8], [8]],
      "pageLenght": 5
    });
}

window.exportarTabelaTotais = function exportarTabelaTotais() {
    // Obter a instância do DataTable
    var tabela = $('#tabelaTotais').DataTable();
    
    // Obter todos os dados da tabela, não apenas os dados paginados
    var dados = tabela.data().toArray();
    
    // Criar uma tabela HTML temporária com todos os dados
    var tabelaCompleta = document.createElement('table');
    var thead = tabelaCompleta.createTHead();
    var tbody = tabelaCompleta.createTBody();
    
    // Adicionar cabeçalho
    var cabecalho = tabela.columns().header().toArray();
    var linhaCabecalho = thead.insertRow();
    cabecalho.forEach(function(coluna) {
        var th = document.createElement('th');
        th.textContent = coluna.innerText;
        linhaCabecalho.appendChild(th);
    });

    // Adicionar linhas de dados
    dados.forEach(function(linha) {
        var linhaTabela = tbody.insertRow();
        Object.values(linha).forEach(function(valor) {
            var celula = linhaTabela.insertCell();
            celula.textContent = valor;
        });
    });
    
    // Converter a tabela temporária para uma worksheet do SheetJS
    var ws = XLSX.utils.table_to_sheet(tabelaCompleta);
    
    // Criar um novo workbook e adicionar a worksheet
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tabela1");
    
    // Exportar o workbook para um arquivo Excel
    XLSX.writeFile(wb, "Propostas Totais.xlsx");
}

window.exportarTabelaReprovadas = function exportarTabelaReprovadas() {
    // Obter a instância do DataTable
    var tabela = $('#tabelaReprovadas').DataTable();
    
    // Obter todos os dados da tabela, não apenas os dados paginados
    var dados = tabela.data().toArray();
    
    // Criar uma tabela HTML temporária com todos os dados
    var tabelaCompleta = document.createElement('table');
    var thead = tabelaCompleta.createTHead();
    var tbody = tabelaCompleta.createTBody();
    
    // Adicionar cabeçalho
    var cabecalho = tabela.columns().header().toArray();
    var linhaCabecalho = thead.insertRow();
    cabecalho.forEach(function(coluna) {
        var th = document.createElement('th');
        th.textContent = coluna.innerText;
        linhaCabecalho.appendChild(th);
    });

    // Adicionar linhas de dados
    dados.forEach(function(linha) {
        var linhaTabela = tbody.insertRow();
        Object.values(linha).forEach(function(valor) {
            var celula = linhaTabela.insertCell();
            celula.textContent = valor;
        });
    });
    
    // Converter a tabela temporária para uma worksheet do SheetJS
    var ws = XLSX.utils.table_to_sheet(tabelaCompleta);
    
    // Criar um novo workbook e adicionar a worksheet
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tabela1");
    
    // Exportar o workbook para um arquivo Excel
    XLSX.writeFile(wb, "Propostas Reprovadas.xlsx");
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
    await criarTabelas();
}

await main();
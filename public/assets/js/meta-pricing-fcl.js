const dadosLogin = JSON.parse(localStorage.getItem('metasUser'));
const propostas_pricing = await Thefetch('/api/propostas_pricing');
const fretes_china = await Thefetch('/api/fretes_china_fcl');

let totalAprovadas = 0;
let totalReprovadas = 0;
let totalPendentes = 0;
let tabelaReprovadas;
let tabelaTotais;
let arrayOscilacaoFretes = [];
let arrayOscilacaoMeses = [];

async function iniciarPagina() {

    for (let index = 0; index < propostas_pricing.length; index++) {
        if(propostas_pricing[index].tipo == 'FCL'){
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

    let soma20DC = [];
    let soma40HC = [];
    let soma40NOR = [];
    let quantidade20DC = [];
    let quantidade40HC = [];
    let quantidade40NOR = [];
    
    for (let index = 0; index < fretes_china.length; index++) {
        if (fretes_china[index].frete > 10 && fretes_china[index].mes_validade) {
            if (fretes_china[index].Descricao == '20 DRY BOX'){
                if (soma20DC[fretes_china[index].mes_validade-1] === undefined){
                    quantidade20DC[fretes_china[index].mes_validade-1] = 0;
                    soma20DC[fretes_china[index].mes_validade-1] = 0;
                }
                soma20DC[fretes_china[index].mes_validade-1] = soma20DC[fretes_china[index].mes_validade-1] + fretes_china[index].frete;
                quantidade20DC[fretes_china[index].mes_validade-1]++;
            }
            if (fretes_china[index].Descricao == '40 DRY BOX' || fretes_china[index].Descricao == '40 HIGH CUBE'){
                if (soma40HC[fretes_china[index].mes_validade-1] === undefined){
                    quantidade40HC[fretes_china[index].mes_validade-1] = 0;
                    soma40HC[fretes_china[index].mes_validade-1] = 0;
                }
                soma40HC[fretes_china[index].mes_validade-1] = soma40HC[fretes_china[index].mes_validade-1] + fretes_china[index].frete;
                quantidade40HC[fretes_china[index].mes_validade-1]++;
            }
            if (fretes_china[index].Descricao == '40 NOR'){
                if (soma40NOR[fretes_china[index].mes_validade-1] === undefined){
                    quantidade40NOR[fretes_china[index].mes_validade-1] = 0;
                    soma40NOR[fretes_china[index].mes_validade-1] = 0;
                }
                soma40NOR[fretes_china[index].mes_validade-1] = soma40NOR[fretes_china[index].mes_validade-1] + fretes_china[index].frete;
                quantidade40NOR[fretes_china[index].mes_validade-1]++;
            }
        }
    }

    for (let index = 0; index < 12; index++) {
        if (soma20DC[index] != undefined){
            soma20DC[index] = Number((soma20DC[index]/quantidade20DC[index]).toFixed(2));
        }
        if (soma40HC[index] != undefined){
            soma40HC[index] = Number((soma40HC[index]/quantidade40HC[index]).toFixed(2));
        }
        if (soma40NOR[index] != undefined){
            soma40NOR[index] = Number((soma40NOR[index]/quantidade40NOR[index]).toFixed(2));
        }
    }

    var options = {
        series: [{
            name: '20DC',
            data: soma20DC
        }, {
            name: '40HC',
            data: soma40HC
        }, {
            name: '40NOR',
            data: soma40NOR
        }],
        colors: ["#F9423A", "#3F2021", "#D0CFCD"],
        chart: {
            height: 520,
            type: 'area',
            toolbar: {
                show: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        xaxis: {
            categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
        },
        yaxis: {
            show: false
        }
    };

    var freightChart = new ApexCharts(document.querySelector("#freightChart"), options);

    freightChart.render();

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
      if (item.tipo == 'FCL') {
        listaPropostasTotais.push({
            numero_proposta: item.proposta,
            agente: item.agente,
            origem: item.origem,
            destino: item.destino,
            situacao: item.status,
          });
      }
      if (item.tipo == 'FCL' && item.status == 'Não Aprovada') {
        listaPropostasReprovadas.push({
            numero_proposta: item.proposta,
            agente: item.agente,
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
        { "data": "agente" },
        { "data": "origem"},
        { "data": "destino"},
        { "data": "situacao"},
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
        { "data": "agente" },
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
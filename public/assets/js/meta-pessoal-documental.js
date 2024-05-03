const dadosLogin = JSON.parse(localStorage.getItem('metasUser'));
const divergencias_CE = await Thefetch('api/divergencias_ce_mercante');
const total_ce_lancados = await Thefetch('api/total_ce_lancados');
const formato_apresentacao_MBL = await Thefetch('api/formato_apresentacao_MBL');
const liberacoes_feitas = await Thefetch('api/liberacoes_feitas');

let totalRetificacoes = {};
let lucro_estimado_por_processo;

async function usuario_logado(consulta) {
    for (let i = 0; i < consulta.length; i++) {
        const item = consulta[i];
        if (item.Email === dadosLogin.email) {
            return item.IdPessoa;
        }
    }
};

async function iniciarPagina() {

    var divLiberacoes = document.getElementById('divLiberacoes');
    var divTempoLiberacao = document.getElementById('divTempoLiberacao');

    let printLiberacoes = '';
    let printTempoLiberacao = '';

    var totalLiberacoes = 0;

    for (let index = 0; index < liberacoes_feitas.length; index++) {
        let data = new Date(liberacoes_feitas[index].Data_Abertura_Processo);
        let dataAno = data.getUTCFullYear();
        if(liberacoes_feitas[index].Descricao == 'Liberação' && dataAno == 2024){
            totalLiberacoes++;
        }
        
    }


    const mediaTempoLiberacao = await calcularTempoLiberacao();


    printLiberacoes = `<div class="mb-2">Liberações feitas</div>
  <div class="text-muted mb-1 fs-12"> 
     <span class="text-dark fw-semibold fs-20 lh-1 vertical-bottom"> ${totalLiberacoes} </span> 
  </div>
  <div> 
     <span class="fs-12 mb-0">Número de processos liberados no ano de 2024</span>
  </div>`

    divLiberacoes.innerHTML = printLiberacoes;

    printTempoLiberacao = `<div class="mb-2">Tempo de Liberação</div>
  <div class="text-muted mb-1 fs-12"> 
     <span class="text-dark fw-semibold fs-20 lh-1 vertical-bottom"> ${mediaTempoLiberacao} </span> 
  </div>
  <div> 
     <span class="fs-12 mb-0">Média de tempo de desbloqueio de processos pagos</span>
  </div>`

    divTempoLiberacao.innerHTML = printTempoLiberacao;

}

async function calcularTempoLiberacao() {
    let tempoLiberacaoSegundos = 0;
    let contagemProcessos = 0;
    let processos = [];

    for (let index = 0; index < liberacoes_feitas.length; index++) {
        const element = liberacoes_feitas[index];
        let dataAbertura = new Date(liberacoes_feitas[index].Data_Abertura_Processo);

        const verificaContagem = processos.find(item => item.referencia == element.Numero_Processo)
      

        if (dataAbertura.getFullYear() == 2024 && !verificaContagem) {
            
            const recebimento = liberacoes_feitas.find(item => item.Descricao == "Recebimento dos Docs" && item.Numero_Processo == element.Numero_Processo);
         
            const liberacao = liberacoes_feitas.find(item => item.Descricao == "Liberação" && item.Numero_Processo == element.Numero_Processo);

            if (recebimento && liberacao) {

                const dataInicio = new Date(recebimento.Valor_Data);
                const dataFim = new Date(liberacao.Valor_Data);

                tempoLiberacaoSegundos += dataFim - dataInicio;

                contagemProcessos++;

                processos.push({
                    referencia: element.Numero_Processo

                })
            }
        }
    }


    if (contagemProcessos > 0) {
        tempoLiberacaoSegundos = tempoLiberacaoSegundos / processos.length
        // Calculando horas, minutos e segundos
        const segundosTotal = Math.floor(tempoLiberacaoSegundos / 1000);
        const horas = Math.floor(segundosTotal / 3600);
        const minutos = Math.floor((segundosTotal % 3600) / 60);
        const segundos = segundosTotal % 60;

        return `${pad(horas)}:${pad(minutos)}:${pad(segundos)}`;
    } else {
        return '00:00:00';
    }
}


function pad(num) {
    return num.toString().padStart(2, '0');
}

async function criarGraficos() {

    var totalCEs = [];

    for (let index = 0; index < total_ce_lancados.length; index++) {
        for (let indexMes = 0; indexMes < 12; indexMes++) {
            let data = new Date(total_ce_lancados[index].Data_CE);
            let dataMes = data.getUTCMonth();
            if (dataMes == indexMes){
                if(totalCEs[indexMes] == null){
                    totalCEs[indexMes] = 1
                }else if(totalCEs[indexMes] > 0){
                    totalCEs[indexMes]++
                }
            }
        }
    }
    var MBLemissao = 0;
    var MBLcourier = 0;
    var MBLdigital = 0;

    for (let index = 0; index < formato_apresentacao_MBL.length; index++) {
        let dataApresentacao = new Date(formato_apresentacao_MBL[index].Data_Abertura_Processo);
        if(dataApresentacao.getFullYear() == 2024){
            if (formato_apresentacao_MBL[index].Valor_Tipo_Fixo == 'Emissão destino'){
                MBLemissao++;
            } else if (formato_apresentacao_MBL[index].Valor_Tipo_Fixo == 'e-BL'){
                MBLdigital++;
            } else if(formato_apresentacao_MBL[index].Valor_Tipo_Fixo == 'Enviado Courrier'){
                MBLcourier++;
            }
        }  
    }

    var options = {

        series: [{
          data: totalCEs
        }],

        colors: ["#F9423A"],

          chart: {
          type: 'bar',
          height: 450,
          toolbar: {
            show: false
          }
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
            offsetX: 30,
            style: {
                fontSize: '12px',
                colors: ["#F9423A", ]
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
          categories: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
        },
        tooltip: {
            enabled: false
        }
        };

    var mailChart = new ApexCharts(document.querySelector("#mail-chart"), options);

    mailChart.render();

    var options = {
        series: [MBLcourier, MBLemissao, MBLdigital],
        labels: ['Emissão no Destino', 'Enviado por Courier', 'E-BL'],
        chart: {
            type: 'pie',
            width: 500
        },

        plotOptions: {
            pie: {
                expandOnClick: false
            }
        },
        colors: ['#F9423A', '#2D2926', '#D0CFCD'],
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

async function faturamento_processo() {
    let retificacao = '';
    let resumoArmador = '';

    for (let index = 0; index < divergencias_CE.length; index++) {
        if(divergencias_CE[index].Divergencias != null){
            retificacao = divergencias_CE[index].Divergencias;
        } else if(divergencias_CE[index].Retificacao != null){
            retificacao = divergencias_CE[index].Retificacao;
        }
        let clienteResumido = divergencias_CE[index].Cliente.split(" ");
        let armadorResumido = divergencias_CE[index].Armador.split(" ");

        if (armadorResumido[1] == undefined){
            resumoArmador = armadorResumido[0];
        } else{
            resumoArmador = armadorResumido[0] + " " + armadorResumido[1];
        }
        totalRetificacoes[index] = {
            cliente: clienteResumido[0] + " " + clienteResumido[1],
            armador: resumoArmador,
            operacional: divergencias_CE[index].Operacional,
            retificacao: retificacao
        }
        
    }

    const resultados = Object.values(totalRetificacoes);

    lucro_estimado_por_processo = $('.table').DataTable({
        "data": resultados,
        "columns": [
            { "data": "cliente" },
            { "data": "armador" },
            { "data": "operacional" },
            { "data": "retificacao" }
        ],
        "language": {
            url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/pt-BR.json' // Tradução para o português do Brasil
        },
        "lengthMenu": [[9], [9]],
        "dom": 'fBrtip',
        "buttons": ['excel']
    });
    
};

async function criarTabelaRetificacoes() {

    let retificacao = '';
    
    for (let index = 0; index < divergencias_CE.length; index++) {
        if(divergencias_CE[index].Divergencias != null){
            retificacao = divergencias_CE[index].Divergencias;
        } else if(divergencias_CE[index].Retificacao != null){
            retificacao = divergencias_CE[index].Retificacao;
        }
        totalRetificacoes[index] = {
            cliente: divergencias_CE[index].IdLogisticaHouse,
            armador: divergencias_CE[index].Setor,
            operacional: divergencias_CE[index].IdResponsavel,
            retificacao: retificacao
        }
        
    }
  
    const resultados = Object.values(lucratividade_processos);
  
    totalRetificacoes = $('.table').DataTable({
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

async function main() {
    await mostrar_loading();
    await iniciarPagina();
    await criarGraficos();
    await remover_loading();
    await faturamento_processo();
}

await main();
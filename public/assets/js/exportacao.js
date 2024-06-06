const meta = 1.15;
const time_new_process = 8000;
let new_process = false;

const meses = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

// Função que lista os dados mes a mes por modal, tipo carga e campo
async function soma_dados_mes_mes(consulta, modalidade, tipoCarga, campo) {
  // Filtra os objetos com a modalidade e tipo de carga
  const objetos_filtrados = consulta.filter(
    (obj) => obj.MODALIDADE === modalidade && obj.TIPO_CARGA === tipoCarga
  );

  // Inicializa um array para armazenar a soma por mês
  const soma_por_mes = Array.from({ length: 12 }, () => 0);

  // Soma os valores para cada mês
  objetos_filtrados.forEach((item) => {
    const mes = item.MES - 1; // Ajusta para o indice do array (0 a 11)
    soma_por_mes[mes] += item[campo];
  });

  // Apresenta somente duas casas decimais em cada item
  for (let i = 0; i < soma_por_mes.length; i++) {
    soma_por_mes[i] = Number(soma_por_mes[i].toFixed(2));
  }

  return soma_por_mes;
}

// Função que filtra e soma por tipo de carga e modal
async function soma_dados_modalidade(consulta, modalidade, tipoCarga, campo) {
  // FIltra os objetos com a modalidade desejada
  const objetos_filtrados = consulta.filter(
    (obj) => obj.MODALIDADE === modalidade && obj.TIPO_CARGA === tipoCarga
  );

  // Usa reduce para somar o valor do campo especifico
  const soma = objetos_filtrados.reduce((acc, obj) => acc + obj[campo], 0);

  return soma;
}

// Função que insere os valores nos cards anuais
async function cards_anuais(
  teus_tons_ano_anterior,
  teus_tons_ano_atual,
  modalidade,
  tipoCarga,
  campo
) {
  const dados_modal_ano_anterior = await soma_dados_modalidade(
    teus_tons_ano_anterior,
    modalidade,
    tipoCarga,
    campo
  );
  const dados_modal_ano_atual = await soma_dados_modalidade(
    teus_tons_ano_atual,
    modalidade,
    tipoCarga,
    campo
  );

  // Multiplica os valores do ano anterior com o valor da meta para termos a meta
  const meta_por_modal = dados_modal_ano_anterior * meta;

  // Divide o total até agora pela meta para termos a porcentagem
  const porcentagem_resultado_alcançado =
    (dados_modal_ano_atual / meta_por_modal) * 100;
  const porcentagem = porcentagem_resultado_alcançado.toFixed(2) + "%";

  // Insere na tela com textContent
  const meta_anual = document.getElementById(
    "meta-anual-" + tipoCarga + "-" + modalidade
  );
  meta_anual.textContent = porcentagem;
}

// Função que insere no card anual LCL
async function cards_anuais_LCL(
  teus_tons_ano_anterior,
  teus_tons_ano_atual,
  modalidade,
  tipoCarga
) {
  // Dados ano anterior
  const ano_anterior = teus_tons_ano_anterior.filter(
    (item) => item.MODALIDADE === modalidade && item.TIPO_CARGA === tipoCarga
  );
  const meta_anual = ano_anterior.length * meta;

  // Dados ano atual
  const ano_atual = teus_tons_ano_atual.filter(
    (item) => item.MODALIDADE === modalidade && item.TIPO_CARGA === tipoCarga
  );
  const total_atual = ano_atual.length;

  // Porcentagens meta anual
  const porcentagem = (total_atual / parseInt(meta_anual)) * 100;
  const card_anual = document.querySelector(
    "#meta-anual-" + tipoCarga + "-" + modalidade
  );

  card_anual.textContent = porcentagem.toFixed(2) + "%";
}

// Função que trás os resultados mes a mes
let graficosMensais = {}; // Objeto para armazenar os gráficos mensais
async function graficos_mensais(
  teus_tons_ano_anterior,
  teus_tons_ano_atual,
  modalidade,
  tipoCarga,
  campo
) {
  const dados_ano_anterior = await soma_dados_mes_mes(
    teus_tons_ano_anterior,
    modalidade,
    tipoCarga,
    campo
  );
  const dados_ano_atual = await soma_dados_mes_mes(
    teus_tons_ano_atual,
    modalidade,
    tipoCarga,
    campo
  );

  const meta_modal_campo = dados_ano_anterior.map((valor) => {
    const valorMeta = parseInt(valor * meta);
    return Math.max(valorMeta, 1); // Retorna o valor máximo entre o valor calculado e 1
  });

  // Armazena as porcentagem do atingido da meta até hoje
  const porcentagens = [];

  for (let i = 0; i < dados_ano_atual.length; i++) {
    const item1 = dados_ano_atual[i];
    const item2 = meta_modal_campo[i];

    const porcentagem = (item1 / item2) * 100;
    porcentagens.push(porcentagem.toFixed(2));
  }

  var options = {
    series: [
      {
        name: "Ano Atual",
        data: dados_ano_atual,
      },
      {
        name: "Meta",
        data: meta_modal_campo,
      },
    ],

    chart: {
      type: "bar",
      height: 390,
      toolbar: {
        show: false,
      },
    },

    colors: ["#F9423A", "#3F2021"],

    plotOptions: {
      bar: {
        borderRadius: 2,
        columnWidth: "70%",
        horizontal: false,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [0, 1], // ativa os rótulos para ambas as séries
      formatter: function (val, opts) {
        if (seriesIndex === 0) {
          // Se for a primeira serie de processos do ano atual, mostra o valor correspondente
          return dados_ano_atual[opts.dataPointIndex];
        } else if (seriesIndex === 1) {
          // Se for a segunda sére (Meta), mostra o valor correspondente
          return meta_modal_campo[opts.dataPointIndex];
        }
      },
      offsetY: -35,
      style: {
        fontSize: "12px",
        colors: ["#F9423A", "#3F2021"],
      },
      background: {
        enabled: true,
        foreColor: "#fff",
        borderRadius: 2,
        padding: 4,
        opacity: 0.9,
        borderWidth: 1,
        borderColor: "#fff",
      },
    },

    stroke: {
      show: true,
      width: 1,
      colors: ["#fff"],
    },

    tooltip: {
      shared: true,
      enabled: false,
      intersect: false,
    },

    xaxis: {
      categories: meses,
      labels: {
        show: false,
      },
    },

    yaxis: {
      show: false,
    },
  };

  var grafico_meta_anual = {
    series: [
      {
        data: dados_ano_atual,
      },
    ],

    colors: ["#F9423A"],

    chart: {
      height: 80,
      width: 180,
      type: "line",
      stacked: false,
      toolbar: {
        show: false,
      },
    },

    stroke: {
      curve: "smooth",
      width: 2,
    },

    dataLabels: {
      enabled: false,
    },

    xaxis: {
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },

    yaxis: {
      show: false,
    },

    grid: {
      show: false,
    },

    tooltip: {
      enabled: false,
    },
  };

  const grafico_mensal_id = "grafico-mes-" + modalidade + "-" + tipoCarga;
  const grafico_anual_id = "grafico-anual-" + modalidade + "-" + tipoCarga;

  // Crie instâncias separadas para gráficos mensais e anuais
  const chartMensal = new ApexCharts(
    document.querySelector("#" + grafico_mensal_id),
    options
  );
  const chartAnual = new ApexCharts(
    document.querySelector("." + grafico_anual_id),
    grafico_meta_anual
  );
  // Renderize os gráficos
  chartMensal.render();
  chartAnual.render();

  // Atribua as instâncias dos gráficos ao objeto usando a combinação de modalidade e tipoCarga como chave
  graficosMensais[`${modalidade}-${tipoCarga}`] = {
    chartMensal,
    chartAnual,
  };

  const modalidadeTipoCargaKey = `${modalidade}-${tipoCarga}`;
  const graficosMensaisExistem = graficosMensais[modalidadeTipoCargaKey];

  if (graficosMensaisExistem) {
    // Atualize as porcentagens
    options.dataLabels.formatter = function (val, opts) {
      const seriesIndex = opts.seriesIndex;
      if (seriesIndex === 0) {
        // Se for a primeira série (Ano Atual), mostre o valor correspondente
        return dados_ano_atual[opts.dataPointIndex];
      } else if (seriesIndex === 1) {
        // Se for a segunda série (Meta), mostre o valor correspondente
        return meta_modal_campo[opts.dataPointIndex];
      }
    };
    // Se existir, atualize os dados e renderize novamente
    graficosMensais[modalidadeTipoCargaKey].chartMensal.updateOptions(options);
    graficosMensais[modalidadeTipoCargaKey].chartAnual.updateOptions(
      grafico_meta_anual
    );
  }
}

// Função que obtem a quantidade de processo, por modal e por mes
async function contagem_processos_mes(consulta, modalidade, tipoCarga) {
  // Inicializa um objeto para armazenar a contagem por mes
  const contagem_por_mes = {};

  // Filtra os objetos na consulta pela modalidade desejada
  const objetos_filtrados = consulta.filter(
    (item) => item.MODALIDADE === modalidade && item.TIPO_CARGA === tipoCarga
  );

  // Item sobre os objetos filtrados
  for (const item of objetos_filtrados) {
    const { MES } = item;

    // Incrementa a contagem para o mes correspondente
    contagem_por_mes[MES] = (contagem_por_mes[MES] || 0) + 1;
  }

  // Inicializa um array para armazenar a contagem total por mês
  const contagem_total_por_mes = Array.from({ length: 12 }, (_, index) => {
    const mes = index + 1;
    // Obtém a contagem para o mês atual
    return contagem_por_mes[mes] || 0;
  });

  return contagem_total_por_mes;
}

// Função que cria os graficos
let graficosMensais_LCL = {}; // Objeto para armazenar os gráficos mensais
async function graficos_mensais_LCL(
  processos_ano_anterior,
  processos_ano_atual,
  modalidade,
  tipoCarga
) {
  const processos_anterior = await contagem_processos_mes(
    processos_ano_anterior,
    modalidade,
    tipoCarga
  );
  const processos_atual = await contagem_processos_mes(
    processos_ano_atual,
    modalidade,
    tipoCarga
  );

  const meta_processos = processos_anterior.map((valor) => {
    const valorMeta = parseInt(valor * meta);
    return Math.max(valorMeta, 1); // Retorna o valor máximo entre o valor calculado e 1
  });

  // Porcentagem da meta
  const porcentagens = [];

  // Passado o ano atual, pois se passar o ano anterior pode dar erro ao comparar os dois, visto que no inicio do ano tem poucos meses de registro e nao os 12
  for (let i = 0; i < processos_atual.length; i++) {
    const item1 = processos_atual[i];
    const item2 = meta_processos[i];

    // Calcular porcentagem  e adicionar ao array de porcentagens
    const porcentagem = (item1 / item2) * 100;
    porcentagens.push(porcentagem.toFixed(2));
  }

  var options_LCL = {
    series: [
      {
        name: "Ano Atual",
        data: processos_atual,
      },
      {
        name: "Meta",
        data: meta_processos,
      },
    ],

    chart: {
      type: "bar",
      height: 390,
      toolbar: {
        show: false,
      },
    },

    colors: ["#F9423A", "#3F2021"],

    plotOptions: {
      bar: {
        borderRadius: 2,
        columnWidth: "70%",
        horizontal: false,
        dataLabels: {
          position: "top",
        },
      },
    },

    dataLabels: {
      enabled: true,
      enabledOnSeries: [0, 1], // ativa os rótulos para ambas as séries
      formatter: function (val, opts) {
        if (seriesIndex === 0) {
          // Se for a primeira serie de processos do ano atual, mostra o valor correspondente
          return processos_atual[opts.dataPointIndex];
        } else if (seriesIndex === 1) {
          // Se for a segunda sére (Meta), mostra o valor correspondente
          return meta_processos[opts.dataPointIndex];
        }
      },
      offsetY: -35,
      style: {
        fontSize: "12px",
        colors: ["#F9423A", "#3F2021"],
      },
      background: {
        enabled: true,
        foreColor: "#fff",
        borderRadius: 2,
        padding: 4,
        opacity: 0.9,
        borderWidth: 1,
        borderColor: "#fff",
      },
    },

    stroke: {
      show: true,
      width: 1,
      colors: ["#fff"],
    },

    tooltip: {
      shared: true,
      enabled: false,
      intersect: false,
    },

    xaxis: {
      categories: meses,
      labels: {
        show: false,
      },
    },

    yaxis: {
      show: false,
    },
  };

  var grafico_meta_anual_LCL = {
    series: [
      {
        data: processos_atual,
      },
    ],

    colors: ["#F9423A"],

    chart: {
      height: 80,
      width: 180,
      type: "line",
      stacked: false,
      toolbar: {
        show: false,
      },
    },

    stroke: {
      curve: "smooth",
      width: 2,
    },

    dataLabels: {
      enabled: false,
    },

    xaxis: {
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },

    yaxis: {
      show: false,
    },

    grid: {
      show: false,
    },

    tooltip: {
      enabled: false,
    },
  };

  const grafico_mensal_id = "grafico-mes-" + modalidade + "-" + tipoCarga;
  const grafico_anual_id = "grafico-anual-" + modalidade + "-" + tipoCarga;

  // Crie instâncias separadas para gráficos mensais e anuais
  const chartMensal = new ApexCharts(
    document.querySelector("#" + grafico_mensal_id),
    options_LCL
  );
  const chartAnual = new ApexCharts(
    document.querySelector("." + grafico_anual_id),
    grafico_meta_anual_LCL
  );
  // Renderize os gráficos
  chartMensal.render();
  chartAnual.render();

  // Atribua as instâncias dos gráficos ao objeto usando a combinação de modalidade e tipoCarga como chave
  graficosMensais[`${modalidade}-${tipoCarga}`] = {
    chartMensal,
    chartAnual,
  };

  const modalidadeTipoCargaKey = `${modalidade}-${tipoCarga}`;
  const graficosMensaisExistem = graficosMensais[modalidadeTipoCargaKey];

  if (graficosMensaisExistem) {
    // Atualize as porcentagens
    options_LCL.dataLabels.formatter = function (val, opts) {
      const seriesIndex = opts.seriesIndex;
      if (seriesIndex === 0) {
        // Se for a primeira série (Ano Atual), mostre o valor correspondente
        return processos_atual[opts.dataPointIndex];
      } else if (seriesIndex === 1) {
        // Se for a segunda série (Meta), mostre o valor correspondente
        return meta_processos[opts.dataPointIndex];
      }
    };
    // Se existir, atualize os dados e renderize novamente
    graficosMensais[modalidadeTipoCargaKey].chartMensal.updateOptions(
      options_LCL
    );
    graficosMensais[modalidadeTipoCargaKey].chartAnual.updateOptions(
      grafico_meta_anual_LCL
    );
  }
}

// Gera o modal
function obter_cores_icone_por_modalidade(modalidade) {
  switch (modalidade) {
    case "IM":
      return {
        cor: "#f9423a",
        background: "rgba(249, 66, 58, 0.2)",
        icon: "ti-ship",
      };
    case "EM":
      return {
        cor: "#3F2021",
        background: "rgba(63, 32, 33, 0.2)",
        icon: "ti-ship",
      };
    case "IA":
      return {
        cor: "#23b7e5",
        background: "rgba(35, 183, 229, 0.2)",
        icon: "ti-plane-inflight",
      };
    default:
      return {
        cor: "#26bf94",
        background: "rgba(38, 191, 148, 0.2)",
        icon: "ti-plane-inflight",
      };
  }
}

function ultimo_processo_modal(data) {
  const audio_palmas = new Audio("/assets/audios/palmas.mp3");

  // Inicia a reprodução do áudio ao clicar
  audio_palmas.play();

  // const ultimo_processo_gerado = await Thefetch('/api/ultimo_processo_gerado');

  const sale_name = document.querySelector("#sale_name");
  const inside_sales_name = document.querySelector("#inside_sales_name");
  const modal_id = document.querySelector("#modal_id");
  const date_open_modal = document.querySelector("#date_open_modal");

  sale_name.textContent = data.VENDEDOR;
  inside_sales_name.textContent = data.INSIDE_SALES;
  modal_id.textContent = data.Numero_Processo;
  date_open_modal.textContent = data.Data_Abertura_Processo;

  // Obter cores com base na modalidade
  const { cor, background, icon } = obter_cores_icone_por_modalidade(
    data.MODALIDADE
  );
  date_open_modal.style.color = cor;
  date_open_modal.style.background = background;

  const sale_img = document.querySelector("#sale_img");
  const inside_img = document.querySelector("#inside_img");
  sale_img.setAttribute(
    "src",
    `https://cdn.conlinebr.com.br/colaboradores/${data.ID_VENDEDOR}`
  );
  inside_img.setAttribute(
    "src",
    `https://cdn.conlinebr.com.br/colaboradores/${data.ID_INSIDE_SALES}`
  );

  // adiciona o modal
  const modaldemo8 = document.querySelector("#modaldemo8");
  modaldemo8.classList.add("effect-scale", "show");
  modaldemo8.style.display = "block";

  setTimeout(() => {
    modaldemo8.classList.remove("effect-scale", "show");
    modaldemo8.style.display = "none";
    audio_palmas.pause();
    new_process = false;
  }, time_new_process);
}

async function mostrar_loading() {
  let img = document.getElementById("loading-img");

  // Define o caminho do gif
  img.src = "/assets/images/brand-logos/SLOGAN VERMELHO.gif";
}

async function remover_loading() {
  let corpoDashboard = document.querySelector(".corpo-dashboard");
  let loading = document.querySelector(".loading");

  corpoDashboard.style.display = "block";
  setTimeout(() => {
    loading.style.display = "none";
  }, 1000);
}

async function main() {
  const teus_tons_ano_anterior = await Thefetch("/api/teus_tons_ano_anterior");
  const teus_tons_ano_atual = await Thefetch("/api/teus_tons_ano_atual");
  await mostrar_loading();
  await cards_anuais(
    teus_tons_ano_anterior,
    teus_tons_ano_atual,
    "EM",
    "FCL",
    "TEUS"
  );
  // await cards_anuais(teus_tons_ano_anterior, teus_tons_ano_atual, 'EM', 'LCL', 'TONS');
  await cards_anuais_LCL(
    teus_tons_ano_anterior,
    teus_tons_ano_atual,
    "EM",
    "LCL"
  );
  await cards_anuais(
    teus_tons_ano_anterior,
    teus_tons_ano_atual,
    "EA",
    "AÉREO",
    "TONS"
  );
  await graficos_mensais(
    teus_tons_ano_anterior,
    teus_tons_ano_atual,
    "EM",
    "FCL",
    "TEUS"
  );
  // await graficos_mensais(teus_tons_ano_anterior, teus_tons_ano_atual, 'EM', 'LCL', 'TONS')
  await graficos_mensais_LCL(
    teus_tons_ano_anterior,
    teus_tons_ano_atual,
    "EM",
    "LCL"
  );
  await graficos_mensais(
    teus_tons_ano_anterior,
    teus_tons_ano_atual,
    "EA",
    "AÉREO",
    "TONS"
  );
  await remover_loading();
}

await main();
await introMain();

// Escurta um novo processo
const socket = io();

const lista_fechamento = [];

socket.on("NewProcess", async function (msg) {
  // console.log(msg)
  await main();
  lista_fechamento.push(msg);
});

setInterval(() => {
  if (lista_fechamento.length > 0 && new_process == false) {
    new_process = true;
    ultimo_processo_modal(lista_fechamento[0]);
    lista_fechamento.splice(0, 1);
  }
}, 1000);

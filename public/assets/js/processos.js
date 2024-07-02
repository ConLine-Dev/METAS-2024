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

// Função que insere os cards anuais
// async function cards_anuais(processos_ano_anterior, processos_ano_atual) {
//   // Dados ano anterior
//   const IM_ano_anterior = processos_ano_anterior.filter(
//     (palavra) => palavra.MODALIDADE === "IM"
//   );
//   const EM_ano_anterior = processos_ano_anterior.filter(
//     (palavra) => palavra.MODALIDADE === "EM"
//   );
//   const IA_ano_anterior = processos_ano_anterior.filter(
//     (palavra) => palavra.MODALIDADE === "IA"
//   );
//   const EA_ano_anterior = processos_ano_anterior.filter(
//     (palavra) => palavra.MODALIDADE === "EA"
//   );

//   const IM_meta = parseInt(IM_ano_anterior.length * meta);
//   const EM_meta = parseInt(EM_ano_anterior.length * meta);
//   const IA_meta = parseInt(IA_ano_anterior.length * meta);
//   const EA_meta = parseInt(EA_ano_anterior.length * meta);

//   // Dados ano atual
//   const IM_ano_atual = processos_ano_atual.filter(
//     (palavra) => palavra.MODALIDADE === "IM"
//   );
//   const EM_ano_atual = processos_ano_atual.filter(
//     (palavra) => palavra.MODALIDADE === "EM"
//   );
//   const IA_ano_atual = processos_ano_atual.filter(
//     (palavra) => palavra.MODALIDADE === "IA"
//   );
//   const EA_ano_atual = processos_ano_atual.filter(
//     (palavra) => palavra.MODALIDADE === "EA"
//   );

//   const IM_total_atual = parseInt(IM_ano_atual.length);
//   const EM_total_atual = parseInt(EM_ano_atual.length);
//   const IA_total_atual = parseInt(IA_ano_atual.length);
//   const EA_total_atual = parseInt(EA_ano_atual.length);

//   // Porcentagens meta anual
//   const IM_porcentagem = (IM_total_atual / IM_meta) * 100;
//   const EM_porcentagem = (EM_total_atual / EM_meta) * 100;
//   const IA_porcentagem = (IA_total_atual / IA_meta) * 100;
//   const EA_porcentagem = (EA_total_atual / EA_meta) * 100;

//   const card_IM = document.querySelector("#card-IM");
//   const card_IA = document.querySelector("#card-IA");
//   const card_EM = document.querySelector("#card-EM");
//   const card_EA = document.querySelector("#card-EA");

//   card_IM.textContent = IM_porcentagem.toFixed(2) + "%";
//   card_EM.textContent = EM_porcentagem.toFixed(2) + "%";
//   card_IA.textContent = IA_porcentagem.toFixed(2) + "%";
//   card_EA.textContent = EA_porcentagem.toFixed(2) + "%";

//   // Mapeia o array por IdCliente unicos
//   const clientes_ano_anterior = Array.from(
//     new Set(processos_ano_anterior.map((obj) => obj.IdCliente))
//   );
//   const clientes_ano_atual = Array.from(
//     new Set(processos_ano_atual.map((obj) => obj.IdCliente))
//   );

//   // Obtém a contagem de Clientes Unicos
//   const quantidade_clientes_ano_anterior = clientes_ano_anterior.length;
//   const meta_clientes = parseInt(quantidade_clientes_ano_anterior * meta);
//   const quantidade_clientes_ano_atual = clientes_ano_atual.length;
//   const CLI_porcentagem = (quantidade_clientes_ano_atual / meta_clientes) * 100;

//   const card_CLI = document.querySelector("#card-CLI");
//   card_CLI.textContent = CLI_porcentagem.toFixed(2) + "%";
// }

// Metas trimestrais
const metas_trimestrais = {
  Q1: 1.15,
  Q2: 1.15,
  Q3: 1.20,
  Q4: 1.20,
};

// Função auxiliar para calcular a meta acumulada anual
async function calcular_meta_anual(processos_ano_anterior, metas) {
  let total_meta = 0;
  let total_processos = processos_ano_anterior.length;

  for (const trimestre in metas) {
    total_meta += total_processos * metas[trimestre];
  }

  return total_meta / 4; // Divide por 4 para obter a média trimestral
}

// Função que insere os cards anuais
async function cards_anuais(processos_ano_anterior, processos_ano_atual) {
  // Calcula as metas acumuladas anuais
  const IM_meta_anual = await calcular_meta_anual(
    processos_ano_anterior.filter((palavra) => palavra.MODALIDADE === "IM"),
    metas_trimestrais
  );
  const EM_meta_anual = await calcular_meta_anual(
    processos_ano_anterior.filter((palavra) => palavra.MODALIDADE === "EM"),
    metas_trimestrais
  );
  const IA_meta_anual = await calcular_meta_anual(
    processos_ano_anterior.filter((palavra) => palavra.MODALIDADE === "IA"),
    metas_trimestrais
  );
  const EA_meta_anual = await calcular_meta_anual(
    processos_ano_anterior.filter((palavra) => palavra.MODALIDADE === "EA"),
    metas_trimestrais
  );

  // Dados ano atual
  const IM_ano_atual = processos_ano_atual.filter(
    (palavra) => palavra.MODALIDADE === "IM"
  );
  const EM_ano_atual = processos_ano_atual.filter(
    (palavra) => palavra.MODALIDADE === "EM"
  );
  const IA_ano_atual = processos_ano_atual.filter(
    (palavra) => palavra.MODALIDADE === "IA"
  );
  const EA_ano_atual = processos_ano_atual.filter(
    (palavra) => palavra.MODALIDADE === "EA"
  );
  
  const IM_total_atual = IM_ano_atual.length;
  const EM_total_atual = EM_ano_atual.length;
  const IA_total_atual = IA_ano_atual.length;
  const EA_total_atual = EA_ano_atual.length;

  // Porcentagens meta anual
  const IM_porcentagem = (IM_total_atual / IM_meta_anual) * 100;
  const EM_porcentagem = (EM_total_atual / EM_meta_anual) * 100;
  const IA_porcentagem = (IA_total_atual / IA_meta_anual) * 100;
  const EA_porcentagem = (EA_total_atual / EA_meta_anual) * 100;

  const card_IM = document.querySelector("#card-IM");
  const card_IA = document.querySelector("#card-IA");
  const card_EM = document.querySelector("#card-EM");
  const card_EA = document.querySelector("#card-EA");

  card_IM.textContent = IM_porcentagem.toFixed(2) + "%";
  card_EM.textContent = EM_porcentagem.toFixed(2) + "%";
  card_IA.textContent = IA_porcentagem.toFixed(2) + "%";
  card_EA.textContent = EA_porcentagem.toFixed(2) + "%";

  // Mapeia o array por IdCliente únicos
  const clientes_ano_anterior = Array.from(
    new Set(processos_ano_anterior.map((obj) => obj.IdCliente))
  );
  const clientes_ano_atual = Array.from(
    new Set(processos_ano_atual.map((obj) => obj.IdCliente))
  );

  // Obtém a contagem de Clientes Únicos
  const quantidade_clientes_ano_anterior = clientes_ano_anterior;
  const meta_clientes_anual = await calcular_meta_anual(quantidade_clientes_ano_anterior, metas_trimestrais);
  const quantidade_clientes_ano_atual = clientes_ano_atual.length;
  const CLI_porcentagem = (quantidade_clientes_ano_atual / meta_clientes_anual) * 100;

  const card_CLI = document.querySelector("#card-CLI");
  card_CLI.textContent = CLI_porcentagem.toFixed(2) + "%";
}

// Função que obtem a quantidade de processo, por modal e por mes
async function contagem_processos_mes(consulta, modalidade) {
  // Inicializa um objeto para armazenar a contagem por mes
  const contagem_por_mes = {};

  // Filtra os obejtos na consulta pela modalidade desejada
  const objetos_filtrados = consulta.filter(
    (item) => item.MODALIDADE === modalidade
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

// Função que cria os gráficos
let graficosMensais = {}; // Objeto para armazenar os gráficos mensais
async function graficos_mensais(processos_ano_anterior, processos_ano_atual, modalidade) {
  const processos_anterior = await contagem_processos_mes(processos_ano_anterior, modalidade);
  const processos_atual = await contagem_processos_mes(processos_ano_atual, modalidade);

  // Determinar a meta para cada mês
  const metas_mensais = processos_anterior.map((valor, index) => {
    let meta_trimestral;
    if (index < 3) {
      meta_trimestral = metas_trimestrais.Q1; // Janeiro, Fevereiro, Março
    } else if (index < 6) {
      meta_trimestral = metas_trimestrais.Q2; // Abril, Maio, Junho
    } else if (index < 9) {
      meta_trimestral = metas_trimestrais.Q3; // Julho, Agosto, Setembro
    } else {
      meta_trimestral = metas_trimestrais.Q4; // Outubro, Novembro, Dezembro
    }
    return parseInt(valor * meta_trimestral);
  });

  // Porcentagem da meta
  const porcentagens = [];

  // Passado o ano atual, pois se passar o ano anterior pode dar erro ao comparar os dois, visto que no inicio do ano tem poucos meses de registro e nao os 12
  for (let i = 0; i < processos_atual.length; i++) {
    const item1 = processos_atual[i];
    const item2 = metas_mensais[i];

    // Calcular porcentagem  e adicionar ao array de porcentagens
    const porcentagem = (item1 / item2) * 100;
    porcentagens.push(porcentagem.toFixed(2));
  }

  var options = {
    series: [
      {
        name: "Ano Atual",
        data: processos_atual,
      },
      {
        name: "Meta",
        data: metas_mensais,
      },
    ],

    chart: {
      type: "bar",
      height: 460,
      toolbar: {
        show: false,
      },
    },

    colors: ["#F9423A", "#3F2021"],

    plotOptions: {
      bar: {
        borderRadius: 2,
        columnWidth: "25%",
        horizontal: true,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [0, 1], // ativa os rótulos para ambas as séries
      formatter: function (val, opts) {
        const seriesIndex = opts.seriesIndex;
        if (seriesIndex === 0) {
          // Se for a primeira serie de processos do ano atual, mostra o valor correspondente
          return processos_atual[opts.dataPointIndex];
        } else if (seriesIndex === 1) {
          // Se for a segunda sére (Meta), mostra o valor correspondente
          return metas_mensais[opts.dataPointIndex];
        }
      },
      offsetX: 30,
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
  };

  var grafico_meta_anual = {
    series: [
      {
        data: processos_atual,
      },
    ],

    colors: ["rgba(249, 66, 58)"],

    chart: {
      height: 80,
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

  const grafico_mensal_id = modalidade;
  const grafico_anual_id = "grafico_card_" + modalidade;

  // Crie instâncias separadas para gráficos mensais e anuais
  const chartMensal = new ApexCharts(
    document.querySelector("#" + grafico_mensal_id),
    options
  );
  const chartAnual = new ApexCharts(
    document.querySelector("#" + grafico_anual_id),
    grafico_meta_anual
  );
  // Renderize os gráficos
  chartMensal.render();
  chartAnual.render();

  // Atribua as instâncias dos gráficos ao objeto usando a combinação de modalidade e tipoCarga como chave
  graficosMensais[`${modalidade}`] = {
    chartMensal,
    chartAnual,
  };

  const modalidadeTipoCargaKey = `${modalidade}`;
  const graficosMensaisExistem = graficosMensais[modalidadeTipoCargaKey];

  if (graficosMensaisExistem) {
    // Atualize as porcentagens
    options.dataLabels.formatter = function (val, opts) {
      const seriesIndex = opts.seriesIndex;
      if (seriesIndex === 0) {
        // Se for a primeira série (Ano Atual), mostre o valor correspondente
        return processos_atual[opts.dataPointIndex];
      } else if (seriesIndex === 1) {
        // Se for a segunda série (Meta), mostre o valor correspondente
        return metas_mensais[opts.dataPointIndex];
      }
    };
    // Se existir, atualize os dados e renderize novamente
    graficosMensais[modalidadeTipoCargaKey].chartMensal.updateOptions(options);
    graficosMensais[modalidadeTipoCargaKey].chartAnual.updateOptions(
      grafico_meta_anual
    );
  }
};

// Função que pega a quantidade de cliente por mes
async function quantidade_clientes_por_mes(consulta) {
  // Armazena a quantidade de cliente por mes
  const contagem_por_mes = [];

  for (let i = 0; i < consulta.length; i++) {
    const item = consulta[i];
    const { MES, IdCliente } = item;

    if (!contagem_por_mes[MES]) {
      contagem_por_mes[MES] = new Set();
    }

    contagem_por_mes[MES].add(IdCliente);
  }

  // Convertendo em um array
  const array_cliente = Object.entries(contagem_por_mes).map(
    ([MES, IdCliente]) => IdCliente.size
  );

  return array_cliente;
};

// Função que cria os gráficos
let graficosMensaisCliente = {}; // Objeto para armazenar os gráficos mensais
// Função que insere os gráficos de clientes
async function grafico_mensais_cliente(processos_ano_anterior, processos_ano_atual) {
  const clientes_ano_anterior = await quantidade_clientes_por_mes(processos_ano_anterior);
  let cliente_ano_atual = await quantidade_clientes_por_mes(processos_ano_atual);

  // Verifique se o array cliente_ano_atual tem menos de 12 itens
  if (cliente_ano_atual.length < 12) {
    // Preencha o array com zeros até ter 12 itens
    const zerosToAdd = 12 - cliente_ano_atual.length;
    const zerosArray = Array(zerosToAdd).fill(0);

    // Combine os zeros com os itens existentes
    cliente_ano_atual = cliente_ano_atual.concat(zerosArray);
  } else if (cliente_ano_atual.length > 12) {
    // Se tiver mais de 12 itens, mantenha apenas os primeiros 12
    cliente_ano_atual = cliente_ano_atual.slice(0, 12);
  }

  // Determinar a meta para cada mês
  const metas_mensais_cliente = clientes_ano_anterior.map((valor, index) => {
    let meta_trimestral;
    if (index < 3) {
      meta_trimestral = metas_trimestrais.Q1; // Janeiro, Fevereiro, Março
    } else if (index < 6) {
      meta_trimestral = metas_trimestrais.Q2; // Abril, Maio, Junho
    } else if (index < 9) {
      meta_trimestral = metas_trimestrais.Q3; // Julho, Agosto, Setembro
    } else {
      meta_trimestral = metas_trimestrais.Q4; // Outubro, Novembro, Dezembro
    }
    return valor * meta_trimestral;
  });

  const porcentagens = [];

  for (let i = 0; i < cliente_ano_atual.length; i++) {
    const item1 = cliente_ano_atual[i];
    const item2 = metas_mensais_cliente[i];

    // Calcular porcentagem  e adicionar ao array de porcentagens
    const porcentagem = (item1 / item2) * 100;
    porcentagens.push(porcentagem.toFixed(2));
  }

  var options = {
    series: [
      {
        name: "Ano Atual",
        data: cliente_ano_atual,
      },
      {
        name: "Meta",
        data: metas_mensais_cliente,
      },
    ],

    chart: {
      type: "bar",
      height: 460,
      toolbar: {
        show: false,
      },
    },

    colors: ["#F9423A", "#3F2021"],

    plotOptions: {
      bar: {
        borderRadius: 2,
        columnWidth: "25%",
        horizontal: true,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [0, 1], // ativa os rótulos para ambas as séries
      formatter: function (val, opts) {
        const seriesIndex = opts.seriesIndex;
        if (seriesIndex === 0) {
          // Se for a primeira série (cliente_ano_atual), mostre o valor correspondente
          return cliente_ano_atual[opts.dataPointIndex];
        } else if (seriesIndex === 1) {
          // Se for a segunda série (meta_cliente), mostre o valor correspondente
          return metas_mensais_cliente[opts.dataPointIndex];
        }
      },
      offsetX: 30,
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
        borderColor: "#3F2021",
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
  };

  var grafico_meta_anual = {
    series: [
      {
        data: cliente_ano_atual,
      },
    ],

    colors: ["rgba(249, 66, 58)"],

    chart: {
      height: 80,
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

  // Crie instâncias separadas para gráficos mensais e anuais
  const chartMensal = new ApexCharts(
    document.querySelector("#CLIENTES"),
    options
  );
  const chartAnual = new ApexCharts(
    document.querySelector("#grafico_card_CLIENTE"),
    grafico_meta_anual
  );
  // Renderize os gráficos
  chartMensal.render();
  chartAnual.render();

  // Atribua as instâncias dos gráficos ao objeto usando a combinação de modalidade e tipoCarga como chave
  graficosMensaisCliente = {
    chartMensal,
    chartAnual,
  };

  const graficosMensaisExistem = graficosMensaisCliente;

  if (graficosMensaisExistem) {
    // Atualize as porcentagens
    options.dataLabels.formatter = function (val, opts) {
      const seriesIndex = opts.seriesIndex;
      if (seriesIndex === 0) {
        // Se for a primeira série (cliente_ano_atual), mostre o valor correspondente
        return cliente_ano_atual[opts.dataPointIndex];
      } else if (seriesIndex === 1) {
        // Se for a segunda série (meta_cliente), mostre o valor correspondente
        return metas_mensais_cliente[opts.dataPointIndex];
      }
    };
    // Se existir, atualize os dados e renderize novamente
    graficosMensaisCliente.chartMensal.updateOptions(options);
    graficosMensaisCliente.chartAnual.updateOptions(grafico_meta_anual);
  }
};

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
  loading.style.display = "none";
}

// Função para organizar a execução das demais
async function main() {
  const processos_ano_anterior = await Thefetch("/api/processos-ano-anterior");
  const processos_ano_atual = await Thefetch("/api/processos-ano-atual");
  await mostrar_loading();
  
  await cards_anuais(processos_ano_anterior, processos_ano_atual);
  await graficos_mensais(processos_ano_anterior, processos_ano_atual, "IM");
  await graficos_mensais(processos_ano_anterior, processos_ano_atual, "IA");
  await graficos_mensais(processos_ano_anterior, processos_ano_atual, "EM");
  await graficos_mensais(processos_ano_anterior, processos_ano_atual, "EA");
  await grafico_mensais_cliente(processos_ano_anterior, processos_ano_atual);
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

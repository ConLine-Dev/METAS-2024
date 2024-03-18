const meses = [
   {label: 'Janeiro', value: 1},
   {label: 'Fevereiro', value: 2},
   {label: 'Março', value: 3},
   {label: 'Abril', value: 4},
   {label: 'Maio', value: 5},
   {label: 'Junho', value: 6},
   {label: 'Julho', value: 7},
   {label: 'Agosto', value: 8},
   {label: 'Setembro', value: 9},
   {label: 'Outubro', value: 10},
   {label: 'Novembro', value: 11},
   {label: 'Dezembro', value: 12},
];

// Insere as opções dentro do select de meses
const opcoes_meses = new Choices(
   '#meses',
   {
      allowHTML: true,
      choices: meses,
      sorter: function(a, b) {
         return a.value - b.value;
      },
      noResultsText: 'Não há opções disponíveis',
      placeholder: false,
      placeholderValue: 'teste',
      itemSelectText: 'Press to select',
   }
);

// Adiciona o regex no input de valor de meta
new Cleave('#input-meta', {
   prefix: 'R$ ',
   numeral: true,
   numeralIntegerScale: 7,
   numeralDecimalScale: 2,
   numeralDecimalMark: ',',
   delimiter: '.',
});

// Seleciona o vendedor
function selecionar_vendedor(e) {

   // Remove a classe vendedor selecionado de todo o arquivo quando outro vendedor for selecionado
   document.querySelectorAll('.vendedor-selecionado').forEach(selecionado => {
      selecionado.classList.remove('vendedor-selecionado');
   });

   e.classList.add('vendedor-selecionado');
}


async function mostrar_loading() {
   let img = document.getElementById('loading-img');

   // Define o caminho do gif
   img.src = "/assets/images/brand-logos/SLOGAN VERMELHO.gif";
}

async function remover_loading() {
   let corpoDashboard = document.querySelector('.corpo-dashboard');
   let loading = document.querySelector('.loading');

   loading.style.display = 'none';
   corpoDashboard.style.display = 'block';
}

async function main() {
   await mostrar_loading();

   await remover_loading();
}

await main();
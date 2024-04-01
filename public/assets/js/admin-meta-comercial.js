const admin_cards_comerciais = await Thefetch('/api/admin-cards-comerciais');
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

// Função para inserir os vendedores
async function vendedores(consulta) {
   const time_vendedores = document.querySelector('#time-vendedores');

   for (let i = 0; i < consulta.length; i++) {
      const item = consulta[i];
      
      const card_html = `
         <div type="button" class="btn col-xxl-4 col-xl-6 col-lg-6 col-md-6 col-sm-12 modal-vendedor" style="border: none;" data-IdVendedor="${item.IdVendedor}">
            <div class="card custom-card team-member-card">

               <div class="teammember-cover-image my-4">
                  <span class="avatar avatar-xl avatar-rounded">
                        <img src="https://cdn.conlinebr.com.br/colaboradores/${item.IdVendedor}" alt="">
                  </span>
               </div>

               <div class="card-body p-0">
                  <div class="d-flex flex-wrap align-item-center mt-sm-0 mt-5 justify-content-between border-bottom border-block-end-dashed p-3" style="margin-top: -25px !important;">
                        <div class="team-member-details flex-fill">
                           <p class="mb-0 fw-semibold fs-16 text-truncate">
                              <a href="javascript:void(0);">${item.Nome}</a>
                           </p>
                           <p class="mb-0 fs-12 text-muted text-break">${item.EMail}</p>
                        </div>
                  </div>

                  <div class="team-member-stats d-sm-flex justify-content-evenly">
                        <div class="text-center p-3 my-auto">
                           <p class="fw-semibold mb-0">Propostas Aprovadas</p><span class="text-muted fs-12">${item.Propostas}</span>
                        </div>
                        <div class="text-center p-3 my-auto">
                           <p class="fw-semibold mb-0">Processos</p><span class="text-muted fs-12">${item.Processos}</span>
                        </div>
                        <div class="text-center p-3 my-auto">
                           <p class="fw-semibold mb-0">Lucro Estimado</p><span class="text-muted fs-12">${item.Lucro_Estimado.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span>
                        </div>
                  </div>
               </div>
            </div>
         </div>
      `

      // Adiciona a string HTML ao array
      time_vendedores.insertAdjacentHTML('beforeend', card_html);
   }
};

async function carrega_indicadores_comercial(IdVendedor) {
   let meta_financeira_comercial = await Thefetch(`/api/meta-financeira-comercial?IdVendedor=${IdVendedor}`);
   let proposta_meta_comercial = await Thefetch(`/api/proposta-meta-comercial?IdVendedor=${IdVendedor}`);
   let processos_meta_comercial = await Thefetch(`/api/processos-meta-comercial?IdVendedor=${IdVendedor}`);
}

async function eventos_cliques() {
   // Pega todas as classes
   const vendedor_clicado = document.querySelectorAll('.imagem-vendedores');
   // Faz um forEach em todas as tags capturadas
   vendedor_clicado.forEach(elemento => {
      elemento.addEventListener('click', function() {
         // Ao clicar em qualquer outro vendedor, vai remover a classe do que estava selecionado e inserir no clicado
         vendedor_clicado.forEach(selecionado => {
            selecionado.classList.remove('vendedor-selecionado')
         });

         elemento.classList.add('vendedor-selecionado')
      })
   });

   document.querySelectorAll('.modal-vendedor').forEach(element => {
      element.addEventListener('click', async function(e) {
         const IdVendedor = this.getAttribute('data-IdVendedor');
         await carrega_indicadores_comercial(IdVendedor);
         $('#exampleModalXl').modal('show');
      })
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
   await vendedores(admin_cards_comerciais);
   await eventos_cliques();
   await remover_loading();
};

await main();
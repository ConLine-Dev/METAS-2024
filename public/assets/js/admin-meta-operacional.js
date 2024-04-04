const listaOperacionais = await Thefetch('/api/operacionais');
const recompras_operacional = await Thefetch('/api/recompras_operacional');
const conversao_taxas = await Thefetch('/api/taxas_conversao');
const quantidade_processos = await Thefetch('/api/quantidade_processos');

async function iniciarPagina(){
    const divCards = document.getElementById('divCards')

    let printDivCards = '';

    let recompraUSD = 0;
    let recompraBRL = 0;
    let recompraEUR = 0;
    let recompraGBP = 0;
    let totalConvertidoBRL = 0;
    let totalProcessos = 0;

    for (let i = 0; i < listaOperacionais.length; i++) {
        for (let j = 0; j < recompras_operacional.length; j++) {
            if (recompras_operacional[j].id_moeda == 1 && recompras_operacional[j].id_operacional == listaOperacionais[i].IdPessoa) {
                recompraUSD = recompraUSD + recompras_operacional[j].valor;
                for (let k = 0; k < conversao_taxas.length; k++) {
                    if (conversao_taxas[k].IdMoeda_Origem == 31) {
                        totalConvertidoBRL = totalConvertidoBRL + (recompras_operacional[j].valor * conversao_taxas[k].Fator);
                    }
                }
            } else if (recompras_operacional[j].id_moeda == 2 && recompras_operacional[j].id_operacional == listaOperacionais[i].IdPessoa) {
                recompraBRL = recompraBRL + recompras_operacional[j].valor;
                totalConvertidoBRL = totalConvertidoBRL + recompras_operacional[j].valor;
            } else if (recompras_operacional[j].id_moeda == 3 && recompras_operacional[j].id_operacional == listaOperacionais[i].IdPessoa) {
                recompraEUR = recompraEUR + recompras_operacional[j].valor;
                for (let k = 0; k < conversao_taxas.length; k++) {
                    if (conversao_taxas[k].IdMoeda_Origem == 52) {
                        totalConvertidoBRL = totalConvertidoBRL + (recompras_operacional[j].valor * conversao_taxas[k].Fator);
                    }
                }
            } else if (recompras_operacional[j].id_moeda == 4 && recompras_operacional[j].id_operacional == listaOperacionais[i].IdPessoa) {
                recompraGBP = recompraGBP + recompras_operacional[j].valor;
                totalConvertidoBRL = totalConvertidoBRL + (recompras_operacional[j].valor * 6);
            }
        }

        for (let j = 0; j < quantidade_processos.length; j++) {
            if(quantidade_processos[j].funcionario == listaOperacionais[i].IdPessoa && quantidade_processos[j].situacao != 'Finalizado'
            && quantidade_processos[j].situacao != 'Cancelado' && quantidade_processos[j].situacao != 'Auditado'){
                totalProcessos++;
            }
        }

        printDivCards += `<div type="button" class="btn col-xxl-4 col-xl-6 col-lg-6 col-md-6 col-sm-12"
        data-bs-toggle="modal" data-bs-target="#exampleModalXl" style="border: none;">
        <div class="card custom-card team-member-card">

           <div class="teammember-cover-image my-4">
              <span class="avatar avatar-xl avatar-rounded">
                 <img src="https://cdn.conlinebr.com.br/colaboradores/${listaOperacionais[i].IdPessoa}" alt="">
              </span>
           </div>

           <div class="card-body p-0">
              <div
                 class="d-flex flex-wrap align-item-center mt-sm-0 mt-5 justify-content-between border-bottom border-block-end-dashed p-3"
                 style="margin-top: -25px !important;">
                 <div class="team-member-details flex-fill">
                    <p class="mb-0 fw-semibold fs-16 text-truncate">
                       <a href="javascript:void(0);">${listaOperacionais[i].Nome}</a>
                    </p>
                    <p class="mb-0 fs-12 text-muted text-break">${listaOperacionais[i].Email}</p>
                 </div>
              </div>

              <div class="team-member-stats d-sm-flex justify-content-evenly">
                 <div class="text-center p-3 my-auto">
                    <p class="fw-semibold mb-0">Nota</p><span class="text-muted fs-12">?</span>
                 </div>
                 <div class="text-center p-3 my-auto">
                    <p class="fw-semibold mb-0">Processos</p><span class="text-muted fs-12">${totalProcessos}</span>
                 </div>
                 <div class="text-center p-3 my-auto">
                    <p class="fw-semibold mb-0">Recompra Total</p><span class="text-muted fs-12">R$
                       ${totalConvertidoBRL.toFixed(2)}</span>
                 </div>
              </div>
           </div>
        </div>
     </div>`;

     recompraUSD = 0;
     recompraBRL = 0;
     recompraEUR = 0;
     recompraGBP = 0;
     totalConvertidoBRL = 0;
     totalProcessos = 0;

    }
    divCards.innerHTML = printDivCards;
}

async function iniciarModal() {
    const divModal = document.getElementById('divModal');
    const divModalTitulo = document.getElementById('divModalTitulo');
    
    let printModal = '';
    let printModalTitulo = '';

    printModalTitulo = `<h6 class="modal-title" id="exampleModalXlLabel">${listaOperacionais[0].Nome}</h6> <button type="button"
    class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`;

    printModal = `<div class="row">
    <div class="col-xxl-12 col-xl-12">
       <div class="row">
          <div class="col-lg-3 col-sm-3 col-md-3 col-xl-3">
             <div class="card custom-card">
                <div class="card-body">
                   <div class="row">
                      <div
                         class="col-xxl-3 col-xl-2 col-lg-3 col-md-3 col-sm-4 col-4 d-flex align-items-center justify-content-center ecommerce-icon secondary  px-0">
                         <span class="rounded p-3 bg-secondary-transparent">
                            <svg xmlns="http://www.w3.org/2000/svg" class="svg-white secondary" width="16"
                               height="16" fill="#000000" viewBox="0 0 16 16">
                               <path
                                  d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73z" />
                            </svg>
                         </span>
                      </div>
                      <div id="divNotaOperacional"
                         class="col-xxl-9 col-xl-10 col-lg-9 col-md-9 col-sm-8 col-8 px-0">
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <div class="col-lg-3 col-sm-3 col-md-3 col-xl-3">
             <div class="card custom-card">
                <div class="card-body">
                   <div class="row">
                      <div
                         class="col-xxl-3 col-xl-2 col-lg-3 col-md-3 col-sm-4 col-4 d-flex align-items-center justify-content-center ecommerce-icon success px-0">
                         <span class="rounded p-3 bg-success-transparent">
                            <svg xmlns="http://www.w3.org/2000/svg" class="svg-white success" width="16"
                               height="16" fill="#000000" viewBox="0 0 16 16">
                               <path
                                  d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73z" />
                            </svg>
                         </span>
                      </div>
                      <div id="divProcessos"
                         class="col-xxl-9 col-xl-10 col-lg-9 col-md-9 col-sm-8 col-8 px-0">
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <div class="col-lg-3 col-sm-3 col-md-3 col-xl-3">
             <div class="card custom-card">
                <div class="card-body">
                   <div class="row">
                      <div
                         class="col-xxl-3 col-xl-2 col-lg-3 col-md-3 col-sm-4 col-4 d-flex align-items-center justify-content-center ecommerce-icon px-0">
                         <span class="rounded p-3 bg-primary-transparent">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                               fill="currentColor" class="svg-white primary" viewBox="0 0 16 16">
                               <path
                                  d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                               <path
                                  d="M8 13A5 5 0 1 1 8 3a5 5 0 0 1 0 10m0 1A6 6 0 1 0 8 2a6 6 0 0 0 0 12" />
                               <path
                                  d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8" />
                               <path d="M9.5 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                            </svg>
                         </span>
                      </div>
                      <div id="divFinanceiro"
                         class="col-xxl-9 col-xl-10 col-lg-9 col-md-9 col-sm-8 col-8 px-0">
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <div class="col-lg-3 col-sm-3 col-md-3 col-xl-3">
             <div class="card custom-card">
                <div class="card-body">
                   <div class="row">
                      <div
                         class="col-xxl-3 col-xl-2 col-lg-3 col-md-3 col-sm-4 col-4 d-flex align-items-center justify-content-center ecommerce-icon warning px-0">
                         <span class="rounded p-3 bg-warning-transparent">
                            <svg xmlns="http://www.w3.org/2000/svg" class="svg-white warning" width="16"
                               height="16" fill="#000000" viewBox="0 0 16 16">
                               <path
                                  d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73z" />
                            </svg>
                         </span>
                      </div>
                      <div id="divCE" class="col-xxl-9 col-xl-10 col-lg-9 col-md-9 col-sm-8 col-8 px-0">
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
    <div class="col-xxl-12 col-xl-12">
       <div class="row">
          <div class="col-xl-3">
             <div class="card custom-card" style="height: 550px">
                <div class="card-header justify-content-between">
                   <div class="card-title">Emails</div>
                </div>
                <div class="card-body" style="padding-top: 0;">
                   <div id="earnings" style="min-height: 215px;">
                      <div id="mail-chart">
                         <!-- GRAFICO AQUI -->
                      </div>
                   </div>
                </div>
             </div>
          </div>
          <div class="col-xl-2">
             <div class="card custom-card" style="height: 550px;">
                <div class="card-header justify-content-between">
                   <div class="card-title">Não conformidades</div>
                </div>
                <div class="card-body" style="padding-top: 0;">
                   <div id="earnings" style="min-height: 500px;">
                      <div id="nf-chart">
                         <!-- GRAFICO AQUI -->
                      </div>
                   </div>
                </div>
             </div>
          </div>
          <div class="col-xl-4">
             <div class="card custom-card" style="height: 550px;">
                <div class="card-header justify-content-between">
                   <div class="card-title"> Recompras Totais </div>
                </div>
                <div class="card-body my-2 py-4" id="modais" style="margin: 0px auto; min-height: 235px;">
                   <div id="recompra-chart">
                      <!-- GRAFICO AQUI -->
                   </div>
                </div>
                <div class="card-footer p-0">
                   <div class="row row-cols-12 justify-content-center">
                      <div class="col pe-0 text-center">
                         <div class="p-sm-12 p-2 "> <span class="text-muted fs-11"
                               id="divRecompraTotal">Recompra Total Convertida</span></div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
          <div class="modal" tabindex="-1" id="meuModal">
             <div class="modal-dialog">
                <div class="modal-content">
                   <div class="modal-header">
                      <h5 class="modal-title">Registro de Recompra</h5>
                   </div>
                   <div class="modal-body">
                      <div class="row text-start">
                         <div class="col-12 col-md-12 ms-auto mt-3 text-start">
                            <div>
                               <label class="form-label mb-0 ms-0">Nº do Processo</label>
                               <input class="multisteps-form__input form-control" type="text"
                                  id="numeroProcesso" />
                            </div>
                         </div>
                         <div class="col-12 col-md-6 ms-auto mt-3 text-start">
                            <div>
                               <label class="form-label mb-0 ms-0">Moeda</label>
                               <select class="form-control" id="tipoMoeda">
                                  <option value="NULL"> </option>
                                  <option value="1">USD</option>
                                  <option value="2">BRL</option>
                                  <option value="3">EUR</option>
                                  <option value="4">GBP</option>
                               </select>
                            </div>
                         </div>
                         <div class="col-12 col-md-6 ms-auto mt-3 text-start">
                            <div>
                               <label class="form-label mb-0 ms-0">Valor</label>
                               <input class="multisteps-form__input form-control" type="number"
                                  id="valorRecompra" />
                            </div>
                         </div>
                         <div class="col-12 col-md-12 ms-auto mt-3 text-start">
                            <div>
                               <label class="form-label mb-0 ms-0">Descrição</label>
                               <select class="form-control" id="campoLivre">
                                  <option value="NULL"> </option>
                                  <option value="correcao">CORREÇÃO</option>
                                  <option value="profit-agente">PROFIT AGENTE</option>
                                  <option value="taxa-destino">TAXAS DE DESTINO</option>
                                  <option value="taxa-origem">TAXAS DE ORIGEM</option>
                                  <option value="telex-release">TELEX RELEASE</option>
                               </select>
                            </div>
                         </div>
                      </div>
                   </div>
                   <div class="modal-footer">
                      <button class="btn bg-gradient-dark ms-auto mb-0 page-item" type="button"
                         title="Send" onclick="confirmar();
                     $('#meuModal').modal('hide');">Enviar</button>
                   </div>
                </div>
             </div>
          </div>
          <div class="col-xl-3">
             <div class="card custom-card" style="height: 550px;">
                <div class="card-header justify-content-between">
                   <div class="card-title"> Processos </div>
                   <div class="d-sm-flex">
                      <div class="me-3 mb-3 mb-sm-0">
                         <input class="form-control form-control-sm" id="pesquisar-processos" type="text"
                            placeholder="Pesquisar" aria-label=".form-control-sm example">
                      </div>
                   </div>
                </div>
                <div class="card-body">
                   <div class="table-responsive">
                      <table class="table text-nowrap table-bordered">
                         <thead>
                            <tr>
                               <th scope="col">Numero Processo</th>
                               <th scope="col">Moeda</th>
                               <th scope="col">Valor</th>
                            </tr>
                         </thead>
                         <tbody>
                         </tbody>
                      </table>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
 </div>`
    
    divModal.innerHTML = printModal;
    divModalTitulo.innerHTML = printModalTitulo;

}

async function main (){
    await iniciarPagina();
    await iniciarModal();
}

await main();
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

async function main (){
    await iniciarPagina();
}

await main();
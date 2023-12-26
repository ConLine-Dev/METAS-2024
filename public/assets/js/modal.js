function obter_cores_icone_por_modalidade(modalidade) {
   switch (modalidade) {
      case 'IM':
         return { cor: '#f9423a', background: 'rgba(249, 66, 58, 0.2)', icon: 'ti-ship' };
      case 'EM':
         return { cor: '#3F2021', background: 'rgba(63, 32, 33, 0.2)', icon: 'ti-ship'};
      case 'IA':
         return { cor: '#23b7e5', background: 'rgba(35, 183, 229, 0.2)', icon: 'ti-plane-inflight' };
      default:
         return { cor: '#26bf94', background: 'rgba(38, 191, 148, 0.2)', icon: 'ti-plane-inflight' };
   }
}

async function ultimo_processo() {
   const audio_palmas = new Audio('/assets/audios/palmas.mp3');

   // Adiciona um event listener para o clique
   document.addEventListener('click', () => {
      // Inicia a reprodução do áudio ao clicar
      audio_palmas.play()
   });

   const ultimo_processo_gerado = await Thefetch('/api/ultimo_processo_gerado');

   const sale_name = document.querySelector('#sale_name');
   const inside_sales_name = document.querySelector('#inside_sales_name');
   const modal_id = document.querySelector('#modal_id');
   const date_open_modal = document.querySelector('#date_open_modal');
   
   sale_name.textContent = ultimo_processo_gerado[0].VENDEDOR;
   inside_sales_name.textContent = ultimo_processo_gerado[0].INSIDE_SALES;
   modal_id.textContent = ultimo_processo_gerado[0].Numero_Processo;
   date_open_modal.textContent = ultimo_processo_gerado[0].Data_Abertura_Processo;

   // Obter cores com base na modalidade
   const { cor, background, icon } = obter_cores_icone_por_modalidade(ultimo_processo_gerado[0].MODALIDADE);
   date_open_modal.style.color = cor;
   date_open_modal.style.background = background;

   // Pega o modal para inserir uma classe para alterar o icone
   const back_modal = document.querySelector('#back_modal');
   const filho_back_modal = back_modal.querySelector('.ti');
   filho_back_modal.classList.add(icon)
   back_modal.style.background = cor;
   
   const sale_img = document.querySelector('#sale_img');
   sale_img.setAttribute('src', `https://cdn.conlinebr.com.br/colaboradores/${ultimo_processo_gerado[0].ID_VENDEDOR}`);


   // remover o modal depois de 4 segundos
   const modaldemo8 = document.querySelector('#modaldemo8');
   setTimeout(() => {
      modaldemo8.classList.remove('effect-scale', 'show');
      audio_palmas.pause()
   }, 4000);
}

async function main() {
   await ultimo_processo()
};

main()

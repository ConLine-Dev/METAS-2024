import funcoesExportadas from "./helper-functions.js";

const teus_tons_ano_anterior = await Thefetch('/api/teus_tons_ano_anterior');
const teus_tons_ano_atual = await Thefetch('/api/teus_tons_ano_atual');
const meta = 1.15;

const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

// Função que filtra e soma por tipo de carga e modal
async function soma_dados_modalidade(consulta, modalidade, tipoCarga, campo) {
   // FIltra os objetos com a modalidade desejada
   const objetos_filtrados = consulta.filter(obj => obj.MODALIDADE === modalidade && obj.TIPO_CARGA === tipoCarga);

   // Usa reduce para somar o valor do campo especifico
   const soma = objetos_filtrados.reduce((acc, obj) => acc + obj[campo], 0);

   return soma;
}

// Função que insere os valores nos cards anuais
async function cards_anuais(modalidade, tipoCarga, campo) {
   const dados_modal_ano_anterior = await soma_dados_modalidade(teus_tons_ano_anterior, modalidade, tipoCarga, campo);
   const dados_modal_ano_atual = await soma_dados_modalidade(teus_tons_ano_atual, modalidade, tipoCarga, campo);

   // Multiplica os valores do ano anterior com o valor da meta para termos a meta
   const meta_por_modal = dados_modal_ano_anterior * meta;
   
   // Divide o total até agora pela meta para termos a porcentagem
   const porcentagem_resultado_alcançado = (dados_modal_ano_atual / meta_por_modal) * 100;
   const porcentagem = porcentagem_resultado_alcançado.toFixed(2) + '%'

   // Insere na tela com textContent
   const meta_anual = document.getElementById('meta-anual-' + tipoCarga + '-' + modalidade);
   meta_anual.textContent = porcentagem;
}

async function main() {
   await cards_anuais('IM', 'FCL', 'TEUS');
   await cards_anuais('IM', 'LCL', 'TONS');
   await cards_anuais('IA', 'AÉREO', 'TONS');
   await funcoesExportadas.remover_loading();
}

main();
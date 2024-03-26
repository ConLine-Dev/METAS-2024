// Pega o usuario logado
const dados_login = JSON.parse(localStorage.getItem('metasUser'));

// Essa função verifica se o usuario que esta logando no portal tem acesso ao módulo
async function verifica_modulo() {
   // Captura todos os atributos modulos
   const modulos = document.querySelectorAll('[modulo]');

   // Cria um array para armazenar as tags do html
   const grupo_modulos = [];
   
   modulos.forEach(item => {
      // Passa por todas as tags e retorna true ou false para verificar quais existem no array
      const tem_acesso = grupo_modulos.find(a => a == item.getAttribute('modulo')) ? true : false;

      // Se nao existir usa o push para enviar ao array
      if (!tem_acesso) {
         grupo_modulos.push(item.getAttribute('modulo'))
      }
   });

   // Faz um foreach no array para verificar se o usuario logado tem acesso ao modulo
   grupo_modulos.forEach(async item => {
      // Envia para o servidor o email do usuario e o modulo para saber se o usuario tem acesso
      const admin_comerciais = await Thefetch(`/api/acesso?nivel=${item}&email=${dados_login.email}`);
      // Aqui vamos selecionar todas as tags que ele tem acesso
      const elemento = document.querySelectorAll(`[modulo='${item}']`)

      // Se o retorno do servidor for maior que zero, da display block nas tags que o usuario tem acesso
      if (admin_comerciais.length > 0) {
         elemento.forEach(element => {
            element.style.display = 'block'
         });
      } else {
         // Se nao tem acesso, remove o html
         elemento.forEach(element => {
            element.remove();
         });
      }
   });
}

await verifica_modulo()
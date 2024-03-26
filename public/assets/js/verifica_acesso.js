const dados_login = JSON.parse(localStorage.getItem('metasUser'));
// Função para verificar se o usuario tem acesso ao modulo em questao
(async function verifica_acesso(){
   // Obtém a URL atual
   let url = window.location.href;

   // Divide a URL pelo caractere '/'
   let partesDaUrl = url.split('/');

   // Obtém a última parte da URL
   let ultimaParte = partesDaUrl[partesDaUrl.length - 1];

   const acesso = await Thefetch(`/api/acesso?nivel=${ultimaParte}&email=${dados_login.email}`);

   if(acesso.length == 0){
      window.location.href = '/erro-401'
   }
})();
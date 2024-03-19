// Essa função verifica se o usuario que esta logando no portal tem acesso ao módulo
async function verifica_modulo(consulta, modulo) {
   const dados_login = JSON.parse(localStorage.getItem('metasUser'));

   consulta.forEach(item => {
      if (item.Email === dados_login.email) {
         // Pega todas as divs que tem o atributo MODULO
         document.querySelectorAll('[modulo]').forEach(div => {
            // Pega somente a div 
            if (div.getAttribute('modulo').includes(modulo)) {
               div.style.display = 'block';
            } else {
               div.remove()
            }
         });
      }
   });

}

async function main() {
   const comerciais = await Thefetch('/api/comerciais');
   const admin_comerciais = await Thefetch('/api/admin-comerciais');

   await verifica_modulo(comerciais, 'meta-financeira-comercial');
   await verifica_modulo(admin_comerciais, 'admin-meta-comercial');
   
}

await main();
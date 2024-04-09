const dados_login = JSON.parse(localStorage.getItem('metasUser'));
const quantidade_prospeccao = await Thefetch(`/api/quantidade-prospeccao?emailVendedor=${dados_login.email}`);
const quantidade_clientes_ativos = await Thefetch(`/api/quantidade-clientes-ativos?emailVendedor=${dados_login.email}`);

console.log(quantidade_clientes_ativos);

// Pega o lucro estimado do vendedor no mes atual
async function quant_prospeccao(consulta) {
   const volume_prospeccao = consulta.length;

   const html_volume_prospeccao = document.getElementById('volume-prospeccao');
   html_volume_prospeccao.textContent = volume_prospeccao;
};

async function clientes_ativos_mes(consulta) {
   const clientes_ativos = document.getElementById('clientes-ativos');

   for (let i = 0; i < consulta.length; i++) {
      const item = consulta[i];

      const card_html = `<tr>
                           <td>
                              <div class="d-flex align-items-center">
                                 <div class="fw-semibold">${item.MES}</div>
                              </div>
                           </td>
                           <td style="width: 115px; text-align: right;">
                              <span>${item.QUANT_CLIENTE}</span>
                           </td>
                        </tr>`

      // Adiciona a string HTML ao array
      clientes_ativos.insertAdjacentHTML('beforeend', card_html);
   }
}

async function main() {
   await quant_prospeccao(quantidade_prospeccao);
   await clientes_ativos_mes(quantidade_clientes_ativos);
};

await main();
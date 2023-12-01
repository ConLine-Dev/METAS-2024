const metasUserLocal = localStorage.getItem('metasUser');
const localMetas = JSON.parse(metasUserLocal);
console.log(localMetas)

const nomeUsuarioLogado = localMetas.name;
const nomeUsuarioSemConline = nomeUsuarioLogado.replace(' - ConLine', '')

nameUser.textContent = nomeUsuarioSemConline; // Inserindo nome do usuario


// Logout
function logout(element) {
   localStorage.removeItem('metasUser');
}
import funcoesExportadas from "./helper-functions.js";

const processos_ano_anterior = await Thefetch('/api/processos-ano-anterior');
const processos_ano_atual = await Thefetch('/api/processos-ano-atual')
const meta = 1.15;
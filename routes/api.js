const express = require('express');
const router = express.Router();
const path = require("path");
const fs = require('fs');
// const { ManageUser } = require('../controllers/ManageUser');
const { helpers } = require('../functions/helpers');


router.get('/ano-anterior', async (req, res, next) => {
    try {
        const result = await helpers.resultados_ano_anterior();

        res.status(200).json(result)
    } catch (error) {

        res.status(404).json(error)   
    }
});

router.get('/ano-atual', async (req, res, next) => {
    try {
        const result = await helpers.resultados_ano_atual();

        res.status(200).json(result)
    } catch (error) {

        res.status(404).json(error)   
    }
});

router.get('/processos-ano-anterior', async (req, res, next) => {
    try {
        const result = await helpers.processos_ano_anterior();

        res.status(200).json(result)
    } catch (error) {

        res.status(404).json(error)   
    }
});

router.get('/processos-ano-atual', async (req, res, next) => {
    try {
        const result = await helpers.processos_ano_atual();

        res.status(200).json(result)
    } catch (error) {

        res.status(404).json(error)   
    }
});

router.get('/ultimos_9_processos', async (req, res, next) => {
    try {
        const result = await helpers.ultimos_9_processos();

        res.status(200).json(result)
    } catch (error) {

        res.status(404).json(error)   
    }
});

router.get('/ultimo_processo_por_modal/:modalidade', async (req, res, next) => {
    try {
        const modalidade = req.params.modalidade;
        const result = await helpers.ultimo_processo_por_modal(modalidade);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json(error);
    }
});

router.get('/teus_tons_ano_anterior', async (req, res, next) => {
    try {
        const result = await helpers.teus_tons_ano_anterior();

        res.status(200).json(result)
    } catch (error) {

        res.status(404).json(error)   
    }
});

router.get('/teus_tons_ano_atual', async (req, res, next) => {
    try {
        const result = await helpers.teus_tons_ano_atual();

        res.status(200).json(result)
    } catch (error) {

        res.status(404).json(error)   
    }
});

router.get('/ultimo_processo_gerado', async (req, res, next) => {
    try {
        const result = await helpers.ultimo_processo_gerado();

        res.status(200).json(result)
    } catch (error) {

        res.status(404).json(error)   
    }
});

router.get('/acesso', async (req, res, next) => {
    const { nivel, email } = req.query;
    try {
        const result = await helpers.nivel_acesso(nivel, email);

        res.status(200).json(result)
    } catch (error) {
        
        res.status(404).json(error)
    }
});

router.get('/comerciais', async (req, res, next) => {
    try {
        const result = await helpers.comerciais();

        res.status(200).json(result)
    } catch (error) {
        
        res.status(404).json(error)
    }
});

router.get('/admin-comerciais', async (req, res, next) => {
    try {
        const result = await helpers.admin_comerciais();

        res.status(200).json(result)
    } catch (error) {
        
        res.status(404).json(error)
    }
});

router.get('/admin-cards-comerciais', async (req, res, next) => {
    try {
        const result = await helpers.admin_cards_comerciais();

        res.status(200).json(result)
    } catch (error) {
        
        res.status(404).json(error)
    }
});

router.get('/admin-modal-valores-comerciais', async (req, res, next) => {
    try {
        const { IdVendedor } = req.query;
        const result = await helpers.admin_modal_valores_comerciais(IdVendedor);

        res.status(200).json(result)
    } catch (error) {
        
        res.status(404).json(error)
    }
});

router.post('/inserir-meta-comercial', async (req, res, next) => {
    try {
        const body = req.body; // Recebe um objeto com os valores do front
        const result = await helpers.inserir_meta_comercial(body);

        res.status(200).json(result)
    } catch (error) {
        res.status(404).json(error)
    }
});

router.get('/operacionais', async (req, res, next) => {
    try {
        const result = await helpers.operacionais();

        res.status(200).json(result)
    } catch (error) {
        
        res.status(404).json(error)
    }
});

router.get('/admin-operacionais', async (req, res, next) => {
    try {
        const result = await helpers.admin_operacionais();

        res.status(200).json(result)
    } catch (error) {
        
        res.status(404).json(error)
    }
});

router.get('/meta-financeira-comercial', async (req, res, next) => {
    try {
        const { IdVendedor, email } = req.query;
        const result = await helpers.meta_financeira_comercial(IdVendedor, email);

        res.status(200).json(result)
    } catch (error) {
        
        res.status(404).json(error)
    }
});

router.get('/proposta-meta-comercial', async (req, res, next) => {
    try {
        const { IdVendedor, email } = req.query;
        const result = await helpers.proposta_meta_comercial(IdVendedor, email);

        res.status(200).json(result)
    } catch (error) {
        
        res.status(404).json(error)
    }
});

router.get('/processos-meta-comercial', async (req, res, next) => {
    try {
        const { IdVendedor, email } = req.query;
        const result = await helpers.processos_meta_comercial(IdVendedor, email);

        res.status(200).json(result)
    } catch (error) {
        
        res.status(404).json(error)
    }
});

router.get('/meta-mes-atual', async (req, res, next) => {
    try {
        const { IdVendedor} = req.query;
        const result = await helpers.meta_mes_atual(IdVendedor);

        res.status(200).json(result)
    } catch (error) {
        
        res.status(404).json(error)
    }
});

router.get('/operacional_por_processo', async (req, res, next) => {

    let { numero_processo, id_moeda, valor, descricao } = req.query;

    try {
        const result = await helpers.operacional_por_processo(numero_processo);
        await helpers.cadastrar_operacional_por_processo(result[0].Numero_do_Processo, result[0].IdPessoa, id_moeda, valor, descricao);

        res.status(200).json(result)
    } catch (error) {

        res.status(404).json(error)
    }
});

router.get('/recompras_operacional', async (req, res, next) => {

    try {
        const result = await helpers.recompras_operacional();

        res.status(200).json(result)
    } catch (error) {

        res.status(404).json(error)
    }
});

router.get('/divergencias_ce_mercante', async (req, res, next) => {

    try {
        const result = await helpers.divergencias_ce_mercante();

        res.status(200).json(result)
    } catch (error) {

        res.status(404).json(error)
    }
});

router.get('/divergencias_financeiras', async (req, res, next) => {

    try {
        const result = await helpers.divergencias_financeiras();

        res.status(200).json(result)
    } catch (error) {

        res.status(404).json(error)
    }
});

router.get('/quantidade_processos', async (req, res, next) => {

    try {
        const result = await helpers.quantidade_processos();

        res.status(200).json(result)
    } catch (error) {

        res.status(404).json(error)
    }
});

router.get('/taxas_conversao', async (req, res, next) => {

    try {
        const result = await helpers.taxas_conversao();

        res.status(200).json(result)
    } catch (error) {

        res.status(404).json(error)
    }
});

router.get('/emails_enviados_recebidos', async (req, res, next) => {

    try {
        const result = await helpers.emails_enviados_recebidos();

        res.status(200).json(result)
    } catch (error) {

        res.status(404).json(error)
    }
});

module.exports = router;
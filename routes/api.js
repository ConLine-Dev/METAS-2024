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

router.get('/meta-financeira-comercial', async (req, res, next) => {
    try {
        const result = await helpers.meta_financeira_comercial();

        res.status(200).json(result)
    } catch (error) {
        
        res.status(404).json(error)
    }
});

router.get('/proposta-meta-comercial', async (req, res, next) => {
    try {
        const result = await helpers.proposta_meta_comercial();

        res.status(200).json(result)
    } catch (error) {
        
        res.status(404).json(error)
    }
});

module.exports = router;
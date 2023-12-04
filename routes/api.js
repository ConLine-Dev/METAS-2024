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

        res.status(404).json('Erro')   
    }
});





module.exports = router;
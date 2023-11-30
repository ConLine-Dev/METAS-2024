const express = require('express');
const router = express.Router();
const path = require("path");
const fs = require('fs');
// const { ManageUser } = require('../controllers/ManageUser');
// const { headCargoQuery } = require('../connect/headCargo');


router.get('/listPoints', async (req, res, next) => {
    try {
        // const result = await headCargoQuery('');

        res.status(200).json('deu certo')
    } catch (error) {

        res.status(404).json('Erro')   
    }
    
});





module.exports = router;
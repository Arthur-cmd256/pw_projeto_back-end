const router = require('express').Router();
const Cliente = require('../models/Cliente');

//rotas da api

// Cadastro
router.post('/cadastro', async (req, res) => {
    const { num_cpf, des_email } = req.body;
    try{
        if ( await Cliente.findOne({ num_cpf }) || await Cliente.findOne({ des_email })) {
            return res.status(400).json({ error: 'Cliente já cadastrado' });
        }
        const cliente = await Cliente.create(req.body);

        cliente.des_senha = undefined;

        res.status(201).json({ cliente });
    } catch(err){ 
        return res.status(400).json({ error: "Falha ao cadastrar" });
    }
})

module.exports = router;
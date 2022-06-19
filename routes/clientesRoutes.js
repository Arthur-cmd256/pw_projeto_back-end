const router = require('express').Router();
const Cliente = require('../models/Cliente');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


function generateToken(params = {}) {
    return jwt.sign(params, process.env.SECRET, {
        expiresIn: 86400,
    });
};

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
});

router.post('/login', async (req, res) => {
    const { des_email, des_senha } = req.body;

    const cliente = await Cliente.findOne({ des_email }).select('+des_senha');

    if(!cliente){
        return res.status(400).json({ error: 'Cliente não encontrado' });
    }

    if (!await bcrypt.compare(des_senha, cliente.des_senha)) {
        return res.status(400).json({ error: 'Senha inválida' });
    }

    cliente.des_senha = undefined;

    res.send({ 
        cliente, 
        token: generateToken({ id: cliente._id }) 
    });
});

module.exports = router;
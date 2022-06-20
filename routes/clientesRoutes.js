const router = require('express').Router();
const Cliente = require('../models/Cliente');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../modules/mailer');
const Cesta = require('../models/Cesta');
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
        
        
        await Cesta.create({ qtd_itens: 0, val_total: 0.0 }).then(async cesta => {
            await Cliente.create({...req.body, cesta: cesta._id}).then(cliente => {
                cesta.cliente = cliente._id;
                cesta.save();
                cliente.des_senha = undefined;
                res.status(201).json({ cliente });
            }).catch(err => {
                res.status(400).json({ error: 'Erro ao criar cliente' });
            });
        }).catch(err => {
            res.status(400).json({ error: 'Erro ao criar cesta' });
        })

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

router.post('/recuperar', async (req, res) => {
    const { des_email } = req.body;

    try{
        const cliente = await Cliente.findOne({ des_email });

        if(!cliente){
            return res.status(400).send({ error: 'Cliente não encontrado' });
        }

        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours() + 1);

        await Cliente.findByIdAndUpdate(cliente._id, {
            $set: {
                des_senha_reset_token: token,
                des_senha_reset_expires: now
            }
        });

        mailer.sendMail({
            to: des_email,
            from: 'arthur@example.com',
            template: 'auth/forgot_password',
            context: { token },
        }, (err) => {
            if (err) {
                return res.status(400).send({ error: 'Erro ao enviar email' });
            }
            return res.send();
        });

    } catch(err){
        return res.status(400).json({ error: 'Falha ao recuperar senha' });
    };

});

router.post('/resetar', async (req, res) => {
    const { email, token, senha } = req.body;

    try {
        const cliente = await Cliente.findOne({ des_email: email }).select('+des_senha_reset_token des_senha_reset_expires');

        if (!cliente) {
            return res.status(400).send({ error: 'Cliente não encontrado' });
        }

        if (token !== cliente.des_senha_reset_token) {
            return res.status(400).send({ error: 'Token inválido' });
        }

        const now = new Date();

        if (now > cliente.des_senha_reset_expires) {
            return res.status(400).send({ error: 'Token expirado' });
        }

        cliente.des_senha = senha;

        await cliente.save();

        res.send();

    } catch(err){
        return res.status(400).json({ error: 'Falha ao resetar senha' });
    }

});

module.exports = router;
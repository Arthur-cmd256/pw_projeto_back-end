const router = require('express').Router();
const Produto = require('../models/Produto');

//rotas da api

// Cadastro

router.post('/', async (req, res) => {

    try{
        const produto = new Produto(req.body);
    produto.save().then(() => {
        return res.status(201).json({ menssagem: 'Produto criado com sucesso'});
    }).catch(err => {
            return res.status(500).json({ error: err.message });
    })
        
    } catch(err){
        return res.status(500).json({ error: err.message });
    };
});

// Consulta

router.get('/', async (req, res) => {
    try{
        const produtos = await Produto.find();
        return res.status(200).json(produtos);
    } catch(err){
        return res.status(500).json({ error: err.message });
    }
})

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try{
        const produto = await Produto.findOne({ _id: id });
        if(!produto){
            return res.status(404).json({ error: 'Produto não encontrado' });
        };
        return res.status(200).json(produto);
    } catch(err){
        return res.status(500).json({ error: err.message });
    }
});

router.get('/busca/:nome', async (req, res) => {
    try{
        const produto = await Produto.find({ nom_produto: { $regex: req.params.nome, $options: 'i' } });
        if(!produto){
            return res.status(404).json({ error: 'Produto não encontrado' });
        };
        return res.status(200).json(produto);
    } catch(err){
        return res.status(500).json({ error: err.message });
    }
});

// Atualização

router.patch('/:id', async (req, res) => {
    const id = req.params.id;
    try{
        const produto = await Produto.findOne({ _id: id });
        if(!produto){
            return res.status(404).json({ error: 'Produto não encontrado' });
        };
        const produtoAtualizado = await Produto.findOneAndUpdate({ _id: id }, req.body, { new: true });
        return res.status(200).json(produtoAtualizado);
    } catch(err){
        return res.status(500).json({ error: err.message });
    }
});

// Apagar

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try{
        const produto = await Produto.findOne({ _id: id });
        if(!produto){
            return res.status(404).json({ error: 'Produto não encontrado' });
        };
        const produtoApagado = await Produto.findOneAndDelete({ _id: id });
        return res.status(200).json(produtoApagado);
    } catch(err){
        return res.status(500).json({ error: err.message });
    }
})

module.exports = router;
const router = require('express').Router();
const Cesta = require('../models/Cesta');
const Produto = require('../models/Produto');
const auth = require('../middlewares/auth');

router.use(auth);

// adicionar produto
router.put('/:id', async (req, res) => {
    try {
        if (!await Cesta.findById(req.params.id)){
            return res.status(400).json({ error: 'Cesta não encontrada' });
        }
        if (!await Produto.findById(req.body.produto)){
            return res.status(400).json({ error: 'Produto não encontrado' });
        }
        var { qtd_itens, val_total, produtos } = await Cesta.findById(req.params.id);
        const { _id, val_produto  } = await Produto.findById(req.body.produto);

        produtos[produtos.length] = _id;
        qtd_itens += 1;
        val_total += val_produto;

        const cesta = await Cesta.findByIdAndUpdate(req.params.id, { qtd_itens, val_total, produtos }, { new: true });

        return res.send({ cesta });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

module.exports = router;
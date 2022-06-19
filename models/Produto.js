const mongoose = require('mongoose');

const ProdutoSchema = new mongoose.Schema({
    nom_produto: {
        type: String, 
        required: true
    },
    des_produto: {
        type: String, 
        required: true
    },
    val_produto: {
        type: Number, 
        required: true
    },
    qtd_produto: {
        type: Number, 
        required: true
    },
    img_produto: {
        type: String, 
        required: true
    },
    cat_produto: {
        type: String, 
        required: true
    },
    ind_destaque: {
        type: Boolean, 
        required: true
    },
});

const Produto = mongoose.model('Produto', ProdutoSchema);

module.exports = Produto;
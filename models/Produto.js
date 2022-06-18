const mongoose = require('mongoose');

const Produto = mongoose.model('Produto', {
    // cod_produto: {type: Number, primaryKey: true, autoIncrement: true},
    nom_produto: {type: String, required: true},
    des_produto: {type: String, required: true},
    val_produto: {type: Number, required: true},
    qtd_produto: {type: Number, required: true},
    img_produto: {type: String, required: true},
    cat_produto: {type: String, required: true},
    ind_destaque: {type: Boolean, required: true},

});

module.exports = Produto;
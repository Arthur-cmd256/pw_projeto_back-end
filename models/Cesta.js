const mongoose = require('mongoose');

const CestaSchema = mongoose.Schema({
    qtd_itens: {
        type: Number,
    },
    val_total: {
        type: Number,
    },
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
    },
    produtos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Produto',
    }],
});

const Cesta = mongoose.model('Cesta', CestaSchema);

module.exports = Cesta;
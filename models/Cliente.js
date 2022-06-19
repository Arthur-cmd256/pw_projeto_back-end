const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ClienteSchema = new mongoose.Schema({
    nom_cliente: {
        type: String, 
        required: true
    },
    num_cpf: {
        type: String, 
        required: true, 
        unique: true
    },
    des_email: {
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true
    },
    des_senha: {
        type: String, 
        required: true, 
        select: false
    },
    des_endereco: {
        type: String, 
        required: true
    },
    num_telefone: {
        type: String
    }
});

ClienteSchema.pre('save', async function(next) {
    const hash = await bcrypt.hash(this.des_senha, 10);
    this.des_senha = hash;
    next();
});

const Cliente = mongoose.model('Cliente', ClienteSchema);

module.exports = Cliente;
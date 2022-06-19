const express = require('express');
require('dotenv').config()
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

app.use(cors());

const {

    MONGODB_USER,
    MONGODB_PASSWORD,
    MONGODB_HOST,
    MONGODB_CLUSTER,
    MONGODB_DATABASE,
    PORT

} = process.env

app.use(express.urlencoded({ extended: true}));

app.use(express.json())

const produtosRoutes = require('./routes/produtosRoutes');

app.use('/produto', produtosRoutes);

mongoose.connect(`mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER}.${MONGODB_HOST}.mongodb.net/${MONGODB_DATABASE}?retryWrites=true&w=majority`).then(() => {
    console.log('Conectado com sucesso ao MongoDB');
    app.listen(PORT);
}).catch((err) => console.log(err));

app.get('/teste_api/:ping', (req, res) => {
    if (req.params.ping === 'ping') {
        res.json({ pong: true });
    }else {
        res.json({ pong: false });
    }  
});


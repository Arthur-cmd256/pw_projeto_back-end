const router = require('express').Router();

const auth = require('../middlewares/auth');

router.use(auth);

router.get('/', async (req, res) => {
    res.send({ ok: true, cliente: req.userId });
});

module.exports = router;
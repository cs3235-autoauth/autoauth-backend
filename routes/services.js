const express = require('express');
const router = express.Router();
const qp = require('flexqp');
const rb = require('flexrb');

router.get('/authenticate/:email', async function (req, res, next) {
    try {
        if (req.err) return next(req.err);
        let data = await qp.executeAndFetchFirstPromise('SELECT * FROM autoauth WHERE email like ?', [req.params.email]);
        res.json(rb.build(data, 'Retrieved user successfully.'));
    } catch (err) {
        err.status = 406;
        next(err);
    }
})

router.post('/register', async function (req, res, next) {
    let con = await qp.connectWithTbegin();
    try {
        if (req.err) return next(req.err);
        let data = req.body.fingerprint;
        await qp.execute('INSERT into autoauth SET fingerprint = ?', [data], con);
        await qp.commitAndCloseConnection(con);
        res.json(rb.build(data, 'Created user successfully.'));
    } catch (err) {
        await qp.rollbackAndCloseConnection(con);
        err.status = 406;
        next(err);
    }
})

module.exports = router;

const express = require('express');
const router = express.Router();
const qp = require('flexqp');
const rb = require('flexrb');
const comparator = require('deep-diff').diff;

router.post('/authenticate', async function (req, res, next) {
    try {
        if (req.err) return next(req.err);
        let fingerprint_Incoming = req.body.fingerprint;
        let email = req.body.email;
        let fingerprint_DB = await qp.executeAndFetchFirstPromise('SELECT fingerprint FROM autoauth WHERE email like ?', [email]);

        if (fingerprint_DB == null) {
            res.statusCode = 401;
            res.json('Unauthorized.');
        } else {
            console.log(fingerprint_DB);
            compareJSON(fingerprint_Incoming, fingerprint_DB);
            res.json(rb.build('Retrieved user successfully.'));
        }
    } catch (err) {
        err.status = 406;
        next(err);
    }
})

router.post('/register', async function (req, res, next) {
    let con = await qp.connectWithTbegin();
    try {
        if (req.err) return next(req.err);
        let fingerprint = JSON.stringify(req.body.fingerprint);
        let email = req.body.email;
        await qp.execute('INSERT into autoauth SET fingerprint = ?, email = ?', [fingerprint, email], con);
        await qp.commitAndCloseConnection(con);
        res.json(rb.build('Created user successfully.'));
    } catch (err) {
        await qp.rollbackAndCloseConnection(con);
        err.status = 406;
        next(err);
    }
})

function compareJSON(a, b) {
    var diff = comparator(a, b);
    console.log(diff);

}

module.exports = router;

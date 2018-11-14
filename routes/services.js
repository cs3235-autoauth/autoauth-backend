const express = require('express');
const router = express.Router();
const qp = require('flexqp');
const rb = require('flexrb');
const _ = require("lodash");
const comparator = require('deep-diff').diff;

router.post('/authenticate', async function (req, res, next) {
    try {
        if (req.err) return next(req.err);
        let fp_to_check = req.body.fingerprint;
        let email = req.body.email;
        let fp_stored = await qp.executeAndFetchFirstPromise('SELECT fingerprint FROM sys.autoauth WHERE email like ?', [email]);

        if (fp_stored == null || 
            !isMatched(fp_to_check, fp_stored.fingerprint)) 
        {
            res.statusCode = 401;
            res.json('Unauthorized.');
        } else {
            console.log(email + " authenticated");
            res.json(rb.build({
                'msg': 'Retrieved user successfully.',
                'stored_fp' : fp_stored.fingerprint,
                'incoming_fp' : fp_to_check,
            }));
            
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
        let level = req.body.level;
        let email = req.body.email;
        let result = await qp.executeAndFetchFirstPromise('SELECT * FROM autoauth WHERE email LIKE ?', [email]);                
        if (result != null) {
            await qp.executeUpdatePromise('UPDATE autoauth SET fingerprint = ?, level = ? WHERE email LIKE ?', [fingerprint, level, email]);
        } else {
            await qp.execute('INSERT into autoauth SET fingerprint = ?, email = ?, level = ?', [fingerprint, email, level], con);
            await qp.commitAndCloseConnection(con);
        }
        res.json(rb.build('Created user successfully.'));
    } catch (err) {
        await qp.rollbackAndCloseConnection(con);
        err.status = 406;
        next(err);
    }
})

function isMatched(check, stored) {
    let DIFF_THRESDHOLD = 20;
    let weight_map = {
        "adBlock": 1,
        "addBehavior": 1,
        "audio": 1, 
        "availableScreenResolution": 1,
        "canvas": 1,
        "colorDepth": 1,
        "cpuClass": 1,
        "deviceMemory": 5,
        "doNotTrack": 1,
        "enumerateDevice": 1,
        "fonts": 1,
        "hardwareConcurrency": 5,
        "indexedDb":1, 
        "language": 1,
        "localStorage": 1, 
        "openDatabase": 1,
        "pixelRatio":1, 
        "platform":10, 
        "plugins":1, 
        "screenResolution": 1,
        "sessionStorage":1, 
        "timezone": 10,
        "timezoneOffset":1, 
        "touchSupport": 5,
        "userAgent": 1,
        "webgl": 1,
        "webglVendorAndRenderer":1, 
    };

    
    //Check stored fp against the incoming fp
    let diff = 0;
    for (var i in stored) {
        if(stored.hasOwnProperty(i)) {
            if(!_.isEqual(stored[i],check[i])) {
                //FIXME: Should we penalize unknown less heavily?
                if(stored[i] === "unknown" || check[i] === "unknown") {
                    diff += 1;
                } else {
                    diff += weight_map[i];
                }
                console.log(i);
                console.log("Stored: " + stored[i]);
                console.log("Checked:" + check[i]);
                console.log("-----------------");
            }
        }
    }
    

    if(diff > DIFF_THRESDHOLD) {
        return false;
    } else {
        return true;
    }
}

module.exports = router;

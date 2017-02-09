var express = require('express');
var router = express.Router();

router.get('/check', function(req,res,next) {
    res.send('check');
});

module.exports = router;

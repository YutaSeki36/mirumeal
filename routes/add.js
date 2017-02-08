var express = require('express');
var router = express.Router();

/* add page. */
router.get('/', function(request, response, next) {
    response.render('add',
        {
            title: 'Add Page',
            msg: 'please type data:'
        }
    );
});

module.exports = router;

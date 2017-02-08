var express = require('express');
var router = express.Router();
var pg = require('pg');

/* add page. */
router.post('/', function(request, response, next) {
    var title = request.body["title"];
    var createdAt = moment().format('YYYY-MM-DD HH:mm:ss'); // 追加

    var con = "tcp://sekiyuuta:root@localhost:5432/postgres";
    pg.connect(con, function(err, client) {
        var qstr = "insert into border (title, created_at) VALUES($2, $3);";
        var query = client.query(qstr,title,createdAt);
        query.on('end', function(row,err) {
            response.redirect("/");
        });
        query.on('error', function(error) {
            console.log("ERROR!");
            response.render('index', {
                title: "ERROR",
                data: null,
                message: "ERROR is occured!"
            });
        });
    });
});

module.exports = router;

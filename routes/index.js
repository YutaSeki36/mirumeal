var express = require('express');
var router = express.Router();
var moment = require('moment');
var pg = require('pg');

/* GET home page. */
router.get('/', function(request, response, next) {
    var con = "tcp://sekiyuuta:root@localhost:5432/postgres"; //
    pg.connect(con, function(err, client) {
      var query = 'SELECT * FROM border';
      client.query(query, function(err, query0) {
        console.log(query0.rows);
        response.render('index', {
          title: 'Express',
          borderList: query0.rows
         });
      });
    });
});

router.get('/add', function(request, response, next) {
    response.render('add',
        {
            title: 'Add Page',
            msg: 'please type data:'
        }
    );
});

router.post('/', function(request, response, next) {
    var title = request.body["title"];
    var c_a=request.body["c_a"]
    var createdAt = moment().format('YYYY-MM-DD HH:mm:ss'); // 追加

    var con = "tcp://sekiyuuta:root@localhost:5432/postgres";
    pg.connect(con, function(err, client) {
        var qstr = "insert into border (title, created_at) VALUES($1, $2);";
        var query = client.query(qstr,[title,c_a]);
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

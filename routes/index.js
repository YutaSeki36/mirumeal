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
        response.render('index', {
          title: 'Express',
          borderList: query0.rows
         });
         client.end();//end();で終わらせないと無限にセッションを作られる
      });
      pg.end();
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

router.get('/check', function(request, response, next) {
    response.render('add',
        {
            title: 'Add Page',
            msg: 'please type data:'
        }
    );
});

router.post('/', function(request, response, next) {
    var c_a=request.body["c_a"];
    var log_eat=request.body["log_date"];
    var title=log_eat+'の食事データ';
    console.log(title);
    var con = "tcp://sekiyuuta:root@localhost:5432/postgres";
    pg.connect(con, function(err, client) {
        var qstr = "insert into border (title, created_at) VALUES($1, $2);";
        var query = client.query(qstr,[title,log_eat]);
        query.on('end', function(row,err) {
            response.redirect("/");
        });
        query.end();
        query.on('error', function(error) {
            console.log("ERROR!");
            response.render('index', {
                title: "ERROR",
                data: null,
                message: "ERROR is occured!"
            });
            query.end();
        });
        pg.end();
    });
});

module.exports = router;

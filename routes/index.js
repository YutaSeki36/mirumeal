var express = require('express');
var router = express.Router();
var moment = require('moment');
var pg = require('pg');

/* GET home page. */
router.get('/', function(request, response, next) {
    var con = "tcp://sekiyuuta:root@localhost:5432/postgres"; //
    pg.connect(con, function(err, client) {
       var query = 'SELECT * FROM border';
       var chart1 = 'select count(*) from logeat where status_id= ' + "'"+'自炊'+"'";
       var chart2 = 'select count(*) from logeat where status_id= ' + "'"+'カップラーメン'+"'";
       var chart3 = 'select count(*) from logeat where status_id= ' + "'"+'外食'+"'";
          client.query(query, function(err, query0) {
            client.query(chart1,function(err,_chart1){
              client.query(chart2,function(err,_chart2){
                client.query(chart3,function(err,_chart3){
                  console.log(_chart1.rows[0].count);
                  response.render('index', {
                    title: 'Express',
                    chart1: _chart1.rows[0].count,
                    chart2: _chart2.rows[0].count,
                    chart3: _chart3.rows[0].count,
                    borderList: query0.rows
                  });
                });
              });
            });
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
        query.on('error', function(error) {
            console.log("ERROR!");
            response.render('index', {
                title: "ERROR",
                data: null,
                message: "ERROR is occured!"
            });
        });
        pg.end();
    });
});

module.exports = router;

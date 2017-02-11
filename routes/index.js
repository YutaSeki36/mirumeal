var express = require('express');
var router = express.Router();
var moment = require('moment');
var pg = require('pg');

/* GET home page. */
router.get('/', function(request, response, next) {
    var con = "tcp://sekiyuuta:root@localhost:5432/postgres"; //
    pg.connect(con, function(err, client) {
       var query = 'SELECT * FROM border order by created_at desc';
       var m__comment = 'select * from m_comment';
       var chart1 = 'select count(*) from logeat where status_id= ' + "'"+'自炊'+"'";
       var chart2 = 'select count(*) from logeat where status_id= ' + "'"+'カップラーメン'+"'";
       var chart3 = 'select count(*) from logeat where status_id= ' + "'"+'外食'+"'";
          client.query(query, function(err, query0) {
            client.query(chart1,function(err,_chart1){
              client.query(chart2,function(err,_chart2){
                client.query(chart3,function(err,_chart3){
                  client.query(m__comment,function(err,_m__comment){
                    console.log(_m__comment.rows[0].text);
                    response.render('index', {
                      title: 'Express',
                      chart1: _chart1.rows[0].count,
                      chart2: _chart2.rows[0].count,
                      chart3: _chart3.rows[0].count,
                      borderList: query0.rows,
                      m_comment: _m__comment.rows[0]
                    });
                  });
                });
              });
            });
         pg.end();
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
    console.log(request.body["log_date"]);
    var con = "tcp://sekiyuuta:root@localhost:5432/postgres";
    pg.connect(con, function(err, client) {
        var qstr = "insert into border (title, created_at) VALUES($1, $2);";
        var query = client.query(qstr,[title,log_eat]);
        query.on('end', function(row,err) {
            response.redirect("/");
            client.end();
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

router.put('/',function(request,response,next){
  var new_comment = request.body["text"];
  console.log(request.body["text"]);
  var query = "update m_comment set text=" + "'" + new_comment + "'" + " where id=1;";
  var con = "tcp://sekiyuuta:root@localhost:5432/postgres";
  pg.connect(con, function(err, client) {
    client.query(query,function(err,query1){
      console.log(query);
      response.redirect('/');
    });
    pg.end();
  });
});

router.delete('/:border_id', function(request,response,next){
  var rm_id =request.params.border_id;
  var qstr = " delete from border where border_id="+rm_id+";";
  var con = "tcp://sekiyuuta:root@localhost:5432/postgres";
  pg.connect(con, function(err, client) {
    client.query(qstr,function(err,query){
      response.redirect('/');
    });
    pg.end();
  });
});

module.exports = router;

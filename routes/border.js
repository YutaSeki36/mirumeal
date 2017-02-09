var express = require('express');
var router = express.Router();
var moment = require('moment');
var pg = require('pg');


router.get('/:border_id', function(req, res, next) {
  var borderId = req.params.border_id;
  var qstr = 'SELECT * FROM border WHERE border_id = ' + borderId;
  var createdAt = "SELECT to_char(created_at, 'yyyy-mm-dd') as created_at FROM border WHERE border_id = "+borderId;
  var getEatLogQuery = 'SELECT * FROM logeat WHERE logdate = ' ;
  var con = "tcp://sekiyuuta:root@localhost:5432/postgres"; //
  pg.connect(con, function(err, client) {
    client.query(qstr,function(err,query0){
      client.query(createdAt, function(err, query1){
        client.query(getEatLogQuery+"'"+query1.rows[0].created_at+"'", function(err, query2) {
        // ②（①の処理がいつ終わるかわかんないけど、次の処理はこれ）
          console.log(query1.rows[0])
          res.render('border', { // ③（②の処理がいつ終わるかわかんないけど、次の処理はこれ）
            title: query1.rows[0].title,
            border: query0.rows[0], // ①の処理は終わっているのでboard[0]は存在する
            messageList: query2 // ②の処理は終わっているのでmessagesは存在する
          });
        });
      });
    });
  });
});

router.post('/:border_id', function(req, res, next) {
  var message = req.body.status_id;
  var mealType = req.body.three_meal;
  var borderId = req.params.border_id;
  var createdAt = "SELECT to_char(created_at, 'yyyy-mm-dd') as created_at FROM border WHERE border_id = "+borderId;
  var con = "tcp://sekiyuuta:root@localhost:5432/postgres";
  var qstr = 'INSERT INTO logeat (status_id, logdate, three_meal) VALUES($1, $2, $3);';
  pg.connect(con, function(err, client) {
    client.query(createdAt,function(err,createTime){
      console.log(createTime.rows[0].created_at);
      var query=client.query(qstr,[message,createTime.rows[0].created_at,mealType]);
      query.on('end', function(row,err) {
          res.redirect('/border/' + borderId);
      });
    });
  });
});

module.exports = router;

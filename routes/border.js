var express = require('express');
var router = express.Router();
var moment = require('moment');
var pg = require('pg');


router.get('/:border_id', function(req, res, next) {
  var borderId = req.params.border_id;
  var qstr = 'SELECT * FROM border WHERE border_id = ' + borderId;
  var getMessagesQuery = 'SELECT * FROM message WHERE border_id = ' + borderId;
  var con = "tcp://sekiyuuta:root@localhost:5432/postgres"; //
  pg.connect(con, function(err, client) {
    client.query(qstr, function(err, query1){
      client.query(getMessagesQuery, function(err, query2) {
        console.log(query2.rows);
        // ②（①の処理がいつ終わるかわかんないけど、次の処理はこれ）
        res.render('border', { // ③（②の処理がいつ終わるかわかんないけど、次の処理はこれ）
          title: query1.rows[0].title,
          border: query1.rows[0], // ①の処理は終わっているのでboard[0]は存在する
          messageList: query2.rows // ②の処理は終わっているのでmessagesは存在する
        });
      });
    });
  });
});

router.post('/:border_id', function(req, res, next) {
  var message = req.body.message;
  var borderId = req.params.border_id;
  var createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
  var con = "tcp://sekiyuuta:root@localhost:5432/postgres";
  var qstr = 'INSERT INTO message (message, border_id, created_at) VALUES($1, $2, $3);';
  pg.connect(con, function(err, client) {
    var query=client.query(qstr,[message,borderId,createdAt]);
    query.on('end', function(row,err) {
        res.redirect('/border/' + borderId);
    });
  });
});

module.exports = router;

var express = require('express');
var router = express.Router();
var moment = require('moment');
var pg = require('pg');


router.get('/:border_id', function(req, res, next) {
  var borderId = req.params.border_id;
  var qstr = 'SELECT * FROM border WHERE border_id = ' + borderId;
  var con = "tcp://sekiyuuta:root@localhost:5432/postgres"; //
  pg.connect(con, function(err, client) {
      var query = client.query(qstr);
      var rows = [];
      query.on('row', function(row) {
          rows.push(row);
      });
      query.on('end', function(row,err) {
        console.log(rows);
          res.render('border', {
              title: rows[0].title,
              border:rows[0]
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

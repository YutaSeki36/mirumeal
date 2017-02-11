var express = require('express');
var router = express.Router();
var moment = require('moment');
var multer = require('multer');
var upload = multer({ dest: './public/images/uploads/' });
var pg = require('pg');
var cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'dmaxejjlk',
  api_key: '635981366553447',
  api_secret: 'j543FRo4j5dChkSY98ync9jouQU'
});

router.get('/:border_id', function(req, res, next) {
  var borderId = req.params.border_id;
  var qstr = 'SELECT * FROM border WHERE border_id = ' + borderId;
  var createdAt = "SELECT to_char(created_at, 'yyyy-mm-dd') as created_at FROM border WHERE border_id = "+borderId;
  var getEatLogQuery = "SELECT id,status_id ,img_id,to_char(logdate, 'yyyy-mm-dd') as logdate,three_meal FROM logeat WHERE logdate = " ;
  var con = "tcp://sekiyuuta:root@localhost:5432/postgres"; //
  pg.connect(con, function(err, client) {
    client.query(qstr,function(err,query0){
      client.query(createdAt, function(err, query1){
        client.query(getEatLogQuery+"'"+query1.rows[0].created_at+"'", function(err, query2) {
        //  console.log(query2.rows[0].id);
          res.render('border', {
            title: query1.rows[0].created_at,
            border: query0.rows[0],
            messageList: query2.rows
          });
        });
      });
      pg.end();
    });
  });
});

router.post('/:border_id', upload.single('image_file'),  function(req, res, next) {
  if (req.file) {
    var path = req.file.path;
  }else{
    var path = null;
  }
  var message = req.body.status_id;
  var mealType = req.body.three_meal;
  var borderId = req.params.border_id;
  var createdAt = "SELECT to_char(created_at, 'yyyy-mm-dd') as created_at FROM border WHERE border_id = "+borderId;
  var con = "tcp://sekiyuuta:root@localhost:5432/postgres";
  var qstr = 'INSERT INTO logeat (status_id, logdate, three_meal, img_id) VALUES($1, $2, $3, $4);';
  cloudinary.uploader.upload(path, function(result) {
    var imagePath = result.url;
    pg.connect(con, function(err, client) {
      client.query(createdAt,function(err,createTime){
    //    console.log(createTime.rows[0].created_at);
        var query=client.query(qstr,[message, createTime.rows[0].created_at, mealType, imagePath]);
        query.on('end', function(row,err) {
            res.redirect('/border/' + borderId);
        });
      });
      pg.end();
    });
  });
});

router.delete('/:border_id/:rm_id',function(req,res,next){
  var borderId = req.params.border_id;
  console.log(req.params.rm_id);
  var rm__id = req.params.rm_id;
  var createdAt = "delete from logeat where logdate='2017-02-06' and id="+rm__id;
  var con = "tcp://sekiyuuta:root@localhost:5432/postgres";
  pg.connect(con, function(err, client) {
    client.query(createdAt,function(err,createTime){
      res.redirect('/border/' + borderId);
    });
    pg.end();
  });
});

module.exports = router;

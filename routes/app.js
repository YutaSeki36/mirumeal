var add = require('./routes/add');
var create = require('./routes/create');
var users = require('./routes/users');
var boards = require('./routes/boder'); // ←追加

var app = express();

app.use('/add', add);
app.use('/create', create);
app.use('/users', users);
app.use('/boder', boder); // ←追加

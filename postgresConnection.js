var options = {
    // initialization options;
};

var pgp = require("pg-promise")(options);

var dbConfig= {
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'sekiyuuta',
    password: 'root'
};

var connection = pgp(dbConfig);

module.exports = connection;

var mysql = require('mysql');
var settings = require('../senhas.js');

var pool = mysql.createPool({
	connectionLimit:100,
	host : '79.170.40.183',
	user : 'cl19-dbpipibic',
	password : settings.senha_DB,
	database : 'cl19-dbpipibic'
});

pool.on('acquire', function(connection){
	console.log('Acquired');
});

pool.on('release', function(connection) {
	console.log('Conecção foi liberada após call!');
});

module.exports.getConnection = function(callback) {
  pool.getConnection(function(err, conn) {
    if(err) {
      return callback(err);
    }
    callback(err, conn);
    conn.release();
  });
};

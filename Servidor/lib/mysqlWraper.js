var mysql = require('mysql');
var settings = require('../senhas.js');
// Servidor Heroku
// var pool = mysql.createPool({
// 	connectionLimit:100,
// 	host : '79.170.40.183',
// 	user : 'cl19-dbpipibic',
// 	password : settings.senha_DB,
// 	database : 'cl19-dbpipibic'
// });

//Servidor AWS
var pool = mysql.createPool({
	connectionLimit:100,
	host : 'pibic.cg43srnwi1wb.us-east-2.rds.amazonaws.com',
	user : 'root',
	password : settings.senha_DB,
	database : 'Pibic'
});





 // Servidor Digital Ocean
// var pool = mysql.createPool({
// 	connectionLimit:100,
// 	host : '138.197.124.95',
// 	port:22,
// 	dstHost:'127.0.0.1',
//   	dstPort:3306,
// 	user : 'root',
// 	password : 'pibicfitbit',
// 	database : 'dbpibic'

// });



pool.on('acquire', function(connection){
	console.log('Acquired');
});

pool.on('release', function(connection) {
	console.log('conexão foi liberada após call!');
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


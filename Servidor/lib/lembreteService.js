"use strict";

var mysql = require('./mysqlWraper.js');

var exports = module.exports = {};

exports.getAllByOrderedByLastModification = function(idMedico) {
    return new Promise(function(resolve, reject) {
        mysql.getConnection(function(err,connection) {
            var query = {
                sql: `SELECT L.* FROM Lembrete L WHERE L.idMedico = ${connection.escape(idMedico)} ORDER BY L.timestamp DESC`,
                timeout: 10000
            }

            connection.query(query, function(err, rows, fields) {
                if(!err)
                    resolve(rows);
                resolve([]);
            });
        });
    });
}

"use strict";

var mysql = require('./mysqlWraper.js');

var exports = module.exports = {};

exports.getAllByOrderedByLastModification = function(idMedico) {
    return new Promise(function(resolve, reject) {
        mysql.getConnection(function(err,connection) {
            var query = {
                sql: `SELECT L.*,P.nomePaciente,M.nome  FROM Lembrete L, Paciente P, Medico M WHERE L.idMedico = ${connection.escape(idMedico)} AND M.idMedico=L.idMedico AND P.idtable1=L.idPaciente ORDER BY L.timestamp DESC`,
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

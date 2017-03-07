/*
Código fonte Back end do PIBIC de Pulseiras Inteligentes
Faculdade de Tecnologia - UnB

Este arquivo contém o módulo javascript de roteamento para as chamadas à API nativa para lembretes.

FUNCIONAMENTO:


*/
var senhas = require('../senhas.js');
var express = require('express');
var mysql = require('mysql');
var request = require('request');
var router = express.Router();

//Setup inicial de conecção com a base de dados 	
var connection = mysql.createConnection({
	host : '79.170.40.183',
	user : 'cl19-dbpipibic',
	password : senhas.senha_DB,
	database : 'cl19-dbpipibic'
});
connection.connect();

//Ações para alterar tabela Lembrete na base de dados
router.route('/')
	.post(function(req, res) {
		if (req.hasOwnProperty('body') && 
			req.body.hasOwnProperty('data') && 
			req.body.hasOwnProperty('mensagem') &&
			req.body.hasOwnProperty('idMedico') &&
			req.body.hasOwnProperty('idPaciente')){	
			var query;
			if (req.body.hasOwnProperty('K') || req.body.hasOwnProperty('Na') || req.body.hasOwnProperty('CI') || req.body.hasOwnProperty('Co2') 
				|| req.body.hasOwnProperty('Bun') || req.body.hasOwnProperty('Creat') || req.body.hasOwnProperty('Gluc') || req.body.hasOwnProperty('wcb')
				|| req.body.hasOwnProperty('HgB') || req.body.hasOwnProperty('Hct') || req.body.hasOwnProperty('Plt')){
				var additionalAttributes = "", additionalValues = "";

				if (req.body.hasOwnProperty('K')) {
						additionalAttributes += `, K`;
						additionalValues += `, ${connection.escape(req.body.K)}`;
				}
				if (req.body.hasOwnProperty('Na')) {
						additionalAttributes += `, Na`;
						additionalValues += `, ${connection.escape(req.body.Na)}`;
				}
				if (req.body.hasOwnProperty('CI')) {
						additionalAttributes += `, CI`;
						additionalValues += `, ${connection.escape(req.body.CI)}`;
				}
				if (req.body.hasOwnProperty('Co2')) {
						additionalAttributes += `, Co2`;
						additionalValues += `, ${connection.escape(req.body.Co2)}`;
				}
				if (req.body.hasOwnProperty('Bun')) {
						additionalAttributes += `, Bun`;
						additionalValues += `, ${connection.escape(req.body.Bun)}`;
				}
				if (req.body.hasOwnProperty('Creat')) {
						additionalAttributes += `, Creat`;
						additionalValues += `, ${connection.escape(req.body.Creat)}`;
				}
				if (req.body.hasOwnProperty('Gluc')) {
						additionalAttributes += `, Gluc`;
						additionalValues += `, ${connection.escape(req.body.Gluc)}`;
				}
				if (req.body.hasOwnProperty('wcb')) {
						additionalAttributes += `, wcb`;
						additionalValues += `, ${connection.escape(req.body.wcb)}`;
				}
				if (req.body.hasOwnProperty('HgB')) {
						additionalAttributes += `, HgB`;
						additionalValues += `, ${connection.escape(req.body.HgB)}`;
				}
				if (req.body.hasOwnProperty('Hct')) {
						additionalAttributes += `, Hct`;
						additionalValues += `, ${connection.escape(req.body.Hct)}`;
				}
				if (req.body.hasOwnProperty('Plt')) {
						additionalAttributes += `, Plt`;
						additionalValues += `, ${connection.escape(req.body.Plt)}`;
				}


				query = {
					sql:`INSERT INTO Lembrete (idMedico, idPaciente, mensagem, data`+ additionalAttributes +`) VALUES (${connection.escape(req.body.idMedico)}, ${connection.escape(req.body.idPaciente)}, ${connection.escape(req.body.mensagem)}, ${connection.escape(req.body.data)}`+ additionalValues +`)`,
					timeout: 10000
				}
			}
			//Caso o lembrete não tenha informações de elementos químicos
			else{
				query = {
					sql:`INSERT INTO Lembrete (idMedico, idPaciente, mensagem, data) VALUES (${connection.escape(req.body.idMedico)}, ${connection.escape(req.body.idPaciente)}, ${connection.escape(req.body.mensagem)}, ${connection.escape(req.body.data)})`,
					timeout: 10000
				}
			}
			

			connection.query(query, function(err, rows, fields) {
				console.log(err);
				if (err) {
					res.send('Não foi possível adicionar lembrete à base de dados.');
				} else {
					res.send('Lembrete adicionado com sucesso.');
				}
			});
		} else {
			//throw new Error('Parâmetros POST inválidos ou inexistentes para adicionar paciente');
			res.send('Error: Parâmetros POST inválidos ou inexistentes para adicionar lembrete');
		}
	
	})
	.put(function(req, res){
		
		if(!req.body.hasOwnProperty('idLembrete'))
		{
			return res.send("Adicionar id do lembrete a ser editado");
		}

		var selector = {
			sql:`SELECT * FROM Lembrete WHERE id = ${connection.escape(req.body.idLembrete)} LIMIT 1`,
			timeout: 10000
		}
		console.log(req.body.idLembrete);
		
		connection.query(selector, function(err, rows, fields) {
			
			if (err != null) console.log('Erro ao selecionar lembrete a ser editado na base de dados.');
			else if (rows.length < 1) {
				res.send('O id no header de sua requisição não existe na base de dados.');
			}
			else {
				var mensagemNova;
				var Elementos = "";

				if (req.body.hasOwnProperty('mensagem')) {
					mensagemNova = req.body.mensagem;
				} else { mensagemNova = rows[0].mensagem; }


				if (req.body.hasOwnProperty('K')) {
					Elementos += `, K=${connection.escape(req.body.K)}`;
				} else { Elementos += `, K=`+rows[0].K; }

				if (req.body.hasOwnProperty('Na')) {
					Elementos += `, Na=${connection.escape(req.body.Na)}`;
				} else { Elementos += `, Na=`+rows[0].Na; }

				if (req.body.hasOwnProperty('CI')) {
					Elementos += `, CI=${connection.escape(req.body.CI)}`;
				} else { Elementos += `, CI=`+rows[0].CI; }

				if (req.body.hasOwnProperty('Co2')) {
					Elementos += `, Co2=${connection.escape(req.body.Co2)}`;
				} else { Elementos += `, Co2=`+rows[0].Co2; }
				if (req.body.hasOwnProperty('Bun')) {
					Elementos += `, Bun=${connection.escape(req.body.Bun)}`;
				} else { Elementos += `, Bun=`+rows[0].Bun; }
				if (req.body.hasOwnProperty('Creat')) {
					Elementos += `, Creat=${connection.escape(req.body.Creat)}`;
				} else { Elementos += `, Creat=`+rows[0].Creat; }


				if (req.body.hasOwnProperty('Gluc')) {
					Elementos += `, Gluc=${connection.escape(req.body.Gluc)}`;
				} else { Elementos += `, Gluc=`+rows[0].Gluc; }
				if (req.body.hasOwnProperty('wcb')) {
					Elementos += `, wcb=${connection.escape(req.body.wcb)}`;
				} else { Elementos += `, wcb=`+rows[0].wcb; }

				if (req.body.hasOwnProperty('HgB')) {
					Elementos += `, HgB=${connection.escape(req.body.HgB)}`;
				} else { Elementos += `, HgB=`+rows[0].HgB; }
				if (req.body.hasOwnProperty('Hct')) {
					Elementos += `, Hct=${connection.escape(req.body.Hct)}`;
				} else { Elementos += `, Hct=`+rows[0].Hct; }
				if (req.body.hasOwnProperty('Plt')) {
					Elementos += `, Plt=${connection.escape(req.body.Plt)}`;
				} else { Elementos += `, Plt=`+rows[0].Plt; }
		
				console.log(`UPDATE Lembrete SET mensagem='${mensagemNova}'` + Elementos + ` WHERE id=${rows[0].id}`);
				connection.query(
				`UPDATE Lembrete SET mensagem='${mensagemNova}'` + Elementos + ` WHERE id=${rows[0].id}`,
				function(error, results){
				console.log(error);
					if (error != null) {
						res.send('Erro ao alterar lembrete na base de dados');
					} else {
						res.send('Lembrete editado com sucesso.');
					}
				});
			}
		});
		
	})
	.delete(function(req, res) {
		//console.log(req.body.hasOwnProperty('idPaciente'));
		if (req.body.hasOwnProperty('idLembrete')) {
			var deleteLembreteQuery = {
				sql: `DELETE FROM Lembrete WHERE id = ${connection.escape(req.body.idLembrete)} LIMIT 1`,
				timeout: 10000	
			}
			connection.query(deleteLembreteQuery, function(err, rows, fields) {
				if(err) {
					res.send('Houve um erro ao se tentar remover lembrete da base de dados.');
				} else { res.send('O lembrete de id especificado pôde ser removido com sucesso.'); }
			});
		} else {
			res.send('Indique o id do lembrete a ser removido da base.');			
		}
	});
	
router.get('/:idPaciente', function(req, res){
	console.log(req.params.hasOwnProperty('idPaciente'));
	if (req.params.hasOwnProperty('idPaciente')) {
		var getPatientQuery = {
			sql: `SELECT M.nome, L.* FROM  Lembrete L,  Medico M WHERE L.idMedico = M.idMedico AND L.idPaciente = ${connection.escape(req.params.idPaciente)}`,
			timeout: 10000	
		}
		connection.query(getPatientQuery, function(err, rows, fields) {
			if(err) {
				console.log(err);
				res.send('Houve um erro ao se tentar puxar lembretes da base de dados.');
			} else {
				console.log(err);
				console.log(rows);
				//console.log(fields);
				res.json(rows);
			}
		});
	} else {
		res.send('Indique o id do Paciente cujos lembretes devem ser puxado da base.');			
	}
}); 

// router.get('/check/:idLembrete', function(req,res){
// 	
// });

module.exports = router;
/*
Código fonte Back end do PIBIC de Pulseiras Inteligentes
Faculdade de Tecnologia - UnB


*/

// ============================= Código ativo =====================================

//Setup de módulos necessários para a aplicação
var senhas = require('./senhas.js');
var express = require('express'),
	app = express(),
	request = require('request'),
	mysql = require('./lib/mysqlWraper.js'),
	bodyParser = require('body-parser'),
	setupOptionsVariables = require('./setupVariables.js'),
	pacienteRouter = require('./routes/paciente.js'),
	lembreteRouter = require('./routes/lembrete.js'),
	medicoRouter = require('./routes/medico.js'),
	loginRouter = require('./routes/login.js'),
	pulseiraRouter = require('./routes/pulseira.js'),
	grupoPacientesRouter = require('./routes/grupoPacientes.js'),
	mailSender = require('./lib/mailgunWraper.js');
	hospitaisRouter = require('./routes/hospitais.js');
	compartilhamentoRouter = require('./routes/compartilhamento.js');

var refreshOAuthToken = require('./lib/refreshOAuthTokenLib.js');
var getDynamicHealthParams = require('./lib/getDynamicHealthParamsLib.js');
var getStaticHealthParams = require('./lib/getStaticHealthParamsLib.js');
var getStaticHealthParams = require('./lib/formatDateLib.js');

//setando todas as variáveis de options nos requests http de teste
setupOptionsVariables(app);

// request(app.optionsPutTestRequestMedico, function(err, httpResponse, body) { 
// 	console.log(err);
// 	//console.log(httpResponse);
// 	console.log(body);
// });

//Loop e multiplexação das pulseiras em atividade para resgate de parâmetros estáticos
// setInterval(function(){
// 	mysql.getConnection(function(err,connection) {
// 		connection.query('SELECT idPulseira FROM Pulseira_Paciente', function(err,rows) {
// 			if (err) console.log(err);
// 			for (var i = 0; i < rows.length; i++) {
// 				getStaticHealthParams(rows[i].idPulseira);
// 			}
// 		});
// 	});
// }, 900000);

//Loop e multiplexação das pulseiras em atividade para resgate de parâmetros dinâmicos
// setInterval(function() {
// 
// 	mysql.getConnection(function(err,connection) {
// 
// 		var data = new Date(),
// 			delay = 30;
// 		connection.query('SELECT idPulseira FROM Pulseira_Paciente', function(err,rows) {
// 			if (err) console.log(err);
// 			for (var i = 0; i < rows.length; i++) {
// 				getDynamicHealthParams(rows[i].idPulseira, data, delay);
// 			}
// 		});
// 	});
// }, 60000);

//request(optionsGetHR, getHRCallback);
//getDynamicHealthParams(60, new Date(), 0);
// getStaticHealthParams(0, 60);
//getStaticHealthParams(0, 18);
//console.log(getTodayDate());

// ================================ código servidor	===================================

//Setup para uso do módulo body parser para possibilitar extração de parâmetros do corpo do request http
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Tentativa de corrigir CORS para interação com front end
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Setup da template engine escolhida para renderizar emails e páginas web
app.set('view engine', 'pug');
app.set('views','./views');

// ROUTING DO SERVIDOR E API's nativas da aplicação
app.get('/', function(req, res) {
	res.render('index');
});

//Ações para alterar tabela paciente na base de dados, usar módulo local ./router/paciente.js
app.use('/api/paciente', pacienteRouter);
	
//Ações para alterar tabela Médico na base de dados, usar módulo local ./router/medico.js
app.use('/api/medico', medicoRouter);

//Ações para alterar tabela Lembrete na base de dados, usar módulo local ./router/lembrete.js
app.use('/api/lembrete', lembreteRouter);

//Ações para alterar tabela Login na base de dados, usar módulo local ./router/login.js
app.use('/api/login', loginRouter);

//Ações para alterar tabela Login na base de dados, usar módulo local ./router/pulseira.js
app.use('/api/pulseira', pulseiraRouter);

app.use('/api/grupoPacientes', grupoPacientesRouter);

app.use('/api/hospitais', hospitaisRouter);

app.use('/api/compartilhamento', compartilhamentoRouter);

port = process.env.PORT || 3000;

app.listen(port);

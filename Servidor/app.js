/*
Código fonte Back end do PIBIC de Pulseiras Inteligentes
Faculdade de Tecnologia - UnB


*/

// ================================ código ativo ===================================

//Setup de módulos necessários para a aplicação
var senhas = require('./senhas.js');
var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser');

// 	importando rotas da aplicação
 	//setupOptionsVariables = require('./setupVariables.js'),
	pacienteRouter = require('./routes/paciente.js'),
	lembreteRouter = require('./routes/lembrete.js'),
	medicoRouter = require('./routes/medico.js'),
	loginRouter = require('./routes/login.js'),
	pulseiraRouter = require('./routes/pulseira.js'),
	grupoPacientesRouter = require('./routes/grupoPacientes.js'),
	equipeRouter = require('./routes/equipe.js');
	compartilhamentoRouter = require('./routes/compartilhamento.js');
	feedRouter = require('./routes/feed.js');
	request = require('request');



//A extensão chrome POSTman realiza requisições com facilidade torna setupOptionsVariables
//redundante.
//setando todas as variáveis de options nos requests http de teste
 //setupOptionsVariables(app);


// var getDynamicHealthParams = require('./lib/getDynamicHealthParamsLib.js');
// getDynamicHealthParams(58, new Date(), 30);
/*
 request(app.optionsPostTestEmailRequestEquipeRelacMedico, function(err, httpResponse, body) {
 	console.log(err);
 	//console.log(httpResponse);
 	console.log(body);
 });
*/
var spawn = require('child_process').spawn;


function childProcessRestarter(pathAndFile, processname) {

// 	console.log('oi');

	var process = spawn('node', [pathAndFile]);

// 	process.stdin.write("Hi there");

	process.stdout.on('data', function (data) {
		console.log(processname + ' has a message: ' + data);
	});

	process.stderr.on('data', function (data) {
		console.log('There was an error: ' + data);
	});

	process.on('exit', function(){
		console.log('Erro no processo ' + processname);
		delete(process);
		setTimeout(childProcessRestarter, 3000, pathAndFile);
	});

}

//Iniciar processos filho para loops de resgate de dados de saúde
childProcessRestarter('./childProcesses/getStaticHealthParams.js', 'getStatic');
childProcessRestarter('./childProcesses/Proc_getDynamicHealthParams.js', 'getDynamic');

// ================================ código servidor	===================================

//Setup de cookies para implementação de cookie session do express
app.use(cookieParser({
	key: 'lifeTrackerCookie.sess',
	secret: senhas.cookiePassword
}));

//Setup para uso do módulo body parser para possibilitar extração de parâmetros do corpo do request http
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Tentativa de corrigir CORS para interação com front end
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization");
	res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
	res.setHeader("Access-Control-Allow-Credentials", true)

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

app.use('/api/equipe', equipeRouter);

app.use('/api/compartilhamento', compartilhamentoRouter);

app.use('/api/feed', feedRouter);

port = process.env.PORT || 3000;

app.get('/teste', function(req, res){
	res.send(req.cookies);
});

app.get('/cookie', function(req,res){
	res.cookie('lifeTrackerIdM', 20);
	res.redirect('http://julianop.com.br/?idMedico='+req.cookies.lifeTrackerIdM);
});

app.listen(port, ()=> console.log('Server running on port 3000'));

app.get('/', (req, res) => {
  res.send('HEY!')
})


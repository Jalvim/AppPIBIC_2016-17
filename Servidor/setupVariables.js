/*
Código fonte Back end do PIBIC de Pulseiras Inteligentes
Faculdade de Tecnologia - UnB

Módulo setupOptionVariables
Contém objetos javascript literais para testes às apis endpoint nativas do projeto das pulseiras inteligentes.
O pacote npm usado para executar requests http é chamado Request, e este permite por meio dos objetos literais 
Javascript passados à função que chama a requisição, um nível de customização razoável para fins do projeto.
Ex: configurar headers e corpos bem como o método usado no request http.

*/

module.exports = function(app) {
	
	//Opções de teste de request http para pacientes
	app.optionsPostTestRequestPaciente = {
		method:'POST',
		url:'http://127.0.0.1:3000/api/paciente/geral',
		form:{ 
			nomePaciente: 'Alceu',
			causaDaInternacao: 'Braço quebrado',
			numeroDoProntuario: 89491649,
			telefone: 999999999,
			foto: 0001000101011111,
			dataDeNascimento: '1999-04-04',
			idMedico: 21
		}
	};
	app.optionsPutTestRequestPaciente = {
		method:'PUT',
		url:'http://127.0.0.1:3000/api/paciente/geral',
		headers: {
			'idPaciente': '86'
		},
		form:{ 
			nomePaciente: 'Mauricio Nunes',
			numeroDoProntuario: 133512,
			telefone: 32631895,
			foto: 000100100101010010,
			causaDaInternacao: 'Diareia',
			dataDeNascimento: '1999-06-14',
			ativo: 1
		}
	}
	app.optionsDeleteTestRequestPaciente = {
		method:'DELETE',
		url:'http://127.0.0.1:3000/api/paciente/geral',
		form:{ 
			idPaciente: 36
		}
	}
	/*
	Não útil
	app.optionsGetTestRequestPaciente = {
		method:'GET',
		url:'http://127.0.0.1:3000/api/paciente/geral',
		form:{ 
			numeroDoProntuario: 133545
		}
	}
	*/
	
	//Opções de teste de request http para médicos
	app.optionsPostTestRequestMedico = {
		method:'POST',
		url:'http://127.0.0.1:3000/api/medico',
		form:{ 
			nomeMedico: 'Matheus Clemente',
			especialidade: 'Gastrointerologista',
			CRM: 777777777,
			telefone: 9401900,
			CPF: 903842093,
			email: 'jbowabco3biuebwacilu@gmail.com',
			senha: 'senia'
		}
	};
	
	app.optionsPutTestRequestMedico = {
		method:'PUT',
		url:'http://127.0.0.1:3000/api/medico',
		form:{ 
			idMedico: 71,
			nomeMedico: "jonas jones"
		}
	};

	app.optionsDeleteTestRequestMedico = {
		method:'DELETE',
		url:'http://127.0.0.1:3000/api/medico',
		form:{
			idMedico: 7,
			nomeMedico: 'Alcides Guimarães',
			especialidade: 'Anestesista',
			CRM: 133545,
			telefone: 33449369
		}
	};
	
	//Opções de teste de request http para lembretes
	app.optionsPostTestRequestLembrete = {
		method:'POST',
		url:'http://127.0.0.1:3000/api/lembrete/',
		form:{ 
			idMedico: '2',
			data: '2017-01-14',
			mensagem: 'Este é um sample lembrete.',
			tarefa: 1,
			dataLimite: '2017-01-25'
		}
	};

	app.optionsPostTestRequestLembreteComElementos = {
		method:'POST',
		url:'http://127.0.0.1:3000/api/lembrete/',
		form:{ 
			idMedico: '2',
			idPaciente: '18',
			data: '2017-01-14',
			mensagem: 'Este é um sample lembrete.',
			tarefa: 1,
			K: 10,
			CI: 1,
			dataLimite: '2017-01-25'
		}
	};
	app.optionsPutTestRequestLembreteComElementos = {
		method:'PUT',
		url:'http://127.0.0.1:3000/api/lembrete/',
		headers: {
			'idLembrete':'28'
		},
		form:{
			idLembrete:'28',
			mensagem: 'Este é um novo sample lembrete!',
			dataLimite: '2017-01-27',
			K: 1,
			CI:10,
			Na: 10
		}
	};
	app.optionsPutTestRequestLembrete = {
		method:'PUT',
		url:'http://127.0.0.1:3000/api/lembrete/',
		headers: {
			'idLembrete':'11'
		},
		form:{ 
			mensagem: 'Este é um novo sample lembrete!',
			dataLimite: '2017-01-27'
		}
	};
	app.optionsDeleteTestRequestLembrete = {
		method:'DELETE',
		url:'http://127.0.0.1:3000/api/lembrete/',
		form:{ 
			idLembrete: '17'
		}
	};

	//Opções de teste de request http para login
	app.optionsPostTestRequestLogin = {
		method:'POST',
		url:'http://127.0.0.1:3000/api/login/',
		form:{ 
			email: 'email@gmail.com',
			senha: '123456'
		}
	};
	app.optionsPutTestRequestLogin = {
		method:'PUT',
		url:'http://127.0.0.1:3000/api/login/',
		form:{ 
			email: 'matheusbafutto@gmail.com'
		}
	};
	
	app.optionsPostTestRequestLoginMudaSenha = {
		method:'POST',
		url:'http://127.0.0.1:3000/api/login/mudarSenha',
		form:{ 
			email: 'matheusbafutto@gmail.com',
			velhaSenha: 'aaaaaa',
			novaSenha: 'Sonia8'
		}
	};

	//Opções de teste de request http para grupos de pacientes
	app.optionsPostTestRequestGrupoPacientes = {
		method:'POST',
		url:'http://127.0.0.1:3000/api/grupoPacientes/',
		form:{ 
			nome: 'Terceiro andar, Ala Norte',
			idMedico: 20	
		}
	};
	app.optionsPutTestRequestGrupoPacientes = {
		method:'PUT',
		url:'http://127.0.0.1:3000/api/grupoPacientes/',
		form:{
			idGrupoPac: 1,
			nome: 'Quarto andar, Ala Norte'	
		}
	};
	app.optionsDeleteTestRequestGrupoPacientes = {
		method:'DELETE',
		url:'http://127.0.0.1:3000/api/grupoPacientes/',
		form:{ 
			idGrupoPac: 2
		}
	};
	app.optionsPostTestRequestGrupoPac_Pacientes = {
		method:'POST',
		url:'http://127.0.0.1:3000/api/grupoPacientes/relacoes/',
		form:{ 
			idGrupoPac: 1,
			idPaciente: 40
		}
	};
	app.optionsDeleteTestRequestGrupoPac_Pacientes = {
		method:'DELETE',
		url:'http://127.0.0.1:3000/api/grupoPacientes/relacoes/',
		form:{ 
			id: 1,
			idGrupoPac: 1,
			idPaciente: 40
		}
	};
	
	//Opções de teste de request http para pulseiras
	app.optionsPostTestRequestPulseira = {
		method:'POST',
		url:'http://127.0.0.1:3000/api/pulseira/',
		form:{ 
			codigoOAuth:'865ad44c39a9715cdfee9fde335e194d02b1bf91',
			redirectUri:'http://julianop.com.br/'
		}
	};
	app.optionsPutTestRequestPulseira = {
		method:'PUT',
		url:'http://127.0.0.1:3000/api/pulseira/',
		form:{ 
			idPulseira: 60,
			disponivel: 0,
			idPaciente: 44
		}
	};
	app.optionsDeleteTestRequestPulseira = {
		method:'DELETE',
		url:'http://127.0.0.1:3000/api/pulseira/',
		form:{ 
			idPulseira: 57
		}
	};

	//Rotas de testes de criação de equipes
	app.optionsPostTestRequestEquipe= {
		method:'POST',
		url:'http://127.0.0.1:3000/api/equipe/',
		form:{ 
			nome: 'Sriio-Libanês'	
		}
	};
	app.optionsPutTestRequestEquipe = {
		method:'PUT',
		url:'http://127.0.0.1:3000/api/equipe/',
		form:{
			idEquipe: 20,
			nome: 'Sírio-Libanês'	
		}
	};
	app.optionsDeleteTestRequestEquipe = {
		method:'DELETE',
		url:'http://127.0.0.1:3000/api/equipe/',
		form:{ 
			idEquipe: 20
		}
	};

	//Rotas de testes de inserção de médicos na equipe
	app.optionsPostTestEmailRequestEquipeRelacMedico = {
		method:'POST',
		url:'http://127.0.0.1:3000/api/equipe/relacoes/medicos/email',
		form:{ 
			idEquipe: 1,
			email:'roberto'
		}
	};
	
	app.optionsPostTestRequestEquipeRelacMedico = {
		method:'POST',
		url:'http://127.0.0.1:3000/api/equipe/relacoes/medicos',
		form:{ 
			idEquipe: 1,
			idMedico: 18
		}
	};
	app.optionsDeleteTestRequestEquipeRelacMedico = {
		method:'DELETE',
		url:'http://127.0.0.1:3000/api/equipe/relacoes/medicos',
		form:{ 
			idEquMed: 26,
			idEquipe: 1,
			idMedico: 18
		}
	};

	//Rotas de testes de inserção de pacientes na equipe
	app.optionsPostTestRequestEquipeRelacPaciente = {
		method:'POST',
		url:'http://127.0.0.1:3000/api/equipe/relacoes/pacientes',
		form:{ 
			idEquipe: 1,
			idPaciente: 20
		}
	};
	app.optionsDeleteTestRequestEquipeRelacPaciente = {
		method:'DELETE',
		url:'http://127.0.0.1:3000/api/equipe/relacoes/pacientes',
		form:{ 
			idEquPac: 1,
			idEquipe: 1,
			idPaciente: 20
		}
	};

	//Rotas de testes de inserção de pulseiras na equipe
	app.optionsPostTestRequestEquipeRelacPulseira = {
		method:'POST',
		url:'http://127.0.0.1:3000/api/equipe/relacoes/pulseiras',
		form:{ 
			idEquipe: 1,
			idPulseira: 47
		}
	};
	app.optionsDeleteTestRequestEquipeRelacPulseira = {
		method:'DELETE',
		url:'http://127.0.0.1:3000/api/equipe/relacoes/pulseiras',
		form:{ 
			idEquPul: 1,
			idEquipe: 1,
			idPulseira: 47
		}
	};
	
	app.optionsPostTestRequestCompartilharPaciente = {
		method:'POST',
		url:'http://127.0.0.1:3000/api/compartilhamento/',
		form:{ 
			idHospitalOrigem: '1',
			idMedicoDestino: '20',
			idPaciente: '61'
		}
	};
}


	






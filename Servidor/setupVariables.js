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
			nomePaciente: 'Juliano Barbosa Pretz',
			causaDaInternacao: 'Estresse Crônico',
			numeroDoProntuario: 8373659,
			telefone: 999990000,
			foto: 0001000101011111,
			dataDeNascimento: '1990-06-05',
			idMedico: 20, 
			idPulseira: 47
		}
	};
	app.optionsPutTestRequestPaciente = {
		method:'PUT',
		url:'http://127.0.0.1:3000/api/paciente/geral',
		headers: {
			'idPaciente': '12'
		},
		form:{ 
			nomePaciente: 'Mauricio Nunes',
			numeroDoProntuario: 133512,
			telefone: 32631895,
			foto: 000100100101010010,
			causaDaInternacao: 'Diareia',
			dataDeNascimento: '1999-06-14',
			crmMedicoResponsavel:'111111111111',
			isNewPatient: false
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
			nomeMedico: 'Ney Matogrosso',
			especialidade: 'Urologista',
			CRM: 12345624,
			telefone: 33449369,
			email: 'email2@gmail.com',
			senha: '123456'
		}
	};
	
	app.optionsPutTestRequestMedico = {
		method:'PUT',
		url:'http://127.0.0.1:3000/api/medico',
		form:{ 
			nomeMedico: 'Ney Matogrosso',
			especialidade: 'Urologista',
			CRM: 133545,
			telefone: 33449388
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

	//Opções de teste de request http para lembretes
	app.optionsPostTestRequestLogin = {
		method:'POST',
		url:'http://127.0.0.1:3000/api/login/',
		form:{ 
			email: 'email@gmail.com',
			senha: '123456'
		}
	};

	//Opções de teste de request http para grupos de pacientes
	app.optionsPostTestRequestGrupoPacientes = {
		method:'POST',
		url:'http://127.0.0.1:3000/api/grupoPacientes/',
		form:{ 
			nome: 'Terceiro andar, Ala Norte'	
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
			codigoOAuth:'1d1976396b6b7d08a5ec444b5ed7b8aa1a837014',
			redirectUri:'https://www.google.com.br/'
		}
	};
	app.optionsPutTestRequestPulseira = {
		method:'PUT',
		url:'http://127.0.0.1:3000/api/pulseira/',
		form:{ 
			idPulseira: 56,
			disponivel: 0,
			idPaciente: 39
		}
	};
	app.optionsDeleteTestRequestPulseira = {
		method:'DELETE',
		url:'http://127.0.0.1:3000/api/pulseira/',
		form:{ 
			idPulseira: 49
		}
	};
	app.optionsPostTestRequestHospitais= {
		method:'POST',
		url:'http://127.0.0.1:3000/api/hospitais/',
		form:{ 
			nome: 'Sriio-Libanês'	
		}
	};
	app.optionsPutTestRequestHospitais = {
		method:'PUT',
		url:'http://127.0.0.1:3000/api/hospitais/',
		form:{
			idHospital: 1,
			nome: 'Sírio-Libanês'	
		}
	};
	app.optionsDeleteTestRequestHospitais = {
		method:'DELETE',
		url:'http://127.0.0.1:3000/api/hospitais/',
		form:{ 
			idHospital: 2
		}
	};
	app.optionsPostTestRequestHospitaisRelac = {
		method:'POST',
		url:'http://127.0.0.1:3000/api/hospitais/relacoes/',
		form:{ 
			idHospital: 1,
			idMedico: 16
		}
	};
	app.optionsDeleteTestRequestHospitaisRelac = {
		method:'DELETE',
		url:'http://127.0.0.1:3000/api/hospitais/relacoes/',
		form:{ 
			idHosPac: 1,
			idHospital: 1,
			idMedico: 16
		}
	};
}


	






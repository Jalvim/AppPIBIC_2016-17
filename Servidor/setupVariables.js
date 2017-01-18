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
			nomePaciente: 'Jorge Mendes',
			causaDaInternacao: 'Overdose de Dota',
			numeroDoProntuario: 5555555,
			telefone: 9823738,
			foto: 0001000101011111,
			dataDeNascimento: '1994-05-17',
			crmMedicoResponsavel: '111111111',
			codigoOAuth:'8d0a6213f00ab776d6769d2df8822471f96e7e94',
			redirectUri:'https://pibicfitbit.herokuapp.com/'
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
			telefone: 33449369
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
			idLembrete: 12
		}
	};
}









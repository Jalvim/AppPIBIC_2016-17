/*
Módulo setupOptionVariables
contém objetos javascript literais para testes às apis endpoint nativas do projeto das pulseiras inteligentes.
*/

module.exports = function(app) {
	
	//Opções de teste de request http para pacientes
	app.optionsPostTestRequestPaciente = {
		method:'POST',
		url:'http://127.0.0.1:3000/api/paciente/geral',
		form:{ 
			nomePaciente: 'Alcides Guimarães',
			causaDaInternacao: 'Dor de cabeça',
			numeroDoProntuario: 133545,
			telefone: 33449369,
			foto: 000100010101,
			dataDeNascimento: '1993-07-03'
		}
	};
	app.optionsPutTestRequestPaciente = {
		method:'PUT',
		url:'http://127.0.0.1:3000/api/paciente/geral',
		headers: {
			'numeroDoProntuario': '0'
		},
		form:{ 
			nomePaciente: 'Mauricio Nunes',
			numeroDoProntuario: 133512,
			telefone: 32631895,
			foto: 000100100101010010,
			causaDaInternacao: 'Diareia',
			dataDeNascimento: '1999-06-14',
			isNewPatient: false
		}
	}
	app.optionsDeleteTestRequestPaciente = {
		method:'DELETE',
		url:'http://127.0.0.1:3000/api/paciente/geral',
		form:{ 
			numeroDoProntuario: 133545
		}
	}
	app.optionsGetTestRequestPaciente = {
		method:'GET',
		url:'http://127.0.0.1:3000/api/paciente/geral',
		form:{ 
			numeroDoProntuario: 133545
		}
	}
	
	//Opções de teste de request http para médicos
	app.optionsPostTestRequestMedico = {
		method:'POST',
		url:'http://127.0.0.1:3000/api/medico',
		form:{ 
			nomeMedico: 'Alcides Guimarães',
			especialidade: 'Anestesista',
			CRM: 133545,
			telefone: 33449369
		}
	};
	
}
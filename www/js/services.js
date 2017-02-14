// Funções utilizadas dentro do App

medApp.services = {

  idAtualMedico: -1,  // ID do médico no login atual

  // Função que seta o ID atual a cada login
  setIdMedico: function(novaId) {

    this.idAtualMedico = novaId;

  },

  // Função que retorna o ID do login atual
  getIdMedico: function() {
    
    return this.idAtualMedico;

  },

  // Função que limpa o ID no logoff
  deleteIdMedico: function() {

    this.idAtualMedico = -1;

  },

  idAtualPaciente: -1, //ID 'default' do paciente.

  //Função que seta o ID do paciente de interesse do médico --> 'onclick' no ícone.
  setIdPaciente: function(novaId) {
    this.idAtualPaciente = novaId;
  },

  //Função que retorna o ID do paciente de interesse.
  getIdPaciente: function() {
    return this.idAtualPaciente;
  },

  //Função que limpa o ID do paciente quando já consultados os dados de saúde;
  deleteIdPaciente: function() {
    this.idAtualPaciente = -1;
  },

  dadosEstaticos: {
    calorias: -1,
    passos: -1,
    pulso: -1,
    degraus: -1
  }, //Seta os dados estaticos do pacientes como 'default'.

  //Conjunto de funções que armazenam novos dados estáticos.
  setDadosEstaticos: {
    calorias: function(data) {
      this.dadosEstaticos.calorias = data;
    },
    passos: function(data) {
      this.dadosEstaticos.passos = data;
    },
    pulso: function(data) {
      this.dadosEstaticos.pulso = data;
    },
    degraus: function(data) {
      this.dadosEstaticos.degraus = data;
    }
  },

  //Conjunto de Funções que retornam os dados estáticos do paciente atual.
  getDadosEstaticos: {
    calorias: function() {
      return this.dadosEstaticos.calorias;
    },
    passos: function() {
      return this.dadosEstaticos.passos;
    },
    pulso: function() {
      return this.dadosEstaticos.pulso;
    },
    degraus: function() {
      return this.dadosEstaticos.degraus;
    }
  },

  //Função que torna os dados estáticos para o formato default.
  deleteDadosEstaticos: {
    calorias: function() {
      this.dadosEstaticos.calorias = -1;
    },
    passos: function() {
      this.dadosEstaticos.passos = -1;
    },
    pulso: function() {
      this.dadosEstaticos.pulso = -1;
    },
    degraus: function() {
      this.dadosEstaticos.degraus = -1;
    }
  },

  // Função que verifica se os dados do médico foram editados 
  checkEdit: function(novo, velho) {

    if ( novo.nomeEdit == velho.nomeEdit &&
        novo.crmEdit == velho.crmEdit &&
        novo.espEdit == velho.espEdit && 
        novo.telEdit == velho.telEdit &&
        novo.emailEdit == velho.emailEdit) {

      return false;

    } else {

      return true;
    }; 

  },

  // Cria novo paciente e adiciona à lista
  createPaciente: function(data) {
     // Template de paciente
     var template = document.createElement('div');
     template.innerHTML =
       '<ons-list-item class="paciente-lista" modifier="chevron">' +
       '<div class="left">' + 
       '<img class="list__item__thumbnail" src="' + 'http://www.clker.com/cliparts/A/Y/O/m/o/N/placeholder-md.png' + '">' +
       '</div>' +
       '<div class="center">' +
       '<span class="list__item__title">' + data.nome + '</span>' +
       '<span class="list__item__subtitle">Prontuário: ' + data.id + '</span>' +
       '<span class="list__item__subtitle">Causa da internação: <span class="causa">' + data.causa + '</span></span>' +
       '<span class="list__item__subtitle">Médico responsavel:' + data.medicoResponsavel + '</span>' // TODO --> Acrescentar na API
       '<span class="list__item__subtitle">Hospital e andar:' + data.andar + data.hospital '</span>' // TODO --> Acrescentar na API
       '</div>' +
       '<div class="right">' +       
       '<ons-icon icon="star-o" class="list__item__icon"></ons-icon>'+
       '</div>';

      var pacienteItem = template.firstChild;

    // Insert urgent tasks at the top and non urgent tasks at the bottom.
     var pacientesLista = document.querySelector('#lista-pacientes');
     pacientesLista.appendChild(pacienteItem);

    },

    // Verifica se houve algum campo em branco nos formulários
    checkEmptyField: function(fields) {

      for (var i = 0, len = fields.length; i < len; i++) {

        if (fields[i].value == '') {

          return true;

        };

      };

      return false;

    },

    // Cria um novo lembrete
    createLembrete: function(data) {
     // Template de paciente
     var template = document.createElement('div');
     template.innerHTML =
      '<ons-list-item>'+
      '<div class="right">' +
      //'<ons-icon icon="star-o" class="list__item__icon"></ons-icon>' + 
      '<ons-icon icon="md-delete" class="list__item__icon delete"></ons-icon>' +
      '</div>' +
      '<div>' +
       data +
      '</div>' +
      '</ons-list-item>';

    var lembreteItem = template.firstChild;
    var lembretesLista = document.querySelector('#lista-lembretes');

    lembretesLista.appendChild(lembreteItem);

    lembreteItem.querySelector('.right').onclick = function() {
        lembretesLista.removeChild(lembreteItem);
      };

    },

};
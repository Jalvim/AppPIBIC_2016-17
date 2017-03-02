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
        novo.emailEdit == velho.emailEdit &&
        novo.cpfEdit == velho.cpfEdit) {

      return false;

    } else {

      return true;
    }; 

  },

  // Cria novo paciente e adiciona à lista
  createPaciente: function(data) {

     // Template de novo paciente
     var template = document.createElement('div');
     template.innerHTML =
      '<ons-list-item class="paciente-lista ' + data.statusPaciente + '" modifier="longdivider" id="pac2" tappable>' +
        '<div class="left">' +
          '<img class="list__item__thumbnail" src="'+ data.img + '">' +
        '</div>' +
        '<div class="center">'+
          '<ons-row class="paciente-header">'+
            '<ons-col>' +
              '<span class="list__item__title">' + data.nomePaciente + '</span>' +
            '</ons-col>' +
            '<ons-col>' +
              '<ons-icon icon="heartbeat" class="list__item__icon"></ons-icon>' + 
              '<span class="list__item__title">' + data.batimentos + ' bpm</span>' +
            '</ons-col>' +
          '</ons-row>' +
          '<ons-row>' +
            '<ons-col class="paciente-detalhes">' +
              '<ons-icon icon="md-calendar" class="list__item__icon"></ons-icon>' +
              '<span class="list__item__subtitle">' + data.dataPaciente + '</span>' +
            '</ons-col>' +
            '<ons-col class="paciente-detalhes">' +
              '<ons-icon icon="md-plaster" class="list__item__icon"></ons-icon>' +
              '<span class="list__item__subtitle">' + data.causaPaciente + '</span>' +  
            '</ons-col>' +
          '</ons-row>' +
          '<ons-row>' +
            '<ons-col class="paciente-detalhes">' +
              '<ons-icon icon="user-md" class="list__item__icon"></ons-icon>' +
              '<span class="list__item__subtitle">' + data.medicoResp + '</span>' +
            '</ons-col>' +
            '<ons-col class="paciente-detalhes">' +
              '<ons-icon icon="hospital-o" class="list__item__icon"></ons-icon>' +
              '<span class="list__item__subtitle">' + data.hospital + '</span>' +
            '</ons-col>' +
          '</ons-row>' +
        '</div>' +
      '</ons-list-item>';

    var pacienteItem = template.firstChild;

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

    // Define um texto resumido do lembrete para vizualização
    var textoLembrete = data.texto.substring(0,20);

    // Template de paciente
    var template = document.createElement('div');
    template.innerHTML =
      '<ons-list-item>'+
      '<div class="right">' +
      //'<ons-icon icon="star-o" class="list__item__icon"></ons-icon>' + 
      '<ons-icon icon="md-delete" class="list__item__icon delete"></ons-icon>' +
      '</div>' +
      '<div>' +
      textoLembrete +
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
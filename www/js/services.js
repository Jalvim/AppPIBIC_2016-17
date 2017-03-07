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

  dadosPacienteAtual: {
    idAtualPaciente: -1,
    nome: '',
    medico: '',
    causa: '',
    dataIntFormatoBarra: '',
    dataIntFormatoTraco: '',
    hospital: ''
  }, //Dados 'default' do paciente.

  //Função que seta o ID do paciente de interesse do médico --> 'onclick' no ícone.
  setPacienteAtual: function(dados) {
    this.dadosPacienteAtual.idAtualPaciente = dados.idPaciente;
    this.dadosPacienteAtual.nome = dados.nome;
    this.dadosPacienteAtual.medico = dados.medicoResp;
    this.dadosPacienteAtual.causa = dados.causa;
    this.dadosPacienteAtual.dataIntFormatoBarra = dados.dataIntFormatoBarra;
    this.dadosPacienteAtual.dataIntFormatoTraco = dados.dataIntFormatoTraco;
    this.dadosPacienteAtual.hospital = dados.hospital;
  },

  //Função que retorna o ID do paciente de interesse.
  getIdPaciente: function() {
    return this.dadosPacienteAtual.idAtualPaciente;
  },

  //Função que limpa o ID do paciente quando já consultados os dados de saúde;
  deletePacienteAtual: function() {
    this.dadosPacienteAtual.idAtualPaciente = -1;
    this.dadosPacienteAtual.nome = '';
    this.dadosPacienteAtual.medico = '';
    this.dadosPacienteAtual.causa = '';
    this.dadosPacienteAtual.dataIntFormatoBarra = '';
    this.dadosPacienteAtual.dataIntFormatoTraco = '';
    this.dadosPacienteAtual.hospital = '';
  },

  dadosEstaticos: {
    calorias: new Array,
    passos: new Array,
    pulso: new Array,
    degraus: new Array
  }, //Seta os dados estaticos do pacientes como 'default'.

  //Conjunto de funções que armazenam novos dados estáticos.
  /*setDadosEstaticos: {
    calorias: function(input) {
      this.dadosEstaticos.calorias = input;
    },
    passos: function(input) {
      this.dadosEstaticos.passos = input;
    },
    pulso: function(input) {
      this.dadosEstaticos.pulso = input;
    },
    degraus: function(input) {
      this.dadosEstaticos.degraus = input;
    }
  },*/

  //Conjunto de Funções que retornam os dados estáticos do paciente atual.
  /*getDadosEstaticos: {
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
  },*/

  //Função que torna os dados estáticos para o formato default.
  /*deleteDadosEstaticos: {
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
  },*/

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

    var dataPacienteFormatoBarra = data.dataPaciente.substring(8,10) + '/' +
                                   data.dataPaciente.substring(5,7) + '/' +
                                   data.dataPaciente.substring(0,4);

    var dataPacienteFormatoTraco = data.dataPaciente.substring(0,10);

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
              '<span class="list__item__subtitle">' + dataPacienteFormatoBarra + '</span>' +
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
    $(pacienteItem).data('idPaciente', data.idPaciente);

    pacienteItem.onclick = function() {

      medApp.services.setPacienteAtual( {idPaciente: $(pacienteItem).data('idPaciente'),
                                          nome: data.nomePaciente,
                                          dataIntFormatoTraco: dataPacienteFormatoTraco,
                                          dataIntFormatoBarra: dataPacienteFormatoBarra,
                                          causa: data.causaPaciente,
                                          medicoResp: data.medicoResp,
                                          hospital: data.hospital
                                        });

      document.querySelector('#pacienteNav').pushPage('html/perfilpaciente.html'); 

    };

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
    if (data.texto.length < 30) {

      var textoLembrete = data.texto;

    } else {

      var textoLembrete = data.texto.substring(0,30);

    };

    var dataFormatoBarra = data.horario.substring(8,10) + '/' +
                           data.horario.substring(5,7) + '/' +
                           data.horario.substring(0,4);

    // Template de paciente
    var template = document.createElement('div');
    template.innerHTML =
      '<ons-list-item>' +
      '<div class="right">' +
        '<ons-icon icon="md-delete" class="list__item__icon delete"></ons-icon>' +
      '</div>' +
      '<div class="center">' +
        '<ons-row style="padding-bottom: 10px">' +
          '<ons-icon icon="md-assignment" class="list__item__icon"></ons-icon>' + 
          '<div class="lembrete-lista-header">' + textoLembrete + ((data.texto.length < 30) ? '' : '...') +
          '</div>' +
        '</ons-row>' + 
        '<ons-row>' +
          '<ons-col>' +
            '<ons-icon icon="md-calendar" size="20px" class="list__item__icon"></ons-icon>' + 
            '<span>' + dataFormatoBarra + '</span>' +
          '</ons-col>' +
          '<ons-col>' +
            '<ons-icon icon="user-md" size="20px" class="list__item__icon"></ons-icon>' +
            '<span>' + data.medico + '</span>' +
          '</ons-col>' +
        '</ons-row>' +
      '</div>' +
    '</ons-list-item>';

    var lembreteItem = template.firstChild;
    var lembretesLista = document.querySelector('#lista-lembretes');
    $(lembreteItem).data('medicoResp', data.medico);
    $(lembreteItem).data('horario', dataFormatoBarra);
    $(lembreteItem).data('idLembrete', data.idLembrete);
    $(lembreteItem).data('fullText', data.texto);

    // Funcionalidade de remover lembrete
    lembreteItem.querySelector('.right').onclick = function() {
        
        ons.notification.confirm({message: 'Tem certeza?'})
        .then( function(confirm){

          if(confirm) {
            $.ajax({
              url: 'http://julianop.com.br:3000/api/lembrete',
              type: 'DELETE',
              data: { 
                idLembrete: $(lembreteItem).data('idLembrete')
              }
            })
            .done(function(data) {

              ons.notification.alert(data);

              lembretesLista.removeChild(lembreteItem);

            });
          };

        });
        

    };

    // Funcionalidade de ver lembrete
    lembreteItem.querySelector('.center').onclick = function() {
        
      document.querySelector('#pacienteNav').pushPage('html/verlembrete.html',
        {data: {texto: $(lembreteItem).data('fullText'),
                horario: $(lembreteItem).data('horario'),
                medicoResp: $(lembreteItem).data('medicoResp'),
                idLembrete: $(lembreteItem).data('idLembrete')
        }});

    };

    lembretesLista.appendChild(lembreteItem);

  },

  //Ciclo de funções para as pulseiras disponiveis

  pulseirasDisponiveis: new Array,

  setPulseirasDisponiveis: function(puls){
    this.pulseirasDisponiveis = puls;
  },

  getPulseirasDisponiveis: function() {
    return this.pulseirasDisponiveis;
  },

  resetPulseirasDisponiveis: function() {
    this.pulseirasDisponiveis = -1;
  },

  pulseiraAtual: -1,

  showPulseirasDisponiveis: function(index) {
    var template = document.createElement('div');

    template.innerHTML = '<ons-list-item modifier="tappable"> <div id=item' + index + '> Pulseira de id = '
      + medApp.services.pulseirasDisponiveis[index].idPulseira + '</div> </ons-list-item>';
    
    var pulseiraItem = template.firstChild;
    var pulseiraLista = document.querySelector('#lista-pulseiras');

    pulseiraLista.appendChild(pulseiraItem); 

  },

  getToday: function(tipo) {
    
    var hoje = new Date();
    var dia = hoje.getDate();
    var mes = hoje.getMonth()+1;
    var ano = hoje.getFullYear();

    if(dia < 10) {
      dia = '0' + dia;
    };

    if(mes < 10) {
      mes = '0' + mes;
    };

    if(tipo === "barra") {

      hoje = dia + '/' + mes + '/' + ano;
      return hoje;

    } else if(tipo === "traco") {

      hoje = ano + '-' + mes + '-' + dia;
      return hoje;

    };

  },

};
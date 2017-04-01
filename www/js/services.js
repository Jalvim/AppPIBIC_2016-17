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

  // Cria novo paciente e adiciona à lista de pacientes ou membros de um grupo
  createPaciente: function(data, lista) {

    var dataPacienteFormatoBarra = data.dataPaciente.substring(8,10) + '/' +
                                   data.dataPaciente.substring(5,7) + '/' +
                                   data.dataPaciente.substring(0,4);

    var dataPacienteFormatoTraco = data.dataPaciente.substring(0,10);

    // Template de novo paciente
    var template = document.createElement('div');
    template.innerHTML =
      '<ons-list-item class="paciente-lista ' + data.statusPaciente + '" modifier="longdivider" tappable>' +
        '<div class="left">' +
          '<img class="list__item__thumbnail" src="'+ data.img + '">' +
        '</div>' +
        '<div class="center">'+
          '<ons-row class="paciente-header">'+
            '<ons-col>' +
              '<span class="list__item__title nome">' + data.nomePaciente + '</span>' +
            '</ons-col>' +
            /* TODO: Adicionar os dados dinâmicos de batimentos cardíacos
            '<ons-col>' +
              '<ons-icon icon="heartbeat" class="list__item__icon"></ons-icon>' + 
              '<span class="list__item__title">' + data.batimentos + ' bpm</span>' +
            '</ons-col>' +
            */
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

      medApp.services.setPacienteAtual( { idPaciente: $(pacienteItem).data('idPaciente'),
                                          nome: data.nomePaciente,
                                          dataIntFormatoTraco: dataPacienteFormatoTraco,
                                          dataIntFormatoBarra: dataPacienteFormatoBarra,
                                          causa: data.causaPaciente,
                                          medicoResp: data.medicoResp,
                                          hospital: data.hospital
                                        });

      document.querySelector('#pacienteNav').pushPage('html/perfilpaciente.html'); 

    };

    if (lista === 'pacientes') {

      var pacientesLista = document.querySelector('#lista-pacientes');

    } else if (lista === 'grupo') {

      var pacientesLista = document.querySelector('#lista-pacientes-grupo');

    };
    
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

  //Função responsável por revelar o dialog.
  showPopover: function(id) {
    document
      .getElementById(id)
      .show();
  },

  //Função responsável por esconder o dialog.
  hidePopover: function(id) {
    document
      .getElementById(id)
      .hide();
  }, 

  //Variável global q armazena o id do Dialog
  dial: '',

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
    $(lembreteItem).data('Na', data.Na),
    $(lembreteItem).data('K', data.K),
    $(lembreteItem).data('Cl', data.Cl),
    $(lembreteItem).data('Co2', data.Co2),
    $(lembreteItem).data('Bun', data.Bun),
    $(lembreteItem).data('Creat', data.Creat),
    $(lembreteItem).data('Gluc', data.Gluc),
    $(lembreteItem).data('wbc', data.wbc),
    $(lembreteItem).data('HgB', data.HgB),
    $(lembreteItem).data('Hct', data.Hct),
    $(lembreteItem).data('Plt', data.Plt)

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
                idLembrete: $(lembreteItem).data('idLembrete'),
                Na: $(lembreteItem).data('Na'),
                K: $(lembreteItem).data('K'),
                Cl: $(lembreteItem).data('Cl'),
                Co2: $(lembreteItem).data('Co2'),
                Bun: $(lembreteItem).data('Bun'),
                Creat: $(lembreteItem).data('Creat'),
                Gluc: $(lembreteItem).data('Gluc'),
                wbc: $(lembreteItem).data('wbc'),
                HgB: $(lembreteItem).data('HgB'),
                Hct: $(lembreteItem).data('Hct'),
                Plt: $(lembreteItem).data('Plt')
        }});

    };

    lembretesLista.appendChild(lembreteItem);

  },

  //Função responsável pela criacão de ítem no feed
  /*
  iconeFeed: function(info, i){
    var template = document.createElement('div')

    template.innerHTML = 
    '<ons-list-titem id="item' + i + '">'
    + '<div class="rigth">' + info.foto +
    '</div>' +
    '<div class="center">' + info.news +
    '</div>' +
    '<div class="left">' + info.nome +
    '</div>'
    + '</ons-list-item>'

    document.querySelector("#item" + i).onclick = function(info){

      dadosPacienteAtual.idAtualPaciente = info.id

      document.querySelector('#pacienteNav').pushPage('html/perfilpaciente.html');
    }
  },
  */

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

  dataDados: new String,

  showPulseirasDisponiveis: function(index) {
    var template = document.createElement('div');

    template.innerHTML = '<ons-list-item modifier="tappable" id=item' + index + ' onclick="hidePopover(' + $('#dialog') + ')"> <div> Pulseira de id '
      + medApp.services.pulseirasDisponiveis[index] + '</div> </ons-list-item>';
    
    var pulseiraItem = template.firstChild;
    var pulseiraLista = document.querySelector('#lista-pulseiras');

    pulseiraLista.appendChild(pulseiraItem); 

    document.querySelector("#item" + index).onclick = function() {

      if(medApp.services.pulseiraAtual.length != 0){
 
         $.ajax({
           url: 'http://julianop.com.br:3000/api/pulseira',
           type: 'PUT',
           success: function(data) {
             console.log(data);
           },
           error: function(data) {
             console.log(data);
            },
           data: {
             idPulseira: medApp.services.pulseiraAtual.idPulseira,
             disponivel: 1,
             idPaciente: medApp.services.getIdPaciente()
           }
         });
 
      }
      
      medApp.services.pulseiraAtual = medApp.services.pulseirasDisponiveis[index];
      medApp.services.hidePopover(medApp.services.dial);

      //Esvazia a lista de pulseiras
      $('#lista-pulseiras').empty();

      ons.notification.alert("Pulseira " + medApp.services.pulseiraAtual + " selecionada.");

      //Adiciona a pulseira e o paciente na base de dados.
      $.ajax({
        url: 'http://julianop.com.br:3000/api/pulseira',
        type: 'PUT',
        success: function(data) {
          console.log("Pulseira " + medApp.services.pulseiraAtual + " selecionada!");
          console.log(data);
        },
        error: function(data) {
          console.log(data);
        },
        data: {
          idPulseira: medApp.services.pulseiraAtual,
          disponivel: 0,
          idPaciente: medApp.services.getIdPaciente()
        }
      });
              
    };

  },

  showPulseirasDisponiveis2: function(index) {
    var template = document.createElement('div');

    template.innerHTML = '<ons-list-item modifier="nodivider"> <div> Pulseira #'
      + medApp.services.pulseirasDisponiveis[index] + '</div> </ons-list-item>';
    
    var pulseiraItem = template.firstChild;
    var pulseiraLista = document.querySelector('#lista-pulseiras');

    pulseiraLista.appendChild(pulseiraItem);
  },

  getDia: function(index) {

    var dia = new Date();
    dia.setDate(dia.getDate() - index);
    return dia;

  },

  idPacVec: new Array,

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

  listAddGroup: function(data, status, list) {
    
    // Template de paciente na lista de adicionar ou editar grupo
    var template = document.createElement('div');
    template.innerHTML =
      '<ons-list-item>' +
          '<div class="left">' +
            '<img class="list__item__thumbnail" src="http://www.clker.com/cliparts/A/Y/O/m/o/N/placeholder-md.png">' +
          '</div>' +
          '<div class="center">' +
            data.nomePaciente +
          '</div>' +
          '<div class="right">' +
            '<ons-input type="checkbox" class="checkbox-opt"></ons-input>' +
          '</div>' +
        '</ons-list-item>'

    var pacienteGroupListItem = template.firstChild;
    jQuery.data(pacienteGroupListItem.querySelector('.checkbox-opt'), 'idPaciente', data.idPaciente);

    if(status == 'checked') {

      pacienteGroupListItem.querySelector('.checkbox-opt').checked = true;

    } else if (status == 'unchecked') {

      pacienteGroupListItem.querySelector('.checkbox-opt').checked = false;

    }

    if(list == 'add') {

      var novoGrupoLista = document.querySelector('#novo-grupo-pacientes');

    } else if(list == 'edit') {

      var novoGrupoLista = document.querySelector('#editar-grupo-pacientes');

    }
    
    novoGrupoLista.appendChild(pacienteGroupListItem);

  },

  listGroups: function(data) {
    
    // Template de cada grupo linkado ao médico atual
    var template = document.createElement('div');
    template.innerHTML = 
      '<ons-list-item class="paciente-lista grupo" modifier="longdivider" tappable>' +
        '<div class="center">' +
          '<ons-row class="paciente-header">' +
            '<span class="list__item__title">' + data.nomeGrupo + '</span>' +
          '</ons-row>' +
          '<ons-row>' +
            /* TODO: Adicionar número de membros de um grupo ao request 
            '<ons-col class="paciente-detalhes">' +
              '<ons-icon icon="md-accounts" class="list__item__icon"></ons-icon>' +
              '<span class="list__item__subtitle">' + data.tamanhoGrupo + '</span>' +
            '</ons-col>' +
            */
            '<ons-col class="paciente-detalhes">' +
              '<ons-icon icon="user-md" class="list__item__icon"></ons-icon>' +
              '<span class="list__item__subtitle">' + data.medicoResp + '</span>' +
            '</ons-col>' +
          '</ons-row>' +
        '</div>' +
        '<div class="right">' +
          '<ons-icon icon="md-delete" class="list__item__icon delete"></ons-icon>' +
        '</div>' +
      '</ons-list-item>';

    var groupListItem = template.firstChild;
    $(groupListItem).data('idGrupoPac', data.idGrupoPac);
    var grupoLista = document.querySelector('#lista-grupos');

    // Funcionalidade de ver grupo
    groupListItem.querySelector('.center').onclick = function() {

      medApp.services.setGrupoAtual($(groupListItem).data('idGrupoPac'));
      document.querySelector('#pacienteNav').pushPage('html/vergrupo.html', {data: { nomeGrupo: data.nomeGrupo } });

    };

    // Funcionalidade de excluír grupo 
    groupListItem.querySelector('.right').onclick = function() {
        
      ons.notification.confirm({message: 'Tem certeza?'})
      .then( function(confirm){

        if(confirm) {
            $.ajax({
              url: 'http://julianop.com.br:3000/api/grupoPacientes',
              type: 'DELETE',
              data: { 
                idGrupoPac: $(groupListItem).data('idGrupoPac')
              }
            })
            .done(function() {
              
              grupoLista.removeChild(groupListItem);

            });
          };

      });
        
    };

    grupoLista.appendChild(groupListItem);

  },

  idGrupoAtual: -1,  // ID do grupo atual selecionado

  // Função que seta o ID atual do grupo
  setGrupoAtual: function(novaId) {

    this.idGrupoAtual = novaId;

  },

  // Função que retorna o ID do grupo atual
  getGrupoAtual: function() {
    
    return this.idGrupoAtual;

  },

  // Função que limpa o ID do grupo
  deleteGrupoAtual: function() {

    this.idGrupoAtual = -1;

  }

};
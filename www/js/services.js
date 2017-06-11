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
    hospital: '',
    foto: ''
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
    this.dadosPacienteAtual.foto = dados.foto;
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
    this.dadosPacienteAtual.foto = '';
  },

  dadosEstaticos: {
    calorias: new Array,
    passos: new Array,
    pulso: new Array,
    degraus: new Array
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
                                          hospital: data.hospital,
                                          foto: data.img
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

    // Template de lembrete
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
  
  iconeFeed: function(info, i){
    var template = document.createElement('div');

    if(info.type === "Paciente"){

      timeStamp = info.patient.timestamp[6] + info.patient.timestamp[7] + "/" 
      + info.patient.timestamp[9] + info.patient.timestamp[10] + " " 
      + info.patient.timestamp[12] + info.patient.timestamp[13]
      + ":" + info.patient.timestamp[15] + info.patient.timestamp[16];

      template.innerHTML = 
      '<ons-list-item id="item'+ i '" class="paciente-lista " modifier="longdivider" tappable>' +
        '<div class="left">' +
          '<img class="list__item__thumbnail" src="'+ info.foto + '">' +
        '</div>' +
        '<div class="center">'+
          '<ons-row class="paciente-header">'+
            '<ons-col>' +
              '<span class="list__item__title nome">' + info.nome + '</span>' +
            '</ons-col>' +
          '</ons-row>' +
          '<ons-row>' +
            '<ons-col class="paciente-detalhes">' +
              '<ons-icon icon="md-calendar" class="list__item__icon"></ons-icon>' +
              '<span class="list__item__subtitle">' + timeStamp + '</span>' +
            '</ons-col>' +
            '<ons-col class="paciente-detalhes">' +
              '<ons-icon icon="md-plaster" class="list__item__icon"></ons-icon>' +
              '<span class="list__item__subtitle">' + 'Paciente novo Adicionado, clique para conhecer o perfil' + '</span>' +  
            '</ons-col>' +
          '</ons-row>' +
          '<ons-row>' +
        '</div>' +
      '</ons-list-item>';
      /*'<ons-list-item id="item' + i + '">'
      + '<div class="rigth">' + info.foto +
      '</div>' +
      '<div class="center">' + info.nome +
      '</div>' +
      '<div class="left">' + timeStamp +
      '</div>'
      + '</ons-list-item>';*/

    } else {

      timeStamp = info.reminder.timestamp[6] + info.reminder.timestamp[7] + "/" 
      + info.reminder.timestamp[9] + info.reminder.timestamp[10] + " " 
      + info.reminder.timestamp[12] + info.reminder.timestamp[13]
      + ":" + info.reminder.timestamp[15] + info.reminder.timestamp[16];

      template.innerHTML = 
      '<ons-list-item id="item'+ i '" class="paciente-lista " modifier="longdivider" tappable>' +
        '<div class="center">'+
          '<ons-row class="paciente-header">'+
            '<ons-col>' +
              '<span class="list__item__title nome">' + info.reminder + '</span>' +
            '</ons-col>' +
          '</ons-row>' +
          '<ons-row>' +
            '<ons-col class="paciente-detalhes">' +
              '<ons-icon icon="md-calendar" class="list__item__icon"></ons-icon>' +
              '<span class="list__item__subtitle">' + timeStamp + '</span>' +
            '</ons-col>' +
            '<ons-col class="paciente-detalhes">' +
              '<ons-icon icon="md-plaster" class="list__item__icon"></ons-icon>' +
              '<span class="list__item__subtitle">' + 'Dados Alterados: K - ' + info.reminder.K + ' Na - ' + info.reminder.Na + 
              ' Cl - ' + info.reminder.Cl+ ' Co2 - '+ info.reminder.Co2+ ' Bun - '+info.reminder.Bun+ ' Great - '+ info.reminder.Great
              + ' Gluc - ' +info.reminder.Gluc+ ' Wcb - '+info.reminder.wcb+' HgB - '+info.reminder.HgB+ ' Hct - ' +info.reminder.Hct+
              ' Plt - '+info.reminder.Plt+ + '</span>' +  
            '</ons-col>' +
          '</ons-row>' +
          '<ons-row>' +
        '</div>' +
      '</ons-list-item>';
      /*'<ons-list-titem id="item' + i + '">'
      + '<div>' + info.reminder.mensagem +
      '</div>'
      '<div>' + timeStamp + '</div>' +
      '<div> Dados alterados: K - ' + info.reminder.K + ' Na - ' + info.reminder.Na + 
      ' Cl - ' + info.reminder.Cl+ ' Co2 - '+ info.reminder.Co2+ ' Bun - '+info.reminder.Bun+ ' Great - '+ info.reminder.Great
      + ' Gluc - ' +info.reminder.Gluc+ ' Wcb - '+info.reminder.wcb+' HgB - '+info.reminder.HgB+ ' Hct - ' +info.reminder.Hct+
      ' Plt - '+info.reminder.Plt+ '</div>'
      + '</ons-list-item>';*/

    }

    var feedItem = template.firstChild;
    var listaFeed = document.querySelector('#feed-lista');

    feedItem.querySelector('.center').onclick = function(info){

      if(info.type === "Paciente"){

      this.dadosPacienteAtual.idAtualPaciente = info.patient.idtable1;

    } else {

      this.dadosPacienteAtual.idAtualPaciente = info.reminder.idPaciente;
    
    }

      document.querySelector('#pacienteNav').pushPage('html/perfilpaciente.html');
    }

    listaFeed.appendChild(feedItem);
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

  showHospitais: function(index, objeto){
    var template = document.createElement('div');

    template.innerHTML = '<ons-list-item modifier="nodivider" id=hospital'+ index +'> <div class="left">' + objeto[index].nome + 
    '<div class="rigth"> <ons-radio-button><ons-radio-button> </div> </ons-list-item>';

    var hospitalItem = template.firstChild;
    var hospitalLista = document.querySelector('#lista-hospital');

    hospitalLista.appendChild(hospitalItem);

    document.querySelector('#hospital' + index).onclick = function(objeto){
      
      $.post("http://julianop.com.br:3000/api/compartilhamento/paciente",{
        
        idPaciente: this.idAtualPaciente,
        idHospitalOrigem: objeto[index].idHospital,
        idMedicoDestino: this.idAtualMedico

      })
      .done(function(data){
        ons.notification.alert('Paciente indexado ao hospital:' + objeto[index].nome +'.');
      })
      .fail(function(){
        ons.notification.alert('Paciente não indexado ao hospital por erro interno.');
      }); //TODO --> VER SE VAI DAR CERTO COM ESSA CHAMADA

      this.hidePopover(this.dial);
    
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

  // Lista os grupos de pacientes
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

  },

  // Lista as equipes a que um médico pertence
  listEquipe: function(equipe) {
    
    // Template de cada equipe que o médico atual pertence
    var template = document.createElement('div');
    template.innerHTML = 
      '<ons-list-item>' +
        '<ons-list-item>' +
          '<ons-icon icon="hospital-o"></ons-icon>' +
           equipe.nomeEquipe +
        '</ons-list-item>' +
        '<ons-list-item class="ver-equipe" tappable>' +
        '<ons-icon icon="md-accounts"></ons-icon>' +
        'Gerenciar Equipe' +
        '</ons-list-item>' +
      '</ons-list-item>';

    var equipeListItem = template.firstChild;
    $(equipeListItem).data('idEquipe', equipe.idEquipe);
    var equipeLista = document.querySelector('#lista-equipe');

    // Funcionalidade de gerenciar equipe
    equipeListItem.querySelector('.ver-equipe').onclick = function() {

      medApp.services.setEquipeAtual($(equipeListItem).data('idEquipe'));
      document.querySelector('#medicoNav').pushPage('html/configequipe.html', {data: { nomeEquipe: equipe.nomeEquipe } });

    };

    equipeLista.appendChild(equipeListItem);

  },

  idEquipeAtual: -1,  // ID da equipe atual selecionada

  // Função que seta o ID atual da equipe
  setEquipeAtual: function(novaId) {

    this.idEquipeAtual = novaId;

  },

  // Função que retorna o ID da equipe atual
  getEquipeAtual: function() {
    
    return this.idEquipeAtual;

  },

  // Função que limpa o ID da equipe
  deleteEquipeAtual: function() {

    this.idEquipeAtual = -1;

  },

  // Função para conseguir as imagens
  getBase64Image: function(img) {

    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");

  },

  // Função para verificar as imagens
  verificarFoto: function(img) {

    // Verifica existe foto, se não, retorna o placeholder
    if(img == null) {

      return 'http://www.clker.com/cliparts/A/Y/O/m/o/N/placeholder-md.png';

    } else {

      return ('data:image/jpeg;base64,' + img);

    };

  },

  // Lista os membros de uma equipe visualizada
  listMembrosEquipe: function(membro) {
    
    // Verifica se o médico possui foto
    membro.foto = medApp.services.verificarFoto(membro.foto);

    // Template de cada médico membro da equipe
    var template = document.createElement('div');
    template.innerHTML = 
      '<ons-list-item>' +
        '<div class="left">' +
          //'<img class="list__item__thumbnail" src="http://www.clker.com/cliparts/A/Y/O/m/o/N/placeholder-md.png">' +
          '<img class="list__item__thumbnail" src="'+ membro.foto + '">' + 
        '</div>' +
        '<div class="center">' +
          '<span class="list__item__title">' +
          membro.nome +
          '</span>' +
            '<ons-row>' +
              '<ons-icon icon="md-email" class="list__item__icon">' +
                '<span class="list__item__subtitle">'+
                membro.email +
                '</span>' +
              '</ons-icon>' +
            '</ons-row>' +
            '<ons-row>' +
              '<ons-icon icon="md-phone" class="list__item__icon">' +
                '<span class="list__item__subtitle">' +
                membro.telefone +
                '</span>' +
              '</ons-icon>' +
            '</ons-row>' +
        '</div>' +
        '<div class="right">' +
          '<ons-icon icon="md-close" size="24px" class="list__item__icon"></ons-icon>' +
        '</div>' +
      '</ons-list-item>';

    var membroListItem = template.firstChild;
    $(membroListItem).data('idMedico', membro.idMedico);
    var membroLista = document.querySelector('#membros-equipe');

    // Funcionalidade de remover médico da equipe
    membroListItem.querySelector('.right').onclick = function() {
        
        ons.notification.confirm({message: 'Deseja remover este médico da equipe?'})
        .then( function(confirm){

          if(confirm) {
            $.ajax({
              url: 'http://julianop.com.br:3000/api/hospitais/relacoes',
              type: 'DELETE',
              data: {
                idHospital: medApp.services.getEquipeAtual(),
                idMedico: $(membroListItem).data('idMedico')
              }
            })
            .done(function(data) {

              ons.notification.alert(data);
              membroLista.removeChild(membroListItem);

            });
          };

        });
        
    };

    membroLista.appendChild(membroListItem);

  },

  // Retorna uma lista com os membros de uma equipe para o compartilhamento
  getMembrosEquipe: function(equipe) {

    $.get('http://julianop.com.br:3000/api/hospitais/' + equipe.idHospital + '/medicos')
        .done(function(membros) {

          console.log(equipe);
          if(membros[0].hasOwnProperty('idMedico')) {

            // Lista vazia dos membros da equipe atual
            var listaMembros = [];

            for (var j = 0, membrosLen = membros.length; j < membrosLen; j++) {

              if (membros[j].idMedico != medApp.services.getIdMedico()) {
                  listaMembros.push({ nomeMembro: membros[j].nome,
                                      idMembro: membros[j].idMedico });
              };

            };

            console.log(listaMembros);

            // LISTA CONTEM OS MEMBROS DA EQUIPE ATUAL AQUI
            medApp.services.listEquipesCompart({ nomeEquipe: equipe.nome,
                                                 idEquipe: equipe.idHospital,
                                                 membros: listaMembros});

      };
                
    });

  },

  // Lista equipes do médico para compartilhamento de pacientes
  listEquipesCompart: function(equipe) {
    console.log(equipe);
    var template = document.createElement('div');
    template.innerHTML = 
      '<ons-list-header>' +
          '<ons-icon icon="hospital-o"></ons-icon>' +
          equipe.nomeEquipe +
      '</ons-list-header>';

    var equipesCompartItem = template.firstChild;
    var compartLista = document.querySelector('#lista-compartilhar');

    for (var i = 0, len = equipe.membros.length; i < len; i++) {

      equipesCompartItem.appendChild(medApp.services.listMembrosCompart(equipe.membros[i], equipe.idEquipe));

    };

    compartLista.appendChild(equipesCompartItem);

  },

  // Retorna membros da equipe selecionada para compartilhamento de pacientes
  listMembrosCompart: function(membro, equipe) {

    var template = document.createElement('div');
    template.innerHTML = 
      '<ons-list-item tappable>' +
        '<ons-icon icon="user-md"></ons-icon>' +
          membro.nomeMembro +
      '</ons-list-item>';

    var membroCompartItem = template.firstChild;
    $(membroCompartItem).data('idMedico', membro.idMembro);
    $(membroCompartItem).data('equipe', equipe);
    membroCompartItem.onclick = function() {

      ons.notification.confirm({message: 'Deseja compartilhar com esse médico?'})
        .then( function(confirm){

          if(confirm) {
            $.post("http://julianop.com.br:3000/api/compartilhamento/paciente",
              {
              idPaciente: medApp.services.getIdPaciente(),
              idHospitalOrigem: $(membroCompartItem).data('equipe'),
              idMedicoDestino: $(membroCompartItem).data('idMedico'),
              })
            .done(function (data){

              ons.notification.alert(data);

            });
          };

        });

    };

    return membroCompartItem;

  },

  // Função para preencher a tela de compartilhamento de pacientes caso esteja vazia
  compartVazio: function() { 

    var template = document.createElement('div');
    template.innerHTML = 
      '<ons-list-item>' +
        'O compartilhamento de pacientes é feito por meio de suas equipes.' +
        '<br>' +
        'Crie uma equipe a partir da página de perfil médico!' +
      '</ons-list-item>';

    var msgVazio = template.firstChild;
    var compartLista = document.querySelector('#lista-compartilhar');

    compartLista.appendChild(msgVazio);

  }

};



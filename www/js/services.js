// Funções utilizadas dentro do App

medApp.services = {

  idAtualMedico: -1,  // ID do médico no login atual

  nomeMedicoAtual: null
  , 
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

  // Função que seta o nome do médico atual a cada login
  setNomeMedico: function(nome) {

    this.nomeMedicoAtual = nome;

  },

  // Função que retorna o nome do médico do login atual
  getNomeMedico: function() {
    
    return this.nomeMedicoAtual;

  },

  // Função que limpa o nome do médico no logoff
  deleteNomeMedico: function() {

    this.nomeMedicoAtual = null;

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
    degraus: new Array,
    tamanho: new Array
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
          '<img class="list__item__thumbnail" style="border: inset 1px rgba(0, 0, 0, 0.3);" src="'+ data.img + '">' +
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

    // Mostra o perfil do paciente selecionado a partir da lista de pacientes ou grupos
    if ((lista === 'pacientes') || (lista === 'grupo')) {

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

    // Muda para a aba de pacientes e mostra o perfil do paciente selecionado a partir de equipes
    } else if (lista === 'equipes'){

      pacienteItem.onclick = function() {

        ons.notification.confirm({message: 'Deseja adicionar esse paciente à sua lista para monitorá-lo?'})
        .then(function(confirm){
          
          $.post('http://julianop.com.br:3000/api/compartilhamento/paciente',
          {
            idPaciente: $(pacienteItem).data('idPaciente'),
            idEquipeOrigem: medApp.services.getEquipeAtual(),
            idMedicoDestino: medApp.services.getIdMedico()
          })
          .done(function(data) {
            
            ons.notification.alert(data);

          });
        /*document.querySelector('#tab-inicial').setActiveTab(1, {options: {animation: 'slide'}});
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
        */
        });

      };

    };

    if (lista === 'pacientes') {

      var pacientesLista = document.querySelector('#lista-pacientes');

    } else if (lista === 'grupo') {

      var pacientesLista = document.querySelector('#lista-pacientes-grupo');

    } else if (lista === 'equipes') {

      var pacientesLista = document.querySelector('#lista-pac-equipe');

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

  iconeFeed: function(info){

    var template = document.createElement('div');

    if(info.type === "Paciente"){

      var foto = "data:image/jpeg;base64, " + info.patient.foto;

      var data =  info.patient.timestamp.substring(8,10) + '/' +
                  info.patient.timestamp.substring(5,7) + '/' +
                  info.patient.timestamp.substring(0,4);

      var hora = info.patient.timestamp.substring(11,16);

      template.innerHTML =
      '<ons-list-item class="paciente-lista " modifier="longdivider"' +
        // Atributo tappable apenas se o paciente estiver ativo
        ((info.patient.ativo == 1) ? 'tappable>' : '>') +
        '<div class="left">' +
          '<img class="list__item__thumbnail" style="border: inset 1px rgba(0, 0, 0, 0.3);" src="'+ foto + '">' +
        '</div>' +
        '<div class="center">'+
          '<ons-row class="paciente-header">'+
              '<span class="list__item__title nome">' + info.patient.nomePaciente + '</span>' +
          '</ons-row>' +
          '<ons-row class="paciente-detalhes">' +
            '<ons-col>' +
              '<ons-icon icon="md-info-outline" class="list__item__icon"></ons-icon>' +
              '<span class="list__item__subtitle">' + 
              ((info.patient.ativo == 1) ? 'Novo paciente adicionado' : 'Paciente teve alta') + 
              '</span>' +
            '</ons-col>' +
          '</ons-row>' +
            '<ons-row class="paciente-detalhes">' +
            '<ons-col>' +
              '<ons-icon icon="md-calendar" class="list__item__icon"></ons-icon>' +
              '<span class="list__item__subtitle">' + data + ' ' + hora + '</span>' +
            '</ons-col>' +
          '</ons-row>' +
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

      //console.log(JSON.stringify(info));
      var data =  info.reminder.timestamp.substring(8,10) + '/' +
                  info.reminder.timestamp.substring(5,7) + '/' +
                  info.reminder.timestamp.substring(0,4);

      var hora = info.reminder.timestamp.substring(11,16);

      template.innerHTML =
      '<ons-list-item class="paciente-lista " modifier="longdivider" tappable>' +
        '<div class="left">' +
          '<ons-icon icon="md-assignment" class="list__item__thumbnail" size="40px"></ons-icon>' +
        '</div>' +
        '<div class="center">'+
          '<ons-row class="paciente-header">'+
            '<ons-col>' +
              '<span class="list__item__title nome">' + 'Notificação de lembrete' + '</span>' +
            '</ons-col>' +
          '</ons-row>' +
          '<ons-row>' +
            '<ons-row class="paciente-detalhes">' +
              '<ons-col>' +
                '<ons-icon icon="md-plaster" class="list__item__icon"></ons-icon>' +
                '<span class="list__item__title nome">' + info.reminder.nomePaciente + '</span>' +
              '</ons-col>' +
            '</ons-row>' +
            '<ons-row class="paciente-detalhes">' +
              '<ons-col>' +
                '<ons-icon icon="md-calendar" class="list__item__icon"></ons-icon>' +
                '<span class="list__item__subtitle">' + data + ' ' + hora + '</span>' +
              '</ons-col>' +
            '</ons-row>' +
            '</ons-row>' +
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

    //feedItem.querySelector('.center').onclick = function(info) {

      if(info.type === "Paciente"){

        if (info.patient.ativo == 1) {

          // Funcionalidade de mostrar paciente adicionado se ele ainda estiver ativo
          feedItem.querySelector('.center').onclick = function() {

            var dataPacienteFormatoBarra = info.patient.dataDeNascimento.substring(8,10) + '/' +
                                           info.patient.dataDeNascimento.substring(5,7) + '/' +
                                           info.patient.dataDeNascimento.substring(0,4);

            var dataPacienteFormatoTraco = info.patient.dataDeNascimento.substring(0,10);

            document.querySelector('#tab-inicial').setActiveTab( 1 , {options: {animation: 'slide'}});
            medApp.services.setPacienteAtual( { idPaciente: info.patient.idtable1,
                                                nome: info.patient.nomePaciente,
                                                dataIntFormatoTraco: dataPacienteFormatoTraco,
                                                dataIntFormatoBarra: dataPacienteFormatoBarra,
                                                causa: info.patient.causaDaInternacao,
                                                medicoResp: info.patient.medicoResposavel,
                                                hospital: info.patient.telefone,
                                                foto: "data:image/jpeg;base64, " + info.patient.foto
                                              });
            document.querySelector('#pacienteNav').pushPage('html/perfilpaciente.html');

          };
        };

      } else if(info.type === "Lembrete") {

        // Funcionalidade de mostrar lembrete adicionado
        feedItem.querySelector('.center').onclick = function() {

          var dataLembreteFormatoBarra = info.reminder.data.substring(8,10) + '/' +
                                         info.reminder.data.substring(5,7) + '/' +
                                         info.reminder.data.substring(0,4);

          medApp.services.dial = document.getElementById('dialog-lembrete').id;
          document.querySelector('#paciente-feed-lembrete').innerHTML = info.reminder.nomePaciente.substring(0,15);
          document.querySelector('#data-feed-lembrete').innerHTML = dataLembreteFormatoBarra;
          document.querySelector('#medico-feed-lembrete').innerHTML = info.reminder.nome;
          $('#texto-feed-lembrete').val(info.reminder.mensagem);
          document.querySelector('#NA-feed').innerHTML = info.reminder.Na;
          document.querySelector('#K-feed').innerHTML = info.reminder.K;
          document.querySelector('#Cl-feed').innerHTML = info.reminder.CI;
          document.querySelector('#Co2-feed').innerHTML = info.reminder.Co2;
          document.querySelector('#Bun-feed').innerHTML = info.reminder.Bun;
          document.querySelector('#Creat-feed').innerHTML = info.reminder.Creat;
          document.querySelector('#Gluc-feed').innerHTML = info.reminder.Gluc;
          document.querySelector('#wbc-feed').innerHTML = info.reminder.wcb;
          document.querySelector('#HgB-feed').innerHTML = info.reminder.HgB;
          document.querySelector('#Hct-feed').innerHTML = info.reminder.Hct;
          document.querySelector('#Plt-feed').innerHTML = info.reminder.Plt;

          medApp.services.showPopover(medApp.services.dial);

        };

      };

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

  /*
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
  */

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
            '<img class="list__item__thumbnail" style="border: inset 1px rgba(0, 0, 0, 0.3);" src="img/defaultprofile.svg">' +
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
      '<ons-list-item class="equipes-lista" modifier="longdivider">' +
      '<div class="left">' +
        '<ons-icon icon="hospital-o" class="list__item__thumbnail" size="40px"></ons-icon>' +
      '</div>' +
      '<div class="center">' +
        '<ons-row class="equipes-header">' +
          '<span class="list__item__title nome">' +
          equipe.nomeEquipe +
          '</span>' +
        '</ons-row>' +
        '<ons-list-item class="pac-equipe" tappable>' +
          '<ons-icon icon="md-accounts" class="list__item__icon"></ons-icon>' +
          'Ver Pacientes' +
        '</ons-list-item>' +
        '<ons-list-item class="ver-equipe" tappable>' +
          '<ons-icon icon="ion-medkit" class="list__item__icon"></ons-icon>' +
          'Gerenciar Equipe' +
        '</ons-list-item>' +
      '</div>' +
    '</ons-list-item>';

    var equipeListItem = template.firstChild;
    $(equipeListItem).data('idEquipe', equipe.idEquipe);
    var equipeLista = document.querySelector('#lista-equipe');

    // Funcionalidade de ver pacientes da equipe
    equipeListItem.querySelector('.pac-equipe').onclick = function() {

      medApp.services.setEquipeAtual($(equipeListItem).data('idEquipe'));
      document.querySelector('#medicoNav').pushPage('html/pacientesequipe.html');

    };

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
    canvas.width = 100;
    canvas.height = 100;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/jpg");
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
          '<img class="list__item__thumbnail" style="border: inset 1px rgba(0, 0, 0, 0.3);" src="'+ membro.foto + '">' +
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
              url: 'http://julianop.com.br:3000/api/equipe/relacoes/medicos',
              type: 'DELETE',
              data: {
                idEquipe: medApp.services.getEquipeAtual(),
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

          if(membros[0].hasOwnProperty('idMedico')) {

            // Lista vazia dos membros da equipe atual
            var listaMembros = [];

            for (var j = 0, membrosLen = membros.length; j < membrosLen; j++) {

              if (membros[j].idMedico != medApp.services.getIdMedico()) {
                  listaMembros.push({ nomeMembro: membros[j].nome,
                                      idMembro: membros[j].idMedico });
              };

            };

            medApp.services.listEquipesCompart({ nomeEquipe: equipe.nome,
                                                 idEquipe: equipe.idHospital,
                                                 membros: listaMembros});

      };

    });

  },

  // Lista equipes do médico para compartilhamento de pacientes
  listEquipesCompart: function(equipe) {

    var template = document.createElement('div');
    template.innerHTML =
      '<ons-list-item class="equipes-lista" modifier="longdivider" tappable>' +
        '<div class="left">' +
          '<ons-icon icon="hospital-o" class="list__item__thumbnail" size="30px"></ons-icon>' +
        '</div>' +
        '<div class="center">' +
          '<ons-row class="equipes-header">' +
            '<span class="list__item__title nome">' +
            equipe.nome
            '</span>' +
          '</ons-row>' +
        '</div>' +
        '<div class="right">' +
          '<ons-icon icon="md-chevron-right" size="20px"></ons-icon>' +
        '</div>' +
      '</ons-list-item>';

    var equipesCompartItem = template.firstChild;
    $(equipesCompartItem).data('idEquipe', equipe.idEquipe);
    var compartLista = document.querySelector('#lista-compartilhar');

    equipesCompartItem.onclick = function() {

      ons.notification.confirm({message: 'Deseja compartilhar com essa equipe?'})
        .then( function(confirm){

          if(confirm) {
            $.post("http://julianop.com.br:3000/api/equipe/relacoes/pacientes",
              {
              idPaciente: medApp.services.getIdPaciente(),
              idEquipe: $(equipesCompartItem).data('idEquipe'),
              })
            .done(function (data){

              ons.notification.alert(data);

            });
          };

        });

    };

    compartLista.appendChild(equipesCompartItem);

  },

  /* Retorna membros da equipe selecionada para compartilhamento de pacientes
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
  */

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

  },

  isUpdatedPaciente: 0,

  isUpdatedGrupo: 0,

  changeUpdatePaciente: function() {

    this.isUpdatedPaciente = !(this.isUpdatedPaciente);

  },

  changeUpdateGrupo: function() {

    this.isUpdatedGrupo = !(this.isUpdatedGrupo);

  },

  editPacientesEquipe: function(paciente) {

    var template = document.createElement('div');
    template.innerHTML =
      '<ons-list-item>' +
        '<div class="center">' +
          '<span class="list__item__title">' +
          paciente.nome +
          '</span>' +
        '</div>' +
        '<div class="right">' +
          '<ons-icon icon="md-delete" size="24px" class="list__item__icon"></ons-icon>' +
        '</div>' +
      '</ons-list-item>';

    var pacEditEquipe = template.firstChild;
    $(pacEditEquipe).data('idPaciente', paciente.idPaciente);
    var editEquipeLista = document.querySelector('#delete-pac-equipe');

    // Funcionalidade de remover paciente da equipe
    pacEditEquipe.querySelector('.right').onclick = function() {

        ons.notification.confirm({message: 'Deseja remover este paciente da equipe?'})
        .then( function(confirm){

          if(confirm) {
            $.ajax({
              url: 'http://julianop.com.br:3000/api/equipe/relacoes/pacientes',
              type: 'DELETE',
              data: {
                idEquipe: medApp.services.getEquipeAtual(),
                idPaciente: $(pacEditEquipe).data('idPaciente')
              }
            })
            .done(function(data) {

              ons.notification.alert(data);
              editEquipeLista.removeChild(pacEditEquipe);

            });
          };

        });

    };

    editEquipeLista.appendChild(pacEditEquipe);

  },

  // Lista as pulseiras disponíveis no dialog das telas de perfil ou configuração do paciente
  listPulseiras: function(pulseira, tela) {

    var template = document.createElement('div');
    template.innerHTML = 
      '<ons-list-item tappable>' +
        '<div>Pulseira de id ' + pulseira.idPulseira + '</div>' +
      '</ons-list-item>';

    var pulseiraDisp = template.firstChild;
    $(pulseiraDisp).data('idPulseira', pulseira.idPulseira);

    // Verifica a tela que o diálogo é chamado
    if(tela == 'perfil') {
      var pulseiraDispLista = document.querySelector('#lista-pulseiras-perfil');
    } else if(tela == 'config') {
      var pulseiraDispLista = document.querySelector('#lista-pulseiras-config');
    }

    pulseiraDisp.onclick = function() {

      if(medApp.services.pulseiraAtual != -1){

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
             idPulseira: medApp.services.pulseiraAtual,
             disponivel: 1,
             idPaciente: medApp.services.getIdPaciente()
           }
         });

      };

      //ons.notification.alert("Pulseira " + medApp.services.pulseiraAtual + " selecionada.");
      //Adiciona a pulseira para o paciente na base de dados.
      $.ajax({
        url: 'http://julianop.com.br:3000/api/pulseira',
        type: 'PUT',
        success: function(data) {
          console.log(data);
          medApp.services.pulseiraAtual = $(pulseiraDisp).data('idPulseira');
          document.querySelector('#pulseira-pac').innerHTML = $(pulseiraDisp).data('idPulseira');
        },
        error: function(data) {
          //console.log(data);
        },
        data: {
          idPulseira: $(pulseiraDisp).data('idPulseira'),
          disponivel: 0,
          idPaciente: medApp.services.getIdPaciente()
        }
      });

      medApp.services.hidePopover(medApp.services.dial);
      ons.notification.alert("Pulseira alterada!");

    };

    pulseiraDispLista.appendChild(pulseiraDisp);

  },

  // Lista as pulseiras em uso ou disponíveis na aba de configurações
  listStatusPulseiras: function(pulseira) {

    var template = document.createElement('div');
    template.innerHTML = 
      '<ons-list-item>' +
        '<div class="center">' +
          'Pulseira #' + pulseira.idPulseira +
        '</div>' +
        '<div class="right">' +
          '<ons-switch class="pulseiraalocada"' + (!(pulseira.disponivel) ? 'checked' : 'disabled') + '></ons-switch>' +
        '</div>' +
      '</ons-list-item>';

    var pulseiraStatus = template.firstChild;
    $(pulseiraStatus).data('idPulseira', pulseira.idPulseira);
    $(pulseiraStatus).data('idPaciente', pulseira.pacienteAtual);
    var pulseiraStatusLista = document.querySelector('#statuspulseiras');

    // Função para desalocar uma pulseira ativa via configurações
    pulseiraStatus.querySelector('.pulseiraalocada').onclick = function(e) {

      if (!e.value){
        ons.notification.confirm({message: 'Deseja desalocar essa pulseira?'})
          .then( function(confirm){

            if(confirm) {

              pulseiraStatus.querySelector('.pulseiraalocada').disabled = true;
              $.ajax({
                url: 'http://julianop.com.br:3000/api/pulseira',
                type: 'PUT',
                success: function(data) {
                  ons.notification.alert("Pulseira desalocada!");
                  pulseiraStatus.querySelector('.pulseiraalocada').checked = false;
                },
                error: function(data) {
                  ons.notification.alert("Erro ao desalocar pulseira!");
                  pulseiraStatus.querySelector('.pulseiraalocada').checked = true;
                  pulseiraStatus.querySelector('.pulseiraalocada').disabled = false;
                },
                data: {
                  idPulseira: $(pulseiraStatus).data('idPulseira'),
                  disponivel: 1,
                  idPaciente: $(pulseiraStatus).data('idPaciente')
                }
              });

            } else if (!confirm) {

              pulseiraStatus.querySelector('.pulseiraalocada').checked = true;

            };

          });

      };
      
    };

    pulseiraStatusLista.appendChild(pulseiraStatus);

  }

};



/******************************************************************
 * Controllers do App, chamados em cada inicialização das páginas *
 ******************************************************************/

medApp.controllers = {

  ////////////////////////////////////
  // Controlador da página de Login //
  ///////////////////////////////////
  login: function(page) {
    
    // Chama página de cadastro
    page.querySelector('#cadastro-button').onclick = function() {
      document.querySelector('#loginNav').pushPage('cadastro.html');
    };

    // Tenta realizar o login
    page.querySelector('#login-button').onclick = function() {

    var modal = document.querySelector('ons-modal');
    modal.show();
    var emailLogin = $('#email-login').val();
    var senhaLogin = $('#senha-login').val();

    if( emailLogin === 'a' && senhaLogin === 'a' ){

      medApp.services.setIdMedico(20);
      document.querySelector('#loginNav').pushPage('inicial.html');

    };

    $.post('https://pibicfitbit.herokuapp.com/api/login/',
      {
        email: emailLogin,
        senha: senhaLogin
      })
        .done(function(data) {

          modal.hide();

          if ( data.hasOwnProperty('idMedico') ) {

            $('#email-login').val("");
            $('#senha-login').val("");
            medApp.services.setIdMedico(data.idMedico);
            console.log('O id atual é: '+ medApp.services.getIdMedico());
            document.querySelector('#loginNav').pushPage('inicial.html');

          } else {

            $('#email-login').val("");
            $('#senha-login').val("");
            alert("Senha ou E-mail errados, por favor refaça o Log-In");

          };
      });

    };

  },

  ///////////////////////////////////////
  // Controlador da página de Cadastro //
  //////////////////////////////////////

  cadastro: function(page) {  

    // Registra novo médico caso as senhas sejam válidas
    page.querySelector('#cadastrar-med').onclick = function() {
    
      var pass = $('#senha-cadastro').val();
      var confirm = $('#senha-confirm').val();
      var inputs = page.getElementsByTagName('input');
      if(medApp.services.checkEmptyField(inputs)){

        alert("Preencha todos os campos!");

      };

      if ( pass === confirm ) {

        $.post('https://pibicfitbit.herokuapp.com/api/medico/',
        {
          nomeMedico: $('#nome-cadastro').val(),
          especialidade: $('#esp-cadastro').val(),
          CRM: $('#crm-cadastro').val(),
          telefone: $('#telefone-cadastro').val(),
          email: $('#email-cadastro').val(),
          senha: $('#senha-cadastro').val()
        })
          .done(function(data) {
            alert(data);
            document.querySelector('#loginNav').popPage();
          });

      } else {

        alert("As senhas não conferem!");

      };

    };
  
  },

  /////////////////////////////////////
  // Controlador do perfil do Médico //
  ////////////////////////////////////

  medico: function(page) {

    // Atualiza os dados do perfil do médico a partir do servidor
    page.addEventListener('show', function(event) {

      $.get('https://pibicfitbit.herokuapp.com/api/medico/busca/ID/' + medApp.services.idAtual)
      .done(function(data) {
        page.querySelector('#nome-perfil').innerHTML = data[0].nome;
        page.querySelector('#crm-perfil').innerHTML = data[0].CRM;
        page.querySelector('#esp-perfil').innerHTML = data[0].especialidade;
        page.querySelector('#tel-perfil').innerHTML = data[0].telefone;
      });

      page.querySelector('#email-perfil').innerHTML = Math.random();

    });

    // Chama a página de editar perfil do médico
    page.querySelector('#edit-med').onclick = function() {

      document.querySelector('#medicoNav').pushPage('editarmedico.html', 
        {data: {nome: page.querySelector('.profile-name').innerHTML, 
                CRM: page.querySelector('#crm-perfil').innerHTML,
                esp: page.querySelector('#esp-perfil').innerHTML,
                tel: page.querySelector('#tel-perfil').innerHTML
                }});

    };

    // Realiza o logoff
    page.querySelector('#logoff').onclick = function() {

      medApp.services.deleteIdMedico();
      document.querySelector('#loginNav').resetToPage( 'login.html', {options: {animation: 'fade'}});
    };

    // Realiza a atualização do perfil com pull
    var pullHook = document.getElementById('pull-hook');

    pullHook.addEventListener('changestate', function(event) {
      var message = '';

      switch (event.state) {
        case 'initial':
          message = 'Pull to refresh';
          break;
        case 'preaction':
          message = 'Release';
          break;
        case 'action':
          message = 'Loading...';
          break;
      }

      pullHook.innerHTML = message;
    });

    pullHook.onAction = function(done) {
      setTimeout(done, 1000);
      page.querySelector('#email-perfil').innerHTML = Math.random();
    };

  },

  ///////////////////////////////////////
  // Controlador da lista de Pacientes //
  //////////////////////////////////////

  pacientes: function(page) {

    // Chama o perfil com os dados do paciente selecionado 
    var pacientes = page.querySelectorAll(".paciente-lista");

    for (var i = 0, len = pacientes.length; i < len; i++) {
      pacientes[i].onclick = function() {
        var nomePaciente = this.querySelector(".list__item__title").innerHTML;
        var causaPaciente = this.querySelector(".causa").innerHTML;
        var imgPaciente = this.querySelector('.list__item__thumbnail').src;
        document.querySelector('#pacienteNav').pushPage('html/perfilpaciente.html', 
          {data: {nome: nomePaciente, 
                  causa: causaPaciente,
                  img: imgPaciente }});
      };
    };
      
  },

  ///////////////////////////////////////
  // Controlador do perfil do Paciente //
  //////////////////////////////////////

  perfilpaciente: function(page) {

    // Preenche os dados do perfil do paciente atual
    page.querySelector('ons-toolbar .center').innerHTML = 'Perfil' + ' ' + page.data.nome;
    page.querySelector('.profile-name').innerHTML = page.data.nome;
    page.querySelector('#causa-perfil').innerHTML = page.data.causa;
    page.querySelector('.profile-image').src = page.data.img;

    // Chama página de dados de saúde
    page.querySelector('#graf1').onclick = function() {

      document.querySelector('#pacienteNav').pushPage('html/dadossaude.html');
    };

    // Chama página de edição de dados do paciente
    page.querySelector('#pacienteeditar').onclick = function() {

      document.querySelector('#pacienteNav').pushPage('html/editarpaciente.html');
    };

  },

  /////////////////////////////////////
  // Controlador de edição do Médico //
  /////////////////////////////////////

  editarmedico: function(page) {

    // Dados atuais para verificar alteração 
    var dadosEdit = {

      nomeEdit: page.data.nome,
      crmEdit: page.data.CRM,
      espEdit: page.data.esp, 
      telEdit: page.data.tel

    };

    $('#nome-medico').val(dadosEdit.nomeEdit);
    $('#crm-medico').val(dadosEdit.crmEdit);
    $('#esp-medico').val(dadosEdit.espEdit);
    $('#tel-medico').val(dadosEdit.telEdit);

    // Botão salvar altera os dados no servidor se houve mudanças 
    page.querySelector('#salvar-med').onclick = function() {

      var novoEdit = {

        nomeEdit: $('#nome-medico').val(),
        crmEdit: $('#crm-medico').val(),
        espEdit: $('#esp-medico').val(), 
        telEdit: $('#tel-medico').val()

      };

      if (medApp.services.checkEdit(novoEdit, dadosEdit)) {

        console.log('nao editou');

      } else {

        console.log('editou');
      };

      document.querySelector('#medicoNav').popPage();
    };

  },

  ///////////////////////////////////////
  // Controlador de edição de Paciente //
  ///////////////////////////////////////

  editarpaciente: function(page) {


  } 

};
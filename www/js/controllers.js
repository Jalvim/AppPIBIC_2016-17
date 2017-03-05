/******************************************************************
 * Controllers do App, chamados em cada inicialização das páginas *
 ******************************************************************/

medApp.controllers = {

  ////////////////////////////////////
  // Controlador da página de Login //
  ///////////////////////////////////
  login: function(page) {

    // Botão de mostrar o texto da senha
    page.querySelector('#olho').ontouchstart = function() {
      $('#senha-login').attr('type', 'text');
    };
    page.querySelector('#olho').ontouchend = function() {
      $('#senha-login').attr('type', 'password');
    };

    // Chama página de cadastro
    page.querySelector('#cadastro-button').onclick = function() {
      document.querySelector('#loginNav').pushPage('html/cadastromedico.html');
    };

    // Tenta realizar o login
    page.querySelector('#login-button').onclick = function() {

    var modal = page.querySelector('ons-modal');
    modal.show();
    var emailLogin = $('#email-login').val();
    var senhaLogin = $('#senha-login').val();

    if( emailLogin === 'a' && senhaLogin === 'a' ){

      medApp.services.setIdMedico(20);
      document.querySelector('#loginNav').pushPage('inicial.html');

    };

    $.post('http://julianop.com.br:3000/api/login/',
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
            document.querySelector('#loginNav').pushPage('inicial.html');

          } else {

            $('#email-login').val("");
            $('#senha-login').val("");
            ons.notification.alert("Senha ou E-mail errados, por favor refaça o Log-In");

          };
      });

    };

  },

  ///////////////////////////////////////
  // Controlador da página de Cadastro //
  //////////////////////////////////////

  cadastromedico: function(page) {

    // Máscaras dos campos de dados
    $('#telefone-cadastro').mask('(00) 00000-0000');
    $('#crm-cadastro').mask('0#');
    $('#cpf-cadastro').mask('000.000.000-00', {reverse: true});

    // Registra novo médico caso as senhas sejam válidas
    page.querySelector('#cadastrar-med').onclick = function() {

      var modal = page.querySelector('ons-modal');
      modal.show();
      var pass = $('#senha-cadastro').val();
      var confirm = $('#senha-confirm').val();
      var email=$('#email-cadastro').val();
      var CPF=$('#cpf-cadastro').val().toString();

      var inputs = page.getElementsByTagName('input');

      // Checa se há algum input vazio
      if(medApp.services.checkEmptyField(inputs)){
        modal.hide();
        ons.notification.alert("Preencha todos os campos!");

      } else if(pass !== confirm) {

        modal.hide();
        ons.notification.alert("As senhas não conferem!");

      } else if(pass.length < 6){

        modal.hide();
        ons.notification.alert("Senha pequena");

      }

      //confere o CPF
      else if(CPF.length<11){

        modal.hide();
        ons.notification.alert("CPF inválido");

      }


      //confere se é possível a existencia do e-mail
      else if(email.indexOf('@')===-1 || email.indexOf('.')===-1||Math.abs(email.indexOf('@')- email.indexOf('.')<3)){

        modal.hide();
        ons.notification.alert("E-mail invalido");

      }


       else {

        $.post('https://pibicfitbit.herokuapp.com/api/medico/',
        {
          nomeMedico: $('#nome-cadastro').val(),
          CPF: $('#cpf-cadastro').val(),
          especialidade: $('#esp-cadastro').val(),
          CRM: $('#crm-cadastro').val(),
          telefone: $('#telefone-cadastro').val(),
          email: $('#email-cadastro').val(),
          senha: $('#senha-cadastro').val()
        })
          .done(function(data) {
            modal.hide();
            ons.notification.alert(data);
            document.querySelector('#loginNav').popPage();
          });

      };
    };
  },

  //////////////////////////////////////////////////////
  // Controlador do perfil do Médico no modo paisagem //
  //////////////////////////////////////////////////////

  medico: function(page) { 

    // Atualiza os dados do perfil do médico a partir do servidor
    page.addEventListener('show', function(event) {

      $.get('https://pibicfitbit.herokuapp.com/api/medico/busca/ID/' + medApp.services.getIdMedico())
      .done(function(data) {
        page.querySelector('#nome-perfil').innerHTML = data[0].nome;
        page.querySelector('#crm-perfil').innerHTML = data[0].CRM;
        page.querySelector('#esp-perfil').innerHTML = data[0].especialidade;
        page.querySelector('#tel-perfil').innerHTML = data[0].telefone;
        page.querySelector('#email-perfil').innerHTML = data[0].email;
      });

    });

    //Funcionalização da responsividade de tela Retrato/Paisagem.
    window.fn = {};

    window.fn.open = function() {
      var menu = document.getElementById('mainperfil');
      menu.open();
    };

    window.fn.load = function(page) {
      var content = document.getElementById('secundperfil');
      var menu = document.getElementById('mainperfil');
      content.load(page)
        .then(menu.close.bind(menu));
    };

    // Chama a página de editar perfil do médico
    page.querySelector('#edit-med').onclick = function() {

      document.querySelector('#medicoNav').pushPage('editarmedico.html');

    };

    // Realiza o logoff
    page.querySelector('#logoff').onclick = function() {

      ons.notification.confirm({message: 'Tem certeza?'})
        .then( function(confirm){

          if(confirm) {
            medApp.services.deleteIdMedico();
            document.querySelector('#loginNav').resetToPage( 'login.html', {options: {animation: 'fade'}});
          };

        });

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
    };


  },

  ///////////////////////////////////////
  // Controlador da lista de Pacientes //
  //////////////////////////////////////

  pacientes: function(page) {

    // Chama o perfil com os dados do paciente selecionado
    //ANTES: var pacientes = page.querySelectorAll(".paciente-lista"); //TODO --> TESTE DE CONEXÂO
    page.addEventListener('show', function(event) { 
      var pacientesInfo;

      $.get('https://pibicfitbit.herokuapp.com/api/paciente/geral/idMedico/' + medApp.services.getIdMedico())
        .done(function(data) {
          pacientesInfo = data;
          console.log(pacientesInfo.length);

          for (var i = 0, len = pacientesInfo.length; i < len; i++) {

        medApp.services.createPaciente( { statusPaciente: 'ativo',
                                        img: 'http://www.clker.com/cliparts/A/Y/O/m/o/N/placeholder-md.png',
                                        nomePaciente: pacientesInfo[i].nomePaciente,
                                        batimentos: '60',
                                        dataPaciente: pacientesInfo[i].dataDeNascimento,
                                        causaPaciente: pacientesInfo[i].causaDaInternacao,
                                        medicoResp: pacientesInfo[i].numeroDoProntuario,
                                        hospital: pacientesInfo[i].telefone 
                                      });
          };
        });

      /*
      pacientes[i].onclick = function() {
        //Funcionalização da função com acesso do servidor, comentarizado --> ANTERIOR
        //ANTES: var nomePaciente = this.querySelector(".list__item__title").innerHTML;
        //ANTES: var causaPaciente = this.querySelector(".causa").innerHTML;
        //ANTES: var imgPaciente = this.querySelector('.list__item__thumbnail').src;
        medApp.services.setIdPaciente(pacientesInfo.numeroDoProntuario);
        document.querySelector('#pacienteNav').pushPage('html/perfilpaciente.html',
          {data: {nome: pacientesInfo[i].nome, // ANTES: nomePaciente,
                  causa: pacientesInfo[i].causa, // ANTES: causaPaciente,
                  img: pacientesInfo[i].foto }});// ANTES: imgPaciente }});
      };
      pacientes[i].querySelector('.list__item__icon').onclick = function() {
        this.setAttribute("icon", "star");
      };
      */
      //};

    });

    // Página para adicionar um novo paciente à lista
    page.querySelector('#buscar-pac').onclick = function() {

      document.querySelector('#pacienteNav').pushPage('html/buscarpaciente.html');

    };

    // Página para adicionar um novo grupo de pacientes
    page.querySelector('#add-grupo').onclick = function() {

      document.querySelector('#pacienteNav').pushPage('html/addgrupo.html');

    };

    // GAMBIARRA PARA O TESTE DE UX !!!RETIRAR!!!

    page.querySelector('#pac1').onclick = function() {

      document.querySelector('#pacienteNav').pushPage('html/perfilpaciente.html');

    };

    page.querySelector('#pac2').onclick = function() {

      document.querySelector('#pacienteNav').pushPage('html/perfilpaciente.html');

    };

    page.querySelector('#pac3').onclick = function() {

      document.querySelector('#pacienteNav').pushPage('html/perfilpaciente.html');

    };

    /*
    page.querySelector('#pac-teste').onclick = function() {

      medApp.services.createPaciente( { statusPaciente: 'ativo',
                                        img: 'http://www.clker.com/cliparts/A/Y/O/m/o/N/placeholder-md.png',
                                        nomePaciente: 'Cara',
                                        batimentos: '60',
                                        dataPaciente: '01/03/2017',
                                        causaPaciente: 'Doença',
                                        medicoResp: 'Médicão',
                                        hospital: 'Hospital/2º andar' 
                                      });

    };
    */
  },

  ///////////////////////////////////////
  // Controlador do perfil do Paciente //
  //////////////////////////////////////

  perfilpaciente: function(page) {

    // Preenche os dados do perfil do paciente atual
    /*page.querySelector('ons-toolbar .center').innerHTML = 'Perfil' + ' ' + page.data.nome;
    page.querySelector('.profile-name').innerHTML = page.data.nome;
    page.querySelector('#causa-perfil').innerHTML = page.data.causa;
    page.querySelector('.profile-image').src = page.data.img;
    //medApp.services.setIdPaciente($('#')); //TODO --> ver se prontuário é retornado e faz papel de ID.
    */

    // Chama página de edição de dados do paciente
    page.querySelector('#pacienteeditar').onclick = function() {

      document.querySelector('#pacienteNav').pushPage('html/editarpaciente.html');

    };

    //Chama página de lembretes do Paciente
    page.querySelector('#lemb').onclick = function() {

      document.querySelector('#pacienteNav').pushPage('html/lembretes.html');

    }


    // Chama página de dados de saúde
    page.querySelector('#graf').onclick = function() {

      document.querySelector('#pacienteNav').pushPage('html/dadossaude.html');

    };

    page.querySelector('#config-pac').onclick = function() {

      document.querySelector('#pacienteNav').pushPage('html/configpaciente.html');

    };

  },

  /////////////////////////////////////
  ///Controle dos Gráficos de saúde ///
  /////////////////////////////////////

  dadossaude1: function(page) {

        //Interface gráfica interativa dos dados estáticos de saúde.

        //Request feito quando a interface gráfica carregar para obter os dados estáticos do paciente.
        /*$('#dadossaude1').ready( function() { //POR HORA COMENTADO POIS A API AINDA N ESTÁ COMPLETA!
          $.get('https://pibicfitbit.herokuapp.com/api/paciente/health/static/' + medApp.services.idAtualPaciente + '/calorias')
            .done(function(data) {
              medApp.services.setDadosEstaticos.calorias(data.calorias);
              console.log('Os dados retornados são: ' + medApp.services.getDadosEstaticos.calorias());
          });
        }); */


        var chrt1 = document.getElementById("myChart1");
        var data1 = {
          labels: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
          datasets: [
            {
              label: "Calorias perdidas ao longo da semana",
              fill: false,
              lineTension: 0.1,
              backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: "rgba(75,192,192,1)",
              pointBackgroundColor: "#fff",
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "rgba(75,192,192,1)",
              pointHoverBorderColor: "rgba(220,220,220,1)",
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: [65, 59, 80, 81, 56, 55, 40], // medApp.services.getDadosEstaticos().calorias;
              spanGaps: false,
            }
          ]
        }; //TODO implementação da comunicação de dados com o servidor.
        var myChart1 = new Chart(chrt1, {
          type: 'line',
          data: data1,
          options: {
            responsive: true
          }
        });

        // Fim da interface gráfica 1. TODO --> Implementar outros gráficos.

  },

  dadossaude2: function(page) {

        //Interface gráfica interativa dos dados estáticos de saúde.

        //Request
        /*$('#dadossaude1').ready( function() { //POR HORA COMENTADO POIS A API AINDA N ESTÁ COMPLETA!
        $.get('https://pibicfitbit.herokuapp.com/api/paciente/health/static/' + medApp.services.idAtualPaciente + '/passos')
          .done(function(data) {
            medApp.services.setDadosEstaticos.passos(data.passos);
            console.log('Os dados retornados são: ' + medApp.services.getDadosEstaticos.passos());
          });
        });*/

        var chrt2 = document.getElementById("myChart2");
        var data2 = {
          labels: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
            datasets: [
              {
                label: "Número de passos dados na última semana",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [65, 59, 80, 81, 56, 55, 40], //medApp.services.getDadosEstaticos().passos
                spanGaps: false,
              }
            ]
          }; //TODO implementação da comunicação de dados com o servidor.
          var myChart2 = new Chart(chrt2, {
            type: 'polarArea',
            data: data2,
            options: {
              responsive: true
            }
          });

          // Fim da interface gráfica 2. TODO --> Implementar outros gráficos.

  },

  dadossaude3: function(page) {

        //Interface gráfica interativa dos dados estáticos de saúde.

        //Request
        /*$('#dadossaude1').ready( function() { //POR HORA COMENTADO POIS A API AINDA N ESTÁ COMPLETA!
          $.get('https://pibicfitbit.herokuapp.com/api/paciente/health/static/' + medApp.services.idAtualPaciente)
            .done(function(data) {
              medApp.services.setDadosEstaticos.pulso(data.pulso);
              console.log('Os dados retornados são: ' + medApp.services.getDadosEstaticos.pulso());
          });
        });*/

        var chrt3 = document.getElementById("myChart3");
        var data3 = {
          labels: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
          datasets: [
            {
              label: "Pulsação média durante a última semana",
              backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              borderWidth: 5,
              hoverBackgroundColor: "rgba(255, 99, 132, 0.4)",
              hoverBorderColor: "rgba:(255, 99, 132, 1)",
              data: [10, 20, 30, 40, 50, 50, 40] // medApp.services.getDadosEstaticos().
            }
          ]
        }; //TODO implementação da comunicação de dados com o servidor.
        var myChart3 = new Chart(chrt3, {
          type: 'bar',
          data: data3,
          options: {
            responsive: true
          }
        });

        // Fim da interface gráfica 3. TODO --> Implementar outros gráficos.

  },

  dadossaude4: function(page) {

        //Interface gráfica interativa dos dados estáticos de saúde.

        //Request
        /*$('#dadossaude1').ready( function() { //POR HORA COMENTADO POIS A API AINDA N ESTÁ COMPLETA!
          $.get('https://pibicfitbit.herokuapp.com/api/paciente/health/static/' + medApp.services.idAtualPaciente + '/degraus')
            .done(function(data) {
              medApp.services.setDadosEstaticos.degrus(data.degraus);
              console.log('Os dados retornados são: ' + medApp.services.getDadosEstaticos.degraus());
          });
        });*/

        var chrt4 = document.getElementById("myChart4");
        var data4 = {
          labels: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
          datasets: [
            {
              label: "Últimas medições de Oximetria do Paciente",
              backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              borderWidth: 5,
              hoverBackgroundColor: "rgba(255, 99, 132, 0.4)",
              hoverBorderColor: "rgba:(255, 99, 132, 1)",
              data: [10, 20, 30, 40, 50, 50, 40] // medApp.services.getDadosEstaticos().
            }
          ]
        }; //TODO implementação da comunicação de dados com o servidor.
        var myChart4 = new Chart(chrt4, {
          type: 'radar',
          data: data4,
          options: {
            responsive: true
          }
        });

        // Fim da interface gráfica 4. TODO --> Implementar outros gráficos.

  },

  /////////////////////////////////////
  // Controlador de edição do Médico //
  /////////////////////////////////////

  editarmedico: function(page) {

    // Máscaras dos campos de dados
    $('#tel-medico').mask('(00) 00000-0000');
    $('#crm-medico').mask('0#');
    $('#cpf-medico').mask('000.000.000-00', {reverse: true});

    // Pega dados do servidor para edição (CPF não é mostrado no perfil, logo não existe seu innerHTML)
    page.addEventListener('show', function(event) {

      $.get('https://pibicfitbit.herokuapp.com/api/medico/busca/ID/' + medApp.services.idAtualMedico)
      .done(function(data) {
        $('#nome-medico').val(data[0].nome);
        $('#crm-medico').val(data[0].CRM);
        $('#esp-medico').val(data[0].especialidade);
        $('#tel-medico').val(data[0].telefone);
        $('#email-medico').val(data[0].email);
        $('#cpf-medico').val(data[0].CPF);
      });

    });

    // Verifica se algum input do formulário foi mudado
    $("#medico-edit-form :input").change(function() {

      $("#medico-edit-form").data("changed",true);

    });

    // Botão salvar altera os dados no servidor se houve mudanças
    page.querySelector('#salvar-med').onclick = function() {

      if ($("#medico-edit-form").data("changed")) {

        var dadosEdit = {

          nome: $('#nome-medico').val(),
          crm: $('#crm-medico').val(),
          esp: $('#esp-medico').val(),
          tel: $('#tel-medico').val(),
          email: $('#email-medico').val(),
          cpf: $('#cpf-medico').val(),
          idMedico: medApp.services.idAtualMedico

        };

        $.ajax({
          url: 'https://pibicfitbit.herokuapp.com/api/medico',
          type: 'PUT',
          data: { idMedico: dadosEdit.idMedico,
                  nomeMedico: dadosEdit.nome,
                  especialidade: dadosEdit.esp,
                  CRM: dadosEdit.crm,
                  telefone: dadosEdit.tel,
                  CPF: dadosEdit.cpf
                }
        });

        document.querySelector('#medicoNav').popPage();

      } else {

        document.querySelector('#medicoNav').popPage();

      };

    };

  },

  ///////////////////////////////////////
  // Controlador de edição de Paciente //
  ///////////////////////////////////////

  editarpaciente: function(page) {

    // Máscaras dos campos de dados
    $('#tel-pac').mask('(00) 00000-0000');

    // Dados atuais para verificar alteração
    var dadosEdit = {

      nomeEdit: page.data.nome,
      causaEdit: page.data.causa,
      prontEdit: page.data.pront,
      fotoEdit: page.data.img,
      idadeEdit: page.data.idade,
	    emailEdit: page.data.email,
	    ativoEdit: page.data.ativo // TODO --> PEDIR PARA IMPLEMENTAÇÃO DE CAMPOS NA API.

    };

    $('#nome-pac').val(dadosEdit.nomeEdit);
    $('#causa-pac').val(dadosEdit.causaEdit);
    $('#obs-pac').val(dadosEdit.obsEdit);
    $('#prontuario-pac').val(dadosEdit.prontEdit);
 	$('#idade-pac').val(dadosEdit.idadeEdit);
  	$('#email-pac').val(dadosEdit.emailEdit);
  	$('#pacienteAtivo').val(dadosEdit.ativoEdit);

    // Botão salvar altera os dados no servidor se houve mudanças
    page.querySelector('#editar-pac').onclick = function() {

      /*var novoEdit = {
        nomeEdit: $('#nome-pac').val(),
        causaEdit: $('#causa-pac').val(),
        obsEdit: $('#obs-pac').val(),
        prontEdit: $('#pront-pac').val(),
        idadeEdit: $('#idade-pac').val(),
   		  emailEdit: $('#email-pac').val(),
      };
      if (medApp.services.checkEdit(novoEdit, dadosEdit)) {
        console.log('nao editou');
      } else {
        console.log('editou');
      };*/

      //Request PUT responsável pela edição de pacientes diretamente na base de dados.

      $.ajax({
          url: 'https://pibicfitbit.herokuapp.com/api/paciente/geral/' + medApp.services.getIdPaciente(),
          type: 'PUT',
          success: function(data) {
            console.log(data);
          },
          error: function() {
            ons.notification.alert("Alterações não efetuadas");
          },
          data: {
            nomePacienteNovo: dadosEdit.nomeEdit,
            novoProntuario: dadosEdit.prontEdit,
            novaFoto: dadosEdit.fotoEdit,
            novaCausa: dadosEdit.causaEdit,
            novaData: dadosEdit.idadeEdit
          }
      });

      document.querySelector('#pacienteNav').popPage();
    };

    document.querySelector('#pacienteAtivo').onclick = function() {
      dadosEdit.ativoEdit = !(dadosEdit.ativoEdit);
    };

  },

    ///////////////////////////////////////
    // Controlador do feed de notícias   //
    ///////////////////////////////////////

  feed: function(page) {
      // Realiza a atualização do feed com pull --> TODO: funcionalidade.
        var pullHook = document.getElementById('pull-hook-feed');
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
        };

      //Implementação de gráfico aparente no feed.
      var ctx = document.getElementById("myChart");
      var dados = {
        labels: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
        datasets: [
          {
            label: "Degraus 'subidos' durante a última semana",
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderWidth: 5,
            hoverBackgroundColor: "rgba(255, 99, 132, 0.4)",
            hoverBorderColor: "rgba:(255, 99, 132, 1)",
            data: [10, 20, 30, 40, 50, 50, 40] // medApp.services.getDadosEstaticos().
          }
        ]
      };
      var myChart = new Chart(ctx, {
        type: 'radar',
        data: dados,
          options: {
            responsive: false
          }
      });
    },

    ///////////////////////////////////////
    // Controlador da lista de lembretes //
    ///////////////////////////////////////

  lembretes: function(page){

    page.querySelector('#add-lembrete').onclick = function() {

      document.querySelector('#pacienteNav').pushPage('html/addlembrete.html');

    };

    page.querySelector('#ver-lembrete').onclick = function() {

      document.querySelector('#pacienteNav').pushPage('html/verlembrete.html');

    };

  },

  ///////////////////////////////////////
  // Controlador da busca de pacientes //
  ///////////////////////////////////////

  buscarpaciente: function(page){

    page.querySelector('#add-pac').onclick = function() {

      document.querySelector('#pacienteNav').pushPage('html/addpaciente.html');

    };

  },

  /////////////////////////////////////////
  // Controlador do cadastro de paciente //
  /////////////////////////////////////////

  addpaciente: function(page) {

    medApp.services.resetPulseirasDisponiveis();

    //Método responsável por encontrar na base as pulseiras disponíveis.
    $.get('https://pibicfitbit.herokuapp.com/api/pulseira/disponivel')
      .done(function(data){
      	if(data.hasOwnProperty('idPulseiras')){
      		medApp.services.setPulseirasDisponiveis(data);
            console.log(medApp.services.pulseirasDisponiveis);
      	} else {
      		ons.notification.alert("Falha ao conectar com o servidor.");
      	}
      });

    page.querySelector('#pulseiraButton').onclick = function() {
      var showPopover = function(target) {
        document.getElementById('popover')
          .show(target);
      };

      document.querySelector('#nuloPulseira').onclick = function() {
      	medApp.services.setPulseiraAtual(-4); // -4 é o valor de flag, já q -1 é id default.
      };

      if(medApp.services.PulseiraAtual == -4){
      	return ;
      }

      for(var i = 0; i < medApp.services.pulseirasDisponiveis.length; i++){
        medApp.services.showPulseirasDisponiveis(i);

        document.querySelector("#item" + i).onclick = function() {

          var id;

          for(var j = 0; j < i; j++){
            if(i == medApp.services.pulseiraOnClick.in[i]){
              id = medApp.services.pulseiraOnClick.id;
              break;
            } else {
              ons.notification.alert("Erro ao preocessar pulseira");
              return;
            }
          } 
      
          medApp.services.setPulseiraAtual(id);

          ons.notification.alert("Pulseira " + medApp.services.pulseiraAtual + "selecionada.");

          document
            .getElementById('#popover')
            .hide();
        };
      }
    };

    var disp = true;

    if(medApp.services.pulseiraAtual == -4){
    	disp = false;
    }

    //Método que linka o paciente à pulseira na base de dados.

    $.ajax({
      url: 'https://pibicfitbit.herokuapp.com/api/pulseira/' + medApp.services.PulseiraAtual,
      type: 'PUT',
      success: function(data) {
        ons.notification.alert("Pulseira Selecionada com Sucesso!");
      },
      error: function() {
        ons.notification.alert("Pulseira não Cadastrada.");
      },
      data: { 
        disponivel: disp,
        idPaciente: medApp.services.idAtualPaciente
      }
    });

    page.querySelector('#cadastrar-pac').onclick = function() {

      var modal = page.querySelector('ons-modal');
      modal.show();

      var inputs = page.getElementsByTagName('input');

      // Checa se há algum input vazio
      if(medApp.services.checkEmptyField(inputs)) {

        modal.hide();
        ons.notification.alert("Preencha todos os campos!");

      } else {

        var nomeNovoPaciente = $('#nome-novo-pac').val();
        var medNovoPaciente = $('#med-novo-pac').val();
        var dataNovoPaciente = $('#data-novo-pac').val();
        var causaNovoPaciente = $('#causa-novo-pac').val();
        var localNovoPaciente = $('#local-novo-pac').val();

        $.post('https://pibicfitbit.herokuapp.com/api/paciente/geral',
        {
          nomePaciente: $('#nome-novo-pac').val(),
          causaDaInternacao: $('#causa-novo-pac').val(),
          numeroDoProntuario: 1111,
          telefone: 11111,
          foto: 01010101011111011111,
          dataDeNascimento: '1980-01-01',
          idMedico: medApp.services.getIdMedico(),
          idPulseira: 47
        })
          .done(function(data) {
            modal.hide();
            ons.notification.alert(data);
            document.querySelector('#pacienteNav').popPage();
          });

      };

    };

  },

  configuracoes: function(page) {

    page.querySelector('#manage-pulseiras').onclick = function() {

      document.querySelector('#configuracoesNav').pushPage('pulseiras.html');

    };

  },

  ////////////////////////////////////////
  // Controlador de adicionar lembrete //
  ///////////////////////////////////////

  addlembrete: function(page) {

    page.querySelector('#pub-lembrete').onclick = function() {

      document.querySelector('#pacienteNav').popPage();

    };

  }

};
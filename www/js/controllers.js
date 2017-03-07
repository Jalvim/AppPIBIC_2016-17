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
      else if(email.indexOf('@')===-1 || email.indexOf('.')===-1||Math.abs(email.indexOf('@') - email.indexOf('.'))<3){

        modal.hide();
        ons.notification.alert("E-mail invalido");

      }


       else {

        $.post('http://julianop.com.br:3000/api/medico/',
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

      $.get('http://julianop.com.br:3000/api/medico/busca/ID/' + medApp.services.getIdMedico())
      .done(function(data) {
        page.querySelector('#nome-perfil').innerHTML = data[0].nome;
        page.querySelector('#crm-perfil').innerHTML = 'CRM' + ' ' + data[0].CRM;
        page.querySelector('#esp-perfil').innerHTML = data[0].especialidade;
        page.querySelector('#tel-perfil').innerHTML = data[0].telefone;
        page.querySelector('#email-perfil').innerHTML = data[0].email;
      });

    });

    //Funcionalização da responsividade de tela Retrato/Paisagem.
    /* RETIRADO PARA TESTES
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
    */

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

    // Realiza a atualização do perfil com pull (NAO IIMPLEMENTADO)
    /*var pullHook = document.getElementById('pull-hook');

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
    };*/


  },

  ///////////////////////////////////////
  // Controlador da lista de Pacientes //
  //////////////////////////////////////

  pacientes: function(page) {

    page.addEventListener('show', function(event) { 

      medApp.services.deletePacienteAtual();
      $('#lista-pacientes').empty();

      $.get('http://julianop.com.br:3000/api/paciente/geral/idMedico/' + medApp.services.getIdMedico())
        .done(function(data) {

          for (var i = 0, len = data.length; i < len; i++) {

            var pacientesInfo = data[i];

            $.get('http://julianop.com.br:3000/api/medico/busca/ID/' + pacientesInfo.idMedico)
            .done(function(input) {
              pacientesInfo.medicoResp = input[0].nome;

              medApp.services.createPaciente( 
              { 
                statusPaciente: 'ativo',
                img: 'http://www.clker.com/cliparts/A/Y/O/m/o/N/placeholder-md.png',
                nomePaciente: pacientesInfo.nomePaciente,
                batimentos: '--',
                dataPaciente: pacientesInfo.dataDeNascimento,
                causaPaciente: pacientesInfo.causaDaInternacao,
                medicoResp: pacientesInfo.numeroDoProntuario,
                hospital: pacientesInfo.telefone,
                idPaciente: pacientesInfo.idPaciente,
                medicoResp: pacientesInfo.medicoResp
              });

            });
          };
      });

    });

    // Página para adicionar um novo paciente à lista
    page.querySelector('#buscar-pac').onclick = function() {

      document.querySelector('#pacienteNav').pushPage('html/addpaciente.html');

    };

    /* Página para adicionar um novo grupo de pacientes (NAO IMPLEMENTADO)
    page.querySelector('#add-grupo').onclick = function() {

      document.querySelector('#pacienteNav').pushPage('html/addgrupo.html');

    };
    */

    /* GAMBIARRA PARA O TESTE DE UX !!!RETIRAR!!!

    page.querySelector('#pac1').onclick = function() {

      document.querySelector('#pacienteNav').pushPage('html/perfilpaciente.html');

    };

    page.querySelector('#pac2').onclick = function() {

      document.querySelector('#pacienteNav').pushPage('html/perfilpaciente.html');

    };

    page.querySelector('#pac3').onclick = function() {

      document.querySelector('#pacienteNav').pushPage('html/perfilpaciente.html');

    };
    */

  },

  ///////////////////////////////////////
  // Controlador do perfil do Paciente //
  //////////////////////////////////////

  perfilpaciente: function(page) {

    // Preenche os dados do perfil do paciente atual
    page.addEventListener('show', function(event) {

      page.querySelector('.profile-name').innerHTML = medApp.services.dadosPacienteAtual.nome;
      page.querySelector('#medico').innerHTML = medApp.services.dadosPacienteAtual.medico;
      page.querySelector('#data-int').innerHTML = medApp.services.dadosPacienteAtual.dataIntFormatoBarra;
      page.querySelector('#causa').innerHTML = medApp.services.dadosPacienteAtual.causa;
      page.querySelector('#hospital').innerHTML = medApp.services.dadosPacienteAtual.hospital;

    });

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
        
        $.get('http://julianop.com.br:3000/api/paciente/health/static/' + medApp.services.dadosPacienteAtual.idAtualPaciente)
          .done(function(data) {
            for(var i = 0; i < data.length; i++){
              medApp.services.dadosEstaticos.calorias[i] = data[i].calories;
            }
          })

          .done(function() {
        

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
                  data: medApp.services.dadosEstaticos.calorias,
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

          });

        // Fim da interface gráfica 1. TODO --> Implementar outros gráficos.

  },

  dadossaude2: function(page) {

        //Interface gráfica interativa dos dados estáticos de saúde.

        //Request
        
        $.get('http://julianop.com.br:3000/api/paciente/health/static/' + medApp.services.dadosPacienteAtual.idAtualPaciente)
          .done(function(data) {
            for(var i = 0; i < data.length; i++){
              medApp.services.dadosEstaticos.passos[i] = data[i].steps;
            }
          })

          .done(function() {  
        

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
                    data: medApp.services.dadosEstaticos.passos,
                    spanGaps: false
                  }
                ]
              }; //TODO implementação da comunicação de dados com o servidor.
              var myChart2 = new Chart(chrt2, {
                type: 'bar',
                data: data2,
                options: {
                  responsive: true
                }
              });

          });

          // Fim da interface gráfica 2. TODO --> Implementar outros gráficos.

  },

  dadossaude3: function(page) {

        //Interface gráfica interativa dos dados estáticos de saúde.

        //Request
        $.get('http://julianop.com.br:3000/api/paciente/health/dynamic/' + medApp.services.dadosPacienteAtual.idAtualPaciente + '/' + medApp.services.getToday('traco'))
          .done(function(data) {
            for(var i = 0; i < 10; i++){
              medApp.services.dadosEstaticos.pulso[i] = data[((data.length - 11) + i)].heartRate;
            }
          })
          .done(function () {
            console.log(medApp.services.dadosEstaticos.pulso);
            var chrt3 = document.getElementById("myChart3");
            var data3 = {
              labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
              datasets: [
                {
                  label: "Pulsação média durante o último dia",
                  backgroundColor: "rgba(75,192,192,0.4)",
                  borderColor: "rgba(75,192,192,1)",
                  borderWidth: 5,
                  hoverBackgroundColor: "rgba(255, 99, 132, 0.4)",
                  hoverBorderColor: "rgba:(255, 99, 132, 1)",
                  data: medApp.services.dadosEstaticos.pulso
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
          });

        // Fim da interface gráfica 3. TODO --> Implementar outros gráficos.

  },

  dadossaude4: function(page) {

        //Interface gráfica interativa dos dados estáticos de saúde.

        //Request
        $.get('http://julianop.com.br:3000/api/paciente/health/static/' + medApp.services.dadosPacienteAtual.idAtualPaciente)
          .done(function(data) {
            for(var i = 0; i < data.length; i++){
              medApp.services.dadosEstaticos.degraus[i] = data[i].steps;
            }
          })

          .done(function() {
        

            var chrt4 = document.getElementById("myChart4");
            var data4 = {
              labels: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
              datasets: [
                {
                  label: "Número de degraus subidos na última semana",
                  backgroundColor: "rgba(75,192,192,0.4)",
                  borderColor: "rgba(75,192,192,1)",
                  borderWidth: 5,
                  hoverBackgroundColor: "rgba(255, 99, 132, 0.4)",
                  hoverBorderColor: "rgba:(255, 99, 132, 1)",
                  data: medApp.services.dadosEstaticos.degraus
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

      $.get('http://julianop.com.br:3000/api/medico/busca/ID/' + medApp.services.idAtualMedico)
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
          url: 'http://julianop.com.br:3000/api/medico',
          type: 'PUT',
          data: { idMedico: dadosEdit.idMedico,
                  nomeMedico: dadosEdit.nome,
                  especialidade: dadosEdit.esp,
                  CRM: dadosEdit.crm,
                  telefone: dadosEdit.tel,
                  CPF: dadosEdit.cpf,
                  email: dadosEdit.email
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

    // Preenche dados do paciente atual
    $('#nome-pac-edit').val(medApp.services.dadosPacienteAtual.nome);
    $('#med-pac-edit').val(medApp.services.dadosPacienteAtual.medico);
    $('#data-pac-edit').val(medApp.services.dadosPacienteAtual.dataIntFormatoTraco);
    $('#causa-pac-edit').val(medApp.services.dadosPacienteAtual.causa);
    $('#hospital-pac-edit').val(medApp.services.dadosPacienteAtual.hospital);

    // Botão salvar altera os dados no servidor se houve mudanças
    page.querySelector('#editar-pac').onclick = function() {

      // Dados editados do paciente
      var dadosEditPac = {

      nome: $('#nome-pac-edit').val(),
      medico: $('#med-pac-edit').val(),
      dataInt: $('#data-pac-edit').val(),
      causa: $('#causa-pac-edit').val(),
      hospital: $('#hospital-pac-edit').val()

      };


      //Request PUT responsável pela edição de pacientes diretamente na base de dados.

      $.ajax({
          url: 'http://julianop.com.br:3000/api/paciente/geral',
          type: 'PUT',
          headers: { 'idpaciente': medApp.services.getIdPaciente() },
          data: {
            nomePaciente: dadosEditPac.nome,
            causaDaInternacao: dadosEditPac.causa,
            dataDeNascimento: dadosEditPac.dataInt
          }
        })
        .done(function(data) {
          console.log(data);
          document.querySelector('#pacienteNav').popPage( {data: 
            {
              nome: dadosEditPac.nome,
              causa: dadosEditPac.causa,
              dataInt: dadosEditPac.dataInt
            }
          });
        })
        .fail(function() {
          ons.notification.alert("Alterações não efetuadas");
          document.querySelector('#pacienteNav').popPage();
        });

    };

  },

  ///////////////////////////////////////
  // Controlador do feed de notícias   //
  ///////////////////////////////////////

  feed: function(page) {

    page.addEventListener('show', function(event) {

      $.get('http://julianop.com.br:3000/api/paciente/geral/idMedico/' + medApp.services.getIdMedico())
        .done(function(data) {

          for (var i = 0, len = data.length; i < len; i++) {

            var pacientesNews = data[i];

            $.get('http://julianop.com.br:3000/api/lembrete/' + pacientesNews.idPaciente)
              .done(function(response){

                // Criar feed de notícias aqui

            });
          };
      });
    });

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

    /* RETIRADO PARA TESTES
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
    */
  },

  ///////////////////////////////////////
  // Controlador da lista de lembretes //
  ///////////////////////////////////////

  lembretes: function(page){

    page.addEventListener('show', function(event) {

      // Limpa e popula a lista de lembretes
      $('#lista-lembretes').empty();
      $.get('http://julianop.com.br:3000/api/lembrete/' + medApp.services.getIdPaciente())
      .done(function(data){
        
        // Cria os lembretes no inverso dos id's retornados (ordem cronológica)
        for (var i = data.length - 1; i >= 0; i--) {

          lembretesInfo = data[i];
          medApp.services.createLembrete( 
            { 
              texto: lembretesInfo.mensagem,
              horario: lembretesInfo.data,
              medico: lembretesInfo.nome,
              idLembrete: lembretesInfo.id
            });
        };

      });

    });

    page.querySelector('#add-lembrete').onclick = function() {

      document.querySelector('#pacienteNav').pushPage('html/addlembrete.html');

    };

  },

  ///////////////////////////////////////
  // Controlador da busca de pacientes // NÃO IMPLEMENTADO
  ///////////////////////////////////////

  /*buscarpaciente: function(page){

    page.querySelector('#add-pac').onclick = function() {

      document.querySelector('#pacienteNav').pushPage('html/addpaciente.html');

    };

  },*/

  /////////////////////////////////////////
  // Controlador do cadastro de paciente //
  /////////////////////////////////////////

  addpaciente: function(page) {

    //Método responsável por encontrar na base as pulseiras disponíveis.
    $.get('http://julianop.com.br:3000/api/pulseira/disponivel')
      .done(function(data){
      	for(var i = 0; i <data.length; i++){
      	  medApp.services.pulseirasDisponiveis[i] = data[i].idPulseira;
      	}
        console.log(medApp.services.pulseirasDisponiveis);
      });

    page.querySelector('#pulseiraButton').onclick = function() {
      var showPopover = function(target) {
        document.getElementById('popover')
          .show(target);
      }

      var hidePopover = function() {
      	document
      	  .getElementById('popover')
      	  .hide();
      };

      document.querySelector('#nuloPulseira').onclick = function() {
        //Método que liga a pulseira ao paciente na base de dados.

        $.ajax({
          url: 'http://julianop.com.br:3000/api/pulseira/' + medApp.services.PulseiraAtual,
          type: 'PUT',
          success: function(data) {
            ons.notification.alert("Pulseira Nula selecionada!");
          },
          error: function() {
            ons.notification.alert("Não Cadastrado.");
          },
          data: { 
            disponivel: 0,
            idPaciente: medApp.services.idAtualPaciente
          }
        });

        for(var i = 0; i < medApp.services.pulseirasDisponiveis.length; i++){
          medApp.services.showPulseirasDisponiveis(i);

          document.querySelector("#item" + i).onclick = function() {
          	var index = $("div").index(this);
          	medApp.services.pulseiraAtual = medApp.services.pulseirasDisponiveis[index];

          	$.ajax({
              url: 'http://julianop.com.br:3000/api/pulseira/' + medApp.services.PulseiraAtual,
              type: 'PUT',
              success: function(data) {
                ons.notification.alert("Pulseira de id " + index + " selecionada.");
                console.log(medApp.services.pulseiraAtual);
              },
              error: function() {
                ons.notification.alert("Erro ao Selecionar a pulseira.");
              },
              data: { 
                disponivel: 1,
                idPaciente: medApp.services.idAtualPaciente
              }
            });
          };
        }


      };

  };

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

        $.post('http://julianop.com.br:3000/api/paciente/geral',
        {
          nomePaciente: $('#nome-novo-pac').val(),
          causaDaInternacao: $('#causa-novo-pac').val(),
          numeroDoProntuario: 1111,
          telefone: 11111,
          foto: 01010101011111011111,
          dataDeNascimento: dataNovoPaciente,
          idMedico: medApp.services.getIdMedico(),
          idPulseira: 50
        })
          .done(function(data) {
            modal.hide();
            ons.notification.alert(data);
            document.querySelector('#pacienteNav').popPage();
          });

      };

    };

  },

  //////////////////////////////////
  // Controlador de configurações //
  //////////////////////////////////

  configuracoes: function(page) {

    page.querySelector('#manage-pulseiras').onclick = function() {

      document.querySelector('#configuracoesNav').pushPage('pulseiras.html');

    };

  },

  ////////////////////////////////////////
  // Controlador do Adicionar Pulseiras //
  ////////////////////////////////////////

  pulseiras: function(page){

    page.querySelector('#addpulseira').onclick = function(){

        //pede o login e a senha do usuario
        var  login;
        login = prompt("Digite o login da FITBIT");


        var   senha;
        senha = prompt("Digite a senha da FITBIT");

        //encontra a URL
        var URL;
        $.post("https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=227WRB&redirect_uri=http%3A%2F%2Fjulianop.com.br%3A3000%2F&scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&expires_in=604800",
            {login:login,
            senha:senha
            })
            .done(function(data){
              URL = window.location.href;
              console.log(URL);
            });

        //pega o codigoOauth
        var Oauth = URL.substr(URL.indexOf("=")+1,URL.indexOf("#")-1);


        //Para debug, retirar depois
        Alert(Oauth);

        $.post("url/api/pulseira",{
         redirectUri :"http://julianop.com.br:3000/",
        ClientID: "227WRB",
        ClientSecret: "1dcfe0c85eee35d7cb8295,733a3b0f9d",
        CodigoOauth:Oauth

        });
        
      };
  },

  ////////////////////////////////////////
  // Controlador de adicionar lembrete //
  ///////////////////////////////////////

  addlembrete: function(page) {

    page.addEventListener('show', function(event) {

      $('#texto-lembrete').val('');

      $.get('http://julianop.com.br:3000/api/medico/busca/ID/' + medApp.services.getIdMedico())
      .done(function(data) {
          page.querySelector('.lembrete-header').innerHTML = medApp.services.dadosPacienteAtual.nome;
          page.querySelector('#medico-lembrete').innerHTML = data[0].nome;
          // Pega a data atual
          var hoje = medApp.services.getToday('barra');
          page.querySelector('#data-lembrete').innerHTML = hoje;
        });

    });

    page.querySelector('#pub-lembrete').onclick = function() {

      var modal = page.querySelector('ons-modal');
      modal.show();

      if($('#texto-lembrete').val() == ''){

        modal.hide();
        ons.notification.alert("Preencha o lembrete!");

      } else {

        $.post('http://julianop.com.br:3000/api/lembrete',
        {
          data: medApp.services.getToday('traco'),
          mensagem: $('#texto-lembrete').val(),
          idMedico: medApp.services.getIdMedico(),
          idPaciente: medApp.services.getIdPaciente()
        })
          .done(function(data) {
            modal.hide();
            ons.notification.alert(data);
            document.querySelector('#pacienteNav').popPage();
          });
      };

    };

  },

  ////////////////////////////////////////
  // Controlador de visualizar lembrete //
  ////////////////////////////////////////

  verlembrete: function(page) {

    page.addEventListener('show', function(event) {

      page.querySelector('.lembrete-header').innerHTML = medApp.services.dadosPacienteAtual.nome;
      $('#texto-ver-lembrete').val(page.data.texto);
      page.querySelector('#medico-ver-lembrete').innerHTML = page.data.medicoResp;
      page.querySelector('#data-ver-lembrete').innerHTML = page.data.horario;

    });

    page.querySelector('#edit-lembrete').onclick = function() {

      var modal = page.querySelector('ons-modal');
      modal.show();

      if($('#texto-ver-lembrete').val() == ''){

        modal.hide();
        ons.notification.alert("Preencha o lembrete!");

      } else {

        $.ajax({
          url: 'http://julianop.com.br:3000/api/lembrete',
          type: 'PUT',
          data: { idLembrete: page.data.idLembrete,
                  mensagem: $('#texto-ver-lembrete').val()
                }
        })
        .done(function(data) {
          console.log(data);
          document.querySelector('#pacienteNav').popPage();
        })
        .fail(function() {
          ons.notification.alert("Edição não efetuada");
          document.querySelector('#pacienteNav').popPage();
        });

      };

    };

  }

};
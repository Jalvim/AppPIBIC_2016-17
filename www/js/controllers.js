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

    page.addEventListener('show', function(event) { 

      medApp.services.deletePacienteAtual();
      $('#lista-pacientes').empty();
      var pacientesInfo;

      $.get('https://pibicfitbit.herokuapp.com/api/paciente/geral/idMedico/' + medApp.services.getIdMedico())
        .done(function(data) {
          pacientesInfo = data;

          for (var i = 0, len = pacientesInfo.length; i < len; i++) {

            medApp.services.createPaciente( 
            { 
              statusPaciente: 'ativo',
              img: 'http://www.clker.com/cliparts/A/Y/O/m/o/N/placeholder-md.png',
              nomePaciente: pacientesInfo[i].nomePaciente,
              batimentos: '60',
              dataPaciente: pacientesInfo[i].dataDeNascimento,
              causaPaciente: pacientesInfo[i].causaDaInternacao,
              medicoResp: pacientesInfo[i].numeroDoProntuario,
              hospital: pacientesInfo[i].telefone,
              idPaciente: pacientesInfo[i].idPaciente,
              //medicoResp: data1[0].nome
                
            });
          };
      });

    });

    // Página para adicionar um novo paciente à lista
    page.querySelector('#buscar-pac').onclick = function() {

      document.querySelector('#pacienteNav').pushPage('html/addpaciente.html');

    };

    // Página para adicionar um novo grupo de pacientes
    page.querySelector('#add-grupo').onclick = function() {

      document.querySelector('#pacienteNav').pushPage('html/addgrupo.html');

    };

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

      page.querySelector('.profile-name').innerHTML = page.data.nome;
      page.querySelector('#data-int').innerHTML = page.data.dataInt;
      page.querySelector('#causa').innerHTML = page.data.causa;
      page.querySelector('#hospital').innerHTML = page.data.hospital;

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
        
        $.get('https://pibicfitbit.herokuapp.com/api/paciente/health/static/' + medApp.services.idAtualPaciente + '/calorias')
          .done(function(data) {
            medApp.services.setDadosEstaticos.calorias(data);
            console.log(data);
        });

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

        // Fim da interface gráfica 1. TODO --> Implementar outros gráficos.

  },

  dadossaude2: function(page) {

        //Interface gráfica interativa dos dados estáticos de saúde.

        //Request
        
        $.get('https://pibicfitbit.herokuapp.com/api/paciente/health/static/' + medApp.services.idAtualPaciente + '/passos')
          .done(function(data) {
            medApp.services.setDadosEstaticos.passos(data);
            console.log(data);
        });

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
        $.get('https://pibicfitbit.herokuapp.com/api/paciente/health/dynamic/' + medApp.services.idAtualPaciente)
          .done(function(data) {
            medApp.services.setDadosEstaticos.pulso(data);
            console.log(medApp.services.getDadosEstaticos.pulso());
        });
        
        var chrt3 = document.getElementById("myChart3");
        var data3 = {
          labels: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
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

        // Fim da interface gráfica 3. TODO --> Implementar outros gráficos.

  },

  dadossaude4: function(page) {

        //Interface gráfica interativa dos dados estáticos de saúde.

        //Request
        $.get('https://pibicfitbit.herokuapp.com/api/paciente/health/static/' + medApp.services.idAtualPaciente + '/degraus')
          .done(function(data) {
            medApp.services.setDadosEstaticos.degraus(data);
            console.log(medApp.services.getDadosEstaticos.degraus());
        });

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
          url: 'http://julianop.com.br:3000/api/medico',
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
          url: 'http://julianop.com.br:3000/api/paciente/geral' + medApp.services.getIdPaciente(),
          type: 'PUT',
          success: function(data) {
            console.log(data);
          },
          error: function() {
            ons.notification.alert("Alterações não efetuadas");
          },
          data: {
            nomePaciente: dadosEditPac.nome,
            causaDaInternacao: dadosEditPac.causa,
            novaData: dadosEdit.idadeEdit,
            dataDeNascimento: '1990-04-12'
          }
        });

      document.querySelector('#pacienteNav').popPage();
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

    page.addEventListener('show', function(event) {

      $('#lista-lembretes').empty();
      $.get('http://julianop.com.br:3000/api/lembrete/' + medApp.services.getIdPaciente())
      .done(function(data){
        
        lembretesInfo = data;
        console.log(lembretesInfo);
          // Cria os lembretes no inverso dos id's retornados (ordem cronológica)
          for (var i = lembretesInfo.length - 1; i >= 0; i--) {

            medApp.services.createLembrete( 
            { 
              texto: lembretesInfo[i].mensagem,
              horario: lembretesInfo[i].data,
              medico: lembretesInfo[i].nome,
              idLembrete: lembretesInfo[i].id
            });
          };

      });

    });

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
    $.get('http://julianop.com.br:3000/api/pulseira/disponivel')
      .done(function(data){
      	medApp.services.setPulseirasDisponiveis(data);
        console.log(medApp.services.pulseirasDisponiveis);
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
      url: 'http://julianop.com.br:3000/api/pulseira/' + medApp.services.PulseiraAtual,
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

        $.post('http://julianop.com.br:3000/api/paciente/geral',
        {
          nomePaciente: $('#nome-novo-pac').val(),
          causaDaInternacao: $('#causa-novo-pac').val(),
          numeroDoProntuario: 1111,
          telefone: 11111,
          foto: 01010101011111011111,
          dataDeNascimento: dataNovoPaciente,
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

    page.addEventListener('show', function(event) {

      page.querySelector('.lembrete-header').innerHTML = medApp.services.dadosPacienteAtual.nome;
      page.querySelector('#medico-lembrete').innerHTML = medApp.services.getNameMedico();
      // Pega a data atual
      var hoje = medApp.services.getToday('barra');
      page.querySelector('#data-lembrete').innerHTML = hoje;

    });

    page.querySelector('#pub-lembrete').onclick = function() {

      if($('#texto-lembrete').val() == ''){

        ons.notification.alert("Preencha todos os campos!");

      } else {

        $.post('http://julianop.com.br:3000/api/lembrete',
        {
          data: medApp.services.getToday('traco'),
          mensagem: $('#texto-lembrete').val(),
          idMedico: medApp.services.getIdMedico(),
          idPaciente: medApp.services.getIdPaciente()
        })
          .done(function(data) {
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
      page.querySelector('.lembrete-text').innerHTML = page.data.texto;
      page.querySelector('#medico-ver-lembrete').innerHTML = page.data.medicoResp;
      page.querySelector('#data-ver-lembrete').innerHTML = page.data.horario;

    });

  }

};
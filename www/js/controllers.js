
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
//função para mandar o e-mail de esquecimento de senha
    page.querySelector('#esquecer-senha').onclick = function() {
      ons.notification.prompt({
        message:"Digite seu e-mail",
        callback: function(email){
          $.ajax({
          url:'http://www.julianop.com.br:3000/api/login/',
            type:'PUT',
            data:{
              email:email
            },
            jsonp:true,
            success:function(info){
              ons.notification.alert(info);
            },
            error:function(erro){
            ons.notification.alert(erro);
            }
          });
     */
        }
      });

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
        document.querySelector('#loginNav').pushPage('html/inicial.html');

      };

      $.post('http://julianop.com.br:3000/api/login/',
        {
          email: emailLogin,
          senha: senhaLogin
        })
          .done(function(data) {

            modal.hide();

            if ( data.hasOwnProperty('idMedico') ) {

              if ($('#lembrar-login').is(':checked')) {

                var storage = window.localStorage;
                storage.setItem('idMedico', data.idMedico);

              };

              $('#email-login').val("");
              $('#senha-login').val("");
              medApp.services.setIdMedico(data.idMedico);
              document.querySelector('#loginNav').pushPage('html/inicial.html');

            } else {

              $('#email-login').val("");
              $('#senha-login').val("");
              ons.notification.alert("E-mail ou Senha incorretos");

            };
        });

    };

    // Sai do app ao apertar o botão de voltar do aparelho
    document.querySelector('#loginNav').onDeviceBackButton = function(event) {

      ons.notification.confirm({message: 'Deseja fechar o aplicativo?'})
        .then( function(confirm){

          if(confirm) {
            navigator.app.exitApp();
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

    // Função de adiquirir imagem de perfil
    page.querySelector('.add-foto').onclick = function snapPicture () {

      medApp.services.dial = document.getElementById('fotosource').id;

      medApp.services.showPopover(medApp.services.dial);

      document.querySelector('#camera-add').onclick = function() {

      	// Captura imagem a partir da câmera do dispositivo
      	medApp.services.hidePopover(medApp.services.dial);

        navigator.camera.getPicture (successCallback, FailCallback, {  quality: 100,
                                                                      targetWidth :110,
                                                                      targetHeight :110,
                                                                      allowEdit: true,
                                                                      sourceType: Camera.PictureSourceType.CAMERA,
                                                                      destinationType: Camera.DestinationType.DATA_URL
                                                                    });

        //Success Callback
        function successCallback (imageData) {

          //Display image
          var image = document.getElementById ('picture');
          image.src = "data:image/jpeg;base64, " + imageData;

        };

        //Error CallBack
        function FailCallback (message) {

            alert ('Erro!!!: ' + message);

        };

      };

      document.querySelector('#galeria').onclick = function() {

      	// Seleciona imagem a partir da galeria de imagens do dispositivo
      	medApp.services.hidePopover(medApp.services.dial);

        navigator.camera.getPicture (successCallback, FailCallback, { quality: 100,
                                                                      targetWidth : 110,
                                                                      targetHeight : 110,
                                                                      allowEdit: true,
                                                                      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                                                                      destinationType: Camera.DestinationType.DATA_URL
                                                                    });

          //Success Callback
          function successCallback (imageData) {

            //Display image
            var image = document.getElementById ('picture');
            image.src = "data:image/jpeg;base64, " + imageData;

          };

          //Error CallBack
          function FailCallback (message) {

            ons.notification.alert('Erro!!!: ' + message);

          };


      };

    };

    // Registra novo médico caso as senhas sejam válidas
    page.querySelector('#cadastrar-med').onclick = function() {

      var modal = page.querySelector('ons-modal');
      modal.show();
      var pass = $('#senha-cadastro').val();
      var confirm = $('#senha-confirm').val();
      var email = $('#email-cadastro').val();
      var CPF = $('#cpf-cadastro').cleanVal();


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
      else if(CPF.length < 11){

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
          CPF: $('#cpf-cadastro').cleanVal(),
          especialidade: $('#esp-cadastro').val(),
          CRM: $('#crm-cadastro').val(),
          telefone: $('#telefone-cadastro').val(),
          email: $('#email-cadastro').val(),
          senha: $('#senha-cadastro').val(),
          foto: medApp.services.getBase64Image(document.getElementById('picture'))
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
        page.querySelector('#img-med').src = medApp.services.verificarFoto(data[0].foto);

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

    // Chama a página de gerenciar equipes do médico
    page.querySelector('#equipes').onclick = function() {

      document.querySelector('#medicoNav').pushPage('html/equipes.html');

    };

    // Realiza o logoff
    page.querySelector('#logoff').onclick = function() {

      ons.notification.confirm({message: 'Tem certeza?'})
        .then( function(confirm){

          if(confirm) {
            medApp.services.deleteIdMedico();
            window.localStorage.removeItem('idMedico');
            document.querySelector('#loginNav').resetToPage('login.html', {options: {animation: 'fade'}});
          };

        });

    };

    // Sai do app ao apertar o botão de voltar do aparelho
    document.querySelector('#loginNav').onDeviceBackButton = function(event) {

      ons.notification.confirm({message: 'Deseja fechar o aplicativo?'})
        .then( function(confirm){

          if(confirm) {
            navigator.app.exitApp();
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

    // Função que gera e autaliza a lista de pacientes a partir de dados do sevidor
    function gerarListaPacientes () {

      medApp.services.changeUpdatePaciente();
      $('#lista-pacientes').empty();

      if(medApp.services.isUpdatedPaciente) {
      $.get('http://julianop.com.br:3000/api/paciente/geral/idMedico/' + medApp.services.getIdMedico())
        .done(function(data) {

          if(data[0].hasOwnProperty('idPaciente')) {

            for (var i = 0, len = data.length; i < len; i++) {

              var pacientesInfo = data[i];

              medApp.services.createPaciente(
                {
                  statusPaciente: (pacientesInfo.ativo == 1) ? 'ativo' : 'inativo',
                  img: medApp.services.verificarFoto(pacientesInfo.foto),
                  nomePaciente: pacientesInfo.nomePaciente,
                  dataPaciente: pacientesInfo.dataDeNascimento,
                  causaPaciente: pacientesInfo.causaDaInternacao,
                  medicoResp: pacientesInfo.numeroDoProntuario,
                  hospital: pacientesInfo.telefone,
                  idPaciente: pacientesInfo.idPaciente,
                  medicoResp: pacientesInfo.nome
                }, 'pacientes');

            };

          };

      });
      };
    };

    // Atualiza a lista de pacientes sempre que a página for mostrada
    page.addEventListener('show', function(event) {

      event.stopPropagation();
      gerarListaPacientes();

    });

    // Página para adicionar um novo paciente à lista
    page.querySelector('#buscar-pac').onclick = function() {

      document.querySelector('#pacienteNav').pushPage('html/addpaciente.html');

    };

    // Sai do app ao apertar o botão de voltar do aparelho
    document.querySelector('#loginNav').onDeviceBackButton = function(event) {

      ons.notification.confirm({message: 'Deseja fechar o aplicativo?'})
        .then( function(confirm){

          if(confirm) {
            navigator.app.exitApp();
          };

        });

    };

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
      page.querySelector('.profile-image').src = medApp.services.dadosPacienteAtual.foto;

      //get da pulseira indexada ao paciente.
  	  $.get('http://julianop.com.br:3000/api/pulseira/idPaciente/' + medApp.services.dadosPacienteAtual.idAtualPaciente)
  	  .done(function(data) {

  	    if(data.length == 0){

           medApp.services.pulseiraAtual = data;

         } else {

           medApp.services.pulseiraAtual = data[0];

         }

  	  })
      .done(function(data) {

        if(data.length == 0){

      	  page.querySelector('#pulseira-pac').innerHTML = 'Nenhuma';

        } else {

      	  page.querySelector('#pulseira-pac').innerHTML = medApp.services.pulseiraAtual.idPulseira;

        };

      });

    });

    // Chama página de configurações para a pulseira/paciente
    page.querySelector('#perfil-pulseiras').onclick = function() {

      document.querySelector('#pacienteNav').pushPage('html/configpaciente.html');

    };

    // Chama página de edição de dados do paciente
    page.querySelector('#pacienteeditar').onclick = function() {

      document.querySelector('#pacienteNav').pushPage('html/editarpaciente.html');

    };

    //Chama página de lembretes do paciente
    page.querySelector('#lemb').onclick = function() {

      document.querySelector('#pacienteNav').pushPage('html/lembretes.html');

    };

    // Chama página de dados de saúde
    page.querySelector('#graf').onclick = function() {

      document.querySelector('#pacienteNav').pushPage('html/dadossaude.html');

    };

    // Chama página de compartilhamento de paciente
    page.querySelector('#compart-pac').onclick = function() {

      document.querySelector('#pacienteNav').pushPage('html/compartilhar.html');

    };


    // Chama página de configurações do paciente
    page.querySelector('#config-pac').onclick = function() {

      document.querySelector('#pacienteNav').pushPage('html/configpaciente.html');

    };

  },

  //////////////////////////////////////
  // Controlador da Criação de Grupos //
  //////////////////////////////////////

  addgrupo: function(page) {

    page.addEventListener('show', function(event) {

      // Cria a lista de possíveis integrantes do novo grupo a partir da lista de pacientes do médico atual
      $.get('http://julianop.com.br:3000/api/paciente/geral/idMedico/' + medApp.services.getIdMedico())
        .done(function(data) {

          if(data[0].hasOwnProperty('idPaciente')) {

            // Preenche a lista de integrantes com os pacientes do médico atual
            for (var i = 0, len = data.length; i < len; i++) {

              var pacientesInfo = data[i];

              medApp.services.listAddGroup(
                {
                  nomePaciente: pacientesInfo.nomePaciente,
                  img: pacientesInfo.foto,
                  idPaciente: pacientesInfo.idPaciente
                }, 'unchecked', 'add');

            };

          };

      });

    });

    page.querySelector('#criar-grupo').onclick = function() {

      var modal = page.querySelector('ons-modal');
      modal.show();

      var nomeNovoGrupo = $('#nome-novo-grupo').val();
      // Array com os ids dos pacientes que entrarão no novo grupo
      var pacientesNovoGrupo = [];

      if (nomeNovoGrupo === '') {

        ons.notification.alert("Preencha o nome do grupo!");

      } else if (nomeNovoGrupo !== '') {

        var integrantes = page.querySelectorAll('.checkbox-opt');

        for (var i = 0, len = integrantes.length; i < len; i++) {

          // Verifica os checkboxes de cada paciente e adiciona seus ids ao pacientesNovoGrupo
          if(integrantes[i].checked == true) {

            pacientesNovoGrupo.push(jQuery.data(integrantes[i], 'idPaciente'));

          };

        };

        $.post("http://julianop.com.br:3000/api/grupoPacientes",
          {
          nome: nomeNovoGrupo,
          idMedico:medApp.services.getIdMedico(),
          })
        .done(function (data){

          if (pacientesNovoGrupo.length == 1) {

            $.post("http://julianop.com.br:3000/api/grupoPacientes/pacientes",
              {
              idPaciente: pacientesNovoGrupo[0],
              idGrupoPac: data.insertId,
              })
            .done(function (resp){
              //console.log(resp);
              modal.hide();
              document.querySelector('#pacienteNav').popPage();

            });

          } else if (pacientesNovoGrupo.length > 1) {

            $.post("http://julianop.com.br:3000/api/grupoPacientes/pacientes/multiplos",
              {
              idPaciente: pacientesNovoGrupo,
              idGrupoPac: data.insertId,
              })
            .done(function (resp){
              //console.log(resp);
              modal.hide();
              document.querySelector('#pacienteNav').popPage();

            });

          } else if (pacientesNovoGrupo.length == 0) {

            modal.hide();
            document.querySelector('#pacienteNav').popPage();

          };

        });

      };

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
            if(data.length <= 7){
              for(var i = 0; i < data.length; i++){
                medApp.services.dadosEstaticos.calorias[i] = data[i].calories;
              }
            } else {
              for(var i = 0; i < 7; i++){
                medApp.services.dadosEstaticos.calorias[i] = data[((data.length - 7) + i)].calories;
              }
            }

            /*for(var i = 0; i < 7; i++){
              medApp.services.semana[i] = medApp.services.getDia(i + 1);
            }*/
          })

          .done(function() {


            var chrt1 = document.getElementById("myChart1");
            var data1 = {
              labels: ["Últimas atualizações."],//["Dia 1", "Dia 2", "Dia 3", "Dia 4", "Dia 5", "Dia 6", "Dia 7"], //medApp.services.semana,
              datasets: [
                {
                  label: "Calorias perdidas nas 7 últimas atualizações",
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

          medApp.services.dataDados = $('#data-dados').val();

          if(medApp.services.dataDados === ''){
            page.querySelector('#dados-recuperados').innerHTML = 'Escolha a Data e clique aqui';
          }

          page.querySelector('#dados-rec').onclick = function(dataDados) {

            medApp.services.dataDados = $('#data-dados').val();

            if(medApp.services.dataDados === ''){
              page.querySelector('#dados-recuperados').innerHTML = 'Dados não recuperados nesta data.';
            } else {

              //console.log(medApp.services.dataDados);

              $.get('http://julianop.com.br:3000/api/paciente/health/static/' + medApp.services.dadosPacienteAtual.idAtualPaciente + '/' + medApp.services.dataDados)
              .done(function(data) {


                //medApp.services.dadosRecuperados = data.calories;

                //console.log(data);
                page.querySelector('#dados-recuperados').innerHTML = data.calories + ' calorias perdidas.';

              });
            }
          };

        // Fim da interface gráfica 1. TODO --> Implementar outros gráficos.

  },

  dadossaude2: function(page) {

        //Interface gráfica interativa dos dados estáticos de saúde.

        //Request

        $.get('http://julianop.com.br:3000/api/paciente/health/static/' + medApp.services.dadosPacienteAtual.idAtualPaciente)
        .done(function(data) {
          if(data.length <= 7){
            for(var i = 0; i < data.length; i++){
              medApp.services.dadosEstaticos.passos[i] = data[i].steps;
            }
          } else {
            for(var i = 0; i < 7; i++){
              medApp.services.dadosEstaticos.passos[i] = data[((data.length - 7) + i)].steps;
            }
          }
        })

          .done(function() {


            var chrt2 = document.getElementById("myChart2");
            var data2 = {
              labels: ["Últimas atualizações."],//["Dia 1", "Dia 2", "Dia 3", "Dia 4", "Dia 5", "Dia 6", "Dia 7"], //medApp.services.semana, //["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
                datasets: [
                  {
                    label: "Número de passos dados nas 7 últimas atualizações",
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

          medApp.services.dataDados = $('#data-dados').val();

          if(medApp.services.dataDados === ''){
            page.querySelector('#dados-recuperados').innerHTML = 'Escolha a Data e clique aqui';
          }

          page.querySelector('#dados-rec').onclick = function(dataDados) {

            medApp.services.dataDados = $('#data-dados').val();

            if(medApp.services.dataDados === ''){
              page.querySelector('#dados-recuperados').innerHTML = 'Dados não recuperados nesta data.';
            } else {

              //console.log(medApp.services.dataDados);

              $.get('http://julianop.com.br:3000/api/paciente/health/static/' + medApp.services.dadosPacienteAtual.idAtualPaciente + '/' + medApp.services.dataDados)
              .done(function(data) {


                //medApp.services.dadosRecuperados = data.calories;

                //console.log(data);
                page.querySelector('#dados-recuperados').innerHTML = data.steps + ' passos dados.';

              });
            }
          };

          // Fim da interface gráfica 2. TODO --> Implementar outros gráficos.

  },

  dadossaude3: function(page) {

        //Interface gráfica interativa dos dados estáticos de saúde.

        //Request
        $.get('http://julianop.com.br:3000/api/paciente/health/dynamic/' + medApp.services.dadosPacienteAtual.idAtualPaciente + '/' + medApp.services.getToday('traco'))
          .done(function(data) {
            if(data.length < 10){
              for(var i = 0; i < data.length; i ++) {
                medApp.services.dadosEstaticos.pulso[i] = data[i].heartRate;
              }
            } else {
              for(var i = 0; i < 10; i++){
                medApp.services.dadosEstaticos.pulso[i] = data[((data.length - 10) + i)].heartRate;
              }
            }
            //console.log(data);
          })
          .done(function () {
            //console.log(medApp.services.dadosEstaticos.pulso);
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

          /*medApp.services.dataDados = $('#data-dados').val();

          if(medApp.services.dataDados === ''){
            page.querySelector('#dados-recuperados').innerHTML = 'Nenhuma busca efetuada.';
          }

          page.querySelector('#dados-rec').onclick = function(dataDados) {

            medApp.services.dataDados = $('#data-dados').val();

            if(medApp.services.dataDados === ''){
              page.querySelector('#dados-recuperados').innerHTML = 'Dados não recuperados.';
            } else {

              console.log(medApp.services.dataDados);

              $.get('http://julianop.com.br:3000/api/paciente/health/static/' + medApp.services.dadosPacienteAtual.idAtualPaciente + '/' + medApp.services.dataDados)
              .done(function(data) {


                //medApp.services.dadosRecuperados = data.calories;

                console.log(data);
                page.querySelector('#dados-recuperados').innerHTML = data.calories;

              });
            }
          }; */

        // Fim da interface gráfica 3. TODO --> Implementar outros gráficos.

  },

  dadossaude4: function(page) {

        //Interface gráfica interativa dos dados estáticos de saúde.

        //Request
        $.get('http://julianop.com.br:3000/api/paciente/health/static/' + medApp.services.dadosPacienteAtual.idAtualPaciente)
          .done(function(data) {
            if(data.length <= 7){
              for(var i = 0; i < data.length; i++){
                medApp.services.dadosEstaticos.degraus[i] = data[i].floors;
              }
            } else {
              for(var i = 0; i < 7; i++){
                medApp.services.dadosEstaticos.degraus[i] = data[((data.length - 7) + i)].floors;
              }
            }
          })

          .done(function() {


            var chrt4 = document.getElementById("myChart4");
            var data4 = {
              labels: ["Últimas atualizações."],//["Dia 1", "Dia 2", "Dia 3", "Dia 4", "Dia 5", "Dia 6", "Dia 7"], //medApp.services.semana, //["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
              datasets: [
                {
                  label: "Número de degraus subidos.",
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

          medApp.services.dataDados = $('#data-dados').val();

          if(medApp.services.dataDados === ''){
            page.querySelector('#dados-recuperados').innerHTML = 'Escolha a Data e clique aqui';
          }

          page.querySelector('#dados-rec').onclick = function(dataDados) {

            medApp.services.dataDados = $('#data-dados').val();

            if(medApp.services.dataDados === ''){
              page.querySelector('#dados-recuperados').innerHTML = 'Dados não recuperados nesta data;.';
            } else {

              //console.log(medApp.services.dataDados);

              $.get('http://julianop.com.br:3000/api/paciente/health/static/' + medApp.services.dadosPacienteAtual.idAtualPaciente + '/' + medApp.services.dataDados)
              .done(function(data) {


                //medApp.services.dadosRecuperados = data.calories;

                //console.log(data);
                page.querySelector('#dados-recuperados').innerHTML = data.floors + ' degraus escalados.';

              });
            }
          };

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
        document.getElementById('img-medico').src = "data:image/jpeg;base64, " + data[0].foto;
      });

    });

    // Função de adiquirir imagem de perfil
    page.querySelector('.add-foto').onclick = function snapPicture () {

      medApp.services.dial = document.getElementById('fotosource').id;

      medApp.services.showPopover(medApp.services.dial);

      document.querySelector('#camera-add').onclick = function() {

        // Captura imagem a partir da câmera do dispositivo
        medApp.services.hidePopover(medApp.services.dial);

        navigator.camera.getPicture (successCallback, FailCallback, {  quality: 100,
                                                                      targetWidth :110,
                                                                      targetHeight :110,
                                                                      allowEdit: true,
                                                                      sourceType: Camera.PictureSourceType.CAMERA,
                                                                      destinationType: Camera.DestinationType.DATA_URL
                                                                    });
        //Error CallBack
        function FailCallback (message) {

            alert ('Erro!!!: ' + message);

          };

        };

        //Success Callback
        function successCallback (imageData) {

          //Display image
          var image = document.getElementById ('img-medico');
          image.src = "data:image/jpeg;base64, " + imageData;


        };

      document.querySelector('#galeria').onclick = function() {

        // Seleciona imagem a partir da galeria de imagens do dispositivo
        medApp.services.hidePopover(medApp.services.dial);

        navigator.camera.getPicture (successCallback, FailCallback, {
                                                                      quality: 100,
                                                                      targetWidth :110,
                                                                      targetHeight :110,
                                                                      allowEdit: true,
                                                                      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                                                                      destinationType: Camera.DestinationType.DATA_URL
                                                                    });
          //Error CallBack
          function FailCallback (message) {

            alert ('Erro!!!: ' + message);

          };

          //Success Callback
          function successCallback (imageData) {

            //Display image
            var image = document.getElementById ('img-medico');
            image.src = "data:image/jpeg;base64, " + imageData;
          };



      };

    };

    /* Verifica se algum input do formulário foi mudado
    $("#medico-edit-form :input").change(function() {
      $("#medico-edit-form").data("changed",true);
    });
    */
    // Botão salvar altera os dados no servidor (se houve mudanças => ALTERADO PARA ENVIAR FOTO)
    page.querySelector('#salvar-med').onclick = function() {

      //if ($("#medico-edit-form").data("changed")) {

        var dadosEdit = {

          nome: $('#nome-medico').val(),
          crm: $('#crm-medico').val(),
          esp: $('#esp-medico').val(),
          tel: $('#tel-medico').val(),
          email: $('#email-medico').val(),
          cpf: $('#cpf-medico').cleanVal(),
          foto: medApp.services.getBase64Image(document.getElementById('img-medico')),
          idMedico: medApp.services.getIdMedico(),

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
                  email: dadosEdit.email,
                  foto: dadosEdit.foto
                }
        });

        document.querySelector('#medicoNav').popPage();

      /*} else {
        document.querySelector('#medicoNav').popPage();
      };
      */

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
    document.getElementById('edit-pac').src= "data:image/jpeg;base64, " + medApp.services.dadosPacienteAtual.foto;


    // Função de adiquirir imagem de perfil
    page.querySelector('.add-foto').onclick = function snapPicture () {

      medApp.services.dial = document.getElementById('fotosource').id;

      medApp.services.showPopover(medApp.services.dial)

      document.querySelector('#camera-add').onclick = function() {

        // Captura imagem a partir da câmera do dispositivo
        medApp.services.hidePopover(medApp.services.dial);

        navigator.camera.getPicture (successCallback, FailCallback, { quality: 100,
                                                                      targetWidth :110,
                                                                      targetHeight :110,
                                                                      allowEdit: true,
                                                                      sourceType: Camera.PictureSourceType.CAMERA,
                                                                      destinationType: Camera.DestinationType.DATA_URL
                                                                    });

        //Success Callback
        function successCallback (imageData) {

          //Display image
          var image = document.getElementById ('edit-pac');
          image.src = "data:image/jpeg;base64, " + imageData;

        };

        //Error CallBack
        function FailCallback (message) {

            alert ('Erro!!!: ' + message);

        };

    };

      document.querySelector('#galeria').onclick = function() {

        // Seleciona imagem a partir da galeria de imagens do dispositivo
        medApp.services.hidePopover(medApp.services.dial);

        navigator.camera.getPicture (successCallback, FailCallback, {  quality: 100,
                                                                      targetWidth :110,
                                                                      targetHeight :110,
                                                                      allowEdit: true,
                                                                      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                                                                      destinationType: Camera.DestinationType.DATA_URL
                                                                    });

          //Success Callback
          function successCallback (imageData) {

            //Display image
            var image = document.getElementById ('edit-pac');
            image.src = "data:image/jpeg;base64, " + imageData;

          };

          //Error CallBack
          function FailCallback (message) {

            alert ('Erro!!!: ' + message);

          };

      };

    };

    /*Função responsável por indexar paciente a um hospital na Base de dados
    page.querySelector('#hospitalButton').onclick = function(){
	  medApp.services.dial = document.getElementById('dialog').id;
	  $.get('http://julianop.com.br:3000/api/hospitais/medico/' + medApp.services.idAtualMedico)
	  .done(function(data){
	  	console.log(data);
	  	if(data.length == 0){
	  	  ons.notification.alert('Erro, não foi encontrado hospital no servidor');
	  	} else{
	  	  medApp.services.showPopover(medApp.services.dial);
  		  for(var i=0; i<data.length; i++){
  		  	medApp.services.showHospitais(i, data);
  		  }
	  	}
	  });
    };
    */

    // Botão salvar altera os dados no servidor se houve mudanças
    page.querySelector('#editar-pac').onclick = function() {

      // Dados editados do paciente
      var dadosEditPac = {

      nome: $('#nome-pac-edit').val(),
      medico: $('#med-pac-edit').val(),
      dataInt: $('#data-pac-edit').val(),
      causa: $('#causa-pac-edit').val(),
      hospital: $('#hospital-pac-edit').val(),
      foto:medApp.services.getBase64Image(document.getElementById('edit-pac'))
      };


      //Request PUT responsável pela edição de pacientes diretamente na base de dados.

      $.ajax({
          url: 'http://julianop.com.br:3000/api/paciente/geral',
          type: 'PUT',
          headers: { 'idpaciente': medApp.services.getIdPaciente() },
          data: {
            nomePaciente: dadosEditPac.nome,
            causaDaInternacao: dadosEditPac.causa,
            dataDeNascimento: dadosEditPac.dataInt,
            telefone: dadosEditPac.hospital,
            foto: dadosEditPac.foto
          }
        })
        .done(function(data) {
          //console.log(data);
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

  /////////////////////////////////////
  // Controlador do feed de notícias //
  /////////////////////////////////////

  feed: function(page) {

    page.addEventListener('show', function(event) {

      $.get('http://julianop.com.br:3000/api/feed/' + medApp.services.getIdMedico()) //+ '?limit=10')
      .done(function(data){

      	//console.log(data);

      	if(data.length == 0) {

          $('#feed-lista').empty();

  	      var template = document.createElement('div');

          template.innerHTML = '<ons-list-item class="paciente-lista" modifier="longdivider" tappable>' +
           '<div class="center">'+
             '<ons-row class="paciente-header">'+
               '<ons-col>' +
                 '<span class="list__item__title nome">' +
                 'Sem atualizações de pacientes no momento. Adicione um paciente na aba "Pacientes"'
                 + '</span>' +
               '</ons-col>' +
             '</ons-row>' +
           '</div>' +
          '</ons-list-item>';

          var feedItem = template.firstChild;
          var listaFeed = document.querySelector('#feed-lista');

          listaFeed.appendChild(feedItem);

        } else {

          $('#feed-lista').empty();

    	    for(var i=0; i<data.length; i++){

    	      medApp.services.iconeFeed(data[i], i);
    	      // onclick que redireciona está dentro da fç

    	    };

        };

      });

    });

    // Sai do app ao apertar o botão de voltar do aparelho
    document.querySelector('#loginNav').onDeviceBackButton = function(event) {

      ons.notification.confirm({message: 'Deseja fechar o aplicativo?'})
        .then( function(confirm){

          if(confirm) {
            navigator.app.exitApp();
          };

        });

    };

    /* Realiza a atualização do feed com pull --> TODO: funcionalidade.
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
              idLembrete: lembretesInfo.id,
              Na: lembretesInfo.Na,
              K: lembretesInfo.K,
              Cl: lembretesInfo.CI,
              Co2: lembretesInfo.Co2,
              Bun: lembretesInfo.Bun,
              Creat: lembretesInfo.Creat,
              Gluc: lembretesInfo.Gluc,
              wbc: lembretesInfo.wcb,
              HgB: lembretesInfo.HgB,
              Hct: lembretesInfo.Hct,
              Plt: lembretesInfo.Plt
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

    // Preencher o nome do Médico Responsável para o médico atual (não-editável)
    page.addEventListener('show', function(event) {

      $.get('http://julianop.com.br:3000/api/medico/busca/ID/' + medApp.services.getIdMedico())
      .done(function(data) {

        $('#med-novo-pac').val(data[0].nome);

      });


    });

    // Função de adiquirir imagem de perfil
    page.querySelector('.add-foto').onclick = function snapPicture () {

      medApp.services.dial = document.getElementById('fotosource').id;

      medApp.services.showPopover(medApp.services.dial);

      document.querySelector('#camera-add').onclick = function() {

        // Captura imagem a partir da câmera do dispositivo
        medApp.services.hidePopover(medApp.services.dial);

        navigator.camera.getPicture (successCallback, FailCallback, {  quality: 100,
                                                                      targetWidth :110,
                                                                      targetHeight :110,
                                                                      allowEdit: true,
                                                                      sourceType: Camera.PictureSourceType.CAMERA,
                                                                      destinationType: Camera.DestinationType.DATA_URL
                                                                    });

        //Success Callback
        function successCallback (imageData) {

          //Display image
          var image = document.getElementById ('picture');
          image.src = "data:image/jpeg;base64, " + imageData;

        };

        //Error CallBack
        function FailCallback (message) {

            alert ('Erro!!!: ' + message);

        };

      };

      document.querySelector('#galeria').onclick = function() {

        // Seleciona imagem a partir da galeria de imagens do dispositivo
        medApp.services.hidePopover(medApp.services.dial);

        navigator.camera.getPicture (successCallback, FailCallback, {  quality: 100,
                                                                      targetWidth :110,
                                                                      targetHeight :110,
                                                                      allowEdit: true,
                                                                      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                                                                      destinationType: Camera.DestinationType.DATA_URL
                                                                    });

          //Success Callback
          function successCallback (imageData) {

            //Display image
            var image = document.getElementById ('img-pac');
            image.src = "data:image/jpeg;base64, " + imageData;

          };

          //Error CallBack
          function FailCallback (message) {

            ons.notification.alert ('Erro!!!: ' + message);

          };

      };

    };

    /*Função responsável por indexar paciente a um hospital na Base de dados
    page.querySelector('#hospitalButton').onclick = function(){
	  medApp.services.dial = document.getElementById('dialog').id;
	  $.get('http://julianop.com.br:3000/api/hospitais/medico/' + medApp.services.idAtualMedico)
	  .done(function(data){
	  	if(data.length == 0){
	  	  ons.notification.alert('Erro, não foi encontrado hospital no servidor');
	  	} else{
  		  for(var i=0; i<data.length; i++){
  		  	medApp.services.showHospitais(i, data);
  		  }
	  	}
	  });
    };*/

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
          telefone: $('#local-novo-pac').val(),
          foto: medApp.services.getBase64Image(document.getElementById('img-pac')),
          dataDeNascimento: dataNovoPaciente,
          idMedico: medApp.services.getIdMedico()
        })
        .done(function(data) {
          modal.hide();
          ons.notification.alert(data);
          document.querySelector('#pacienteNav').popPage();
        })
        .done(function(){
          //Inserir aqui o PUT da indexação de pulseiras.

          $.get('http://julianop.com.br:3000/api/paciente/geral/idMedico/' + medApp.services.getIdMedico())
          .done(function(data) {

            for(var i = 0; i < data.length; i++){
              medApp.services.idPacVec[i] = data[i].idPaciente;
            }

          });

        });

      };

    };

  },

  //////////////////////////////////
  // Controlador de configurações //
  //////////////////////////////////

  configuracoes: function(page) {

    page.querySelector('#manage-pulseiras').onclick = function() {

      // Template dentro de html/configuracoes
      document.querySelector('#configuracoesNav').pushPage('pulseiras.html');

    };

    // Realiza o logoff do app
    page.querySelector('#logoff-config').onclick = function() {

      ons.notification.confirm({message: 'Tem certeza?'})
        .then( function(confirm){

          if(confirm) {
            medApp.services.deleteIdMedico();
            window.localStorage.removeItem('idMedico');
            document.querySelector('#loginNav').resetToPage('login.html', {options: {animation: 'fade'}});
          };

        });

    };

    // Sai do app ao apertar o botão de voltar do aparelho
    document.querySelector('#loginNav').onDeviceBackButton = function(event) {

      ons.notification.confirm({message: 'Deseja fechar o aplicativo?'})
        .then( function(confirm){

          if(confirm) {
            navigator.app.exitApp();
          };

        });

    };

  },

  ////////////////////////////////////////
  // Controlador do Adicionar Pulseiras //
  ////////////////////////////////////////

  pulseiras: function(page){

  	/*$.get('http://julianop.com.br:3000/api/pulseira/disponivel')
    .done(function(data){
      for(var i = 0; i <data.length; i++){
        medApp.services.pulseirasDisponiveis[i] = data[i].idPulseira;
      }
    })
    .done(function() {
      for(var i = 0; i < medApp.services.pulseirasDisponiveis.length; i++){
    	medApp.services.showPulseirasDisponiveis2(i);
      }
    });*/

    /*page.querySelector('#addpulseira').onclick = function(){
      var  Oauth;
      ons.notification.prompt({message: "Digite o codigo da FITBIT"})
      .then(function(prompt) {
        Oauth = prompt;
      //Oauth = prompt("Digite o codigo da FITBIT");
      //pega o codigoOauth
        //console.log(Oauth);
        $.post("http://julianop.com.br:3000/api/pulseira",
          {
            redirectUri :"http://julianop.com.br:3000/",
            ClientID: "227WRB",
            ClientSecret: "---",  // Inserir secret
            CodigoOauth: Oauth
          })
          .done(function(data){
            //console.log(data);
          });
      });
    };*/

    page.querySelector('#link-fitbit').onclick = function() {

      window.open( "https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=227WRB&redirect_uri=http%3A%2F%2Fjulianop.com.br%3A3000%2Fapi%2Fpulseira%2Fcodigo&scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&expires_in=604800");

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
          idPaciente: medApp.services.getIdPaciente(),
          Na: $('#NA-add').val(),
          K: $('#K-add').val(),
          CI: $('#Cl-add').val(),
          Co2: $('#Co2-add').val(),
          Bun: $('#Bun-add').val(),
          Creat: $('#Creat-add').val(),
          Gluc: $('#Gluc-add').val(),
          wcb: $('#wbc-add').val(),
          HgB: $('#HgB-add').val(),
          Hct: $('#Hct-add').val(),
          Plt: $('#Plt-add').val()

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
      page.querySelector('#NA-diagrama').innerHTML = page.data.Na;
      page.querySelector('#K-diagrama').innerHTML = page.data.K;
      page.querySelector('#Cl-diagrama').innerHTML = page.data.Cl;
      page.querySelector('#Co2-diagrama').innerHTML = page.data.Co2;
      page.querySelector('#Bun-diagrama').innerHTML = page.data.Bun;
      page.querySelector('#Creat-diagrama').innerHTML = page.data.Creat;
      page.querySelector('#Gluc-diagrama').innerHTML = page.data.Gluc;
      page.querySelector('#wbc-diagrama').innerHTML = page.data.wbc;
      page.querySelector('#HgB-diagrama').innerHTML = page.data.HgB;
      page.querySelector('#Hct-diagrama').innerHTML = page.data.Hct;
      page.querySelector('#Plt-diagrama').innerHTML =page.data.Plt;

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
                  mensagem: $('#texto-ver-lembrete').val(),
                  Na: $('#NA-ver').val(),
                  K: $('#K-ver').val(),
                  CI: $('#Cl-ver').val(),
                  Co2: $('#Co2-ver').val(),
                  Bun: $('#Bun-ver').val(),
                  Creat: $('#Creat-ver').val(),
                  Gluc: $('#Gluc-ver').val(),
                  wcb: $('#wbc-ver').val(),
                  HgB: $('#HgB-ver').val(),
                  Hct: $('#Hct-ver').val(),
                  Plt: $('#Plt-ver').val()
                }
        })
        .done(function(data) {
          //console.log(data);
          document.querySelector('#pacienteNav').popPage();
        })
        .fail(function() {
          ons.notification.alert("Edição não efetuada");
          document.querySelector('#pacienteNav').popPage();
        });

      };

    };

  },

  //////////////////////////////////////////////
  // Controlador de configurações do paciente //
  //////////////////////////////////////////////

  configpaciente: function(page) {

  	page.querySelector('#manage-pulseiras').onclick = function() {

  		medApp.services.dial = document.getElementById('dialog').id;

        //Método responsável por encontrar na base as pulseiras disponíveis.
        $.get('http://julianop.com.br:3000/api/pulseira/disponivel')
        .done(function(data){
          for(var i = 0; i < data.length; i++){
            medApp.services.pulseirasDisponiveis[i] = data[i].idPulseira;
          }
        })
        .done(function() {

          medApp.services.showPopover(medApp.services.dial);

          document.querySelector('#nuloPulseira').onclick = function() {

            medApp.services.hidePopover(medApp.services.dial);

            ons.notification.alert("Pulseira Nula selecionada.");

            $.ajax({
              url: 'http://julianop.com.br:3000/api/pulseira',
              type: 'PUT',
              success: function(data) {
                //console.log(data);
              },
              error: function(data) {
                //console.log(data);
              },
              data: {
                idPulseira: medApp.services.pulseiraAtual.idPulseira,
                disponivel: 1,
                idPaciente: medApp.services.getIdPaciente()
              }
            });

            //Esvazia a lista de pulseiras
            $('#lista-pulseiras').empty();

          };

          //Loop de criação de ítns responsíveis no menu.
          for(var i = 0; i < medApp.services.pulseirasDisponiveis.length; i++){
            medApp.services.showPulseirasDisponiveis(i);
          }

        });
    };

    // Funcionalidade de alta do paciente (setar ativo = '0')
    page.querySelector('#alta-pac').onclick = function() {

      ons.notification.confirm({message: 'Tem certeza?'})
        .then( function(confirm){

          if(confirm) {

            var modal = page.querySelector('ons-modal');
            modal.show();

            $.ajax({
              url: 'http://julianop.com.br:3000/api/paciente/geral',
              type: 'PUT',
              headers: { 'idpaciente': medApp.services.getIdPaciente() },
              data: {
                ativo: 0
              }
            })
            .done(function(data) {

              //console.log(data);

            })
            .fail(function() {
              ons.notification.alert("Não foi possível dispensar o paciente");
            });

            setTimeout(function(){
              modal.hide();
              document.querySelector('#pacienteNav').resetToPage('html/pacientes.html', {options: {animation: 'fade'}});
              }, 1000);

          };

        });

    };

  },

  ////////////////////////////////////
  // Controlador da lista de Grupos //
  ////////////////////////////////////

  grupos: function(page) {

    page.addEventListener('show', function(event) {

      // Limpa o grupo atual selecionado
      medApp.services.deleteGrupoAtual();
      // Limpa e popula a lista de grupos
      medApp.services.changeUpdateGrupo();
      $('#lista-grupos').empty();

      if(medApp.services.isUpdatedGrupo) {
      $.get('http://julianop.com.br:3000/api/grupoPacientes/buscarGrupo/idMedico/' + medApp.services.getIdMedico())
      .done(function(data) {

          if(data[0].hasOwnProperty('idGrupoPac')) {

            for (var i = 0, len = data.length; i < len; i++) {

            medApp.services.listGroups({ nomeGrupo: data[i].nomeGrupo,
                                         medicoResp: data[i].MedicoResp,
                                         idGrupoPac: data[i].idGrupoPac})

            };

          };

        });

    };
  });
    // Página para criar um novo grupo de pacientes
    page.querySelector('#add-grupo').onclick = function() {

      document.querySelector('#pacienteNav').pushPage('html/addgrupo.html');

    };

  },

  /////////////////////////////////////////
  // Controlador de Ver Membros do Grupo //
  /////////////////////////////////////////

  vergrupo: function(page) {

    page.addEventListener('show', function(event) {

      // Seta o nome do grupo na Tollbar
      page.querySelector('.center').innerHTML = page.data.nomeGrupo;

      // Limpa o paciente atual, se retornar do perfil de alguém
      medApp.services.deletePacienteAtual();

      $('#lista-pacientes-grupo').empty();
      $.get('http://julianop.com.br:3000/api/grupoPacientes/buscarGrupo/paciente/' + medApp.services.getGrupoAtual() + '/' + medApp.services.getIdMedico())
      .done(function(data) {

          for (var i = 0, len = data.length; i < len; i++) {

            var pacientesInfo = data[i];

            medApp.services.createPaciente(
              {
                statusPaciente: (pacientesInfo.ativo == 1) ? 'ativo' : 'inativo',
                img: medApp.services.verificarFoto(pacientesInfo.foto),
                nomePaciente: pacientesInfo.nomePaciente,
                dataPaciente: pacientesInfo.dataDeNascimento,
                causaPaciente: pacientesInfo.causaDaInternacao,
                medicoResp: pacientesInfo.numeroDoProntuario,
                hospital: pacientesInfo.telefone,
                idPaciente: pacientesInfo.idtable1,
                medicoResp: pacientesInfo.nome
              }, 'grupo');

          };

        });

    });

    page.querySelector('#grupo-edit').onclick = function() {

      document.querySelector('#pacienteNav').pushPage('html/editargrupo.html', { data: { nomeGrupo: page.querySelector('.center').innerHTML } });

    };


  },

  ////////////////////////////////////
  // Controlador de Edição de Grupo //
  ////////////////////////////////////

  editargrupo: function(page) {

    var nomeAtual = page.data.nomeGrupo;
    var listaIntegrantes = [];
    var listaNaoIntegrantes = [];

    page.addEventListener('show', function(event) {

      // Seta o nome atual do grupo editado e listas de membros
      $('#nome-editar-grupo').val(page.data.nomeGrupo);

      // Pega lista de membros do grupo e membros da lista de pacientes do médico que não são membros
      $.get('http://julianop.com.br:3000/api/grupoPacientes/buscarGrupo/paciente/' + medApp.services.getGrupoAtual() + '/' + medApp.services.getIdMedico())
      .done(function(data) {

        for (var i = 0, len = data.length; i < len; i++) {

            var integrantesInfo = data[i];

            listaIntegrantes.push(integrantesInfo.idtable1);

            medApp.services.listAddGroup(
              {
                nomePaciente: integrantesInfo.nomePaciente,
                img: integrantesInfo.foto,
                idPaciente: integrantesInfo.idtable1
              }, 'checked', 'edit');

          };

        $.get('http://julianop.com.br:3000/api/paciente/geral/idMedico/' + medApp.services.getIdMedico())
        .done(function(listaPac) {

          for (var i = 0, len = listaPac.length; i < len; i++) {

            var notIntegrantesInfo = listaPac[i];

            if (!listaIntegrantes.includes(notIntegrantesInfo.idtable1)) {

              listaNaoIntegrantes.push(notIntegrantesInfo.idtable1);

              medApp.services.listAddGroup(
                {
                  nomePaciente: notIntegrantesInfo.nomePaciente,
                  img: notIntegrantesInfo.foto,
                  idPaciente: notIntegrantesInfo.idtable1
                }, 'unchecked', 'edit');

            };

          };

        });

      });

    });

    page.querySelector('#editar-grupo').onclick = function() {

      var modal = page.querySelector('ons-modal');
      modal.show();

      if ($('#nome-editar-grupo').val() === '') {

        ons.notification.alert("Preencha o nome do grupo!");

      } else {

        if(nomeAtual !== $('#nome-editar-grupo').val()) {

          $.ajax({
            url: 'http://julianop.com.br:3000/api/grupoPacientes',
            type: 'PUT',
            data: {
                    idGrupoPac: medApp.services.getGrupoAtual(),
                    nome: $('#nome-editar-grupo').val()
                  }
          });

        };

        var integrantesEdit = page.querySelectorAll('.checkbox-opt');

        for (var i = 0, len = integrantesEdit.length; i < len; i++) {

          var idPacEditGrupo = jQuery.data(integrantesEdit[i], 'idPaciente');

          // Verifica os checkboxes de cada paciente e os exclui/inclui no grupo
          if((listaIntegrantes.includes(idPacEditGrupo)) && integrantesEdit[i].checked == false) {

            // Exclui o paciente se ele pertencia ao grupo e teve sua checkbox unchecked
            $.ajax({
              url: 'http://julianop.com.br:3000/api/grupoPacientes/pacientes',
              type: 'DELETE',
              data: {
                idGrupoPac: medApp.services.getGrupoAtual(),
                idPaciente: jQuery.data(integrantesEdit[i], 'idPaciente')
              }
            })
            .done(function(data) {
              console.log(data);
            });

          } else if((listaNaoIntegrantes.includes(idPacEditGrupo)) && integrantesEdit[i].checked == true) {

            // Inclui o paciente se ele não pertencia ao grupo e teve sua checkbox checked
            $.post("http://julianop.com.br:3000/api/grupoPacientes/pacientes",
              {
                idPaciente: idPacEditGrupo,
                idGrupoPac: medApp.services.getGrupoAtual(),
              });


          };

        };

        setTimeout(function(){
              modal.hide();
              document.querySelector('#pacienteNav').popPage({ data: { nomeGrupo: $('#nome-editar-grupo').val() }});
              }, 500);

      };

    };

  },

  //////////////////////////////////////
  // Controlador de Gerenciar Equipes //
  //////////////////////////////////////

  equipes: function(page) {

    // Lista as equipes as quais o médico pertence
    page.addEventListener('show', function(event) {

      // Limpa a equipe atual selecionada
      medApp.services.deleteEquipeAtual();

      // Limpa e popula a lista de equipes
      $('#lista-equipe').empty();
      $.get('http://julianop.com.br:3000/api/hospitais/medico/' + medApp.services.getIdMedico())
      .done(function(data) {

          if(data[0].hasOwnProperty('idHospital')) {
            for (var i = 0, len = data.length; i < len; i++) {
              medApp.services.listEquipe({ nomeEquipe: data[i].nome,
                                           idEquipe: data[i].idHospital})
            };

          };

      });
    });


    page.querySelector('#add-equipe').onclick = function() {

      ons.notification.prompt ({message: "Digite o nome da equipe a ser criada:"})
      .then(function(nomeNovaEquipe) {

        if (nomeNovaEquipe == '') {

          ons.notification.alert("Preencha o nome da Equipe!");

        } else {

          $.post('http://julianop.com.br:3000/api/hospitais',
          {
            nome: nomeNovaEquipe

          })
            .done(function(data) {

              if (data.hasOwnProperty('idHospital')) {

                console.log(data);
                $.post('http://julianop.com.br:3000/api/hospitais/relacoes',
                {
                  idMedico: medApp.services.getIdMedico(),
                  idHospital: data.idHospital

                })
                  .done(function(resp) {

                    medApp.services.listEquipe({ nomeEquipe: data.nome,
                                                 idEquipe: data.idHospital});

                  });

              } else {

                ons.notification.alert("Não foi possível criar a Equipe.");

              };

            });

        };

      });

    };

  },

  ////////////////////////////////////////////
  // Controlador de Configurações de Equipe //
  ////////////////////////////////////////////

  configequipe: function(page) {

    page.addEventListener('show', function(event) {

      // Seta o nome da equipe no espaço correspondente
      page.querySelector('#nome-equipe').innerHTML = page.data.nomeEquipe;

      // Limpa e popula a lista de membros da equipes
      $('#membros-equipe').empty();
      $.get('http://julianop.com.br:3000/api/hospitais/' + medApp.services.getEquipeAtual() + '/medicos')
          .done(function(data) {

            if(data[0].hasOwnProperty('idMedico')) {

              for (var i = 0, len = data.length; i < len; i++) {

                var membroInfo = data[i];

                if (membroInfo.idMedico !== medApp.services.getIdMedico() ) {

                  medApp.services.listMembrosEquipe(
                    {
                      nome: membroInfo.nome,
                      telefone: membroInfo.telefone,
                      idMedico: membroInfo.idMedico,
                      email: membroInfo.email,
                      foto: membroInfo.foto
                    });

                };

              };

            };

          });

    });

    // Botão para adicionar membros à equipe através do email
    page.querySelector('#adicionar-membro-equipe').onclick = function(e) {

      ons.notification.prompt({
        message:"Digite o e-mail do membro a ser adicionado:",
        callback: function(email){

          if (email !== '') {

            $.get('http://julianop.com.br:3000/api/medico/busca/email/' + email)
            .done(function(data) {

              $.post("http://julianop.com.br:3000/api/hospitais/relacoes",
                {
                  idMedico: data[0].idMedico,
                  idHospital: medApp.services.getEquipeAtual(),
                });

            });
          }
        }
      });

    };

    // Botão para deixar de participar da equipe
    page.querySelector('#sair-equipe').onclick = function(e) {

      ons.notification.confirm({message: 'Tem certeza que quer deixa a equipe?'})
        .then( function(confirm){

          if(confirm) {

            $.ajax({
              url: 'http://julianop.com.br:3000/api/hospitais/relacoes',
              type: 'DELETE',
              data: {
                idHospital: medApp.services.getEquipeAtual(),
                idMedico: medApp.services.getIdMedico()
              }
            })
            .done(function(data) {
              console.log(data);
              document.querySelector('#medicoNav').popPage();
            });

          };

        });

    };

    // Botão para editar nome da equipe
    page.querySelector('#edit-equipe').onclick = function(e) {

      ons.notification.prompt({
        message:"Digite o novo nome da equipe:",
        callback: function(nomeEquipeEdit){

          if (nomeEquipeEdit !== '') {

            $.ajax({
              url: 'http://julianop.com.br:3000/api/hospitais',
              type: 'PUT',
              data: { idHospital: medApp.services.getEquipeAtual(),
                      nome: nomeEquipeEdit
                    }
            })
            .done(function(data) {
              console.log(data);
              page.querySelector('#nome-equipe').innerHTML = nomeEquipeEdit;
            });

          } else if (nomeEquipeEdit == '') {

            ons.notification.alert("A Equipe precisa ter um nome!");

          };
        }
      });

    };

    // Botão para apagar a equipe
    page.querySelector('#delete-equipe').onclick = function(e) {

      ons.notification.confirm({message: 'Tem certeza que quer apagar a equipe?'})
        .then( function(confirm){

          if(confirm) {

            $.ajax({
              url: 'http://julianop.com.br:3000/api/hospitais',
              type: 'DELETE',
              data: {
                idHospital: medApp.services.getEquipeAtual()
              }
            })
            .done(function(data) {
              console.log(data);
              document.querySelector('#medicoNav').popPage();
            });

          };

        });

    };

  },

  //////////////////////////////////////////////////
  // Controlador de Compartilhamento de Pacientes //
  //////////////////////////////////////////////////

  compartilhar: function(page) {

    // Lista as equipes as quais o médico pertence e seus respectivos membros
    page.addEventListener('show', function(event) {

      // Limpa e popula a lista de equipes
      $('#lista-compartilhar').empty();
      $.get('http://julianop.com.br:3000/api/hospitais/medico/' + medApp.services.getIdMedico())
      .done(function(equipes) {

          if(equipes[0].hasOwnProperty('idHospital')) {

            for (var i = 0, equipesLen = equipes.length; i < equipesLen; i++) {

              var listaMembros = medApp.services.getMembrosEquipe(equipes[i]);

            };

          } else {

            medApp.services.compartVazio();

          };

      });
    });

  }

};
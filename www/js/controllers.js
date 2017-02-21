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

      var pass = $('#senha-cadastro').val();
      var confirm = $('#senha-confirm').val();
      var inputs = page.getElementsByTagName('input');

      if(medApp.services.checkEmptyField(inputs)){

        alert("Preencha todos os campos!");

      };

      if ( pass === confirm && !medApp.services.checkEmptyField(inputs) ) {

        $.post('https://pibicfitbit.herokuapp.com/api/medico/',
        {
          nomeMedico: $('#nome-cadastro').val(),
          cpfMedico: $('#cpf-cadastro').val(),
          especialidade: $('#esp-cadastro').val(),
          CRM: $('#crm-cadastro').val(),
          telefone: $('#telefone-cadastro').val(),
          email: $('#email-cadastro').val(),
          senha: $('#senha-cadastro').val()
        })
          .done(function(data) {
            ons.notification.alert(data);
            document.querySelector('#loginNav').popPage();
          });

      } else if(!medApp.services.checkEmptyField(inputs)) {

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

      $.get('https://pibicfitbit.herokuapp.com/api/medico/busca/ID/' + medApp.services.idAtualMedico)
      .done(function(data) {
        page.querySelector('#nome-perfil').innerHTML = data[0].nome;
        page.querySelector('#crm-perfil').innerHTML = data[0].CRM;
        page.querySelector('#esp-perfil').innerHTML = data[0].especialidade;
        page.querySelector('#tel-perfil').innerHTML = data[0].telefone;
        page.querySelector('#email-perfil').innerHTML = data[0].email;
      });

    });

    // Chama a página de editar perfil do médico
    page.querySelector('#edit-med').onclick = function() {

      document.querySelector('#medicoNav').pushPage('editarmedico.html', 
        {data:
        {nome: page.querySelector('.profile-name').innerHTML,
         CRM: page.querySelector('#crm-perfil').innerHTML,
         esp: page.querySelector('#esp-perfil').innerHTML,
         tel: page.querySelector('#tel-perfil').innerHTML,
         email: page.querySelector('#email-perfil').innerHTML
        }});

        //Objeto contendo as variáveis alteradas para .put no servidor

        var dadosNovos = {
          novoNome: page.data.nome,
          novoCrm: page.data.CRM, // TODO --> acrescentar na API (.put).
          novaEsp: page.data.esp,
          novoTel: page.data.tel,
          novoEmail: page.data.email, //TODO --> acrescentar na API (.put).
          novoCpf: 1234 //dummie TODO --> acrescentar na API (.put).
        };

        $('#nome-medico').val(dadosNovos.novoNome);
        $('#crm-medico').val(dadosNovos.novoCrm);
        $('#esp-medico').val(dadosNovos.novaEsp);
        $('#tel-medico').val(dadosNovos.novoTel);
        $('#email-medico').val(dadosNovos.novoEmail);
        $('#cpf-medico').val(dadosNovos.novoCpf);

        //Onclick event do botão salvar.

        document.querySelector('#salvar-med').onclick = function() {

          //Método PUT, responsável por alterar os dados do médico no servidor.

          $.put('https://pibicfitbit.herokuapp.com/api/medico/' + medApp.services.getIdAtualMedico, {
            idMedico: dadosNovos.novoCrm, //TODO --> verificar com o Jorge se foi alterado id-CRM.
            nome: dadosNovos.novoNome,
            especialidade: dadosNovos.novaEsp,
            telefone: dadosNovos.novoTel // TODO --> PEDIR PRO BACK ACRESCENTAR OS NOVOS CAMPOS!!
          }).fail(function() {
            ons.notification.prompt({message: 'Edição não efetuada.'});
          }).done(function(data) {
            console.log(data);
          });

          //Retorna para a página de perfil do médico

          document.querySelector('#medicoNav').popPage();
        };

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
    var pacientesInfo;

    /*
    //Request de lista de pacientes do médico AINDA A SE IMPLEMENTAR.
    $.get('https://pibicfitbit.herokuapp.com/api/paciente/geral/id/' + medApp.services.getIdAtualMedico)
      .done(function(data) {
        //console.log(data);
        pacientesInfo = data;
        console.log(pacientesInfo);
      });

    for (var i = 0, len = pacientesInfo.length; i < len; i++) {
      medApp.services.createPaciente(pacientesInfo[i]); // DEPOIS, apagar caso falha
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
    };
    */

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

    // Dados atuais para verificar alteração 
    var dadosEdit = {

      nomeEdit: page.data.nome,
      crmEdit: page.data.CRM,
      espEdit: page.data.esp, 
      telEdit: page.data.tel,
      emailEdit: page.data.email,

    };

    $('#nome-medico').val(dadosEdit.nomeEdit);
    $('#crm-medico').val(dadosEdit.crmEdit);
    $('#esp-medico').val(dadosEdit.espEdit);
    $('#tel-medico').val(dadosEdit.telEdit);
    $('#email-medico').val(dadosEdit.emailEdit);

    // Botão salvar altera os dados no servidor se houve mudanças 
    page.querySelector('#salvar-med').onclick = function() {

      var novoEdit = {

        nomeEdit: $('#nome-medico').val(),
        crmEdit: $('#crm-medico').val(),
        espEdit: $('#esp-medico').val(), 
        telEdit: $('#tel-medico').val(),
        emailEdit: $('#email-medico').val()

      };

      if (medApp.services.checkEdit(novoEdit, dadosEdit)) {

        console.log('editou');
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
      $.put('https://pibicfitbit.herokuapp.com/api/paciente/geral/' + medApp.services.getIdPaciente(),
      {
        nomePacienteNovo: dadosEdit.nomeEdit,
        novoProntuario: dadosEdit.prontEdit,
        novaFoto: dadosEdit.fotoEdit,
        novaCausa: dadosEdit.causaEdit,
        novaData: dadosEdit.idadeEdit
        //TODO --> PEDIR PARA O JORGE INSERIR CAMPOS EXTRAS NA API.
      })
        .fail( function(data){
          ons.notification.prompt({message: 'Alterações Não Efetuadas.'});
        })
        .done(function (data) {
          console.log(data);
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
            responsive: true
          }
      });
    },

    ///////////////////////////////////////
    // Controlador da lista de lembretes //
    ///////////////////////////////////////

    lembretes: function(page){

      /* Funcionalidade Antiga (adaptar)
      page.querySelector('#add-lembrete').onclick = function() {
        ons.notification.prompt({message: 'Escreva abaixo o lembrete:'})
          .then(function(texto){

            if( texto === '' ) {
              ons.notification.alert('Insira algum texto!');
            } else {
              medApp.services.createLembrete(texto);
            };

        });
      };
      */

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

      page.querySelector('#cadastrar-pac').onclick = function() {
        
        document.querySelector('#pacienteNav').popPage();

      };

    },

    configuracoes: function(page) {

      page.querySelector('#manage-pulseiras').onclick = function() {
        
        document.querySelector('#configuracoesNav').pushPage('pulseiras.html');

      };

    }

};
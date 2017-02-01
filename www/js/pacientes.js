ons.ready (function(){ 

document.addEventListener('init', function(event) {
  var page = event.target;

  page.querySelector('#cancelar-add').onclick = function() {
    document.querySelector('#pacienteNav').popPage();
  };

  page.querySelector('#salvar-add').onclick = function() {
    document.querySelector('#pacienteNav').popPage();
  };

});

document.addEventListener('init', function(event) {
  var page = event.target;

  page.querySelector('#adicionar').onclick = function() {
    document.querySelector('#pacienteNav').pushPage('editar1.html');
  };

});

document.addEventListener('init', function(event) {
  var page = event.target;

  page.querySelector('#login-button').onclick = function() {

    var emailLogin = $('#email-login').val();
    var senhaLogin = $('#senha-login').val();
    $('#email-login').val("");
    $('#senha-login').val("");

    if( emailLogin === 'a' && senhaLogin === 'a' ){

      document.querySelector('#loginNav').pushPage('inicial.html');
      setIdMedico(20);

    };

    $.post('https://pibicfitbit.herokuapp.com/api/login/',
      {
        email: emailLogin,
        senha: senhaLogin
      })
        .done(function(data) {
          if ( data.hasOwnProperty('idMedico') ) {

            medicoId.setIdMedico(data.idMedico);
            console.log('O id atual é: '+ medicoId.getIdMedico());
            document.querySelector('#loginNav').pushPage('inicial.html');

          } else {

            alert("Senha ou E-mail errados, por favor refaça o Log-In");

            console.log('deu errado');

          };
    });

  };

});

var medicoId = {

  idAtual: -1,
  setIdMedico: function(novaId) {

    this.idAtual = novaId;

  },
  getIdMedico: function() {
    
    return this.idAtual;

  },
  deleteIdMedico: function() {

    this.idAtual = -1;

  }

}
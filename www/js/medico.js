document.addEventListener('init', function(event) {
  var page = event.target;

  page.querySelector('#push-button').onclick = function() {
    document.querySelector('#medicoNav').pushPage('editar-medico.html');
    $.get('https://pibicfitbit.herokuapp.com/api/medico/busca/ID/' + medicoId.idAtual)
        .done(function(data) {
          document.getElementById('esp-perfil').innerHTML = data[0].especialidade;
        });
  };

});

document.addEventListener('init', function(event) {
  var page = event.target;

  page.querySelector('#salvar-med').onclick = function() {
    document.querySelector('#medicoNav').popPage();
  };

});

document.addEventListener('init', function(event) {
  var page = event.target;

  page.querySelector('#logoff').onclick = function() {

    medicoId.deleteIdMedico();
    console.log('Id apagado '+ medicoId.idAtual);
    document.querySelector('#loginNav').popPage( {options: {animation: 'fade'}});
  };

});



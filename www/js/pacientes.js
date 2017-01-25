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
    document.querySelector('#loginNav').pushPage('inicial.html');
  };

});

document.addEventListener('init', function(event) {
  var page = event.target;

  page.querySelector('#cadastro-button').onclick = function() {
    document.querySelector('#loginNav').pushPage('cadastro.html');
  };

});

document.addEventListener('init', function(event) {
  var page = event.target;

  page.querySelector('#cadastrar-med').onclick = function() {
    document.querySelector('#loginNav').popPage();
  };
  
});
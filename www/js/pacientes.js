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

  if (page.id === 'pacientes') {
    page.querySelector('#adicionar').onclick = function() {
      document.querySelector('#pacienteNav').pushPage('editar1.html', {data: {title: 'Adicionar Paciente'}});
    };
  } else if (page.id === 'editar1') {
    page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
  }
});
document.addEventListener('init', function(event) {
  var page = event.target;

  if (page.id === 'medico') {
    page.querySelector('#push-button').onclick = function() {
      document.querySelector('#medicoNav').pushPage('editar-medico.html', {data: {title: 'Editar Perfil'}});
    };
  } else if (page.id === 'editar-medico') {
    page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
  }

});

document.addEventListener('init', function(event) {
  var page = event.target;

  page.querySelector('#salvar-med').onclick = function() {
    document.querySelector('#medicoNav').popPage();
  };

});


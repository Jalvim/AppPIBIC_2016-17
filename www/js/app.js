// Lógica do App contida no objeto
window.medApp = {};

document.addEventListener('init', function(event) {
  var page = event.target;

  // Cada página chama seu controller dentro do obj. medApp
  if (medApp.controllers.hasOwnProperty(page.id)) {
    medApp.controllers[page.id](page);
  }
});
$('.modal-trigger').leanModal();

// Função para criação de novos lembretes via popup modal
function newElement() {
  var li = document.createElement("li");    // Cria item da lista
  var li_class = li.setAttribute('class', 'collection-item');    // Seta a classe dos items
  var inputValue = document.getElementById("lembrete").value;    // Seta o texto colocado pelo usuário
  var t = document.createTextNode(inputValue);
  li.appendChild(t);

  // Verifica se algo foi escrito
  if (inputValue === '') {
    alert("Você precisa escrever algo!");
  } else {
    document.getElementById("listaLembretes").appendChild(li);
  }
  document.getElementById("lembrete").value = "";

  // Cria o botão de fechar com a classe "closebtn" alinhado a direita
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "closebtn right";
  span.appendChild(txt);
  li.appendChild(span);

  // Cria a funcionalidade do botão fechar o lembrete
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function() {
      var div = this.parentElement;
      div.style.display = "none";
    }
  }

};

// Limpa o formulário do modal ao clicar "Cancelar"
function clearText() {

  document.getElementById("lembrete").value = "";

}

// Clica no botão fechar para esconder o lembrete
var close = document.getElementsByClassName("closebtn");
var i;
for (i = 0; i < close.length; i++) {
  close[i].onclick = function() {
    var div = this.parentElement;
    div.style.display = "none";
  }
}

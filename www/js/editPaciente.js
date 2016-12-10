$('.modal-trigger').leanModal();

// Funções que salvam as alterações feitas na edição do perfil
function nome() {

};

function idade() {};

function prontuario() {};

function email() {};

function internacao() {};

function add() {
  var li = document.createElement('li');
  var li_class = li.setAttribute('class', 'collection-item');
  var inputValue = document.getElementById("nomePaciente").value;    // Seta o texto colocado pelo usuário
  var t = document.createTextNode(inputValue);
  li.appendChild(t);

  if(inputValue = ''){
    alert("O campo - Nome - é obrigatório");
  } else {
    document.getElementById("nomePaciente").appendChild(li);
  }
  document.getElementById("nomePaciente").value = "";

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

function del() {};

// Funções que salvam as alterações feitas na edição do perfil
function nome() { // Função responsável por alterar o nome do paciente.
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

function idade() { // Função responsável por alterar a idade do paciente.

  var li = document.createElement('li');
  var li_class = li.setAttribute('class', 'collection-item');
  var inputValue = document.getElementById("idadePaciente").value;    // Seta o texto colocado pelo usuário
  var t = document.createTextNode(inputValue);
  li.appendChild(t);

  if(inputValue = ''){
    alert("O campo - Idade - é obrigatório");
  } else {
    document.getElementById("idadePaciente").appendChild(li);
  }
  document.getElementById("idadePaciente").value = "";

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

function prontuario() { // Função responsável por alterar o prontuário do paciente.

  var li = document.createElement('li');
  var li_class = li.setAttribute('class', 'collection-item');
  var inputValue = document.getElementById("idPaciente").value;    // Seta o texto colocado pelo usuário
  var t = document.createTextNode(inputValue);
  li.appendChild(t);

  if(inputValue = ''){
    alert("O campo - Prontuário - é obrigatório");
  } else {
    document.getElementById("idPaciente").appendChild(li);
  }
  document.getElementById("idPaciente").value = "";

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

function internacao() { // Função responsável por alterar a causa de internação do paciente.

  var li = document.createElement('li');
  var li_class = li.setAttribute('class', 'collection-item');
  var inputValue = document.getElementById("causaPaciente").value;    // Seta o texto colocado pelo usuário
  var t = document.createTextNode(inputValue);
  li.appendChild(t);

  if(inputValue = ''){
    alert("O campo - Causa de internação - é obrigatório");
  } else {
    document.getElementById("causaPaciente").appendChild(li);
  }
  document.getElementById("causaPaciente").value = "";

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

function add() { // Função responsável por adicionar um novo paciente na lista, ocntendo todos os dados necessários.

  nome();
  idade();
  prontuario();
  internacao();

};
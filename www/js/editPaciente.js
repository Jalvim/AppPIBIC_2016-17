
// Funções que salvam as alterações feitas na edição do perfil
function atualizaPaciente() { // Função responsável por alterar o nome do paciente.
  var li = document.createElement('li');
  var li_class = li.setAttribute('class', 'collection-item');
  var iV1 = document.getElementById("nomePaciente").value;    // Seta o texto colocado pelo usuário
  var iV2 = document.getElementById("causaPaciente").value;
  var iV3 = document.getElementById("idPaciente").value;
  var iV4 = document.getElementById("idMedico").value;
  var iV5 = document.getElementById("telePaciente").value;
  var iV6 = document.getElementById("fotoPaciente").value;
  var iV7 = document.getElementById("dataPaciente").value;
  var iV8 = document.getElementById("oAuthPaciente").value; // TODO --> Ver como resolver este problema.
  var t = document.createTextNode(inputValue);
  li.appendChild(t);

  if(iV1 === '' || iV2 === '' || iV3 === '' || iV4 === '' || iV5 === '' || iV6 === '' || iV7 === '' || iV8 === ''){
    // Condição que retorna que os campos obrigatórios não foram preenchidos
    alert("É necessário responder todos os campos.");
  } else { // Utiliza do método .POST para atualizar o BD. --> Todos os campos devem ser preenchidos e atualizados.
    document.getElementById("nomePaciente").appendChild(li);
    $.post("https://pibicfitbit.herokuapp.com/api/paciente/geral", {
      nomePaciente: "#nomePaciente",
      causaDaInternacao: "#causaPaciente",
      numeroDoProntuario: "#idPaciente",
      crmMedicoResponsavel: "#idMedico",
      telefone: "#telePaciente",
      foto: 0011010010100101001010,
      dataDeNascimento: "#dataPaciente",
      codigoOAuth: "#oAuthPaciente", //TODO DAR UM JEITO NESSA JOÇA.
      redirectUri: //TODO Encontrar a URL de retorno própria.
    });
  }
  //document.getElementById("nomePaciente").value = ""; //TODO --> averiguar utilidade.

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

function novoPaciente() {
  // Completar formulário com variável isNewPatient === true
  //TODO IMPLEMENTAR !!!
}
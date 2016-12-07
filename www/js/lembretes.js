$('.modal-trigger').leanModal();

$('#confirmar').on('click', function() {
    var texto = "";

    $('.badge').parent().each(function(){
        texto += this.firstChild.textContent + ': ';
        texto += this.lastChild.textContent + ', ';
    });

    $('#resumo').empty().text(texto);
});

$('.acao-limpar').on('click', function() {
    $('#numero-mesa').val('');
    $('.badge').remove();
});

function newElement() {
  var li = document.createElement("li");
  var li_href = li.setAttribute('href', '#confirmarRemov');
  var li_class = li.setAttribute('class', 'collection-item modal-trigger');
  var inputValue = document.getElementById("lembrete").value;
  var t = document.createTextNode(inputValue);
  li.appendChild(t);

  if (inputValue === '') {
    alert("Você precisa escrever algo!");
  } else {
    document.getElementById("listaLembretes").appendChild(li);
  }
  document.getElementById("lembrete").value = "";

}

function clearText() {

  document.getElementById("lembrete").value = "";

}

function removeElement() {

  var elem = document.getElementById('id');
  elem.parentNode.removeChild(elem);

}
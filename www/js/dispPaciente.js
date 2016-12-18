//Funcões para fazer o display das infos configuradas na lista de pacientes.
function dispNome() {
  var nome = jQuery("#nomePaciente").val();
  jQuery.load("Pacientes1.html", function(){
    jQuery("#li").html(nome); //li?? Encontrar forma de localizar o texto no HTML em q se deseja colocar o texto
  });
}
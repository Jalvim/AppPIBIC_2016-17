class DispPaciente{
  //Funcões para fazer o display das infos configuradas na lista de pacientes.
  dispNome= function () { // Nome
    var nome = jQuery("#nomePaciente").val();
    jQuery.load("Pacientes1.html", function(){
      jQuery("#li").html(nome); //li?? Encontrar forma de localizar o texto no HTML em q se deseja colocar o texto
    });
  }

  dispIdade = function () { // Idade
     var nome = jQuery("#idadePaciente").val();
     jQuery.load("Pacientes1.html", function(){
       jQuery("#li").html(nome); //li?? Encontrar forma de localizar o texto no HTML em q se deseja colocar o texto
     });
  }

  dispTele = function () { // Telefone
       var nome = jQuery("#telePaciente").val();
       jQuery.load("Pacientes1.html", function(){
         jQuery("#li").html(nome); //li?? Encontrar forma de localizar o texto no HTML em q se deseja colocar o texto
       });
    }

  dispId = function () { // Prontuário
     var nome = jQuery("#idPaciente").val();
     jQuery.load("Pacientes1.html", function(){
       jQuery("#li").html(nome); //li?? Encontrar forma de localizar o texto no HTML em q se deseja colocar o texto
     });
  }

  dispEmail = function () { // E-mail
     var nome = jQuery("#emailPaciente").val();
     jQuery.load("Pacientes1.html", function(){
       jQuery("#li").html(nome); //li?? Encontrar forma de localizar o texto no HTML em q se deseja colocar o texto
     });
  }

  dispCausa = function () { // Causa
     var nome = jQuery("#causaPaciente").val();
     jQuery.load("Pacientes1.html", function(){
       jQuery("#li").html(nome); //li?? Encontrar forma de localizar o texto no HTML em q se deseja colocar o texto
    });
  }

  dispObs = function () { // Observações
     var nome = jQuery("#obsPaciente").val();
     jQuery.load("Pacientes1.html", function(){
       jQuery("#li").html(nome); //li?? Encontrar forma de localizar o texto no HTML em q se deseja colocar o texto
     });
  }
}

ons.redy (function(){

    document.addEventListener('init', function{
    var page = event.target;

        $.get('https://pibicfitbit.herokuapp.com/api/paciente/geral/' + medicoCrm)//TODO --> Setar var medicoCrm.
        .done(function(data){

            if(data.hasOwnProperty('nomePaciente')){
                console.log('Retorno do request: ' + data);
                var dadosPacientes = data;
            } else {
                console.log('Request mal sucedido');
            }

        });
    });

    //TODO --> Organizar o array em variáveis do html.

    page.querySelesctor('#Paciente[i]').onclick = function(){ //TODO --> Colocar variável adequda no lugar de paciente
        pacienteId.setIdPaciente(dadosPaciente[i].idPaciente);
        pushPage();
    }

});


//Objeto utilizado para o manuzeio das IDs dos Pacientes de determinado médico.
var pacienteId = {
    idAtual: -1,
    setIdPaciente: function(novaId){
        this.idAtual = novaId;
    },
    getIdPaciente: function(){
        return this.idAtual;
    },
    deleteIdPaciente: function(){
        this.idAtual = -1;
    }
}
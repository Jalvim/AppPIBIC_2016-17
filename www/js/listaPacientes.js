ons.redy (function(){

    document.addEventListener('init', function{
    var page = event.target;

        $.get('https://pibicfitbit.herokuapp.com/api/paciente/geral/' + medicoCrm)//TODO --> Setar var medicoCrm.
        .done(function(data){
            console.log('Retorno do request: ' + data);
            //TODO --> Organizar o array em variáveis do html.
        });
    });


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
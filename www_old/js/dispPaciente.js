// TODO IMPLEMENTAR FUNÇÃO QUE SEPARE VARIÁVEIS UTILIZANDO O MÉTODO GET
function getGeralPaciente(){
    $.get("https://pibicfitbit.herokuapp.com/api/paciente/geral/" + idMedico, function(data, status){
         alert("Data: " + data "\nStatus: " + status);
    });
}

// Função responsável em setar os id's dos diferentes pacientes em variáveis.
function getIdPaciente(){
    Array idBasePaciente = {data[0], data[]}; //TODO encontrar forma de administrar os múltiplos ID's.
}

//Função responsável em armazenar o nome do DB em uma variável, no caso a ID  "nomePaciente".
function getNome(idBasePaciente){
    Array nomePaciente;
    for(var i=0; i<=Array.length(idPaciente); i += ){ // TODO ver o número de parâmetros até a repetição de infos.
        var j=0
        $.get("https://pibicfitbit.herokuapp.com/api/paciente/geral/" + idPaciente[i] + "nome", function(data, status){
                alert("Data: " + data + "\nStatus: " + status);
        });
        nomePaciente[j] = data[i];
        j++;
    }
}

//Função responsável em armazenar a idade do DB em uma variável, no caso a ID  "idadePaciente".
function getIdade(idBasePaciente){
    Array idadePaciente;
    for(var i=0; i<=Array.length(idPaciente); i += ){ // TODO ver o número de parâmetros até a repetição de infos.
        var j=0
        $.get("https://pibicfitbit.herokuapp.com/api/paciente/geral/" + idPaciente[i] + "nome", function(data, status){
                alert("Data: " + data + "\nStatus: " + status);
        });
        idadePaciente[j] = data[i];
        j++;
    }
}

//Função responsável em armazenar o telefone do DB em uma variável, no caso a ID  "telePaciente".
function getTelefone(idBasePaciente){
    Array telePaciente;
    for(var i=0; i<=Array.length(idPaciente); i += ){ // TODO ver o número de parâmetros até a repetição de infos.
        var j=0
        $.get("https://pibicfitbit.herokuapp.com/api/paciente/geral/" + idPaciente[i] + "nome", function(data, status){
                alert("Data: " + data + "\nStatus: " + status);
        });
        telePaciente[j] = data[i];
        j++;
    }
}

//Função responsável em armazenar o prontuário do DB em uma variável, no caso a ID  "idPaciente".
function getProntuario(idBasePaciente){
    Array idPaciente;
    for(var i=0; i<=Array.length(idPaciente); i += ){ // TODO ver o número de parâmetros até a repetição de infos.
        var j=0
        $.get("https://pibicfitbit.herokuapp.com/api/paciente/geral/" + idPaciente[i] + "nome", function(data, status){
                alert("Data: " + data + "\nStatus: " + status);
        });
        idPaciente[j] = data[i];
        j++;
    }
}

//Função responsável em armazenar o e-mail do DB em uma variável, no caso a ID  "emailPaciente".
function getEmail(idBasePaciente){
    Array emailPaciente;
    for(var i=0; i<=Array.length(idPaciente); i += ){ // TODO ver o número de parâmetros até a repetição de infos.
        var j=0
        $.get("https://pibicfitbit.herokuapp.com/api/paciente/geral/" + idPaciente[i] + "nome", function(data, status){
                alert("Data: " + data + "\nStatus: " + status);
        });
        emailPaciente[j] = data[i];
        j++;
    }
}

//Função responsável em armazenar a causaa da internação do DB em uma variável, no caso a ID  "causaPaciente".
function getCausa(idBasePaciente){
    Array causaPaciente;
    for(var i=0; i<=Array.length(idPaciente); i += ){ // TODO ver o número de parâmetros até a repetição de infos.
        var j=0
        $.get("https://pibicfitbit.herokuapp.com/api/paciente/geral/" + idPaciente[i] + "nome", function(data, status){
                alert("Data: " + data + "\nStatus: " + status);
        });
        causaPaciente[j] = data[i];
        j++;
    }
}

//Função responsável em armazenar umaobservação do DB em uma variável, no caso a ID  "obsPaciente".
function getObs(idBasePaciente){
    Array obsPaciente;
    for(var i=0; i<=Array.length(idPaciente); i += ){ // TODO ver o número de parâmetros até a repetição de infos.
        var j=0
        $.get("https://pibicfitbit.herokuapp.com/api/paciente/geral/" + idPaciente[i] + "nome", function(data, status){
                alert("Data: " + data + "\nStatus: " + status);
        });
        obsPaciente[j] = data[i];
        j++;
    }
}


// Funções utilizadas dentro do App

medApp.services = {

  idAtual: -1,  // ID do médico no login atual 

  // Função que seta o ID atual a cada login
  setIdMedico: function(novaId) {

    this.idAtual = novaId;

  },

  // Função que retorna o ID do login atual
  getIdMedico: function() {
    
    return this.idAtual;

  },

  // Função que limpa o ID no logoff
  deleteIdMedico: function() {

    this.idAtual = -1;

  },

  // Função que verifica se os dados do médico foram editados 
  checkEdit: function(novo, velho) {

    if ( novo.nomeEdit == velho.nomeEdit &&
        novo.crmEdit == velho.crmEdit &&
        novo.espEdit == velho.espEdit && 
        novo.telEdit == velho.telEdit) {

      return true;

    } else {

      return false;
    }; 

  }

};
function validar() {
    //pede os dados ao usuário
    var nome = form1.nome.value;
    var email = form1.email.value;
    var senha = form1.senha.value;
    var rep_senha = form1.rep_senha.value;


//verifica se está tudo preenchido
    if (nome == "") {
        alert('Nome Invalido');
        form1.nome.focus();
        return false;
    }

    if (email == "") {
        alert('Email Invalido');
        form1.email.focus();
        return false;
    }

    if (senha == "") {
        alert('Senha nao preenchida');
        form1.senha.focus();
        return false;
    }

    if (rep_senha == "") {
        alert('Redigite sua senha');
        form1.rep_senha.focus();
        return false;
    }

    //se o numero é menor que 8 esse telefone celular nao existe
    if(cel.length<8) {


        Alert('Numero incompleto');
        form1.cel.focus()
        return false;

    }
    //se as senhas nao são iguais, o usuário digitou errado
    if (senha != rep_senha) {
        alert('Senhas não sao iguais');
        form1.senha.focus();
        return false;
    }
    return true;
}
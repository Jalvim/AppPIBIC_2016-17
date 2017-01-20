

function conf(){



        var codigo='h212';
        var texto=confi.codigo.value;

        if (codigo != texto) {
            alert('Senhas não sao iguais');
            confi.texto.focus();
            return false;
        }

        return true;

    }



var form = document.getElementById('cadastroForm');


form.addEventListener('submit', function(event) {
   
    var inputs = [
        { element: document.getElementById('username'), minLength: 5, errorMessageEmpty: 'O nome é obrigatório.', errorMessageMinLength: 'O nome deve ter pelo menos 5 caracteres.' },
        { element: document.getElementById('userdate'), minLength: 1, errorMessageEmpty: 'A data de nascimento é obrigatória.' },
        { element: document.getElementById('userdocuments'), minLength: 1, errorMessageEmpty: 'O RG ou CPF é obrigatório.' },
        { element: document.getElementById('useremail'), minLength: 1, errorMessageEmpty: 'O email é obrigatório.', errorMessageInvalidEmail: 'Por favor, insira um email válido.' },
        { element: document.getElementById('userpassword'), minLength: 8, errorMessageEmpty: 'A senha é obrigatória.', errorMessageMinLength: 'A senha deve ter pelo menos 8 caracteres.', errorMessageWeak: 'A senha deve ter pelo menos 8 caracteres, incluindo pelo menos um número, uma letra maiúscula e um caractere especial (!@#$%^&*).' },
        { element: document.getElementById('usercpassword'), minLength: 8, errorMessageEmpty: 'A confirmação de senha é obrigatória.', errorMessageMinLength: 'A confirmação de senha deve ter pelo menos 8 caracteres.', errorMessageMatch: 'As senhas não coincidem.' }
    ];
    
    var hasError = false;
    var today = new Date();
    var userBirthDate = new Date(document.getElementById('userdate').value);

    // Verificar se a data de nascimento indica que o usuário é menor de 18 anos
    var age = today.getFullYear() - userBirthDate.getFullYear();
    var monthDiff = today.getMonth() - userBirthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < userBirthDate.getDate())) {
        age--;
    }
    if (age < 18) {
        window.location.href = '/cadastromenor';
        event.preventDefault();
        return;
    }

    inputs.forEach(inputData => {
        var input = inputData.element;
        var minLength = inputData.minLength;
        var errorMessageEmpty = inputData.errorMessageEmpty;
        var errorMessageMinLength = inputData.errorMessageMinLength;
        var errorMessageWeak = inputData.errorMessageWeak;
        var errorMessageMatch = inputData.errorMessageMatch;
        var errorMessageInvalidEmail = inputData.errorMessageInvalidEmail;

        var trimmedValue = input.value.trim();

        if (trimmedValue === "") {
            hasError = true;
            input.style.border = '1px solid red';
            var warningSpan = input.nextElementSibling;
            warningSpan.textContent = errorMessageEmpty;
        } else {
            input.style.border = '';

            if (minLength && trimmedValue.length < minLength) {
                hasError = true;
                input.style.border = '1px solid red';
                var warningSpan = input.nextElementSibling;
                warningSpan.textContent = errorMessageMinLength;
            } else {
                if (input.id === 'useremail' && !isValidEmail(trimmedValue)) {
                    hasError = true;
                    input.style.border = '1px solid red';
                    var warningSpan = input.nextElementSibling;
                    warningSpan.textContent = errorMessageInvalidEmail;
                } else if (input.id === 'userpassword' && !isStrongPassword(trimmedValue)) {
                    hasError = true;
                    input.style.border = '1px solid red';
                    var warningSpan = input.nextElementSibling;
                    warningSpan.textContent = errorMessageWeak;
                } else if (input.id === 'usercpassword' && trimmedValue !== document.getElementById('userpassword').value.trim()) {
                    hasError = true;
                    input.style.border = '1px solid red';
                    var warningSpan = input.nextElementSibling;
                    warningSpan.textContent = errorMessageMatch;
                } else {
                    var warningSpan = input.nextElementSibling;
                    warningSpan.textContent = '';
                }
            }
        }
    });

    if (hasError) {
        event.preventDefault();
    }
});

// Adiciona um event listener para o evento 'paste' no campo de confirmação de senha
document.getElementById('usercpassword').addEventListener('paste', function(event) {
    // Cancela o evento de colar
    event.preventDefault();
});

// Função para validar o formato do email
function isValidEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.(com|hotmail)+$/; // Aceita apenas .com e hotmail
    return emailRegex.test(email);
}

// Função para verificar se a senha é forte o suficiente
function isStrongPassword(password) {
    // Pelo menos 8 caracteres, 1 número, 1 letra maiúscula e 1 caractere especial
    var passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    return passwordRegex.test(password);
}

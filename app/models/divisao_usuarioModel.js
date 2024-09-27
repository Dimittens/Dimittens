// Definindo os tipos de usuários no sistema
const userTypes = {
    UNDERAGE: "underage",   // Menores de idade (usuário comum)
    ADULT: "adult",         // Maiores de idade (usuário comum)
    PSYCHOLOGIST: "psychologist",  // Psicólogo
    ADMIN: "admin"          // Administrador
};

// Definindo os planos de cada usuário comum
const subscriptionPlans = {
    NONE: "none",           // Sem plano
    MONTHLY: "monthly",     // Plano mensal
    SEMIANNUAL: "semiannual",// Plano semestral
    ANNUAL: "annual"        // Plano anual
};

// Função que retorna os detalhes do usuário (tipo de usuário, idade e plano, se for usuário comum)
function getUserDetails() {
    // Exemplo de dados que podem ser retornados de um banco de dados ou API
    const userDetails = getCurrentUserFromDatabase(); // Exemplo de função para pegar dados reais do usuário
}

// Função que separa o usuário por tipo, idade e plano
function routeUserBasedOnTypeAgeAndPlan() {
    const user = getUserDetails();

    // Verifica se o usuário é um psicólogo
    if (user.type === userTypes.PSYCHOLOGIST) {
        console.log("Página: Psicólogo - Página Inicial de Psicólogo");
        // Carrega a página inicial para psicólogos
        return;
    }

    // Verifica se o usuário é um administrador
    if (user.type === userTypes.ADMIN) {
        console.log("Página: Admin - Página Inicial de Administrador");
        // Carrega a página inicial para administradores
        return;
    }

    // Se o usuário for um usuário comum (não psicólogo nem admin), verifica idade e plano
    if (user.type === userTypes.UNDERAGE) {
        console.log("Página: Menor de Idade - Acesso Restrito");
        // Carrega página para menores de idade (sem acesso a planos)
        return;
    } else if (user.type === userTypes.ADULT) {
        console.log("Usuário é maior de idade.");

        // Verifica o plano do usuário maior de idade
        if (user.plan === subscriptionPlans.NONE) {
            console.log("Página: Maior de idade - Sem Plano");
            // Carrega a página para maiores de idade sem plano
        } else if (user.plan === subscriptionPlans.MONTHLY) {
            console.log("Página: Maior de idade - Plano Mensal");
            // Carrega a página para maiores de idade com plano mensal
        } else if (user.plan === subscriptionPlans.SEMIANNUAL) {
            console.log("Página: Maior de idade - Plano Semestral");
            // Carrega a página para maiores de idade com plano semestral
        } else if (user.plan === subscriptionPlans.ANNUAL) {
            console.log("Página: Maior de idade - Plano Anual");
            // Carrega a página para maiores de idade com plano anual
        } else {
            console.log("Tipo de plano desconhecido.");
            // Tratar casos inesperados de planos desconhecidos
        }
    }
}

// Chama a função para separar o usuário e carregar o conteúdo correto
routeUserBasedOnTypeAgeAndPlan();


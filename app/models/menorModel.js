var pool = require("../../config/pool_de_conexao");

const menorModel = {
  
    findAll: async () => {
        try {
            const [results] = await pool.query(
                "SELECT " +
                "ID_USUARIO, NOME_USUARIO, " +
                "EMAIL_USUARIO, SENHA_USUARIO, " +
                "DT_NASC_USUARIO, " +
                "DT_CRIACAO_CONTA_USUARIO, " +
                "CPF_USUARIO, " +
                "DIFERENCIACAO_USUARIO, " +
                "CPF_RESPONSAVEL, " +
                "NOME_RESPONSAVEL " +
                "FROM USUARIO WHERE DIFERENCIACAO_USUARIO = 'Menor de Idade'"
            );

            return results;
        } catch (error) {
            console.log("Erro ao encontrar os menores", error);
            return error;
        }
    },

    findAllEmails: async () => {
        try {
            const [results] = await pool.query(
                "SELECT EMAIL_USUARIO FROM USUARIO WHERE DIFERENCIACAO_USUARIO = 'Menor de Idade'"
            );
            return results.map(user => user.EMAIL_USUARIO);
        } catch (error) {
            console.log("Erro ao encontrar os emails dos menores", error);
            return [];
        }
    },

    findUserCPF: async (camposForm) => {
        try {
            const [results] = await pool.query(
                "SELECT * FROM USUARIO WHERE CPF_USUARIO = ?",  
                [camposForm.CPF_USUARIO] 
            );
            return results;
        } catch (error) {
            console.log("Erro ao comparar o CPF do menor", error);
            return error;
        }
    },

    findUser: async (camposForm) => {
        try {
            const [results] = await pool.query(
                "SELECT * FROM USUARIO WHERE CPF_USUARIO = ? AND DT_NASC_USUARIO = ?",  
                [camposForm.CPF_USUARIO, camposForm.DT_NASC_USUARIO] 
            );
            return results;
        } catch (error) {
            console.log("Erro ao buscar usuário:", error);
            return error;
        }
    },

    create: async (camposForm) => {
        try {
            const [results] = await pool.query(
                "INSERT INTO USUARIO SET ?", [camposForm] 
            );
            return results;
        } catch (error) {
            console.log("Erro ao criar a conta do menor", error);
            return null;
        }
    },
};

module.exports = menorModel;

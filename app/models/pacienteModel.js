var pool = require("../../config/pool_de_conexao");


const pacienteModel = {
  
    findAll: async () => {
    try {
        const [results] = await pool.query(
            "SELECT " +
                "ID_USUARIO, NOME_USUARIO " +
                "EMAIL_USUARIO,   SENHA_USUARIO " +
                "DT_NASC_USUARIO, " +
                "DT_CRIACAO_CONTA_USUARIO, " +
                "CPF_USUARIO, " +
                "DIFERENCIACAO_USUARIO, " +
                "PSICOLOGO_ID_PSICOLOGO, " +
                "PUBLICACAO_COMUNIDADE_ID_PUBLICACOMU, " +
                "CALENDARIO_ID_CALENDARIO " +
            "FROM USUARIO"
        );

        return results;
    } catch (error) {
        console.log("Erro ao encontrar os usuários", error);
        return error;
    }
},

findAllEmails: async () => {
    try {
        const [results] = await pool.query(
            "SELECT * FROM USUARIO WHERE EMAIL_USUARIO"
        );
        return results.map(user => user.EMAIL_USUARIO);
    } catch (error) {
        console.log("Erro ao encontrar os emails dos usuários", error);
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
        console.log("Erro ao comparar o CPF", error);
        return error;
    }
},


    create: async (camposForm) => {
        try {
            const [results] = await pool.query(
                "insert into USUARIO set ?", [camposForm] 
            )
            
            return results;
        } catch (error) {
            console.log("Erro ao criar a conta", error);
            return null;
        }
    },


};


module.exports = pacienteModel
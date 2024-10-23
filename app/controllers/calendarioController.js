const pool = require("../../config/pool_de_conexao");

exports.salvarEvento = async (req) => {
    try {
        const { data, nota, horarioInicio } = req.body;
        const usuarioId = req.session.autenticado.usuarioId; // ID do usuário logado

        const query = `
            INSERT INTO CALENDARIO (DATA_CALENDARIO, ANOTACOES_CALENDARIO, ID_USUARIO)
            VALUES (?, ?, ?);
        `;

        const dataCompleta = `${data} ${horarioInicio}`;

        // Executa a query no banco de dados
        const [result] = await pool.query(query, [
            dataCompleta,
            nota,
            usuarioId,
        ]);

        console.log("Evento salvo com sucesso:", result);

        return { success: true, message: "Evento salvo com sucesso!" };
    } catch (error) {
        console.error("Erro ao salvar evento:", error);
        return { success: false, message: "Erro ao salvar o evento." };
    }
};

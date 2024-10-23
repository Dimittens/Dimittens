const pool = require("../../config/pool_de_conexao");

exports.salvarEvento = async (req, res) => {
    try {
        const { data, nota, horarioInicio, horarioFim } = req.body;
        const usuarioId = req.session.autenticado.usuarioId; // ID do usuário logado na sessão

        const query = `
            INSERT INTO CALENDARIO (DATA_CALENDARIO, ANOTACOES_CALENDARIO, ID_USUARIO)
            VALUES (?, ?, ?);
        `;

        // Combina a data e os horários de início para formar o valor correto
        const dataCompleta = `${data} ${horarioInicio}`;

        // Executa a query no banco de dados
        const [result] = await pool.query(query, [
            dataCompleta, // Data e horário juntos
            nota,         // Anotações do evento
            usuarioId     // ID do usuário logado
        ]);

        console.log("Evento salvo com sucesso:", result);

        res.status(201).json({
            success: true,
            message: "Evento salvo com sucesso!",
        });
    } catch (error) {
        console.error("Erro ao salvar evento:", error);
        res.status(500).json({
            success: false,
            message: "Erro ao salvar o evento.",
        });
    }
};

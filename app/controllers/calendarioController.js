var pool = require("../../config/pool_de_conexao");

exports.salvarEvento = async (req, res) => {
  try {
    const { data, nota, horarioInicio, horarioFim, usuarioId } = req.body;

    const query = `
      INSERT INTO CALENDARIO (DATA_CALENDARIO, ANOTACOES_CALENDARIO, HUMOR_CALENDARIO, ID_USUARIO)
      VALUES (?, ?, '', ?);
    `;

    const [result] = await pool.query(query, [
      `${data} ${horarioInicio}`, // Formato completo de data e hora
      nota,
      usuarioId, // ID do usuário passado pelo front-end
    ]);

    res.status(200).json({ success: true, message: "Evento salvo com sucesso!" });
  } catch (error) {
    console.error("Erro ao salvar evento:", error);
    res.status(500).json({ success: false, message: "Erro ao salvar o evento." });
  }
};

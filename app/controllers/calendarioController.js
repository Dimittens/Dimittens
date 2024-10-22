var pool = require("../../config/pool_de_conexao");

exports.salvarEvento = async (req, res) => {
  try {
    const { data, nota, horarioInicio, horarioFim } = req.body;

    const query = `
      INSERT INTO CALENDARIO (DATA_CALENDARIO, ANOTACOES_CALENDARIO)
      VALUES (?, ?);
    `;

    const [result] = await pool.query(query, [
      `${data} ${horarioInicio}`, // Data e hora juntos
      nota,
    ]);

    const eventoId = result.insertId;

    res.status(200).json({
      success: true,
      message: "Evento salvo com sucesso!",
      eventoId: eventoId,
    });
  } catch (error) {
    console.error("Erro ao salvar evento:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao salvar o evento.",
    });
  }
};

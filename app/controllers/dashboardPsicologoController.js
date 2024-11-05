const pool = require('../../config/pool_de_conexao');

// Função para marcar um dia como disponível
async function marcarDisponivel(req, res) {
    const { day, month } = req.body;
    const userId = req.session.autenticado.usuarioId;
    const crp = req.session.autenticado.usuarioCRP;

    console.log(`Tentativa de marcar dia: usuário ${userId}, CRP ${crp}, dia ${day}, mês ${month}`); // Log de diagnóstico
    try {
        // Busca entrada para o mesmo usuário, CRP e mês
        const [rows] = await pool.query(
            `SELECT id, dias_disponiveis FROM DASHBOARDPSICOLOGO WHERE ID_USUARIO = ? AND CRP_USUARIO = ? AND MES_DIAS = ?`,
            [userId, crp, month]
        );

        if (rows.length > 0) {
            // Entrada existente encontrada; agora verificar os dias
            const existingDays = rows[0].dias_disponiveis ? rows[0].dias_disponiveis.split(",") : [];

            if (!existingDays.includes(String(day))) {
                existingDays.push(day); // Adiciona o novo dia
                const updatedDays = existingDays.join(",");

                // Atualiza o registro com os dias acumulados
                await pool.query(
                    `UPDATE DASHBOARDPSICOLOGO SET dias_disponiveis = ? WHERE id = ?`,
                    [updatedDays, rows[0].id]
                );

                console.log(`Dia ${day} adicionado aos dias disponíveis para o usuário ${userId} com CRP ${crp} no mês ${month}.`);
            } else {
                console.log(`Dia ${day} já está marcado como disponível para o usuário ${userId} com CRP ${crp} no mês ${month}.`);
            }
        } else {
            // Nenhuma entrada encontrada: cria um novo registro para o mês e CRP
            const [result] = await pool.query(
                `INSERT INTO DASHBOARDPSICOLOGO (ID_USUARIO, CRP_USUARIO, MES_DIAS, dias_disponiveis) VALUES (?, ?, ?, ?)`,
                [userId, crp, month, String(day)]
            );

            if (result.affectedRows > 0) {
                console.log(`Novo registro criado para o usuário ${userId} com CRP ${crp} com o dia ${day} no mês ${month}.`);
            } else {
                console.log(`Falha ao criar o novo registro para o usuário ${userId}.`);
            }
        }

        res.json({ success: true });
    } catch (error) {
        console.error("Erro ao marcar dia disponível:", error);
        res.status(500).json({ success: false, message: "Erro ao marcar dia disponível." });
    }
}

// Função para remover um dia específico da disponibilidade
async function removerDisponivel(req, res) {
    const { day, month } = req.body;
    const userId = req.session.autenticado.usuarioId;
    const crp = req.session.autenticado.usuarioCRP;

    if (!crp) {
        // Retorna erro se o CRP estiver ausente na sessão
        return res.status(400).json({ success: false, message: "Erro: CRP não encontrado na sessão." });
    }

    try {
        const [rows] = await pool.query(
            `SELECT dias_disponiveis FROM DASHBOARDPSICOLOGO WHERE ID_USUARIO = ? AND CRP_USUARIO = ? AND MES_DIAS = ?`,
            [userId, crp, month]
        );

        if (rows.length > 0) {
            let existingDays = rows[0].dias_disponiveis.split(",");
            existingDays = existingDays.filter(d => d !== String(day));

            const updatedDays = existingDays.join(",");

            if (updatedDays) {
                await pool.query(
                    `UPDATE DASHBOARDPSICOLOGO SET dias_disponiveis = ? WHERE ID_USUARIO = ? AND CRP_USUARIO = ? AND MES_DIAS = ?`,
                    [updatedDays, userId, crp, month]
                );
                console.log(`Dia ${day} removido da disponibilidade para o usuário ${userId} com CRP ${crp} no mês ${month}.`);
                return res.json({ success: true, status: "removed", message: `Disponibilidade do dia ${day} removida.` });
            } else {
                await pool.query(
                    `DELETE FROM DASHBOARDPSICOLOGO WHERE ID_USUARIO = ? AND CRP_USUARIO = ? AND MES_DIAS = ?`,
                    [userId, crp, month]
                );
                console.log(`Todos os dias de disponibilidade removidos para o mês ${month} do usuário ${userId} com CRP ${crp}.`);
                return res.json({ success: true, status: "removed", message: `Disponibilidade do dia ${day} removida.` });
            }
        } else {
            return res.status(404).json({ success: false, message: "Nenhuma disponibilidade encontrada para este dia." });
        }
    } catch (error) {
        console.error("Erro ao remover dia disponível:", error);
        res.status(500).json({ success: false, message: "Erro ao remover dia disponível." });
    }
}

module.exports = {
    marcarDisponivel,
    removerDisponivel,
};

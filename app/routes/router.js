const express = require('express');
const router = express.Router();
const pool = require('../../config/pool_de_conexao'); // Pool de conexão com o banco
const { listarEventosUsuario } = require('../controllers/calendarioController');

// Middleware para verificar autenticação
function verificarAutenticacao(req, res, next) {
    if (req.session.autenticado) {
        return next(); // Usuário autenticado, prosseguir
    } else {
        res.redirect('/loginpacientes'); // Redirecionar para login se não autenticado
    }
}

// Rotas principais (home e página logada)
router.get('/', (req, res) => {
    const autenticado = req.session.autenticado || false;
    res.render('pages/index', {
        pagina: autenticado ? 'homelogged' : 'home',
        autenticado: req.session.autenticado,
    });
});

router.get('/homelogged', verificarAutenticacao, (req, res) => {
    res.render('pages/index', {
        pagina: 'homelogged',
        autenticado: req.session.autenticado,
    });
});

// Rota de login para pacientes
router.get('/loginpacientes', (req, res) => {
    res.render('pages/index', { pagina: 'loginpacientes', autenticado: null });
});

router.post('/loginpacientes', async (req, res) => {
    try {
        const resultadoLogin = await userPacientesController.logar(req);
        if (resultadoLogin.success) {
            req.session.autenticado = {
                usuarioNome: resultadoLogin.dados.NOME_USUARIO,
                usuarioId: resultadoLogin.dados.ID_USUARIO,
                tipo: resultadoLogin.dados.DIFERENCIACAO_USUARIO,
            };

            const eventos = await listarEventosUsuario(req.session.autenticado.usuarioId);
            req.session.eventos = eventos;

            req.session.save((err) => {
                if (err) {
                    console.error('Erro ao salvar sessão:', err);
                    return res.status(500).send('Erro ao salvar sessão.');
                }
                res.redirect('/homelogged');
            });
        } else {
            res.status(401).render('pages/index', {
                pagina: 'loginpacientes',
                errorsList: resultadoLogin.errors || [{ msg: 'Erro desconhecido' }],
                autenticado: null,
            });
        }
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).render('pages/index', {
            pagina: 'loginpacientes',
            errorsList: [{ msg: 'Erro no servidor.' }],
            autenticado: null,
        });
    }
});

// Rota de logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erro ao destruir a sessão:', err);
            return res.status(500).redirect('/');
        }
        res.clearCookie('user_session');
        res.redirect('/');
    });
});

// Rota para listar eventos da sessão
router.get('/calendario/listar-sessao', verificarAutenticacao, (req, res) => {
    if (req.session.eventos) {
        res.status(200).json(req.session.eventos);
    } else {
        res.status(404).json({ message: 'Nenhum evento encontrado.' });
    }
});

// Rota de chat protegida
router.get('/chat', verificarAutenticacao, async (req, res) => {
    try {
        const sessoesChatAtivas = await pool.query(`
            SELECT DISTINCT
                c.ID_CONSULTAS as consultaId,
                u.NOME_USUARIO as psicologoNome,
                (SELECT MENSAGEM_CHAT 
                 FROM chat 
                 WHERE ID_CONSULTA = c.ID_CONSULTAS 
                 ORDER BY DATA_HORA_CHAT DESC 
                 LIMIT 1) as ultimaMensagem,
                c.DATAHORA_CONSULTAS as ultimaAtualizacao
            FROM consultas c
            JOIN usuario u ON (
                CASE 
                    WHEN c.USUARIO_ID_USUARIO = ? THEN c.PSICOLOGO_ID_PSICOLOGO = u.ID_USUARIO
                    ELSE c.USUARIO_ID_USUARIO = u.ID_USUARIO
                END
            )
            WHERE (c.USUARIO_ID_USUARIO = ? OR c.PSICOLOGO_ID_PSICOLOGO = ?)
              AND c.STATUS_CONSULTAS = 'Agendada'
        `, [req.session.autenticado.usuarioId, req.session.autenticado.usuarioId, req.session.autenticado.usuarioId]);

        res.render('pages/index', {
            pagina: 'chat',
            autenticado: req.session.autenticado,
            sessoesChatAtivas,
        });
    } catch (error) {
        console.error('Erro ao carregar chat:', error);
        res.status(500).render('pages/index', {
            pagina: 'chat',
            autenticado: req.session.autenticado,
            error: 'Erro ao carregar sessões de chat',
        });
    }
});

// Middleware para verificar se o usuário é psicólogo
async function verificarPsicologo(req, res, next) {
    const usuarioId = req.session.autenticado.usuarioId;

    try {
        const [result] = await pool.query(
            `SELECT DIFERENCIACAO_USUARIO FROM usuario WHERE ID_USUARIO = ?`,
            [usuarioId]
        );

        if (result.length > 0 && result[0].DIFERENCIACAO_USUARIO === 'Psicologo') {
            next(); // O usuário é psicólogo, prosseguir
        } else {
            res.status(403).send('Acesso negado. Apenas psicólogos podem acessar esta página.');
        }
    } catch (error) {
        console.error('Erro ao verificar psicólogo:', error);
        res.status(500).send('Erro no servidor.');
    }
}

// Rota protegida: formulário de consulta para psicólogos
router.get('/formularioconsulta', verificarAutenticacao, verificarPsicologo, (req, res) => {
    res.render('pages/index', {
        pagina: 'formularioconsulta',
        psicologoId: req.session.autenticado.usuarioId,
    });
});

// Rotas estáticas (carregar views específicas)
const rotasEstaticas = [
    'headerunlogged', 'faq', 'psicologos', 'interesses', 'transtornos',
    'sobrenos', 'perfil-comunidade', 'redirecionamentosuporte', 'comunidade',
    'criarpostagem', 'criarcomunidade', 'carroseltranstornos', 'comentarios',
    'rodape', 'passoapasso', 'passoapassopsico', 'editeseuperfil', 'perfil',
    'consultas', 'atividademensal', 'popuppsicologos'
];

// Registrar todas as rotas estáticas
rotasEstaticas.forEach((pagina) => {
    router.get(`/${pagina}`, (req, res) => {
        res.render('pages/index', { pagina, autenticado: req.session.autenticado || null });
    });
});

// Rota para banir usuário
router.post('/api/banir', verificarAutenticacao, async (req, res) => {
    const { nomeUsuario } = req.body;

    try {
        const [usuario] = await pool.query(
            `SELECT ID_USUARIO FROM usuario WHERE NOME_USUARIO = ?`, 
            [nomeUsuario]
        );

        if (usuario.length === 0) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
        }

        const usuarioId = usuario[0].ID_USUARIO;

        await pool.query(
            `UPDATE usuario SET DIFERENCIACAO_USUARIO = 'Banido' WHERE ID_USUARIO = ?`, 
            [usuarioId]
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Erro ao banir usuário:', error);
        res.status(500).json({ success: false, message: 'Erro ao banir usuário.' });
    }
});

module.exports = router;

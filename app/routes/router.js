const express = require('express');
const router = express.Router();
const pool = require('../../config/pool_de_conexao');
const { listarEventosUsuario } = require('../controllers/calendarioController');
const userPacientesController = require('../controllers/userPacientesController');
const userPsicologosController = require('../controllers/userPsicologosController');
const userMenorController = require('../controllers/userMenorController');

// Middleware para verificar autenticação
function verificarAutenticacao(req, res, next) {
    if (req.session.autenticado) {
        return next();
    }
    res.redirect('/loginpacientes');
}

// Rota principal: Home ou Página Logada
router.get('/', (req, res) => {
    const autenticado = req.session.autenticado || false;
    res.render('pages/index', {
        pagina: autenticado ? 'homelogged' : 'home',
        autenticado: req.session.autenticado,
    });
});

// Página Logada
router.get('/homelogged', verificarAutenticacao, (req, res) => {
    res.render('pages/index', {
        pagina: 'homelogged',
        autenticado: req.session.autenticado,
    });
});

// Cadastro de Pacientes
router.get('/cadastropacientes', (req, res) => {
    res.render('pages/index', {
        pagina: 'cadastropacientes',
        autenticado: null,
        errorsList: null,
        valores: {
            username: '',
            userdate: '',
            userpassword: '',
            useremail: '',
            userdocuments: ''
        }
    });
});

router.post('/cadastropacientes', async (req, res) => {
    try {
        const resultado = await userPacientesController.cadastrar(req);
        if (resultado.success) {
            res.redirect('/');
        } else {
            res.render('pages/index', {
                pagina: 'cadastropacientes',
                autenticado: null,
                errorsList: resultado.errors,
                valores: req.body,
            });
        }
    } catch (error) {
        console.error('Erro no cadastro:', error);
        res.status(500).render('pages/index', {
            pagina: 'cadastropacientes',
            errorsList: [{ msg: 'Erro no servidor.' }],
            valores: req.body,
        });
    }
});

// Cadastro de Psicólogos
router.get('/cadastropsicologos', (req, res) => {
    res.render('pages/index', {
        pagina: 'cadastropsicologos',
        autenticado: null,
        errorsList: null,
        valores: {
            username: '',
            useremail: '',
            userpassword: '',
            userdocuments: '',
            usercrp: ''
        }
    });
});

router.post('/cadastropsicologos', async (req, res) => {
    try {
        const resultado = await userPsicologosController.cadastrar(req);
        if (resultado.success) {
            res.redirect('/');
        } else {
            res.render('pages/index', {
                pagina: 'cadastropsicologos',
                errorsList: resultado.errors,
                valores: req.body,
            });
        }
    } catch (error) {
        console.error('Erro no cadastro de psicólogos:', error);
        res.status(500).render('pages/index', {
            pagina: 'cadastropsicologos',
            errorsList: [{ msg: 'Erro no servidor.' }],
            valores: req.body,
        });
    }
});

// Login de Pacientes
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
            res.redirect('/homelogged');
        } else {
            res.status(401).render('pages/index', {
                pagina: 'loginpacientes',
                errorsList: resultadoLogin.errors || [{ msg: 'Credenciais inválidas.' }],
            });
        }
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).render('pages/index', {
            pagina: 'loginpacientes',
            errorsList: [{ msg: 'Erro no servidor.' }],
        });
    }
});

// Login de Psicólogos
router.get('/loginpsicologos', (req, res) => {
    res.render('pages/index', { pagina: 'loginpsicologos', autenticado: null });
});

router.post('/loginpsicologos', async (req, res) => {
    try {
        const resultadoLogin = await userPsicologosController.logar(req);
        if (resultadoLogin.success) {
            req.session.autenticado = {
                usuarioNome: resultadoLogin.dados.NOME_USUARIO,
                usuarioId: resultadoLogin.dados.ID_USUARIO,
                tipo: resultadoLogin.dados.DIFERENCIACAO_USUARIO,
            };
            res.redirect('/homelogged');
        } else {
            res.render('pages/index', {
                pagina: 'loginpsicologos',
                errorsList: resultadoLogin.errors || [{ msg: 'Credenciais inválidas.' }],
            });
        }
    } catch (error) {
        console.error('Erro no login de psicólogos:', error);
        res.status(500).render('pages/index', {
            pagina: 'loginpsicologos',
            errorsList: [{ msg: 'Erro no servidor.' }],
        });
    }
});

// Chat Protegido
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
            sessoesChatAtivas,
            autenticado: req.session.autenticado,
        });
    } catch (error) {
        console.error('Erro ao carregar chat:', error);
        res.status(500).render('pages/index', { pagina: 'chat', error: 'Erro ao carregar o chat.' });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erro ao destruir a sessão:', err);
            res.status(500).redirect('/');
        } else {
            res.clearCookie('user_session');
            res.redirect('/');
        }
    });
});

// Rotas Estáticas
const rotasEstaticas = [
    'headerunlogged', 'faq', 'psicologos', 'interesses', 'transtornos',
    'sobrenos', 'perfil-comunidade', 'comunidade', 'criarpostagem',
    'criarcomunidade', 'comentarios', 'rodape', 'perfil'
];

rotasEstaticas.forEach((pagina) => {
    router.get(`/${pagina}`, (req, res) => {
        res.render('pages/index', { pagina, autenticado: req.session.autenticado || null });
    });
});

module.exports = router;

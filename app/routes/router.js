const express = require('express');
const router = express.Router();
const pool = require('../../config/pool_de_conexao');
const { salvarEvento, listarEventosUsuario } = require("../controllers/calendarioController");
const userPacientesController = require('../controllers/userPacientesController');
const userPsicologosController = require('../controllers/userPsicologosController');
const userMenorController = require('../controllers/userMenorController');
const { checkAuthenticatedUser } = require("../models/autenticador_middleware");


// Middleware para verificar autenticação
function verificarAutenticacao(req, res, next) {
    if (req.session.autenticado) {
        return next();
    }
    res.redirect('/loginpacientes');
}


router.get('/', (req, res) => {
    console.log('Sessão atual:', req.session); // Log de debug da sessão

    const autenticado = req.session.autenticado || null;
    const usuarioNome = autenticado ? autenticado.usuarioNome : 'Visitante';

    // Define que a página é 'homelogged' somente para a rota '/'
    const pagina = autenticado ? 'homelogged' : 'home';

    res.render('pages/index', {
        pagina: pagina,
        autenticado: autenticado,
        usuarioNome: usuarioNome,
    });
});



// Rotas Estáticas
router.get('/headerunlogged', (req, res) => {
    res.render('pages/index', { pagina: 'headerunlogged', autenticado: req.session.autenticado || null });
  });
  
  router.get('/faq', (req, res) => {
    res.render('pages/index', { pagina: 'faq', autenticado: req.session.autenticado || null });
  });
  
  router.get('/psicologos', (req, res) => {
    res.render('pages/index', { pagina: 'psicologos', autenticado: req.session.autenticado || null });
  });
  
  router.get('/interesses', (req, res) => {
    res.render('pages/index', { pagina: 'interesses', autenticado: req.session.autenticado || null });
  });
  
  router.get('/transtornos', (req, res) => {
    res.render('pages/index', { pagina: 'transtornos', autenticado: req.session.autenticado || null });
  });
  
  router.get('/sobrenos', (req, res) => {
    res.render('pages/index', { pagina: 'sobrenos', autenticado: req.session.autenticado || null });
  });
  
  router.get('/perfil-comunidade', (req, res) => {
    res.render('pages/index', { pagina: 'perfil-comunidade', autenticado: req.session.autenticado || null });
  });
  
  router.get('/comunidade', (req, res) => {
    res.render('pages/index', { pagina: 'comunidade', autenticado: req.session.autenticado || null });
  });
  
  router.get('/criarpostagem', (req, res) => {
    res.render('pages/index', { pagina: 'criarpostagem', autenticado: req.session.autenticado || null });
  });
  
  router.get('/criarcomunidade', (req, res) => {
    res.render('pages/index', { pagina: 'criarcomunidade', autenticado: req.session.autenticado || null });
  });
  
  router.get('/comentarios', (req, res) => {
    res.render('pages/index', { pagina: 'comentarios', autenticado: req.session.autenticado || null });
  });
  
  router.get('/rodape', (req, res) => {
    res.render('pages/index', { pagina: 'rodape', autenticado: req.session.autenticado || null });
  });
  
  router.get('/perfil', (req, res) => {
    res.render('pages/index', { pagina: 'perfil', autenticado: req.session.autenticado || null });
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
            // Adiciona as informações na sessão
            req.session.autenticado = {
                usuarioNome: req.body.username,  // Nome do usuário
                usuarioId: resultado.id,         // ID do usuário
                tipo: 'Comum',                   // Tipo de usuário
            };

            // Salva a sessão antes do redirecionamento
            req.session.save((err) => {
                if (err) {
                    console.error('Erro ao salvar sessão:', err);
                    return res.status(500).send('Erro ao salvar sessão.');
                }
                res.redirect('/');  // Redireciona para a página inicial
            });
        } else {
            res.status(401).render('pages/index', {
                pagina: 'cadastropacientes',
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
            req.session.autenticado = {
                usuarioNome: req.body.username,  // Nome do usuário
                usuarioId: resultado.id,         // ID do usuário
                tipo: 'Psicologo',
            };

            // Salva a sessão antes de redirecionar para garantir que será persistida
            req.session.save((err) => {
                if (err) {
                    console.error('Erro ao salvar sessão:', err);
                    return res.status(500).send('Erro ao salvar sessão.');
                }
                res.redirect('/');  // Redireciona para a página principal
            });
        } else {
            res.status(401).render('pages/index', {
                pagina: 'cadastropsicologos',
                errorsList: resultado.errors,
                valores: req.body,
            });
        }
    } catch (error) {
        console.error('Erro no cadastro:', error);
        res.status(500).render('pages/index', {
            pagina: 'cadastropsicologos',
            errorsList: [{ msg: 'Erro no servidor.' }],
            valores: req.body,
        });
    }
});

router.post('/cadastropacientes', async (req, res) => {
    try {
        const resultado = await userPacientesController.cadastrar(req);

        if (resultado.success) {
            req.session.autenticado = {
                usuarioNome: req.body.username,  // Nome do usuário
                usuarioCRP: req.body.usercrp,
                usuarioId: resultado.id,         // ID do usuário
                tipo: 'Psicologo',
            };

            // Salva a sessão antes de redirecionar para garantir que será persistida
            req.session.save((err) => {
                if (err) {
                    console.error('Erro ao salvar sessão:', err);
                    return res.status(500).send('Erro ao salvar sessão.');
                }
                res.redirect('/');  // Redireciona para a página principal
            });
        } else {
            res.status(401).render('pages/index', {
                pagina: 'cadastropacientes',
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

// Rota GET: Renderiza a página de cadastro de menor
router.get('/cadastromenor', (req, res) => {
    res.render('pages/index', {
        pagina: 'cadastromenor',
        autenticado: null,
        errorsList: null,
        valores: {
            username: '',
            userpassword: '',
            useremail: '',
            userdocuments: '',
            userdatemenor: '',
            userresponsaveldocuments: '',
            usernameresponsavel: ''
        }
    });
});

// Rota POST: Processa o cadastro de menor
router.post('/cadastromenor', async (req, res) => {
    try {
        const resultado = await userMenorController.cadastrar(req, res);

        if (resultado.success) {
            // Adiciona as informações na sessão
            req.session.autenticado = {
                usuarioNome: req.body.username,
                usuarioId: resultado.id,
                tipo: 'Menor de Idade'
            };

            // Salva a sessão antes do redirecionamento
            req.session.save((err) => {
                if (err) {
                    console.error('Erro ao salvar sessão:', err);
                    return res.status(500).send('Erro ao salvar sessão.');
                }
                res.redirect('/'); // Redireciona para a página inicial
            });
        } else {
            res.status(401).render('pages/index', {
                pagina: 'cadastromenor',
                errorsList: resultado.errorsList,
                valores: req.body
            });
        }
    } catch (error) {
        console.error('Erro no cadastro de menor:', error);
        res.status(500).render('pages/index', {
            pagina: 'cadastromenor',
            errorsList: [{ msg: 'Erro no servidor.' }],
            valores: req.body
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
            const usuario = resultadoLogin.usuario;

            // Configura a sessão
            req.session.autenticado = {
                usuarioNome: usuario.NOME_USUARIO,
                usuarioId: usuario.ID_USUARIO,
                tipo: usuario.DIFERENCIACAO_USUARIO,
            };

            // Salva a sessão antes de redirecionar para garantir que foi persistida
            req.session.save((err) => {
                if (err) {
                    console.error('Erro ao salvar sessão:', err);
                    return res.status(500).send('Erro ao salvar sessão.');
                }
                res.redirect('/'); // Redireciona corretamente
            });
        } else {
            console.log('Erros enviados para renderização:', resultadoLogin.errors);

            // Renderiza a página com os erros e mantém os valores inseridos pelo usuário
            res.status(401).render('pages/index', {
                pagina: 'loginpacientes',
                errorsList: resultadoLogin.errors,
                valores: req.body, // Mantém os valores preenchidos no formulário
            });
        }
    } catch (error) {
        console.error('Erro no login de pacientes:', error);
        res.status(500).render('pages/index', {
            pagina: 'loginpacientes',
            errorsList: [{ msg: 'Erro no servidor.' }],
            valores: req.body, // Mantém os valores
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

            req.session.save((err) => {
                if (err) {
                    console.error('Erro ao salvar sessão:', err);
                    return res.status(500).send('Erro ao salvar sessão.');
                }
                res.redirect('/');
            });
        } else {
            console.log('Erros enviados para renderização:', resultadoLogin.errors);

            res.status(401).render('pages/index', {
                pagina: 'loginpsicologos',
                errorsList: resultadoLogin.errors,
                valores: req.body,
            });
        }
    } catch (error) {
        console.error('Erro no login de psicólogos:', error);

        res.status(500).render('pages/index', {
            pagina: 'loginpsicologos',
            errorsList: [{ msg: 'Erro no servidor.' }],
            valores: req.body,
        });
    }
});




// Rota GET: Renderiza a página de login de dependentes
router.get('/logindependentes', (req, res) => {
    res.render('pages/index', {
        pagina: 'logindependentes',
        autenticado: null,
        errorsList: null
    });
});

// Rota POST: Processa o login de dependentes
router.post('/logindependentes', async (req, res) => {
    try {
        const resultadoLogin = await userMenorController.logar(req);

        if (resultadoLogin.success) {
            const usuario = resultadoLogin.usuario;

            // Preenche a sessão com as informações do usuário
            req.session.autenticado = {
                usuarioNome: usuario.NOME_USUARIO,
                usuarioId: usuario.ID_USUARIO,
                tipo: usuario.DIFERENCIACAO_USUARIO
            };

            // Salva a sessão antes do redirecionamento
            req.session.save((err) => {
                if (err) {
                    console.error('Erro ao salvar sessão:', err);
                    return res.status(500).send('Erro ao salvar sessão.');
                }
                res.redirect('/'); // Redireciona para a página inicial
            });
        } else {
            console.log('Erros para renderização:', resultadoLogin.errors);

            // Renderiza a página com os erros e mantém os valores inseridos
            res.status(401).render('pages/index', {
                pagina: 'logindependentes',
                errorsList: resultadoLogin.errors,
                valores: req.body, // Mantém os valores preenchidos no formulário
            });
        }
    } catch (error) {
        console.error('Erro no login dependentes:', error);
        res.status(500).render('pages/index', {
            pagina: 'logindependentes',
            errorsList: [{ msg: 'Erro no servidor.' }],
            valores: req.body, // Mantém os valores
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

// Renderiza a página de calendário
router.get("/calendario", checkAuthenticatedUser, (req, res) => {
    res.render("pages/index", {
      pagina: "calendario",
      autenticado: req.session.autenticado,
    });
  });
  
  // Rota para salvar um evento (POST)
  router.post("/calendario/salvar", checkAuthenticatedUser, async (req, res) => {
    try {
      const resultado = await salvarEvento(req, false);
      if (resultado.success) {
        return res.status(201).json(resultado);
      } else {
        return res.status(400).json(resultado);
      }
    } catch (error) {
      console.error("Erro na rota de salvar evento:", error);
      if (!res.headersSent) {
        return res.status(500).json({ success: false, message: "Erro interno do servidor." });
      }
    }
  });
  
  // Rota para editar um evento (PUT)
  router.put("/calendario/editar/:id", checkAuthenticatedUser, async (req, res) => {
    try {
      const resultado = await salvarEvento(req, true);
      if (resultado.success) {
        return res.status(200).json(resultado);
      } else {
        return res.status(400).json(resultado);
      }
    } catch (error) {
      console.error("Erro ao editar evento:", error);
      res.status(500).json({ success: false, message: "Erro interno do servidor." });
    }
  });
  
  // Rota para listar todos os eventos do usuário (GET)
  router.get("/calendario/listar-sessao", checkAuthenticatedUser, async (req, res) => {
    try {
      const usuarioId = req.session.autenticado.usuarioId;
      const eventos = await listarEventosUsuario(usuarioId);
      res.status(200).json(eventos);
    } catch (error) {
      console.error("Erro ao listar eventos:", error);
      res.status(500).json({ message: "Erro ao listar eventos." });
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



module.exports = router;

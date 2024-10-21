const bd = require("../../config/pool_de_conexao");

class Postagem {
    static criarPostagem(idUsuario, titulo, tipo, topico, idComunidade, imagemPostagem) {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO Postagens (idUsuario, titulo, tipo, topico, idComunidade, imagemPostagem) VALUES (?, ?, ?, ?, ?, ?)`;
            bd.query(query, [idUsuario, titulo, tipo, topico, idComunidade, imagemPostagem], (err, results) => {
                if (err) {
                    return reject(err);
                    
                }
                resolve(results);
                console.log('Criação da Postagem:', results);
            });
        });
    }
}

module.exports = Postagem;
// /models/postModel.js
const db = require('../config/dbConfig');

// Função para salvar a postagem no banco de dados
const savePost = (userId, content, callback) => {
    const query = 'INSERT INTO posts (user_id, content, created_at) VALUES (?, ?, NOW())';
    
    db.query(query, [userId, content], (err, result) => {
        if (err) {
            console.error('Erro ao salvar a postagem:', err);
            callback(err, null);
        } else {
            console.log('Postagem salva com sucesso:', result);
            callback(null, result);
        }
    });
};

module.exports = { savePost };
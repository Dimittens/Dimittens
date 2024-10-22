require('dotenv').config(); // Garante o carregamento das variáveis do .env
const mysql = require('mysql2');
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true,
});

pool.getConnection((err, conn) => {
    if (err) {
        console.error("Erro na conexão com o banco de dados:", err.code);
        console.error("Mensagem SQL:", err.sqlMessage);
    } else {
        console.log("Conectado ao Banco de dados");
        conn.release(); // Libera a conexão de volta para o pool
    }
});


module.exports = pool.promise();

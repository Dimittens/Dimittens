const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true,
    connectTimeout: 20000,  // 20 segundos de timeout para conectar
    acquireTimeout: 20000,  // 20 segundos para adquirir conexão do pool
});

pool.getConnection((err, conn) => {
    if (err) {
        console.error("Erro na conexão com o banco de dados:", err.code);
        console.error("Mensagem SQL:", err.sqlMessage || 'Não disponível');
    } else {
        console.log("Conectado ao Banco de dados");
        conn.release(); // Libera a conexão
    }
});

module.exports = pool.promise();

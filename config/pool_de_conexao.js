const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'hv-mtl2-020.clvrcld.net',  // Direct Hostname
    port: 13728,  // Direct Port
    user: 'ubeinqxvw6gz7f5h',
    password: 'a6zpJpq0zMWb2YxQxw3Z',
    database: 'b7nmairb8dsvar1ji739',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true,
    connectTimeout: 30000,
    acquireTimeout: 30000,
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

const mysql = require('mysql2');
const dbConfig = require('../../connection.json');

// Crear la conexión a la base de datos
const pool = mysql.createPool({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.pass,
    database: dbConfig.bd_name,
    waitForConnections: true,
    connectionLimit: 10,       // Número máximo de conexiones en el pool
    queueLimit: 0
});

module.exports = pool;

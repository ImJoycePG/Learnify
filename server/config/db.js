const mysql = require('mysql2');
const dbConfig = require('../../connection.json');

// Crear la conexión a la base de datos
const connection = mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.pass,
    database: dbConfig.bd_name
});

// Conectar a la base de datos
connection.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err.stack);
        return;
    }
    console.log('Conectado a la base de datos con id ' + connection.threadId);
});

module.exports = connection;

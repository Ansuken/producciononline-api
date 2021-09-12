const mysql = require('mysql');

// MYSQL
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.MYSQL_DB,
    port: process.env.DB_PORT
});

// Check connect
connection.connect(error=> {
    if (error) throw error;
    console.log('Acceso a la base de datos correcta');
})

module.exports = connection;
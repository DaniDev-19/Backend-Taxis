const {Pool} = require('pg');
const {db} = require('./config.js');

const pool = new Pool({
    user: db.user,
    password: db.password,
    host: db.host,
    port: db.port || 5432,
    database: db.database,
    ssl: {
        rejectUnauthorized: false 
    }
});

console.log('Conectando a la base de datos:', db);

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error al conectar a la Base de Datos:', err);
    } else {
        console.error('Conexión exitosa a PostgreSQL:', res.rows[0].now);
    }
});


function query (text, params){
    return pool.query(text, params);
}

function getClient () {
    return pool.connect();
}

module.exports = {
    query,
    getClient,
};
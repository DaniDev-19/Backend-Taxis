const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();


const app = express();

const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '.', 'data', 'user.json');

function readUsersFromFile() {
    if(!fs.existsSync(dataPath)) {
        return [];
    }
    const json = fs.readFileSync(dataPath, 'utf8');
    return json ? JSON.parse(json) : [];
}

function writeUsersToFile(users) {
    fs.writeFileSync(dataPath, JSON.stringify(users, null, 2), 'utf8');
}

const users = readUsersFromFile();
// const users = [
//     {id: 1, name: 'juan', edad: 30},
//     {id: 2, name: 'juan', edad: 20},
//     {id: 3, name: 'juan', edad: 70},
//     {id: 4, name: 'juan', edad: 23}
// ];

const corsOptions = { 
    origin: process.env.ALLOWED_ORIGINS || "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
};

app.use(express.json());
app.use(morgan('dev'));
app.use(cors(corsOptions));

app.use(helmet());


app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.get('/', (req, res) => {
    res.send('Hola Servidor');
});

app.get('/users',(req, res) => {
    res.json(users);
});

app.get('/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const user = users.find(u => u.id === id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
});

app.post('/users', (req, res, next) => {
    const {name, edad} = req.body;
    if (!name) {
        return next(new Error('El campo name es obligatorio'));
    }
    
    const newUser = {
        id: users.length ? users[users.length - 1].id + 1 : 1,
        name: name,
        edad
    };

    users.push(newUser);
    writeUsersToFile(users);
    res.status(200).json(newUser);
});

app.put('/users/:id', (req, res, next) => {
    const id = Number(req.params.id);
    const {name, edad} = req.body;
    const user = users.find(u => u.id === id);

    if (!user){
        return res.status(404).json({error: 'usuario no encontrado'});
    }
    if (!name){
        return res.status(400).json({error: 'El campo name es obligatorio'});
    }

    user.name = name;
    user.edad = edad; 
    writeUsersToFile(users);
    res.json(user);
});

app.delete('/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = users.findIndex(u => u.id === id);

    if(index === -1) {
        return res.status(404).json({error: 'Usuario no encontrado'});
    }

    users.splice(index, 1);
    writeUsersToFile(users);
    res.status(204).end();
});

app.use((err,req, res, next) => {
    console.error(err);
    res.status(500).json({
        status: 'error',
        message: err.message || 'Error del Servidor'
    });
})


const PORT = process.env.PORT || 3000;
app.listen(PORT,() => {
    console.log(`Servidor corriendo en el localhost: ${PORT}`);
});


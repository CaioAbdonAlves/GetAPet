const express = require('express');
const cors = require('cors');

const conn = require('./db/conn.js');

const app = express();
const port = 3001;

// Config JSON response
app.use(express.json());

// Solve CORS
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

// Public folder for images
app.use(express.static("public"));

// Routes
const userRoutes = require('./routes/UserRoutes.js');

app.use('/users', userRoutes);

app.listen(port, () => {
    console.log(`O servidor backend está rodando na porta: ${port}`);
})
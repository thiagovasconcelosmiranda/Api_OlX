require('dotenv').config();
const express = require('express');
const apiRouter = require('./src/routes');
const mongoose = require('mongoose');
const cors = require('cors');
const fileupload = require('express-fileupload');

const server = express();

mongoose.connect(process.env.DATABASE);

mongoose.Promise = global.Promise;
mongoose.connection.on('error', (error)=>{
    console.log("ERROR:", error.message);
})

server.use(cors())
server.use(express.json());
server.use(express.urlencoded({extended: true}));
server.use(fileupload());

server.use(express.static(__dirname+'./public'));

server.use(apiRouter);

server.listen(process.env.PORT, () =>{
     console.log(`- Rodando no endereço:  ${process.env.BASE}`);
});
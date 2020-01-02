'use strict'
//Cargar modulos de node para crear el servidor
var express = require('express');
var bodyParser = require('body-parser');

//Ejecutar express
var app = express();

//Cargar ficheros rutas
var article_routes = require('./routes/article');
//Cargar middlewares (Esto es algo que siempre se ejecuta antes de cargar la ruta o el controlador) 
app.use(bodyParser.urlencoded({extended: false}));//Cargar el bodyparser (lanzarlo, utilizarlo)
app.use(bodyParser.json());//Convertir cualquier petición que me llegue en un json (un objeto de js)

//Cargar el CORS para permitir peticiones desde el frontend
//El CORS es el acceso cruzado entre dominios, es importante configuarlo en la api para permitir el acceso 
//o permitir las llamas HTTP o las peticione ajax al api desde cualquier frontend
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Añadir prefijos a rutas / Cargar rutas, las debo cargar dentro de express para poder usarlas
//Con el use puedo cargar tanto middleware como cargar configuraciones dentro de express
app.use('/api', article_routes);
//Ruta o metodo de prueba para el api
/*
app.post('/datos-curso', (req, res)=>{
    var hola = req.body.hola;
    return res.status(200).send({
        curso: 'Master en Frameworks JS',
        autor: 'Víctorroblesweb',
        url: 'victorroblesweb.es',
        hola
    });
});
*/
//Exportar el modulo (fichero actual), para poder usarlo afuera y poder lanzar el servidor a escuahar
module.exports = app;
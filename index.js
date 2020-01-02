'use strict'
//Conexión a la bd de datos de mongoDB mediante mongoose
var mongoose = require('mongoose');//requerir el paquete de mongoose y guardarlo en una variable
var app = require('./app');//Cargar el modulo app que es donde se encuentra el servidor
var port = 3900; //Definir el puerto que quiero utilizar para la aplicación

mongoose.set('useFindAndModify', false);//Desactivar funciones antiguas para interaccion con bd
mongoose.Promise = global.Promise;//Configuración general para mejorar el trabajo con las promesas en mongoose
//Conexión a la bd de mongo
mongoose.connect('mongodb://localhost:27017/api_rest_blog', { useNewUrlParser: true })
        .then(()=>{
            console.log("La conexión a la base de datos se ha realizado correctamente!!!");

            //Crear el servidor y ponerme escuchar peticiones HTTP
            app.listen(port, ()=>{
                console.log('Servidor corriendo en http://localhost:'+port);
            });

        });


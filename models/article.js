'use strict'
//Cargar mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//Pasar los documentos y configuraciones que vamos a tener en la bd con mongoose
var ArticleSchema = Schema({
    title: String,
    content: String,
    date: { type: Date, default: Date.now },
    image: String
});

//Exportar como modulo para poder importarlo en otros archivos
//Creamos el modelo de la base de datos disciendole que cada documento que yo creo va a ser un articulo y que vamos a utilizar el schema o bd de ArticleSchema osea el que definimos arriba.
module.exports = mongoose.model('Article', ArticleSchema);
//Cuando mongoose guarda el documento, pluraliza el nombre que le dimos y lo pone en minúscula
//ejm: articles -->guarda documentos de este tipo y con esta estructua dentro de la colección
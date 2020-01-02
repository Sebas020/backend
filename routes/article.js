'use strict'
//Cargar express para poder utilizar las rutas 
var express = require('express');
//Cargo el controlador de article para poder usar las funciones y asignarselas a las rutas
var ArticleController = require('../controllers/article');
//Cargar el router de express para poder usar las peticiones HTTP
var router = express.Router();
//Requerir el multipar para poder subir archivos
var multipart = require('connect-multiparty');
//Configurar el middleware del multipar para indicarle donde guardar las imagenes
var md_upload = multipart({ uploadDir: './upload/articles'});

//Rutas de prueba
router.post('/datos-curso', ArticleController.datosCurso);
router.get('/test-de-controlador', ArticleController.test);

//Rutas para articulos
router.post('/save', ArticleController.save);
router.get('/articles/:last?', ArticleController.getArticles);
router.get('/article/:id', ArticleController.getArticle);
router.put('/article/:id', ArticleController.update);
router.delete('/article/:id', ArticleController.delete);
//Aplicarle el middleware del multpar a la ruta para poder realizar la subida de archivos
router.post('/upload-image/:id?', md_upload, ArticleController.upload);
router.get('/get-image/:image', ArticleController.getImage);
router.get('/search/:search', ArticleController.search);
//Exportar las rutas para poder usarlas, las debo cargar en el app.js para poder que express las reconozca y poder utilizarlas
module.exports = router;

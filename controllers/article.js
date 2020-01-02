'use strict'
//Importar libreras

var validator = require('validator');
var fs = require('fs');
var path = require('path');
var Article = require('../models/article');


var controller = {
    datosCurso: (req, res) => {
        var hola = req.body.hola;
        return res.status(200).send({
            curso: 'Master en Frameworks JS',
            autor: 'Víctorroblesweb',
            url: 'victorroblesweb.es',
            hola
        });
    },

    test: (req, res) =>{
        return res.status(200).send({
            message: 'Soy la acción test de mi controlador de articulos' 
        });
    },

    save: (req, res) =>{
        //Recoger los parámetros por post
        var params = req.body;
        
        //Validar los datos con validator(libreria)
        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            
        }catch(err){
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar' 
            });
        }

        if(validate_title && validate_content){
            
            //Crear el objeto a guardar
            var article = new Article();
            //Asignar valores al objeto
            article.title = params.title;
            article.content = params.content;
            if(params.image){
                article.image = params.image;
            }else{
                article.image = null;
            }
            
            //Guardar el articulo
            article.save((err, articleStored) => {
                if(err || !articleStored){
                    return res.status(404).send({
                        status: 'error',
                        message: 'El articulo no se ha guardado !!' 
                    });
                }
                //Devolver respuesta
                return res.status(200).send({
                    status: 'success',
                    article: articleStored
                });

            });
           
            
        }else{
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son váidos' 
            });
        }
        
    },
    getArticles: (req, res) => {

        var query = Article.find({});

        var last = req.params.last;
        if(last || last != undefined){
            query.limit(5);
        }
        //Find
        query.find({}).sort('-_id').exec((err, articles) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los articulos' 
                });
            }
            if(!articles){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos para mostrar' 
                });
            }
            return res.status(200).send({
                status: 'success',
                articles: articles 
            });
        }); 
    },
    getArticle: (req, res) => {

        //Recoger el id de la url
        var artcleId = req.params.id; 
        //Comprobar si existe
        if(!artcleId || artcleId == null){
            return res.status(404).send({
                status: 'error',
                message: 'No existe el articulo' 
            });
        }
        //Buscar el articulo
        Article.findById(artcleId, (err, article) => {
            if(err || !article){
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el articulo' 
                });
            }
            //Devolver el json
            return res.status(200).send({
                status: 'success',
                article: article
            });
        });
    },
    update: (req, res) => {

        //Recoger el id del articulo que viene por la url 
        var articleId = req.params.id;
        //Recoger los datos que llegan por put
        var params = req.body;
        //Validar los datos
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);

            if(validate_title && validate_content){
                //Hacer un FindAndUpdate
                Article.findOneAndUpdate({_id : articleId }, params, { new: true}, (err, articleUpdated) => {
                    if(err || !articleUpdated){
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error al actualizar'
                        });
                    }
                    //Devolver respuesta
                    return res.status(200).send({
                        status: 'success',
                        article: articleUpdated
                    });
                });
            }else{
                return res.status(200).send({
                    status: 'error',
                    message: 'La validación no es correcta'
                });
            }
        } catch (error) {
            return res.status(404).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }
    },
    delete: (req, res) =>{
        //Recoger el id de la url
        var articleId = req.params.id;
        //usar find and delete
        Article.findOneAndDelete({_id : articleId }, (err, articleRemoved) =>{
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al borrar'
                });
            }
            if(!articleRemoved){
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ha borrado el articulo, posiblemente no exista'
                });
            }
            return res.status(200).send({
                status: 'success',
                article: articleRemoved
            });
        });
    },
    upload: (req, res) =>{
        //Configuar el modulo de connect multiparty router/article.js (hecho)
        //Recoger el fichero del petición
        var file_name = 'Imagen no subida...';

        if(!req.files){
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }
        
        //Conseguir el nombre y la extensión del archivo
        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\');

        // * ADVERTENCIA * EN LINUX O MAC SERIA DE LA SIGTE MANERA
        // var file_split = file_path.split('/');

        //Nombre del archivo
        var file_name = file_split[2];

        //Extensión del fichero
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];
        //Comprobar la extensión, sólo imagenes, si no es válida borrar el archivo
        if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
            //Borar el archivo subido
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'error',
                    message: 'La extensión de la imagen no es válida'
                });
            });
        }else{
            //si todo es válido, sacar id de la url
            var articleId = req.params.id;

            if(articleId){
                //Buscar el articulo, asignarle el nombre de la imagen y actualizarlo
                Article.findOneAndUpdate({_id : articleId}, {image: file_name}, {new : true}, (err, articleUpdated)=>{
                    if(err || !articleUpdated){
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error al guardar la imagen del articulo'
                        });
                    }
                    
                    return res.status(200).send({
                        status: 'success',
                        article: articleUpdated
                    });
                });
            }else{
                return res.status(200).send({
                    status: 'success',
                    image: file_name
                });
            }
        }
    },//End upload file
    getImage: (req, res) => {
        //Sacar el nombre del fichero
        var file = req.params.image;
        //Sacar el path de la imagen
        var path_file = './upload/articles/'+file;

        fs.exists(path_file, (exists) => {
            if(exists){
                return res.sendFile(path.resolve(path_file));
            }else{
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe'
                });
            }
        });
    },
    search: (req, res) =>{
        //Sacar el string a buscar 
        var searchString = req.params.search;
        //Find or
        Article.find({ "$or":[
            {"title": {"$regex": searchString, "$options": "i"}},
            {"content": {"$regex": searchString, "$options": "i"}}
        ]})
        .sort([['date', 'descending']])
        .exec((err, articles) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la petición'
                });
            }
            if(!articles || articles.length <= 0){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos que coincidan con tu busqueda'
                });
            }
            return res.status(200).send({
                status: 'success',
                articles
            });
        });
        
    }
};//End controller

module.exports = controller;
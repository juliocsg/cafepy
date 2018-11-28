const express = require('express');
const { verificarToken } = require('../middleware/autenticacion');

let app = express();
let Producto = require('../models/producto');

//=====================
//Obtener productos
//=====================
app.get('/productos', verificarToken, (req, res) => {
    //trae todos los productos
    //populate usuario categoria
    //paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);
    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });
        });
});

//=====================
//Obtener un producto
//=====================

app.get('/productos/:id', verificarToken, (req, res) => {
    //trae un producto
    //populate usuario categoria
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "ID no existe"
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });
        });
});
//=====================
//Buscar productos
//=====================
app.get('/productos/buscar/:termino', verificarToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });
        });
});

//=====================
//Crear un nuevo producto
//=====================
app.post('/productos', verificarToken, (req, res) => {
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        usuario: req.usuario._id,
        categoria: body.categoria
    });
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });

    //grabar el usuario
    //grabar una categoria del listado
});
//=====================
//Actualizar un nuevo producto
//=====================
app.put('/productos/:id', verificarToken, (req, res) => {
        let id = req.params.id;
        let body = req.body;
        /*let Product = {
            nombre: body.nombre,
            precioUni: body.precioUni,
            descripcion: body.descripcion
        }*/
        Producto.findByIdAndUpdate(id, { new: true, runValidators: true }, (err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID no existe'
                    }
                });
            }
            productoDB.nombre = body.nombre;
            productoDB.precioUni = body.precioUni;
            productoDB.categoria = body.categoria;
            productoDB.disponible = body.disponible;
            productoDB.descripcion = body.descripcion;

            productoDB.save((err, productoGuardado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    producto: productoGuardado
                });
            });
        });
        //grabar el usuario
        //grabar una categoria del listado
    })
    //=====================
    //Borrar un producto
    //=====================
app.delete('/productos/:id', verificarToken, (req, res) => {
    //cambiar el disponible
    //grabar el usuario
    //grabar una categoria del listado
    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "ID no existe"
                }
            });
        }
        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoBorrado,
                message: 'Producto Borrado'
            });
        });
    });
    /*Producto.findByIdAndDelete(id, (err, productoDB) =>{
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });*/
});

module.exports = app;
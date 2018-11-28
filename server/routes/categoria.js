const express = require('express');
const { verificarToken, verificarAdmin_Role } = require('../middleware/autenticacion');
const _ = require('underscore');
let app = express();

let Categoria = require('../models/categoria');

/**
 * Mostrar todas las categorias
 */
app.get('/categoria', verificarToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categoria: categorias
            });
        });
});
/**
 * Mostrar una categoria por ID
 */
app.get('/categoria/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});
/**
 * Crear nueva categoria
 */
app.post('/categoria', verificarToken, (req, res) => {
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
    //regresa la nueva categoria
    //req.usuario._id
});
/**
 * Mostrar todas las categorias
 */
app.put('/categoria/:id', verificarToken, (req, res) => {
    //descripcion de la categoria
    let id = req.params.id;
    let body = req.body; //_.pick(req.body, [nombre]);

    let descCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});
/**
 * Mostrar todas las categorias
 */
app.delete('/categoria/:id', [verificarToken, verificarAdmin_Role], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            //categoria: categoriaDB
            message: 'Categoria borrada'
        });
    });
    //solo un adminsitrador puede borrar categorias ADMIN_ROLE
    //Categoria.findByAndRemove
});

module.exports = app;
const express = require('express');

const bcrypt = require('bcrypt');

const _ = require('underscore');

const Usuario = require('../models/usuario');

const { verificarToken, verificarAdmin_Role } = require('../middleware/autenticacion');

const app = express();

app.get('/usuario', verificarToken, (req, res) => {
    //res.json('get Usuario LOCAL!!!');
    //{estado: true}
    /*return res.json({
        usuario: req.usuario,
        nombre: req.usuario.nombre,
        email: req.usuario.email

    });*/
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let cambiarEstado = {
        estado: true
    }
    let limite = req.query.limite || 5;
    limite = Number(limite);
    Usuario.find(cambiarEstado, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.count(cambiarEstado, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            });
        });
});
app.post('/usuario', [verificarToken, verificarAdmin_Role], (req, res) => {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,

    });
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        //usuarioDB.password = null;
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });
});
//Actualiación
app.put('/usuario/:id', [verificarToken, verificarAdmin_Role], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ["nombre", "email", "img", "role", "estado"]);

    Usuario.findByIdAndUpdate(id, body, { new: true /*, runValidators: true */ }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});
app.delete('/usuario/:id', [verificarToken, verificarAdmin_Role], function(req, res) {
    let id = req.params.id;

    //Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    let cambiaEstado = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (usuarioBorrado === null) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "Usuario no encontrado"
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    });
});
module.exports = app;
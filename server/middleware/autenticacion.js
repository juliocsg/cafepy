const jwt = require('jsonwebtoken');
require('../config/config');
/* ===========================
 * Verificar Token
   ==========================*/
//otra forma = let module.exports.verificarToken ... 
let verificarToken = (req, res, next) => {
    //Autorización
    let token = req.get('token');

    /*res.json({
        token: token
    });*/
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return
            res.status(401).json({
                ok: false,
                err: {
                    message: 'token no válido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
};
/* ===========================
 * Verificar AdminRole
   ==========================*/
let verificarAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
};
module.exports = {
    verificarToken,
    verificarAdmin_Role
}
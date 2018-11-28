//========================
// Puerto
//========================
process.env.PORT = process.env.PORT || 3000;

//========================
// Entorno
//========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//========================
// Vencimiento del Token
//========================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
//process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
process.env.CADUCIDAD_TOKEN = '48h';
//========================
// SEED de autenticación
//========================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

process.env.SEED_PRODUCCION = process.env.SEED_PRODUCCION || 'este-es-el-seed-produccion'
    //========================
    // Base de datos
    //========================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    //git heroku config:set MONGO_URI='sitio'
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

//========================
// Google Client ID
//========================

process.env.CLIENT_ID = process.env.CLIENT_ID || '529324214219-rhgor0c1ktt39l8rs7q9uclg5p21svvo.apps.googleusercontent.com';
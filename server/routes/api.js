const express = require('express');
const router = express.Router();
const { obtenerPregunta, registrarRespuesta  } = require('../controllers/preguntasController');

router.get('/obtenerPregunta', obtenerPregunta);
router.post('/registrarRespuesta', registrarRespuesta);

module.exports = router;

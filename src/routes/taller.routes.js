const { Router } = require('express');
const router = Router();
const tallerCtrl = require('../controllers/taller.controller');
const validateSchema = require('../middleware/validator.middleware');
const { tallerSchema, updateSchema } = require('../schemas/taller.schema');

router.get('/taller', tallerCtrl.getAllTalleres);
router.get('/taller/:codt', tallerCtrl.getTallerByCod);
router.post('/taller', validateSchema(tallerSchema), tallerCtrl.createTaller);
router.put('/taller/:codt', validateSchema(updateSchema), tallerCtrl.updateTaller);
router.delete('/taller/:codt', tallerCtrl.deleteTaller);

module.exports = router;

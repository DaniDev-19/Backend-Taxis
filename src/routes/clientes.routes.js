const {Router} = require('express');
const validateSchema = require('../middleware/validator.middleware');
const { createSchema, updateSchema } = require('../schemas/clientes.schema');
const {getClientes , getClienteById, createCliente, updateCliente, deleteCliente} = require('../controllers/clientes.controller');

const router = Router();

router 
    .route('/cliente')
    .post(validateSchema(createSchema), createCliente)
    .get(getClientes);
    
router 
    .route('/cliente/:codc')
    .get(getClienteById)
    .put(validateSchema(updateSchema), updateCliente)
    .delete(deleteCliente);
    
module.exports = router;
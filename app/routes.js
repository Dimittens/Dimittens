const express = require('express');
const CreateOrderController = require('./controllers/CreateOrderController');
const router = express.Router();
const createOrderController = new CreateOrderController();
router.post('/', createOrderController.handler.bind(createOrderController)); // Use bind para manter o contexto
module.exports = router;

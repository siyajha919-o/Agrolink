const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, orderController.createOrder);
router.post('/create-payment', protect, orderController.createPaymentOrder);
router.post('/verify', protect, orderController.verifyPayment);
router.post('/webhook', orderController.handleWebhook);
router.get('/', protect, orderController.getOrdersForUser);

module.exports = router;

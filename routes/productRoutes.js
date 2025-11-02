const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, farmerOnly } = require('../middleware/authMiddleware');
const { parser } = require('../utils/uploadImage');

router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);
router.post('/', protect, farmerOnly, parser.single('image'), productController.createProduct);
router.put('/:id', protect, farmerOnly, parser.single('image'), productController.updateProduct);
router.delete('/:id', protect, farmerOnly, productController.deleteProduct);

module.exports = router;

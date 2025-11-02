const Product = require('../models/Product');

const { uploadBufferToCloudinary } = require('../utils/uploadImage');

exports.createProduct = async (req, res) => {
  try {
    const { name, category, pricePerKg, quantityAvailable, location } = req.body;
    const farmerId = req.user.id;
    let imageUrl;
    if (req.file && req.file.buffer) {
      try {
        const result = await uploadBufferToCloudinary(req.file.buffer, `${Date.now()}_${req.file.originalname}`);
        imageUrl = result.secure_url;
      } catch (err) {
        console.warn('Image upload failed', err.message);
      }
    }
    const product = await Product.create({ name, category, pricePerKg, quantityAvailable, location, farmerId, imageUrl });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('farmerId', 'name email');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('farmerId', 'name email');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.farmerId.toString() !== req.user.id) return res.status(403).json({ message: 'Not allowed' });
    const updates = req.body;
    if (req.file && req.file.buffer) {
      try {
        const result = await uploadBufferToCloudinary(req.file.buffer, `${Date.now()}_${req.file.originalname}`);
        updates.imageUrl = result.secure_url;
      } catch (err) {
        console.warn('Image upload failed', err.message);
      }
    }
    Object.assign(product, updates);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.farmerId.toString() !== req.user.id) return res.status(403).json({ message: 'Not allowed' });
    await product.remove();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

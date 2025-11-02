const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String },
  pricePerKg: { type: Number, required: true },
  quantityAvailable: { type: Number, required: true, default: 0 },
  location: { type: String },
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

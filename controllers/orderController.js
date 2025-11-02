const Order = require('../models/Order');
const Product = require('../models/Product');
let razorpay = null;
try {
  const Razorpay = require('razorpay');
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
  }
} catch (err) {
  console.warn('Razorpay not configured or package missing');
}

exports.createOrder = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const buyerId = req.user.id;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.quantityAvailable < quantity) return res.status(400).json({ message: 'Insufficient quantity' });
    // reduce quantity
    product.quantityAvailable -= quantity;
    await product.save();
    const totalPrice = quantity * product.pricePerKg;
    const order = await Order.create({ buyerId, productId, quantity, totalPrice, status: 'pending' });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId).populate('productId');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!razorpay) return res.status(501).json({ message: 'Payment gateway not configured' });
    const options = {
      amount: Math.round(order.totalPrice * 100), // in paise
      currency: 'INR',
      receipt: `order_rcpt_${order._id}`
    };
    const rOrder = await razorpay.orders.create(options);
    res.json({ razorpayOrder: rOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Payment error' });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const crypto = require('crypto');
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    
    if (!razorpay) return res.status(501).json({ message: 'Payment gateway not configured' });
    
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || '')
      .update(body.toString())
      .digest("hex");
    
    const isAuthentic = expectedSignature === razorpay_signature;
    
    if (isAuthentic) {
      // Update order status to paid
      const order = await Order.findById(orderId);
      if (order) {
        order.status = 'paid';
        order.payment = { razorpay_order_id, razorpay_payment_id, razorpay_signature };
        await order.save();
      }
      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Verification error' });
  }
};

exports.getOrdersForUser = async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.user.id }).populate('productId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.handleWebhook = async (req, res) => {
  try {
    const crypto = require('crypto');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
    
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');
    
    if (digest === req.headers['x-razorpay-signature']) {
      // Webhook verified
      const event = req.body.event;
      const paymentEntity = req.body.payload.payment.entity;
      
      if (event === 'payment.captured') {
        // Find order by razorpay_order_id and update status
        const order = await Order.findOne({ 'payment.razorpay_order_id': paymentEntity.order_id });
        if (order) {
          order.status = 'paid';
          await order.save();
        }
      }
      res.json({ status: 'ok' });
    } else {
      res.status(400).json({ message: 'Invalid webhook signature' });
    }
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ message: 'Webhook processing error' });
  }
};

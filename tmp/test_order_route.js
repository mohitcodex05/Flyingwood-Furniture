const mongoose = require('mongoose');
require('dotenv').config({ path: 'backend/.env' });
const Order = require('./backend/models/Order');
const User = require('./backend/models/User');
const Product = require('./backend/models/Product');

async function test() {
  try {
    console.log('Connecting to:', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flyingwood-furniture');
    console.log('Connected');
    
    console.log('Fetching orders...');
    const orders = await Order.find()
      .populate('customer', 'username email')
      .sort({ createdAt: -1 })
      .limit(10);
    console.log('Orders found:', orders.length);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

test();

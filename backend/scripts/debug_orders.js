const mongoose = require('mongoose');
const Order = require('./models/Order');
const User = require('./models/User');
require('dotenv').config();

async function debugOrders() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flyingwood-furniture');
    console.log('Connected');
    
    const orders = await Order.find().lean();
    console.log('Total orders:', orders.length);
    
    orders.forEach((o, i) => {
      console.log(`Order ${i}:`, {
        _id: o._id,
        customer: o.customer,
        total: o.total,
        status: o.status
      });
    });
    
    process.exit(0);
  } catch (err) {
    console.error('Debug failed:', err);
    process.exit(1);
  }
}

debugOrders();

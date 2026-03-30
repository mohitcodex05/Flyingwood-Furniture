const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const simpleTest = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    const User = require('../models/User');
    const Product = require('../models/Product');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});

    // Create just ONE user
    const user = await User.create({
      name: "Test User",
      username: "testuser",
      email: "test@example.com",
      password: await bcrypt.hash('test123', 10),
      role: "customer"
    });
    console.log('✅ Created user:', user.email);

    // Try creating ONE simple product with minimal fields
    const product = await Product.create({
      name: "Test Product",
      description: "Test description",
      price: 99.99,
      category: "test", // Try simple category
      vendor: user._id,
      stock: 10,
      images: [] // Empty array
    });
    console.log('✅ Created product:', product.name);

    console.log('\n🎉 SUCCESS! Basic data insertion works.');
    console.log('You can now check MongoDB Atlas for the data.');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

simpleTest();
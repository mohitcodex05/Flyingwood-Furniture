const mongoose = require('mongoose');
require('dotenv').config();

const debugOrder = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    const Order = require('../models/Order');
    
    console.log('\n🔍 ORDER SCHEMA ANALYSIS:');
    console.log('========================');
    
    // Check schema paths
    const schemaPaths = Order.schema.paths;
    console.log('\n📋 Order Schema Fields:');
    
    // Check payment field specifically
    console.log('\n💳 Payment Field Details:');
    const paymentPath = Order.schema.path('payment');
    if (paymentPath && paymentPath.schema) {
      const paymentSchema = paymentPath.schema.paths;
      Object.keys(paymentSchema).forEach(path => {
        const schemaType = paymentSchema[path];
        console.log(`  - payment.${path}: ${schemaType.instance}`);
        
        // Check for enum values
        if (schemaType.enumValues && schemaType.enumValues.length > 0) {
          console.log(`    ↳ Allowed values: [${schemaType.enumValues.join(', ')}]`);
        }
      });
    }

    // Check status field
    console.log('\n📦 Status Field:');
    const statusPath = Order.schema.path('status');
    if (statusPath && statusPath.enumValues) {
      console.log(`  - Allowed values: [${statusPath.enumValues.join(', ')}]`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
    console.log('\n📊 Database connection closed');
  }
};

debugOrder();
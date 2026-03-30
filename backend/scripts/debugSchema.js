const mongoose = require('mongoose');
require('dotenv').config();

const debugSchema = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Get the Product model schema
    const Product = require('../models/Product');
    
    console.log('\n🔍 PRODUCT SCHEMA ANALYSIS:');
    console.log('==========================');
    
    // Check schema paths
    const schemaPaths = Product.schema.paths;
    console.log('\n📋 Schema Fields:');
    Object.keys(schemaPaths).forEach(path => {
      const schemaType = schemaPaths[path];
      console.log(`  - ${path}: ${schemaType.instance} ${schemaType.isRequired ? '(required)' : ''}`);
      
      // Check for enum values
      if (schemaType.enumValues && schemaType.enumValues.length > 0) {
        console.log(`    ↳ Allowed values: [${schemaType.enumValues.join(', ')}]`);
      }
      
      // Check for min/max values
      if (schemaType.validators && schemaType.validators.length > 0) {
        schemaType.validators.forEach(validator => {
          if (validator.type === 'max') {
            console.log(`    ↳ Max value: ${validator.max}`);
          }
          if (validator.type === 'min') {
            console.log(`    ↳ Min value: ${validator.min}`);
          }
        });
      }
    });

    // Check images field specifically
    console.log('\n🖼️ Images Field Details:');
    const imagesPath = Product.schema.path('images');
    if (imagesPath) {
      console.log('  - Instance type:', imagesPath.instance);
      console.log('  - Is array?', imagesPath instanceof mongoose.Schema.Types.Array);
      if (imagesPath.caster) {
        console.log('  - Array item type:', imagesPath.caster.instance);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
    console.log('\n📊 Database connection closed');
  }
};

debugSchema();
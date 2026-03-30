const mongoose = require('mongoose');
require('dotenv').config();

const debugImages = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    const Product = require('../models/Product');
    
    console.log('\n🔍 IMAGES FIELD DETAILED ANALYSIS:');
    console.log('=================================');
    
    const imagesPath = Product.schema.path('images');
    console.log('Images path:', imagesPath);
    
    if (imagesPath && imagesPath.caster) {
      console.log('Caster instance:', imagesPath.caster.instance);
      console.log('Caster constructor name:', imagesPath.caster.constructor.name);
      
      // Check if it's a subdocument array
      if (imagesPath.caster.schema) {
        console.log('\n📋 Images Subdocument Schema:');
        const subSchemaPaths = imagesPath.caster.schema.paths;
        Object.keys(subSchemaPaths).forEach(path => {
          const schemaType = subSchemaPaths[path];
          console.log(`  - ${path}: ${schemaType.instance}`);
        });
      }
    }

    // Try to create a test product with different image formats
    console.log('\n🧪 Testing image formats...');
    
    const testFormats = [
      { images: [] }, // Empty array
      { images: ["simple string"] }, // Simple string
      { images: [{ url: "object with url" }] }, // Object with url
      { images: [{ src: "object with src" }] }, // Object with src
      { images: [{ imageUrl: "object with imageUrl" }] } // Object with imageUrl
    ];

    for (let format of testFormats) {
      try {
        const testProduct = {
          name: "Test Product",
          description: "Test",
          category: "chairs",
          price: 100,
          stock: 10,
          vendor: new mongoose.Types.ObjectId(),
          ...format
        };
        
        const product = new Product(testProduct);
        await product.validate();
        console.log(`✅ Format works: ${JSON.stringify(format.images)}`);
      } catch (error) {
        console.log(`❌ Format fails: ${JSON.stringify(format.images)} - ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
    console.log('\n📊 Database connection closed');
  }
};

debugImages();

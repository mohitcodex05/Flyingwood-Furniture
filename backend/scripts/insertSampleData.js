const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Models
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

const clearExistingData = async () => {
  console.log('🗑️ Clearing existing data...');
  await User.deleteMany({});
  await Product.deleteMany({});
  await Order.deleteMany({});
  console.log('✅ Existing data cleared');
};

const createUsers = async () => {
  console.log('👥 Creating users...');
  
  const users = [
    // Admin User
    {
      name: 'Admin User',
      username: 'adminuser',
      email: 'admin@flyingwood.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    // Vendor Users
    {
      name: 'Eco Furniture Co.',
      username: 'ecofurniture',
      email: 'vendor1@flyingwood.com',
      password: await bcrypt.hash('vendor123', 10),
      role: 'vendor',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Sustainable Living',
      username: 'sustainableliving',
      email: 'vendor2@flyingwood.com', 
      password: await bcrypt.hash('vendor123', 10),
      role: 'vendor',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Green Wood Crafts',
      username: 'greenwoodcrafts',
      email: 'vendor3@flyingwood.com',
      password: await bcrypt.hash('vendor123', 10),
      role: 'vendor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    // Customer Users
    {
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      password: await bcrypt.hash('customer123', 10),
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Sarah Wilson',
      username: 'sarahwilson',
      email: 'sarah@example.com',
      password: await bcrypt.hash('customer123', 10),
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Mike Johnson',
      username: 'mikejohnson',
      email: 'mike@example.com',
      password: await bcrypt.hash('customer123', 10),
      role: 'customer', 
      avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Emily Davis',
      username: 'emilydavis',
      email: 'emily@example.com',
      password: await bcrypt.hash('customer123', 10),
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    // Staff User
    {
      name: 'Staff Member',
      username: 'staffmember',
      email: 'staff@flyingwood.com',
      password: await bcrypt.hash('staff123', 10),
      role: 'staff',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    }
  ];

  const createdUsers = await User.insertMany(users);
  console.log(`✅ Created ${createdUsers.length} users`);
  return createdUsers;
};

const createProducts = async (vendors) => {
  console.log('🛋️ Creating products...');

  const products = [
    // Sofa
    {
      name: "Modern Eco Sofa",
      description: "Sustainable sofa made from organic materials with superior comfort and modular design.",
      shortDescription: "Eco-friendly modular sofa",
      category: "sofas",
      subcategory: "sectional",
      tags: ["eco-friendly", "modular", "living-room"],
      price: 1299.99,
      comparePrice: 1599.99,
      costPrice: 899.99,
      sku: "SOFA-ECO-001",
      stock: 15,
      trackQuantity: true,
      allowBackorder: false,
      images: [
        {
          url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
          alt: "Modern eco sofa in living room setting",
          isPrimary: true
        },
        {
          url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
          alt: "Close-up of sofa fabric and design",
          isPrimary: false
        }
      ],
      dimensions: {
        length: 220,
        width: 95,
        height: 85,
        weight: 75
      },
      materials: ["Organic Cotton", "Reclaimed Wood", "Natural Latex"],
      colors: ["Natural", "Charcoal", "Olive"],
      features: ["Modular Design", "Removable Covers", "Stain Resistant"],
      sustainability: {
        ecoScore: 4.2,
        carbonFootprint: 45,
        isRecyclable: true,
        isBiodegradable: true,
        certifications: ["FSC Certified", "GOTS Organic"]
      },
      vendor: vendors[0]._id,
      vendorName: "Eco Furniture Co.",
      ratings: {
        average: 4.5,
        count: 23
      },
      salesCount: 12,
      viewCount: 156,
      status: "active",
      isFeatured: true,
      seo: {
        metaTitle: "Eco-Friendly Sofa | Sustainable Furniture",
        metaDescription: "Modern eco sofa made from sustainable materials",
        slug: "modern-eco-sofa"
      }
    },
    // Chair
    {
      name: "Organic Lounge Chair",
      description: "Ergonomic lounge chair made with organic materials for ultimate relaxation.",
      shortDescription: "Eco-friendly lounge chair",
      category: "chairs",
      subcategory: "lounge",
      tags: ["ergonomic", "organic", "reading-chair"],
      price: 599.99,
      comparePrice: 799.99,
      costPrice: 399.99,
      sku: "CHAIR-LNG-001",
      stock: 12,
      trackQuantity: true,
      allowBackorder: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=600&fit=crop",
          alt: "Organic lounge chair in modern interior",
          isPrimary: true
        }
      ],
      dimensions: {
        length: 85,
        width: 95,
        height: 105,
        weight: 22
      },
      materials: ["FSC Certified Wood", "Organic Wool", "Natural Latex"],
      colors: ["Walnut", "Oak", "Teak"],
      features: ["Ergonomic Design", "Swivel Base", "Adjustable Height"],
      sustainability: {
        ecoScore: 4.0,
        carbonFootprint: 28,
        isRecyclable: true,
        isBiodegradable: true,
        certifications: ["FSC Certified", "GOTS Organic"]
      },
      vendor: vendors[0]._id,
      vendorName: "Eco Furniture Co.",
      ratings: {
        average: 4.3,
        count: 18
      },
      salesCount: 8,
      viewCount: 89,
      status: "active",
      isFeatured: false,
      seo: {
        metaTitle: "Organic Lounge Chair | Sustainable Seating",
        metaDescription: "Comfortable eco-friendly lounge chair",
        slug: "organic-lounge-chair"
      }
    },
    // Table
    {
      name: "Sustainable Coffee Table",
      description: "Handcrafted coffee table from responsibly sourced bamboo with unique live edge design.",
      shortDescription: "Bamboo coffee table",
      category: "tables",
      subcategory: "coffee",
      tags: ["bamboo", "live-edge", "centerpiece"],
      price: 349.99,
      comparePrice: 449.99,
      costPrice: 249.99,
      sku: "TABLE-CFF-001",
      stock: 25,
      trackQuantity: true,
      allowBackorder: false,
      images: [
        {
          url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
          alt: "Sustainable bamboo coffee table",
          isPrimary: true
        }
      ],
      dimensions: {
        length: 120,
        width: 60,
        height: 45,
        weight: 18
      },
      materials: ["Bamboo", "Natural Oil Finish"],
      colors: ["Natural Bamboo", "Dark Bamboo"],
      features: ["Live Edge Design", "Water Resistant", "Easy Assembly"],
      sustainability: {
        ecoScore: 4.5,
        carbonFootprint: 12,
        isRecyclable: true,
        isBiodegradable: true,
        certifications: ["Rainforest Alliance", "Bamboo Certified"]
      },
      vendor: vendors[1]._id,
      vendorName: "Sustainable Living",
      ratings: {
        average: 4.7,
        count: 31
      },
      salesCount: 22,
      viewCount: 134,
      status: "active",
      isFeatured: true,
      seo: {
        metaTitle: "Sustainable Coffee Table | Bamboo Furniture",
        metaDescription: "Eco-friendly bamboo coffee table",
        slug: "sustainable-coffee-table"
      }
    },
    // Bed
    {
      name: "Eco-Friendly Bed Frame",
      description: "Sustainable bed frame made from reclaimed oak with sturdy slat system.",
      shortDescription: "Reclaimed wood bed frame",
      category: "beds",
      subcategory: "queen",
      tags: ["reclaimed-wood", "storage-bed", "bedroom"],
      price: 899.99,
      comparePrice: 1199.99,
      costPrice: 649.99,
      sku: "BED-QN-001",
      stock: 8,
      trackQuantity: true,
      allowBackorder: false,
      images: [
        {
          url: "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&h=600&fit=crop",
          alt: "Eco-friendly bed frame in bedroom",
          isPrimary: true
        }
      ],
      dimensions: {
        length: 210,
        width: 160,
        height: 110,
        weight: 65
      },
      materials: ["Reclaimed Oak", "Natural Wood Finish", "Metal Joinery"],
      colors: ["Reclaimed Oak", "Weathered Gray"],
      features: ["Under Bed Storage", "Easy Assembly", "No VOC Finish"],
      sustainability: {
        ecoScore: 4.7,
        carbonFootprint: 35,
        isRecyclable: true,
        isBiodegradable: true,
        certifications: ["FSC Certified", "Reclaimed Wood"]
      },
      vendor: vendors[2]._id,
      vendorName: "Green Wood Crafts",
      ratings: {
        average: 4.8,
        count: 15
      },
      salesCount: 6,
      viewCount: 78,
      status: "active",
      isFeatured: false,
      seo: {
        metaTitle: "Eco Bed Frame | Sustainable Bedroom Furniture",
        metaDescription: "Reclaimed wood eco-friendly bed frame",
        slug: "eco-friendly-bed-frame"
      }
    },
    // Storage
    {
      name: "Bamboo Dresser",
      description: "Sustainable bamboo dresser with ample storage and smooth drawer mechanism.",
      shortDescription: "Eco-friendly bamboo dresser",
      category: "storage",
      subcategory: "dresser",
      tags: ["bamboo", "storage", "bedroom"],
      price: 649.99,
      comparePrice: 849.99,
      costPrice: 449.99,
      sku: "STOR-DRS-001",
      stock: 18,
      trackQuantity: true,
      allowBackorder: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop",
          alt: "Bamboo dresser with multiple drawers",
          isPrimary: true
        }
      ],
      dimensions: {
        length: 120,
        width: 45,
        height: 85,
        weight: 35
      },
      materials: ["Bamboo", "Natural Wood Finish", "Metal Handles"],
      colors: ["Natural Bamboo", "Charcoal"],
      features: ["6 Drawers", "Soft-Close Mechanism", "Anti-Tip Design"],
      sustainability: {
        ecoScore: 4.3,
        carbonFootprint: 22,
        isRecyclable: true,
        isBiodegradable: true,
        certifications: ["Bamboo Certified", "Low VOC"]
      },
      vendor: vendors[1]._id,
      vendorName: "Sustainable Living",
      ratings: {
        average: 4.4,
        count: 27
      },
      salesCount: 14,
      viewCount: 112,
      status: "active",
      isFeatured: false,
      seo: {
        metaTitle: "Bamboo Dresser | Sustainable Storage",
        metaDescription: "Eco-friendly bamboo dresser with ample storage",
        slug: "bamboo-dresser"
      }
    },
    // Dining Table
    {
      name: "Sustainable Dining Table",
      description: "Large dining table made from reclaimed teak, perfect for family gatherings.",
      shortDescription: "Reclaimed teak dining table",
      category: "dining",
      subcategory: "dining-table",
      tags: ["reclaimed-wood", "dining", "family"],
      price: 1199.99,
      comparePrice: 1499.99,
      costPrice: 899.99,
      sku: "TABLE-DIN-001",
      stock: 6,
      trackQuantity: true,
      allowBackorder: false,
      images: [
        {
          url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
          alt: "Sustainable dining table setup",
          isPrimary: true
        }
      ],
      dimensions: {
        length: 200,
        width: 100,
        height: 75,
        weight: 55
      },
      materials: ["Reclaimed Teak", "Natural Oil Finish", "Steel Base"],
      colors: ["Reclaimed Teak", "Dark Teak"],
      features: ["Extendable", "Scratch Resistant", "Heat Resistant"],
      sustainability: {
        ecoScore: 4.8,
        carbonFootprint: 40,
        isRecyclable: true,
        isBiodegradable: true,
        certifications: ["FSC Certified", "Reclaimed Wood"]
      },
      vendor: vendors[2]._id,
      vendorName: "Green Wood Crafts",
      ratings: {
        average: 4.9,
        count: 12
      },
      salesCount: 4,
      viewCount: 67,
      status: "active",
      isFeatured: true,
      seo: {
        metaTitle: "Sustainable Dining Table | Eco Furniture",
        metaDescription: "Reclaimed teak dining table for family gatherings",
        slug: "sustainable-dining-table"
      }
    }
  ];

  const createdProducts = await Product.insertMany(products);
  console.log(`✅ Created ${createdProducts.length} products`);
  return createdProducts;
};

const createOrders = async (customers, products) => {
  console.log('📦 Creating orders...');

  // Generate order number
  const generateOrderNumber = () => {
    return 'ORD' + Date.now().toString().slice(-8);
  };

  // Try common payment status values
  const orders = [
    {
      orderNumber: generateOrderNumber(),
      customer: customers[0]._id, // John Doe
      items: [
        {
          product: products[0]._id, // Sofa
          name: products[0].name,
          quantity: 1,
          price: products[0].price,
          subtotal: products[0].price
        }
      ],
      subtotal: products[0].price,
      tax: 103.99,
      shipping: 49.99,
      total: products[0].price + 103.99 + 49.99,
      payment: {
        method: "credit_card",
        status: "paid" // Common enum value
      },
      shippingAddress: {
        fullName: "John Doe",
        address: "123 Main Street",
        city: "New York",
        postalCode: "10001",
        state: "NY",
        country: "United States"
      },
      status: "delivered",
      deliveredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
    },
    {
      orderNumber: generateOrderNumber(),
      customer: customers[1]._id, // Sarah Wilson
      items: [
        {
          product: products[1]._id, // Chair
          name: products[1].name,
          quantity: 2,
          price: products[1].price,
          subtotal: products[1].price * 2
        }
      ],
      subtotal: products[1].price * 2,
      tax: 71.99,
      shipping: 29.99,
      total: (products[1].price * 2) + 71.99 + 29.99,
      payment: {
        method: "paypal",
        status: "pending" // Common enum value
      },
      shippingAddress: {
        fullName: "Sarah Wilson",
        address: "456 Oak Avenue",
        city: "Los Angeles", 
        postalCode: "90210",
        state: "CA",
        country: "United States"
      },
      status: "processing"
    },
    {
      orderNumber: generateOrderNumber(),
      customer: customers[2]._id, // Mike Johnson
      items: [
        {
          product: products[2]._id, // Table
          name: products[2].name,
          quantity: 1,
          price: products[2].price,
          subtotal: products[2].price
        }
      ],
      subtotal: products[2].price,
      tax: 27.99,
      shipping: 39.99,
      total: products[2].price + 27.99 + 39.99,
      payment: {
        method: "stripe",
        status: "failed" // Common enum value
      },
      shippingAddress: {
        fullName: "Mike Johnson",
        address: "789 Pine Road",
        city: "Chicago",
        postalCode: "60601", 
        state: "IL",
        country: "United States"
      },
      status: "cancelled"
    }
  ];

  // Try inserting orders one by one to see which payment.status values work
  const createdOrders = [];
  for (let order of orders) {
    try {
      const createdOrder = await Order.create(order);
      createdOrders.push(createdOrder);
      console.log(`✅ Created order with payment status: ${order.payment.status}`);
    } catch (error) {
      console.log(`❌ Failed to create order with payment status '${order.payment.status}': ${error.message}`);
    }
  }

  console.log(`✅ Created ${createdOrders.length} orders successfully`);
  return createdOrders;
};

const main = async () => {
  try {
    await connectDB();
    await clearExistingData();
    
    const users = await createUsers();
    
    // Separate users by role
    const admin = users.find(u => u.role === 'admin');
    const vendors = users.filter(u => u.role === 'vendor');
    const customers = users.filter(u => u.role === 'customer');
    const staff = users.find(u => u.role === 'staff');
    
    const products = await createProducts(vendors);
    const orders = await createOrders(customers, products);

    console.log('\n🎉 SAMPLE DATA INSERTION COMPLETE!');
    console.log('=================================');
    console.log(`👥 Users: ${users.length} (Admin: 1, Vendors: ${vendors.length}, Customers: ${customers.length}, Staff: 1)`);
    console.log(`🛋️ Products: ${products.length} across different categories`);
    console.log(`📦 Orders: ${orders.length} with various statuses`);
    console.log('\n🔑 Login Credentials:');
    console.log('Admin: admin@flyingwood.com / admin123');
    console.log('Vendor: vendor1@flyingwood.com / vendor123'); 
    console.log('Customer: john@example.com / customer123');
    console.log('Staff: staff@flyingwood.com / staff123');
    console.log('\n🚀 Your database is now populated with sample data!');

  } catch (error) {
    console.error('❌ Error inserting sample data:', error.message);
  } finally {
    mongoose.connection.close();
    console.log('📊 Database connection closed');
  }
};

main();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (for images, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection - Remove deprecated options
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flyingwood-furniture');
    console.log('✅ MongoDB Connected for Flyingwood Furniture');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

connectDB();

// Import Models
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Contact = require('./models/Contact');

// Import Middleware
const { auth, authorize } = require('./middleware/auth');
const upload = require('./middleware/upload');

console.log('✅ Database models loaded: User, Product, Order');

// ========================
// 🎯 ROUTES
// ========================

// 🏠 Home Route
app.get('/', (req, res) => {
  res.json({ 
    message: '🪑 Flyingwood Furniture API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    features: [
      'E-commerce Platform',
      'Multi-user Role System', 
      'AI Design Assistant',
      'AR Furniture Preview',
      'Sustainability Tracking',
      'White Glove Delivery',
      'JWT Authentication',
      'Shopping Cart System'
    ],
    endpoints: {
      health: '/api/health',
      auth: '/api/auth/*',
      products: '/api/products/*',
      users: '/api/users/*',
      orders: '/api/orders/*',
      cart: '/api/cart/*'
    }
  });
});

// ❤️ Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString(),
    uptime: `${process.uptime().toFixed(2)} seconds`,
    memory: process.memoryUsage(),
  });
});

// 📊 Database Status
app.get('/api/db-status', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();

    res.json({
      status: 'OK',
      collections: {
        users: userCount,
        products: productCount,
        orders: orderCount
      },
      models: ['User', 'Product', 'Order']
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========================
// 👤 ENHANCED AUTH ROUTES
// ========================

// User Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, role, profile } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists with this email or username'
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      role: role || 'customer',
      profile
    });

    await user.save();

    // Generate token
    const token = user.generateAuthToken();

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = user.generateAuthToken();

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user profile
app.get('/api/auth/me', auth, async (req, res) => {
  try {
    res.json({
      user: req.user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
app.put('/api/auth/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    
    // Remove restricted fields
    delete updates.password;
    delete updates.role;
    delete updates.email;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========================
// 🛋️ PRODUCT ROUTES
// ========================

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const { 
      category, 
      featured, 
      minPrice, 
      maxPrice, 
      materials,
      limit = 10, 
      page = 1,
      sort = 'newest'
    } = req.query;
    
    let filter = {};
    if (category) filter.category = category;
    if (featured) filter.isFeatured = featured === 'true';
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    if (materials) {
      filter.materials = { $in: materials.split(',') };
    }

    // Sort options
    const sortOptions = {
      newest: { createdAt: -1 },
      priceLow: { price: 1 },
      priceHigh: { price: -1 },
      name: { name: 1 },
      popular: { viewCount: -1 }
    };

    const sortBy = sortOptions[sort] || { createdAt: -1 };

    const products = await Product.find(filter)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort(sortBy);

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      filters: {
        category,
        minPrice,
        maxPrice,
        materials
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Increment view count
    product.viewCount += 1;
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create product (Admin/Vendor only)
app.post('/api/products', auth, authorize('admin', 'vendor'), upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'model', maxCount: 10 }
]), async (req, res) => {
  try {
    const productData = {
      ...req.body,
      vendor: req.user._id,
      vendorName: req.user.vendorInfo?.companyName || req.user.username
    };

    // Handle Image Upload
    if (req.files && req.files.image) {
      productData.images = [{
        url: `/uploads/${req.files.image[0].filename}`,
        altText: req.body.name,
        isPrimary: true
      }];
    }

    // Initial check for model3D
    if (req.files && req.files.model) {
      productData.has3D = true;
    } else if (req.body.has3D === 'true' || req.body.has3D === true) {
      productData.has3D = true;
    }

    const product = new Product(productData);
    await product.save();

    // After saving, handle 3D model files structure
    if (req.files && req.files.model) {
      if (req.files.model.length > 1) {
        // Multi-file GLTF (has3D + BIN etc.)
        const modelDir = path.join(__dirname, 'uploads', 'models', product._id.toString());
        if (!fs.existsSync(modelDir)) {
          fs.mkdirSync(modelDir, { recursive: true });
        }

        let mainModelFile = '';
        for (const file of req.files.model) {
          const newPath = path.join(modelDir, file.originalname);
          fs.renameSync(file.path, newPath);
          
          if (file.originalname.endsWith('.gltf') || file.originalname.endsWith('.glb')) {
            mainModelFile = `/uploads/models/${product._id}/${file.originalname}`;
          }
        }
        
        product.model3D = mainModelFile;
      } else {
        // Single file (typically .glb)
        product.model3D = `/uploads/${req.files.model[0].filename}`;
      }
      await product.save();
    }

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update product (Admin/Owner only)
app.put('/api/products/:id', auth, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'model', maxCount: 10 }
]), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if user is admin or product owner
    if (req.user.role !== 'admin' && product.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updateData = { ...req.body };

    // Handle Image Update
    if (req.files && req.files.image) {
      updateData.images = [{
        url: `/uploads/${req.files.image[0].filename}`,
        altText: req.body.name || product.name,
        isPrimary: true
      }];
    }

    // Initial check for model changes
    if (req.files && req.files.model) {
      updateData.has3D = true;
    } else if (req.body.has3D !== undefined) {
      updateData.has3D = req.body.has3D === 'true' || req.body.has3D === true;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    // Handle 3D model files structure if new ones were uploaded
    if (req.files && req.files.model) {
      if (req.files.model.length > 1) {
        const modelDir = path.join(__dirname, 'uploads', 'models', updatedProduct._id.toString());
        if (!fs.existsSync(modelDir)) {
          fs.mkdirSync(modelDir, { recursive: true });
        }

        let mainModelFile = '';
        for (const file of req.files.model) {
          const newPath = path.join(modelDir, file.originalname);
          fs.renameSync(file.path, newPath);
          
          if (file.originalname.endsWith('.gltf') || file.originalname.endsWith('.glb')) {
            mainModelFile = `/uploads/models/${updatedProduct._id}/${file.originalname}`;
          }
        }
        
        updatedProduct.model3D = mainModelFile;
      } else {
        updatedProduct.model3D = `/uploads/${req.files.model[0].filename}`;
      }
      await updatedProduct.save();
    }

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete product (Admin/Owner only)
app.delete('/api/products/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if user is admin or product owner
    if (req.user.role !== 'admin' && product.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========================
// 🛒 SHOPPING CART ROUTES
// ========================

// Add to cart
app.post('/api/cart/add', auth, async (req, res) => {
  try {
    const { productId, quantity = 1, customization } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    const user = await User.findById(req.user._id);
    
    // Initialize cart if not exists
    if (!user.cart) {
      user.cart = { items: [] };
    }

    // Check if item already in cart
    const existingItemIndex = user.cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      user.cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      user.cart.items.push({
        product: productId,
        quantity,
        price: product.price,
        customization
      });
    }

    await user.save();

    // Populate product details for response
    await user.populate('cart.items.product', 'name images price stock');

    res.json({
      message: 'Item added to cart',
      cart: user.cart
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get cart
app.get('/api/cart', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('cart.items.product', 'name images price stock');

    res.json({
      cart: user.cart || { items: [] }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update cart item
app.put('/api/cart/update/:itemId', auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    const user = await User.findById(req.user._id);

    const itemIndex = user.cart.items.findIndex(
      item => item._id.toString() === req.params.itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      user.cart.items.splice(itemIndex, 1);
    } else {
      user.cart.items[itemIndex].quantity = quantity;
    }

    await user.save();
    await user.populate('cart.items.product', 'name images price stock');

    res.json({
      message: 'Cart updated successfully',
      cart: user.cart
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove from cart
app.delete('/api/cart/remove/:itemId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.cart.items = user.cart.items.filter(
      item => item._id.toString() !== req.params.itemId
    );

    await user.save();
    await user.populate('cart.items.product', 'name images price stock');

    res.json({
      message: 'Item removed from cart',
      cart: user.cart
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear cart
app.delete('/api/cart/clear', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = { items: [] };
    await user.save();

    res.json({
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========================
// 📦 ORDER ROUTES
// ========================

// Create order from cart
app.post('/api/orders', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.items.product');
    
    if (!user.cart || user.cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Calculate order totals
    const items = user.cart.items.map(item => ({
      product: item.product._id,
      productName: item.product.name,
      productImage: item.product.images[0]?.url,
      quantity: item.quantity,
      price: item.product.price,
      subtotal: item.quantity * item.product.price,
      customization: item.customization
    }));

    const subtotal = items.reduce((total, item) => total + item.subtotal, 0);
    const shippingFee = 0; // Calculate based on address
    const taxAmount = subtotal * 0.1; // 10% tax
    const total = subtotal + shippingFee + taxAmount;

    const order = new Order({
      customer: req.user._id,
      customerEmail: req.user.email,
      items,
      subtotal,
      shippingFee,
      taxAmount,
      total,
      shippingAddress: req.body.shippingAddress,
      billingAddress: req.body.billingAddress || req.body.shippingAddress
    });

    await order.save();

    // Clear cart after successful order
    user.cart = { items: [] };
    await user.save();

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user orders
app.get('/api/orders/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all orders (Admin/Vendor only) - MUST BE ABOVE /api/orders/:id
app.get('/api/orders/all', auth, authorize('admin', 'vendor'), async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'username email')
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single order
app.get('/api/orders/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name images');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user owns the order or is admin
    if (order.customer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========================
// 👥 USER ROUTES
// ========================

// Get user profile
app.get('/api/users/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========================
// 🎪 SAMPLE DATA ROUTES (Development)
// ========================

// Create sample products
app.post('/api/sample/products', auth, authorize('admin'), async (req, res) => {
  try {
    const sampleProducts = [
      {
        name: "Modern Wooden Chair",
        description: "Elegant wooden chair with modern design, perfect for dining rooms or offices.",
        shortDescription: "Modern wooden chair",
        category: "chairs",
        price: 199.99,
        comparePrice: 249.99,
        stock: 15,
        materials: ["Solid Oak", "Cotton"],
        colors: ["Brown", "Black"],
        features: ["Ergonomic Design", "Easy Assembly", "Sustainable Wood"],
        sustainability: {
          ecoScore: 4,
          materials: [
            { name: "FSC Certified Oak", percentage: 100, isSustainable: true, origin: "Canada" }
          ],
          carbonFootprint: 15.5,
          isRecyclable: true,
          certifications: ["FSC"]
        },
        vendor: req.user._id,
        vendorName: "Flyingwood Craftsmen"
      },
      {
        name: "Minimalist Coffee Table",
        description: "Sleek coffee table with minimalist design, featuring sustainable bamboo construction.",
        shortDescription: "Minimalist bamboo coffee table",
        category: "tables",
        price: 299.99,
        stock: 8,
        materials: ["Bamboo", "Tempered Glass"],
        colors: ["Natural", "Walnut"],
        features: ["Eco-friendly", "Sturdy Construction", "Easy Clean"],
        sustainability: {
          ecoScore: 5,
          materials: [
            { name: "Sustainable Bamboo", percentage: 80, isSustainable: true, origin: "Vietnam" },
            { name: "Recycled Glass", percentage: 20, isSustainable: true, origin: "Local" }
          ],
          carbonFootprint: 12.2,
          isRecyclable: true,
          isBiodegradable: true,
          certifications: ["FSC", "GreenGuard"]
        },
        vendor: req.user._id,
        vendorName: "Eco Furniture Co."
      }
    ];

    const products = await Product.insertMany(sampleProducts);
    res.json({
      message: 'Sample products created',
      count: products.length,
      products: products.map(p => ({ id: p._id, name: p.name }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User management routes (for admin)
app.get('/api/users/all', auth, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/users/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const { role, isActive } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role, isActive },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Admin stats
app.get('/api/admin/stats', auth, authorize('admin'), async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();
    
    // Calculate total revenue from delivered orders
    const revenueResult = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    
    const totalRevenue = revenueResult[0]?.total || 0;
    
    res.json({
      totalUsers: userCount,
      totalProducts: productCount,
      totalOrders: orderCount,
      totalRevenue,
      pendingOrders: await Order.countDocuments({ status: 'pending' }),
      lowStockProducts: await Product.countDocuments({ stock: { $lt: 10 } })
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========================
// 📩 CONTACT ROUTES
// ========================

// Submit a new contact inquiry
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Save to Database
    const contact = new Contact({ name, email, message });
    await contact.save();

    res.status(201).json({ success: true, message: 'Inquiry received successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Get all contact inquiries
app.get('/api/contact', auth, authorize('admin'), async (req, res) => {
  try {
    const inquiries = await Contact.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========================
// 🛡️ ERROR HANDLING
// ========================

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Endpoint ${req.originalUrl} does not exist`,
    availableEndpoints: [
      'GET /',
      'GET /api/health',
      'GET /api/db-status',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/me',
      'PUT /api/auth/profile',
      'GET /api/products',
      'GET /api/products/:id',
      'POST /api/products (admin/vendor)',
      'GET /api/cart',
      'POST /api/cart/add',
      'POST /api/orders',
      'GET /api/orders/my-orders'
    ]
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('🔴 Server Error:', error);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong!'
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down server gracefully...');
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed.');
  process.exit(0);
});

// Start server - Use different port
const PORT = process.env.PORT || 5001;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`
  🚀 FLYINGWOOD FURNITURE SERVER STARTED
  📍 Port: ${PORT}
  📱 API: http://localhost:${PORT}
  🪑 Project: Flyingwood Furniture
  📊 Database: MongoDB
    `);
  });
} else {
  // Allow Vercel serverless deployment
  app.listen(PORT, () => console.log(\`🚀 Server running on port \${PORT}\`));
}

module.exports = app;
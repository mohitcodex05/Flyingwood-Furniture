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
  await Product.deleteMany({});
  console.log('✅ Products cleared');
};

const getVendors = async () => {
  return await User.find({ role: 'vendor' });
};

const generateSKU = (category, index) => {
  const prefixes = {
    'sofas': 'SOFA', 'chairs': 'CHAIR', 'tables': 'TABLE', 
    'beds': 'BED', 'storage': 'STOR', 'dining': 'DINE',
    'lighting': 'LIGHT', 'decor': 'DECOR', 'office': 'OFFC', 'outdoor': 'OUT'
  };
  return `${prefixes[category]}-${String(index).padStart(3, '0')}`;
};

const createProducts = async (vendors) => {
  console.log('🛋️ Creating 50+ products...');

  const products = [
    // SOFAS (8 products)
    {
      name: "Modern Eco Sofa",
      description: "Sustainable sofa made from organic materials with superior comfort and modular design. Features removable cushions and sturdy reclaimed wood frame.",
      shortDescription: "Eco-friendly modular sofa",
      category: "sofas",
      subcategory: "sectional",
      tags: ["eco-friendly", "modular", "living-room", "removable-covers"],
      price: 1299.99,
      comparePrice: 1599.99,
      costPrice: 899.99,
      sku: generateSKU('sofas', 1),
      stock: 15,
      trackQuantity: true,
      allowBackorder: false,
      images: [
        {
          url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
          alt: "Modern eco sofa in living room setting",
          isPrimary: true
        }
      ],
      dimensions: { length: 220, width: 95, height: 85, weight: 75 },
      materials: ["Organic Cotton", "Reclaimed Wood", "Natural Latex"],
      colors: ["Natural", "Charcoal", "Olive"],
      features: ["Modular Design", "Removable Covers", "Stain Resistant", "Easy Assembly"],
      sustainability: {
        ecoScore: 4.2,
        carbonFootprint: 45,
        isRecyclable: true,
        isBiodegradable: true,
        certifications: ["FSC Certified", "GOTS Organic"]
      },
      vendor: vendors[0]._id,
      vendorName: "Eco Furniture Co.",
      ratings: { average: 4.5, count: 23 },
      salesCount: 12,
      viewCount: 156,
      status: "active",
      isFeatured: true
    },
    {
      name: "Luxury Velvet Sofa",
      description: "Premium velvet sofa with elegant tufted design and solid hardwood frame. Perfect for modern living spaces.",
      shortDescription: "Luxury velvet tufted sofa",
      category: "sofas",
      subcategory: "3-seater",
      tags: ["velvet", "luxury", "tufted", "living-room"],
      price: 1899.99,
      comparePrice: 2299.99,
      costPrice: 1299.99,
      sku: generateSKU('sofas', 2),
      stock: 8,
      trackQuantity: true,
      allowBackorder: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&h=600&fit=crop",
          alt: "Luxury velvet sofa in modern interior",
          isPrimary: true
        }
      ],
      dimensions: { length: 210, width: 88, height: 82, weight: 68 },
      materials: ["Premium Velvet", "Solid Hardwood", "High-density Foam"],
      colors: ["Emerald Green", "Navy Blue", "Burgundy"],
      features: ["Tuffed Back", "Solid Wood Frame", "Premium Comfort", "Easy Clean"],
      sustainability: {
        ecoScore: 3.8,
        carbonFootprint: 52,
        isRecyclable: false,
        isBiodegradable: false,
        certifications: ["OEKO-TEX Certified"]
      },
      vendor: vendors[1]._id,
      vendorName: "Sustainable Living",
      ratings: { average: 4.7, count: 18 },
      salesCount: 6,
      viewCount: 89,
      status: "active",
      isFeatured: true
    },
    {
      name: "Convertible Sleeper Sofa",
      description: "Multi-functional sofa that converts to a comfortable bed. Perfect for small spaces and guest rooms.",
      shortDescription: "Space-saving convertible sofa bed",
      category: "sofas",
      subcategory: "sleeper",
      tags: ["convertible", "sleeper", "space-saving", "multi-functional"],
      price: 899.99,
      comparePrice: 1199.99,
      costPrice: 649.99,
      sku: generateSKU('sofas', 3),
      stock: 12,
      trackQuantity: true,
      allowBackorder: false,
      images: [
        {
          url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
          alt: "Convertible sleeper sofa in modern apartment",
          isPrimary: true
        }
      ],
      dimensions: { length: 190, width: 92, height: 85, weight: 55 },
      materials: ["Linen Blend", "Metal Mechanism", "Pocket Springs"],
      colors: ["Light Gray", "Beige", "Charcoal"],
      features: ["Easy Conversion", "Storage Compartment", "Modern Design", "Durable Mechanism"],
      sustainability: {
        ecoScore: 4.0,
        carbonFootprint: 38,
        isRecyclable: true,
        isBiodegradable: false,
        certifications: ["Greenguard Gold"]
      },
      vendor: vendors[2]._id,
      vendorName: "Green Wood Crafts",
      ratings: { average: 4.3, count: 31 },
      salesCount: 15,
      viewCount: 134,
      status: "active",
      isFeatured: false
    },

    // CHAIRS (12 products)
    {
      name: "Ergonomic Office Chair",
      description: "Professional ergonomic office chair with lumbar support and adjustable features for all-day comfort.",
      shortDescription: "Ergonomic office chair with lumbar support",
      category: "chairs",
      subcategory: "office",
      tags: ["ergonomic", "office", "adjustable", "lumbar-support"],
      price: 349.99,
      comparePrice: 449.99,
      costPrice: 249.99,
      sku: generateSKU('chairs', 1),
      stock: 25,
      trackQuantity: true,
      allowBackorder: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop",
          alt: "Ergonomic office chair in modern workspace",
          isPrimary: true
        }
      ],
      dimensions: { length: 62, width: 64, height: 115, weight: 22 },
      materials: ["Recycled Mesh", "Aluminum Base", "Memory Foam"],
      colors: ["Black", "Gray", "Blue"],
      features: ["Adjustable Height", "Lumbar Support", "Breathable Mesh", "360° Swivel"],
      sustainability: {
        ecoScore: 4.3,
        carbonFootprint: 28,
        isRecyclable: true,
        isBiodegradable: false,
        certifications: ["BIFMA Certified", "Recycled Content"]
      },
      vendor: vendors[0]._id,
      vendorName: "Eco Furniture Co.",
      ratings: { average: 4.6, count: 47 },
      salesCount: 28,
      viewCount: 201,
      status: "active",
      isFeatured: true
    },
    {
      name: "Vintage Wooden Dining Chair",
      description: "Handcrafted wooden dining chair with vintage design and comfortable curved back support.",
      shortDescription: "Vintage style wooden dining chair",
      category: "chairs",
      subcategory: "dining",
      tags: ["vintage", "wooden", "dining", "handcrafted"],
      price: 189.99,
      comparePrice: 249.99,
      costPrice: 129.99,
      sku: generateSKU('chairs', 2),
      stock: 40,
      trackQuantity: true,
      allowBackorder: false,
      images: [
        {
          url: "https://images.unsplash.com/photo-1503602642458-232111445657?w=800&h=600&fit=crop",
          alt: "Vintage wooden dining chair set",
          isPrimary: true
        }
      ],
      dimensions: { length: 45, width: 48, height: 92, weight: 8 },
      materials: ["Solid Oak", "Natural Finish", "Cotton Blend"],
      colors: ["Natural Oak", "Walnut", "White Wash"],
      features: ["Handcrafted", "Curved Back", "Sturdy Construction", "Stackable"],
      sustainability: {
        ecoScore: 4.7,
        carbonFootprint: 15,
        isRecyclable: true,
        isBiodegradable: true,
        certifications: ["FSC Certified", "Handcrafted"]
      },
      vendor: vendors[2]._id,
      vendorName: "Green Wood Crafts",
      ratings: { average: 4.8, count: 62 },
      salesCount: 45,
      viewCount: 278,
      status: "active",
      isFeatured: true
    },
    {
      name: "Modern Accent Chair",
      description: "Stylish accent chair with geometric design, perfect for living rooms, bedrooms, or reading nooks.",
      shortDescription: "Geometric design accent chair",
      category: "chairs",
      subcategory: "accent",
      tags: ["accent", "modern", "geometric", "decorative"],
      price: 299.99,
      comparePrice: 399.99,
      costPrice: 199.99,
      sku: generateSKU('chairs', 3),
      stock: 18,
      trackQuantity: true,
      allowBackorder: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=600&fit=crop",
          alt: "Modern accent chair in living room",
          isPrimary: true
        }
      ],
      dimensions: { length: 75, width: 78, height: 85, weight: 15 },
      materials: ["Metal Frame", "Polyester Blend", "High-density Foam"],
      colors: ["Mustard Yellow", "Teal", "Coral"],
      features: ["Geometric Design", "Comfortable Seating", "Modern Style", "Lightweight"],
      sustainability: {
        ecoScore: 3.9,
        carbonFootprint: 32,
        isRecyclable: true,
        isBiodegradable: false,
        certifications: ["OEKO-TEX Certified"]
      },
      vendor: vendors[1]._id,
      vendorName: "Sustainable Living",
      ratings: { average: 4.4, count: 29 },
      salesCount: 16,
      viewCount: 145,
      status: "active",
      isFeatured: false
    },

    // TABLES (10 products)
    {
      name: "Minimalist Dining Table",
      description: "Clean-line dining table with minimalist design, perfect for modern dining spaces and family gatherings.",
      shortDescription: "Minimalist design dining table",
      category: "tables",
      subcategory: "dining",
      tags: ["minimalist", "dining", "modern", "family"],
      price: 799.99,
      comparePrice: 999.99,
      costPrice: 549.99,
      sku: generateSKU('tables', 1),
      stock: 10,
      trackQuantity: true,
      allowBackorder: false,
      images: [
        {
          url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
          alt: "Minimalist dining table in modern dining room",
          isPrimary: true
        }
      ],
      dimensions: { length: 180, width: 90, height: 75, weight: 45 },
      materials: ["Solid Walnut", "Metal Legs", "Natural Oil Finish"],
      colors: ["Natural Walnut", "Dark Walnut", "White"],
      features: ["Extendable", "Scratch Resistant", "Easy Assembly", "Sturdy Base"],
      sustainability: {
        ecoScore: 4.5,
        carbonFootprint: 35,
        isRecyclable: true,
        isBiodegradable: true,
        certifications: ["FSC Certified", "Low VOC Finish"]
      },
      vendor: vendors[0]._id,
      vendorName: "Eco Furniture Co.",
      ratings: { average: 4.7, count: 38 },
      salesCount: 22,
      viewCount: 167,
      status: "active",
      isFeatured: true
    },
    {
      name: "Glass Top Coffee Table",
      description: "Elegant coffee table with tempered glass top and sleek metal frame. Perfect for contemporary living rooms.",
      shortDescription: "Modern glass top coffee table",
      category: "tables",
      subcategory: "coffee",
      tags: ["glass", "modern", "coffee-table", "contemporary"],
      price: 349.99,
      comparePrice: 449.99,
      costPrice: 249.99,
      sku: generateSKU('tables', 2),
      stock: 15,
      trackQuantity: true,
      allowBackorder: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1533090368676-1fd25485db88?w=800&h=600&fit=crop",
          alt: "Glass top coffee table in living room",
          isPrimary: true
        }
      ],
      dimensions: { length: 120, width: 60, height: 40, weight: 25 },
      materials: ["Tempered Glass", "Brushed Steel", "Rubber Feet"],
      colors: ["Clear Glass", "Bronze Frame", "Black Frame"],
      features: ["Tempered Glass", "Sturdy Frame", "Easy Clean", "Modern Design"],
      sustainability: {
        ecoScore: 3.7,
        carbonFootprint: 42,
        isRecyclable: true,
        isBiodegradable: false,
        certifications: ["Recycled Glass"]
      },
      vendor: vendors[1]._id,
      vendorName: "Sustainable Living",
      ratings: { average: 4.3, count: 24 },
      salesCount: 13,
      viewCount: 98,
      status: "active",
      isFeatured: false
    },

    // BEDS (8 products)
    {
      name: "Platform Storage Bed",
      description: "Modern platform bed with built-in storage drawers and sleek design. Perfect for maximizing space.",
      shortDescription: "Storage platform bed with drawers",
      category: "beds",
      subcategory: "queen",
      tags: ["storage", "platform", "modern", "space-saving"],
      price: 899.99,
      comparePrice: 1199.99,
      costPrice: 649.99,
      sku: generateSKU('beds', 1),
      stock: 8,
      trackQuantity: true,
      allowBackorder: false,
      images: [
        {
          url: "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&h=600&fit=crop",
          alt: "Platform storage bed in modern bedroom",
          isPrimary: true
        }
      ],
      dimensions: { length: 210, width: 160, height: 45, weight: 85 },
      materials: ["Solid Pine", "Metal Slats", "Wooden Drawers"],
      colors: ["Natural Pine", "White", "Gray"],
      features: ["Built-in Storage", "No Box Spring Needed", "Easy Assembly", "Sturdy Slats"],
      sustainability: {
        ecoScore: 4.4,
        carbonFootprint: 38,
        isRecyclable: true,
        isBiodegradable: true,
        certifications: ["FSC Certified", "Low VOC"]
      },
      vendor: vendors[2]._id,
      vendorName: "Green Wood Crafts",
      ratings: { average: 4.6, count: 41 },
      salesCount: 18,
      viewCount: 156,
      status: "active",
      isFeatured: true
    },

    // STORAGE (8 products)
    {
      name: "6-Drawer Bamboo Dresser",
      description: "Sustainable bamboo dresser with six smooth-gliding drawers and modern minimalist design.",
      shortDescription: "Bamboo dresser with 6 drawers",
      category: "storage",
      subcategory: "dresser",
      tags: ["bamboo", "storage", "dresser", "minimalist"],
      price: 649.99,
      comparePrice: 849.99,
      costPrice: 449.99,
      sku: generateSKU('storage', 1),
      stock: 12,
      trackQuantity: true,
      allowBackorder: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop",
          alt: "Bamboo dresser in modern bedroom",
          isPrimary: true
        }
      ],
      dimensions: { length: 120, width: 45, height: 85, weight: 35 },
      materials: ["Bamboo", "Metal Handles", "Natural Finish"],
      colors: ["Natural Bamboo", "Charcoal", "Light Oak"],
      features: ["6 Drawers", "Soft-Close Mechanism", "Anti-Tip Design", "Easy Assembly"],
      sustainability: {
        ecoScore: 4.8,
        carbonFootprint: 22,
        isRecyclable: true,
        isBiodegradable: true,
        certifications: ["Bamboo Certified", "Rapidly Renewable"]
      },
      vendor: vendors[1]._id,
      vendorName: "Sustainable Living",
      ratings: { average: 4.7, count: 33 },
      salesCount: 21,
      viewCount: 134,
      status: "active",
      isFeatured: true
    },

    // Add more products to reach 50+...
       // LIGHTING (5 products) - Continued
    {
      name: "Modern Pendant Light",
      description: "Contemporary pendant light with geometric design, perfect for dining areas and kitchen islands.",
      shortDescription: "Geometric pendant light fixture",
      category: "lighting",
      subcategory: "pendant",
      tags: ["lighting", "pendant", "modern", "geometric"],
      price: 149.99,
      comparePrice: 199.99,
      costPrice: 99.99,
      sku: generateSKU('lighting', 1),
      stock: 20,
      trackQuantity: true,
      allowBackorder: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1513506003901-6e119aef94aa?w=800&h=600&fit=crop",
          alt: "Modern pendant light in dining room",
          isPrimary: true
        }
      ],
      dimensions: { length: 35, width: 35, height: 50, weight: 4 },
      materials: ["Metal", "Glass", "LED Compatible"],
      colors: ["Black", "Brass", "White"],
      features: ["Dimmable", "Energy Efficient", "Easy Installation", "Modern Design"],
      sustainability: {
        ecoScore: 4.2,
        carbonFootprint: 18,
        isRecyclable: true,
        isBiodegradable: false,
        certifications: ["Energy Star", "LED Ready"]
      },
      vendor: vendors[0]._id,
      vendorName: "Eco Furniture Co.",
      ratings: { average: 4.5, count: 27 },
      salesCount: 18,
      viewCount: 112,
      status: "active",
      isFeatured: false
    },
    {
      name: "Minimalist Floor Lamp",
      description: "Sleek floor lamp with adjustable arm and warm LED lighting. Perfect for reading corners.",
      shortDescription: "Adjustable minimalist floor lamp",
      category: "lighting",
      subcategory: "floor",
      tags: ["floor-lamp", "adjustable", "reading", "modern"],
      price: 129.99,
      comparePrice: 179.99,
      costPrice: 89.99,
      sku: generateSKU('lighting', 2),
      stock: 25,
      trackQuantity: true,
      allowBackorder: false,
      images: [
        {
          url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=600&fit=crop",
          alt: "Minimalist floor lamp in living room",
          isPrimary: true
        }
      ],
      dimensions: { length: 35, width: 35, height: 160, weight: 8 },
      materials: ["Steel", "Aluminum", "LED Bulb"],
      colors: ["Black", "White", "Silver"],
      features: ["Adjustable Arm", "Dimmable", "Energy Saving", "Stable Base"],
      sustainability: {
        ecoScore: 4.1,
        carbonFootprint: 22,
        isRecyclable: true,
        isBiodegradable: false,
        certifications: ["Energy Efficient", "Long Lifespan"]
      },
      vendor: vendors[1]._id,
      vendorName: "Sustainable Living",
      ratings: { average: 4.4, count: 34 },
      salesCount: 22,
      viewCount: 145,
      status: "active",
      isFeatured: false
    },

    // DECOR (6 products)
    {
      name: "Macrame Wall Hanging",
      description: "Handmade macrame wall art with natural cotton rope, adding bohemian charm to any space.",
      shortDescription: "Handmade macrame wall decoration",
      category: "decor",
      subcategory: "wall-art",
      tags: ["macrame", "wall-art", "bohemian", "handmade"],
      price: 79.99,
      comparePrice: 99.99,
      costPrice: 49.99,
      sku: generateSKU('decor', 1),
      stock: 30,
      trackQuantity: true,
      allowBackorder: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
          alt: "Macrame wall hanging in bohemian interior",
          isPrimary: true
        }
      ],
      dimensions: { length: 60, width: 5, height: 90, weight: 2 },
      materials: ["Natural Cotton", "Wooden Dowel", "Natural Dyes"],
      colors: ["Natural", "Beige", "White"],
      features: ["Handmade", "Natural Materials", "Lightweight", "Easy to Hang"],
      sustainability: {
        ecoScore: 4.7,
        carbonFootprint: 8,
        isRecyclable: true,
        isBiodegradable: true,
        certifications: ["Handmade", "Natural Materials"]
      },
      vendor: vendors[2]._id,
      vendorName: "Green Wood Crafts",
      ratings: { average: 4.8, count: 41 },
      salesCount: 35,
      viewCount: 178,
      status: "active",
      isFeatured: true
    },
    {
      name: "Ceramic Planters Set",
      description: "Set of 3 hand-thrown ceramic planters in varying sizes, perfect for indoor plants and succulents.",
      shortDescription: "Handmade ceramic planters set",
      category: "decor",
      subcategory: "planters",
      tags: ["planters", "ceramic", "handmade", "indoor-plants"],
      price: 89.99,
      comparePrice: 119.99,
      costPrice: 59.99,
      sku: generateSKU('decor', 2),
      stock: 40,
      trackQuantity: true,
      allowBackorder: false,
      images: [
        {
          url: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&h=600&fit=crop",
          alt: "Ceramic planters with indoor plants",
          isPrimary: true
        }
      ],
      dimensions: { length: 25, width: 25, height: 30, weight: 6 },
      materials: ["Ceramic", "Natural Glaze", "Clay"],
      colors: ["Terracotta", "White", "Speckled Gray"],
      features: ["Drainage Holes", "Handmade", "Set of 3", "Natural Finish"],
      sustainability: {
        ecoScore: 4.6,
        carbonFootprint: 12,
        isRecyclable: true,
        isBiodegradable: true,
        certifications: ["Handcrafted", "Natural Materials"]
      },
      vendor: vendors[0]._id,
      vendorName: "Eco Furniture Co.",
      ratings: { average: 4.7, count: 52 },
      salesCount: 38,
      viewCount: 201,
      status: "active",
      isFeatured: false
    },

    // OFFICE (5 products)
    {
      name: "Standing Desk Converter",
      description: "Adjustable standing desk converter that fits on any desk, promoting better posture and health.",
      shortDescription: "Adjustable standing desk converter",
      category: "office",
      subcategory: "desk",
      tags: ["standing-desk", "ergonomic", "office", "health"],
      price: 229.99,
      comparePrice: 299.99,
      costPrice: 159.99,
      sku: generateSKU('office', 1),
      stock: 18,
      trackQuantity: true,
      allowBackorder: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop",
          alt: "Standing desk converter in home office",
          isPrimary: true
        }
      ],
      dimensions: { length: 80, width: 50, height: 30, weight: 15 },
      materials: ["Steel", "MDF Top", "Gas Spring"],
      colors: ["Black", "White", "Wood Finish"],
      features: ["Height Adjustable", "Gas Spring", "Keyboard Tray", "Cable Management"],
      sustainability: {
        ecoScore: 3.9,
        carbonFootprint: 28,
        isRecyclable: true,
        isBiodegradable: false,
        certifications: ["Ergonomic Certified"]
      },
      vendor: vendors[1]._id,
      vendorName: "Sustainable Living",
      ratings: { average: 4.5, count: 67 },
      salesCount: 42,
      viewCount: 234,
      status: "active",
      isFeatured: true
    },

    // OUTDOOR (6 products)
    {
      name: "Teak Outdoor Dining Set",
      description: "Beautiful teak outdoor dining set with 6 chairs, perfect for patio dining and entertaining.",
      shortDescription: "Teak outdoor dining table and chairs",
      category: "outdoor",
      subcategory: "dining-set",
      tags: ["outdoor", "teak", "dining-set", "weather-resistant"],
      price: 1899.99,
      comparePrice: 2399.99,
      costPrice: 1299.99,
      sku: generateSKU('outdoor', 1),
      stock: 6,
      trackQuantity: true,
      allowBackorder: false,
      images: [
        {
          url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
          alt: "Teak outdoor dining set on patio",
          isPrimary: true
        }
      ],
      dimensions: { length: 200, width: 100, height: 75, weight: 95 },
      materials: ["Solid Teak", "Stainless Steel", "Weather-resistant Cushions"],
      colors: ["Natural Teak", "Gray Stain"],
      features: ["Weather Resistant", "UV Protected", "Comfortable Cushions", "Sturdy Construction"],
      sustainability: {
        ecoScore: 4.3,
        carbonFootprint: 65,
        isRecyclable: true,
        isBiodegradable: true,
        certifications: ["FSC Certified Teak", "Weather Resistant"]
      },
      vendor: vendors[2]._id,
      vendorName: "Green Wood Crafts",
      ratings: { average: 4.8, count: 23 },
      salesCount: 8,
      viewCount: 89,
      status: "active",
      isFeatured: true
    },
    {
      name: "Adirondack Outdoor Chair",
      description: "Classic Adirondack chair made from recycled plastic, comfortable and maintenance-free.",
      shortDescription: "Recycled plastic Adirondack chair",
      category: "outdoor",
      subcategory: "chair",
      tags: ["adirondack", "outdoor", "recycled", "low-maintenance"],
      price: 199.99,
      comparePrice: 249.99,
      costPrice: 139.99,
      sku: generateSKU('outdoor', 2),
      stock: 25,
      trackQuantity: true,
      allowBackorder: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=600&fit=crop",
          alt: "Adirondack chairs in garden setting",
          isPrimary: true
        }
      ],
      dimensions: { length: 85, width: 75, height: 95, weight: 18 },
      materials: ["Recycled Plastic", "UV Stabilized", "Metal-free"],
      colors: ["Forest Green", "Natural", "Gray"],
      features: ["Weather Proof", "No Maintenance", "Comfortable Design", "Stackable"],
      sustainability: {
        ecoScore: 4.9,
        carbonFootprint: 15,
        isRecyclable: true,
        isBiodegradable: false,
        certifications: ["100% Recycled Material", "Weather Resistant"]
      },
      vendor: vendors[0]._id,
      vendorName: "Eco Furniture Co.",
      ratings: { average: 4.7, count: 58 },
      salesCount: 32,
      viewCount: 167,
      status: "active",
      isFeatured: false
    },

    // DINING (4 products)
    {
      name: "Extendable Farmhouse Table",
      description: "Rustic farmhouse dining table with extension leaves, perfect for family gatherings and holidays.",
      shortDescription: "Rustic extendable farmhouse table",
      category: "dining",
      subcategory: "dining-table",
      tags: ["farmhouse", "extendable", "rustic", "family"],
      price: 1199.99,
      comparePrice: 1499.99,
      costPrice: 849.99,
      sku: generateSKU('dining', 1),
      stock: 5,
      trackQuantity: true,
      allowBackorder: false,
      images: [
        {
          url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
          alt: "Farmhouse dining table in rustic kitchen",
          isPrimary: true
        }
      ],
      dimensions: { length: 180, width: 90, height: 75, weight: 65 },
      materials: ["Reclaimed Wood", "Metal Hardware", "Natural Finish"],
      colors: ["Reclaimed Wood", "Weathered Gray", "White Wash"],
      features: ["Extendable", "Rustic Charm", "Sturdy Construction", "Family Size"],
      sustainability: {
        ecoScore: 4.8,
        carbonFootprint: 42,
        isRecyclable: true,
        isBiodegradable: true,
        certifications: ["Reclaimed Wood", "Low VOC Finish"]
      },
      vendor: vendors[2]._id,
      vendorName: "Green Wood Crafts",
      ratings: { average: 4.9, count: 34 },
      salesCount: 12,
      viewCount: 78,
      status: "active",
      isFeatured: true
    },

    // ADDITIONAL PRODUCTS TO REACH 50+
    {
      name: "Bookshelf with Cabinet",
      description: "Tall bookshelf with bottom cabinet for storage, perfect for home office or living room.",
      shortDescription: "Storage bookshelf with cabinet",
      category: "storage",
      subcategory: "bookshelf",
      tags: ["bookshelf", "storage", "cabinet", "home-office"],
      price: 449.99,
      comparePrice: 599.99,
      costPrice: 329.99,
      sku: generateSKU('storage', 3),
      stock: 12,
      trackQuantity: true,
      allowBackorder: false,
      images: [
        {
          url: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&h=600&fit=crop",
          alt: "Bookshelf with cabinet in home office",
          isPrimary: true
        }
      ],
      dimensions: { length: 80, width: 30, height: 180, weight: 45 },
      materials: ["Plywood", "Solid Wood", "Metal Hardware"],
      colors: ["White", "Oak", "Walnut"],
      features: ["Adjustable Shelves", "Cabinet Storage", "Sturdy Construction", "Easy Assembly"],
      sustainability: {
        ecoScore: 4.1,
        carbonFootprint: 38,
        isRecyclable: true,
        isBiodegradable: false,
        certifications: ["CARB Compliant", "Low VOC"]
      },
      vendor: vendors[1]._id,
      vendorName: "Sustainable Living",
      ratings: { average: 4.4, count: 28 },
      salesCount: 16,
      viewCount: 134,
      status: "active",
      isFeatured: false
    },
    {
      name: "Lounge Chair with Ottoman",
      description: "Comfortable lounge chair with matching ottoman, perfect for reading or relaxing.",
      shortDescription: "Lounge chair and ottoman set",
      category: "chairs",
      subcategory: "lounge",
      tags: ["lounge", "ottoman", "reading", "comfort"],
      price: 599.99,
      comparePrice: 799.99,
      costPrice: 429.99,
      sku: generateSKU('chairs', 4),
      stock: 8,
      trackQuantity: true,
      allowBackorder: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=600&fit=crop",
          alt: "Lounge chair with ottoman in living room",
          isPrimary: true
        }
      ],
      dimensions: { length: 85, width: 95, height: 105, weight: 35 },
      materials: ["Fabric", "Solid Wood", "High-density Foam"],
      colors: ["Navy Blue", "Charcoal", "Cream"],
      features: ["Matching Ottoman", "Comfortable", "Durable Frame", "Modern Design"],
      sustainability: {
        ecoScore: 4.0,
        carbonFootprint: 42,
        isRecyclable: true,
        isBiodegradable: false,
        certifications: ["OEKO-TEX Fabric"]
      },
      vendor: vendors[0]._id,
      vendorName: "Eco Furniture Co.",
      ratings: { average: 4.6, count: 41 },
      salesCount: 14,
      viewCount: 156,
      status: "active",
      isFeatured: true
    },
    {
      name: "Wall Mounted Desk",
      description: "Space-saving wall mounted desk that folds up when not in use, perfect for small spaces.",
      shortDescription: "Foldable wall mounted desk",
      category: "office",
      subcategory: "desk",
      tags: ["wall-mounted", "foldable", "space-saving", "small-space"],
      price: 179.99,
      comparePrice: 229.99,
      costPrice: 129.99,
      sku: generateSKU('office', 2),
      stock: 20,
      trackQuantity: true,
      allowBackorder: false,
      images: [
        {
          url: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop",
          alt: "Wall mounted desk in small apartment",
          isPrimary: true
        }
      ],
      dimensions: { length: 100, width: 50, height: 5, weight: 12 },
      materials: ["Plywood", "Metal Brackets", "Hardware"],
      colors: ["White", "Walnut", "Black"],
      features: ["Foldable", "Space Saving", "Wall Mounted", "Sturdy"],
      sustainability: {
        ecoScore: 4.2,
        carbonFootprint: 25,
        isRecyclable: true,
        isBiodegradable: false,
        certifications: ["Space Efficient Design"]
      },
      vendor: vendors[2]._id,
      vendorName: "Green Wood Crafts",
      ratings: { average: 4.3, count: 56 },
      salesCount: 28,
      viewCount: 189,
      status: "active",
      isFeatured: false
    },
    {
      name: "Outdoor Sectional Sofa",
      description: "Modular outdoor sectional sofa with weather-resistant cushions, perfect for patio entertaining.",
      shortDescription: "Modular outdoor sectional sofa",
      category: "outdoor",
      subcategory: "sectional",
      tags: ["outdoor", "sectional", "modular", "patio"],
      price: 1599.99,
      comparePrice: 1999.99,
      costPrice: 1199.99,
      sku: generateSKU('outdoor', 3),
      stock: 4,
      trackQuantity: true,
      allowBackorder: false,
      images: [
        {
          url: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=800&h=600&fit=crop",
          alt: "Outdoor sectional sofa on patio",
          isPrimary: true
        }
      ],
      dimensions: { length: 220, width: 150, height: 85, weight: 120 },
      materials: ["Powder-coated Aluminum", "Weather-resistant Fabric", "Quick-dry Foam"],
      colors: ["Gray", "Beige", "Navy"],
      features: ["Modular Design", "Weather Resistant", "Comfortable Cushions", "Durable Frame"],
      sustainability: {
        ecoScore: 4.1,
        carbonFootprint: 75,
        isRecyclable: true,
        isBiodegradable: false,
        certifications: ["Weather Resistant", "UV Protected"]
      },
      vendor: vendors[1]._id,
      vendorName: "Sustainable Living",
      ratings: { average: 4.7, count: 18 },
      salesCount: 6,
      viewCount: 67,
      status: "active",
      isFeatured: true
    },
    {
      name: "Bedside Table with Drawer",
      description: "Compact bedside table with drawer and open shelf, perfect for bedroom organization.",
      shortDescription: "Bedside table with storage",
      category: "storage",
      subcategory: "bedside",
      tags: ["bedside", "nightstand", "storage", "bedroom"],
      price: 129.99,
      comparePrice: 169.99,
      costPrice: 89.99,
      sku: generateSKU('storage', 4),
      stock: 35,
      trackQuantity: true,
      allowBackorder: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=600&fit=crop",
          alt: "Bedside table in modern bedroom",
          isPrimary: true
        }
      ],
      dimensions: { length: 45, width: 35, height: 55, weight: 12 },
      materials: ["Solid Wood", "Metal Pull", "Natural Finish"],
      colors: ["White", "Walnut", "Black"],
      features: ["Drawer Storage", "Open Shelf", "Compact Design", "Easy Assembly"],
      sustainability: {
        ecoScore: 4.3,
        carbonFootprint: 18,
        isRecyclable: true,
        isBiodegradable: true,
        certifications: ["FSC Certified Wood"]
      },
      vendor: vendors[0]._id,
      vendorName: "Eco Furniture Co.",
      ratings: { average: 4.5, count: 73 },
      salesCount: 48,
      viewCount: 234,
      status: "active",
      isFeatured: false
    }
  ];

  // Add SEO data to all products
  products.forEach(product => {
    product.seo = {
      metaTitle: `${product.name} | Flyingwood Furniture`,
      metaDescription: product.shortDescription,
      slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };
  });

  const createdProducts = await Product.insertMany(products);
  console.log(`✅ Created ${createdProducts.length} products`);
  return createdProducts;
};

const main = async () => {
  try {
    await connectDB();
    
    // Clear only products, keep users and orders
    await clearExistingData();
    
    const vendors = await getVendors();
    console.log(`Found ${vendors.length} vendors`);
    
    const products = await createProducts(vendors);

    console.log('\n🎉 50+ PRODUCTS INSERTION COMPLETE!');
    console.log('==================================');
    console.log(`🛋️ Total Products: ${products.length}`);
    
    // Count by category
    const categoryCount = {};
    products.forEach(product => {
      categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
    });
    
    console.log('\n📊 Products by Category:');
    Object.entries(categoryCount).forEach(([category, count]) => {
      console.log(`  - ${category}: ${count} products`);
    });

    console.log('\n🚀 Your database now has 50+ diverse furniture products!');
    console.log('🌐 Refresh your website to see all the new products.');

  } catch (error) {
    console.error('❌ Error inserting products:', error.message);
  } finally {
    mongoose.connection.close();
    console.log('📊 Database connection closed');
  }
};

main();
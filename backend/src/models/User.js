const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Make sure this line is added


const userSchema = new mongoose.Schema({
    // Basic Info
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },

    // User Role System
    role: {
        type: String,
        enum: ['customer', 'admin', 'staff', 'vendor'],
        default: 'customer'
    },

    // Profile Information
    profile: {
        firstName: String,
        lastName: String,
        phone: String,
        avatar: String,
        bio: String,
        dateOfBirth: Date
    },

    // Address Management
    addresses: [{
        type: {
            type: String,
            enum: ['home', 'work', 'other'],
            default: 'home'
        },
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: {
            type: String,
            default: 'United States'
        },
        isDefault: {
            type: Boolean,
            default: false
        }
    }],

    // Vendor Specific Fields (if role is vendor)
    vendorInfo: {
        companyName: String,
        businessEmail: String,
        taxId: String,
        description: String,
        website: String,
        isVerified: {
            type: Boolean,
            default: false
        }
    },

    // Staff Specific Fields (if role is staff)
    staffInfo: {
        employeeId: String,
        department: String,
        position: String,
        hireDate: Date,
        permissions: [String] // ['manage_products', 'view_orders', etc.]
    },

    // Preferences & Settings
    preferences: {
        newsletter: {
            type: Boolean,
            default: true
        },
        emailNotifications: {
            type: Boolean,
            default: true
        },
        smsNotifications: {
            type: Boolean,
            default: false
        },
        theme: {
            type: String,
            enum: ['light', 'dark', 'auto'],
            default: 'light'
        }
    },

    // Loyalty & Analytics
    loyaltyPoints: {
        type: Number,
        default: 0
    },
    totalOrders: {
        type: Number,
        default: 0
    },
    totalSpent: {
        type: Number,
        default: 0
    },

    // Add this to the userSchema, before the preferences field
    cart: {
        items: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
                default: 1
            },
            price: Number,
            customization: {
                color: String,
                finish: String,
                notes: String
            },
            addedAt: {
                type: Date,
                default: Date.now
            }
        }],
        updatedAt: {
            type: Date,
            default: Date.now
        }
    },

    // Status & Timestamps
    isActive: {
        type: Boolean,
        default: true
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    lastLogin: Date
},

    {
        timestamps: true
    });



// Password hashing middleware
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const saltRounds = 12;
        this.password = await bcrypt.hash(this.password, saltRounds);
        next();
    } catch (error) {
        next(error);
    }
});

// Generate JWT Token method
userSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        {
            userId: this._id,
            email: this.email,
            role: this.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// Password comparison method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual for full name
userSchema.virtual('fullName').get(function () {
    return `${this.profile.firstName} ${this.profile.lastName}`.trim();
});

// Method to check if user has role
userSchema.methods.hasRole = function (role) {
    return this.role === role;
};

// Method to check multiple roles
userSchema.methods.hasAnyRole = function (roles) {
    return roles.includes(this.role);
};

module.exports = mongoose.model('User', userSchema);
// Fallback API service with mock data
export const userAPI = {
  getAll: async () => {
    console.log('userAPI.getAll called - using mock data');
    return {
      data: [
        {
          _id: '1',
          username: 'admin',
          email: 'admin@flyingwood.com',
          role: 'admin',
          isActive: true,
          createdAt: new Date(),
          lastLogin: new Date()
        },
        {
          _id: '2', 
          username: 'vendor1',
          email: 'vendor@flyingwood.com',
          role: 'vendor',
          isActive: true,
          createdAt: new Date(),
          lastLogin: new Date()
        }
      ]
    };
  }
};

export const orderAPI = {
  getAll: async () => {
    console.log('orderAPI.getAll called - using mock data');
    return {
      data: [
        {
          _id: '1',
          orderNumber: 'FLY-2024-001',
          customerEmail: 'customer@example.com',
          status: 'delivered',
          total: 299.99,
          items: [{ product: '1', quantity: 1, price: 299.99 }],
          createdAt: new Date()
        }
      ]
    };
  }
};
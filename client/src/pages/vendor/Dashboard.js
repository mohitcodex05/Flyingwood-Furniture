import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import {
  Inventory,
  TrendingUp,
  AttachMoney,
  Add,
  Edit
} from '@mui/icons-material';
import { Link } from 'react-router-dom'; // ← ADD THIS IMPORT
import { useAuth } from '../../context/AuthContext';
import { productAPI, orderAPI } from '../../services/api';
import { formatPrice } from '../../utils/currency';

const VendorDashboard = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [products, setProducts] = useState([]);
  const [vendorOrders, setVendorOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if user is vendor or admin
  const isVendor = user && (user.role === 'vendor' || user.role === 'admin');



  // Wrap fetchVendorData in useCallback to prevent infinite re-renders
  const fetchVendorData = useCallback(async () => {
    if (!user?._id) return;
    
    try {
      setLoading(true);
      setError('');

      // Fetch all products and filter for vendor's products
      const productsRes = await productAPI.getAll({ limit: 1000 });
      const allProducts = productsRes.products || productsRes.data?.products || [];
      const vendorProducts = allProducts.filter(
        product => product.vendor?.toString() === user._id || user.role === 'admin' // Admins can see all products
      );

      // Try to fetch orders
      let allOrders = [];
      try {
        const ordersRes = await orderAPI.getAll();
        allOrders = Array.isArray(ordersRes) ? ordersRes : (ordersRes.data || []);
      } catch (orderError) {
        console.log('Orders API error, using empty orders:', orderError);
        allOrders = [];
      }

      // Filter orders for vendor's products
      const ordersWithVendorProducts = allOrders.filter(order =>
        order.items && order.items.some(item =>
          vendorProducts.some(product => product._id.toString() === item.product?.toString())
        )
      );

      // Calculate vendor stats
      const totalRevenue = ordersWithVendorProducts.reduce((sum, order) => {
        const vendorItems = order.items.filter(item =>
          vendorProducts.some(product => product._id.toString() === item.product?.toString())
        );
        return sum + vendorItems.reduce((itemSum, item) => itemSum + (item.subtotal || 0), 0);
      }, 0);

      const lowStockProducts = vendorProducts.filter(product => (product.stock || 0) < 5).length;
      const pendingOrders = ordersWithVendorProducts.filter(order =>
        order.status === 'pending' || order.status === 'confirmed'
      ).length;

      setProducts(vendorProducts);
      setVendorOrders(ordersWithVendorProducts.slice(0, 10));
      setStats({
        totalProducts: vendorProducts.length,
        totalOrders: ordersWithVendorProducts.length,
        totalRevenue,
        lowStockProducts,
        pendingOrders
      });

    } catch (err) {
      setError('Failed to load vendor data: ' + err.message);
      console.error('Error fetching vendor data:', err);
    } finally {
      setLoading(false);
    }
  }, [orderAPI, user?._id]);

  // useEffect with proper dependencies
  useEffect(() => {
    if (isVendor) {
      fetchVendorData();
    }
  }, [isVendor, fetchVendorData]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      confirmed: 'info',
      processing: 'primary',
      shipped: 'secondary',
      delivered: 'success',
      cancelled: 'error'
    };
    return colors[status] || 'default';
  };

  // Show access denied for non-vendors
  if (!isVendor) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Access denied. Vendor privileges required.
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading Vendor Dashboard...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1">
          Vendor Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {user.vendorInfo?.companyName || 'My Store'}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Inventory color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.totalProducts || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    My Products
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp color="secondary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.totalOrders || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Orders
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AttachMoney color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {formatPrice(stats.totalRevenue || 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Revenue
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Inventory color="warning" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.lowStockProducts || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Low Stock
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper elevation={2} sx={{ p: 0 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="My Products" />
          <Tab label="Orders" />
          <Tab label="Analytics" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* My Products Tab */}
          {tabValue === 0 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">
                  My Products ({products.length})
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  component={Link}
                  to="/vendor/products/new"
                >
                  Add New Product
                </Button>
              </Box>

              {products.length === 0 ? (
                <Box textAlign="center" sx={{ py: 4 }}>
                  <Inventory sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No products found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Start by adding your first product to see it here.
                  </Typography>
                  <Button 
                    variant="contained" 
                    startIcon={<Add />}
                    component={Link}
                    to="/vendor/products/new"
                  >
                    Add Your First Product
                  </Button>
                </Box>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Stock</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Sales</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product._id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box
                                component="img"
                                src={product.images?.[0]?.url || '/api/placeholder/40/40'}
                                alt={product.name}
                                sx={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 1, mr: 2 }}
                                onError={(e) => {
                                  e.target.src = '/api/placeholder/40/40';
                                }}
                              />
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  {product.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {product.shortDescription || 'No description'}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={product.category || 'Uncategorized'}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>{formatPrice(product.price)}</TableCell>
                          <TableCell>
                            <Chip
                              label={product.stock || 0}
                              color={
                                (product.stock || 0) < 5 ? 'error' :
                                  (product.stock || 0) < 10 ? 'warning' : 'success'
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={product.status || 'draft'}
                              color={product.status === 'active' ? 'success' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{product.salesCount || 0}</TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              startIcon={<Edit />}
                              variant="outlined"
                              component={Link}
                              to={`/vendor/products/edit/${product._id}`}
                            >
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}

          {/* Orders Tab */}
          {tabValue === 1 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">
                  Recent Orders
                </Typography>
                <Button variant="outlined">
                  View All Orders
                </Button>
              </Box>

              {vendorOrders.length === 0 ? (
                <Box textAlign="center" sx={{ py: 4 }}>
                  <TrendingUp sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No orders yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Orders containing your products will appear here.
                  </Typography>
                  <Button 
                    variant="outlined" 
                    startIcon={<TrendingUp />}
                    onClick={fetchVendorData}
                    sx={{ mt: 2 }}
                  >
                    Refresh Orders
                  </Button>
                </Box>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Order #</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell>Items</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell align="right">Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {vendorOrders.map((order) => {
                        const vendorItems = order.items.filter(item =>
                          products.some(product => product._id.toString() === item.product?.toString())
                        );
                        const vendorTotal = vendorItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);

                        return (
                          <TableRow key={order._id}>
                            <TableCell>{order.orderNumber || `#${order._id?.slice(-6) || 'N/A'}`}</TableCell>
                            <TableCell>{order.customerEmail || order.customer?.email || 'N/A'}</TableCell>
                            <TableCell>
                              {vendorItems.length} item(s)
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={order.status}
                                color={getStatusColor(order.status)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                            </TableCell>
                            <TableCell align="right">{formatPrice(vendorTotal)}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}

          {/* Analytics Tab */}
          {tabValue === 2 && (
            <Box>
              <Typography variant="h5" gutterBottom>
                Sales Analytics
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Top Selling Products
                      </Typography>
                      {products.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                          No products available
                        </Typography>
                      ) : (
                        products
                          .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
                          .slice(0, 5)
                          .map((product, index) => (
                            <Box key={product._id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2">
                                {index + 1}. {product.name}
                              </Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {product.salesCount || 0} sales
                              </Typography>
                            </Box>
                          ))
                      )}
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Quick Stats
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="body2">
                          <strong>Active Products:</strong> {products.filter(p => p.status === 'active').length}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Out of Stock:</strong> {products.filter(p => (p.stock || 0) === 0).length}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Featured Products:</strong> {products.filter(p => p.isFeatured).length}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Average Rating:</strong> {(
                            products.reduce((sum, product) => sum + (product.ratings?.average || 0), 0) /
                            (products.filter(p => p.ratings?.average).length || 1)
                          ).toFixed(1)}/5
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default VendorDashboard;
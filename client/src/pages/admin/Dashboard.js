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
  Tab,
  MenuItem,
  Select,
  FormControl,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  People, Inventory, ShoppingCart, TrendingUp, AttachMoney, Star, Email
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { userAPI, productAPI, orderAPI, contactAPI } from '../../services/api';
import { formatPrice } from '../../utils/currency';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Quick Edit Modal States
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({ price: '', comparePrice: '', stock: '' });

  // Check if user is admin - moved BEFORE hooks
  const isAdmin = user && user.role === 'admin';

  // Wrap fetchDashboardData in useCallback
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [usersRes, productsRes, ordersRes, contactsRes] = await Promise.all([
        userAPI.getAll().catch(() => ({ data: [] })),
        productAPI.getAll({ limit: 1000 }),
        orderAPI.getAll().catch(() => ({ data: [] })),
        contactAPI.getAll().catch(() => ({ data: [] }))
      ]);

      const users = usersRes.data || [];
      const allProducts = productsRes.products || productsRes.data?.products || [];
      const orders = ordersRes.data || [];
      const contactData = contactsRes.data || [];

      // Calculate stats
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      const pendingOrders = orders.filter(order => order.status === 'pending').length;
      const lowStockProducts = allProducts.filter(product => (product.stock || 0) < 10).length;

      setStats({
        totalUsers: users.length,
        totalProducts: allProducts.length,
        totalOrders: orders.length,
        totalRevenue,
        pendingOrders,
        lowStockProducts
      });

      // Get recent data
      setRecentOrders(orders.slice(0, 5));
      setRecentUsers(users.slice(0, 5).map(u => ({ ...u, password: undefined })));
      setInquiries(contactData);
      setProducts(allProducts);

    } catch (err) {
      setError('Failed to load dashboard data: ' + err.message);
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since we don't use external variables

  // useEffect with proper dependencies
  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData();
    }
  }, [isAdmin, fetchDashboardData]);

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

  // Add this function to handle user role changes
  const handleRoleChange = async (userId, newRole) => {
    try {
      await userAPI.update(userId, { role: newRole });
      // Refresh the data
      fetchDashboardData();
    } catch (err) {
      console.error('Error updating user role:', err);
      setError('Failed to update user role');
    }
  };

  // Add this function to handle user status changes
  const handleStatusChange = async (userId, isActive) => {
    try {
      await userAPI.update(userId, { isActive });
      // Refresh the data
      fetchDashboardData();
    } catch (err) {
      console.error('Error updating user status:', err);
      setError('Failed to update user status');
    }
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setEditFormData({
      price: product.price || '',
      comparePrice: product.comparePrice || '',
      stock: product.stock || 0
    });
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    if (!selectedProduct) return;
    try {
      await productAPI.update(selectedProduct._id, {
        price: Number(editFormData.price),
        comparePrice: editFormData.comparePrice ? Number(editFormData.comparePrice) : null,
        stock: Number(editFormData.stock)
      });
      setEditDialogOpen(false);
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to update product', err);
      setError('Failed to update product');
    }
  };

  // Show access denied for non-admins
  if (!isAdmin) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Access denied. Admin privileges required.
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading Admin Dashboard...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <People color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.totalUsers || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Users
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Inventory color="secondary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.totalProducts || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Products
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ShoppingCart color="success" sx={{ mr: 2 }} />
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

        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AttachMoney color="warning" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {formatPrice(stats.totalRevenue)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Revenue
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp color="info" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.pendingOrders || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Orders
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Star color="error" sx={{ mr: 2 }} />
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

      {/* Tabs for different sections */}
      <Paper elevation={2} sx={{ p: 0 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Overview" />
          <Tab label="Recent Orders" />
          <Tab label="User Management" />
          <Tab label="Products" />
          <Tab label="Inquiries" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* Overview Tab */}
          {tabValue === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Recent Orders
                </Typography>
                {recentOrders.length === 0 ? (
                  <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                    No orders found
                  </Typography>
                ) : (
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Order #</TableCell>
                          <TableCell>Customer</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell align="right">Amount</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recentOrders.map((order) => (
                          <TableRow key={order._id}>
                            <TableCell>{order.orderNumber}</TableCell>
                            <TableCell>{order.customerEmail}</TableCell>
                            <TableCell>
                              <Chip
                                label={order.status}
                                color={getStatusColor(order.status)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="right">{formatPrice(order.total)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Recent Users
                </Typography>
                {recentUsers.length === 0 ? (
                  <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                    No users found
                  </Typography>
                ) : (
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Username</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>Role</TableCell>
                          <TableCell>Joined</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recentUsers.map((user) => (
                          <TableRow key={user._id}>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Chip
                                label={user.role}
                                color="primary"
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              {new Date(user.createdAt).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Grid>
            </Grid>
          )}

          {/* Recent Orders Tab */}
          {tabValue === 1 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">
                  Recent Orders
                </Typography>
                <Button variant="contained">
                  View All Orders
                </Button>
              </Box>
              {recentOrders.length === 0 ? (
                <Box textAlign="center" sx={{ py: 4 }}>
                  <ShoppingCart sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No orders yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Customer orders will appear here
                  </Typography>
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
                        <TableCell align="right">Total</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentOrders.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell>{order.orderNumber}</TableCell>
                          <TableCell>{order.customerEmail}</TableCell>
                          <TableCell>{order.items?.length} items</TableCell>
                          <TableCell>
                            <Chip
                              label={order.status}
                              color={getStatusColor(order.status)}
                            />
                          </TableCell>
                          <TableCell>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell align="right">{formatPrice(order.total)}</TableCell>
                          <TableCell>
                            <Button size="small" variant="outlined">
                              View
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

          {/* User Management Tab */}
          {tabValue === 2 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">
                  User Management
                </Typography>
                <Button variant="contained">
                  Add New User
                </Button>
              </Box>
              {recentUsers.length === 0 ? (
                <Box textAlign="center" sx={{ py: 4 }}>
                  <People sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No users found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    User accounts will appear here
                  </Typography>
                </Box>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Username</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Joined</TableCell>
                        <TableCell>Last Login</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentUsers.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                              <Select
                                value={user.role || 'customer'}
                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                              >
                                <MenuItem value="customer">Customer</MenuItem>
                                <MenuItem value="vendor">Vendor</MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                                <MenuItem value="staff">Staff</MenuItem>
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={user.isActive !== false}
                                  onChange={(e) => handleStatusChange(user._id, e.target.checked)}
                                  color="success"
                                />
                              }
                              label={user.isActive !== false ? 'Active' : 'Inactive'}
                            />
                          </TableCell>
                          <TableCell>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                          </TableCell>
                          <TableCell>
                            <Button size="small" variant="outlined" sx={{ mr: 1 }}>
                              Edit
                            </Button>
                            <Button 
                              size="small" 
                              color="error" 
                              variant="outlined"
                              disabled // Temporarily disabled
                            >
                              Delete
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

          {/* Products Tab */}
          {tabValue === 3 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">Product Management ({products.length})</Typography>
                <Button
                  variant="contained"
                  component={Link}
                  to="/vendor/products/new"
                  startIcon={<Inventory />}
                >
                  Add New Product
                </Button>
              </Box>

              {products.length === 0 ? (
                <Box textAlign="center" sx={{ py: 6 }}>
                  <Inventory sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">No products found</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Add your first product to get started.
                  </Typography>
                </Box>
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'action.hover' }}>
                        <TableCell>Product</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell align="right">Price (INR)</TableCell>
                        <TableCell align="right">Offer Price</TableCell>
                        <TableCell align="center">Discount</TableCell>
                        <TableCell align="center">Stock</TableCell>
                        <TableCell align="center">3D</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {products.map((product) => {
                        const discount = product.comparePrice && product.comparePrice > product.price
                          ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
                          : 0;
                        return (
                          <TableRow key={product._id} hover>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box
                                  component="img"
                                  src={product.images?.[0]?.url || 'https://via.placeholder.com/40'}
                                  alt={product.name}
                                  sx={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 1, flexShrink: 0 }}
                                  onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }}
                                />
                                <Box>
                                  <Typography variant="body2" fontWeight="600" sx={{ lineHeight: 1.2 }}>
                                    {product.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {product.shortDescription?.slice(0, 40) || 'No description'}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip label={product.category || '—'} size="small" variant="outlined" />
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" fontWeight="600">
                                {formatPrice(product.price)}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              {product.comparePrice ? (
                                <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                                  {formatPrice(product.comparePrice)}
                                </Typography>
                              ) : (
                                <Typography variant="body2" color="text.disabled">—</Typography>
                              )}
                            </TableCell>
                            <TableCell align="center">
                              {discount > 0 ? (
                                <Chip label={`${discount}% OFF`} size="small" color="success" />
                              ) : (
                                <Typography variant="body2" color="text.disabled">—</Typography>
                              )}
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={product.stock ?? 0}
                                size="small"
                                color={(product.stock ?? 0) < 5 ? 'error' : (product.stock ?? 0) < 10 ? 'warning' : 'success'}
                              />
                            </TableCell>
                            <TableCell align="center">
                              {product.has3D ? (
                                <Chip label="3D" size="small" color="secondary" variant="filled" />
                              ) : (
                                <Typography variant="caption" color="text.disabled">No</Typography>
                              )}
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={product.status || 'draft'}
                                size="small"
                                color={product.status === 'active' ? 'primary' : 'default'}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() => handleEditClick(product)}
                              >
                                Quick Edit
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {/* Quick Edit Dialog */}
              <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                  ✏️ Quick Edit — {selectedProduct?.name}
                </DialogTitle>
                <DialogContent dividers>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
                    <TextField
                      label="Sale Price (USD in DB, shown as ₹)"
                      type="number"
                      fullWidth
                      value={editFormData.price}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, price: e.target.value }))}
                      inputProps={{ min: 0, step: 0.01 }}
                      helperText={`Will display as ${editFormData.price ? formatPrice(Number(editFormData.price)) : '—'}`}
                    />
                    <TextField
                      label="Original / Compare-at Price (for Offer % — leave blank to remove offer)"
                      type="number"
                      fullWidth
                      value={editFormData.comparePrice}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, comparePrice: e.target.value }))}
                      inputProps={{ min: 0, step: 0.01 }}
                      helperText={
                        editFormData.comparePrice && Number(editFormData.comparePrice) > Number(editFormData.price)
                          ? `${Math.round(((editFormData.comparePrice - editFormData.price) / editFormData.comparePrice) * 100)}% discount will be shown`
                          : 'Must be higher than Sale Price to show a discount badge'
                      }
                    />
                    <TextField
                      label="Stock Quantity"
                      type="number"
                      fullWidth
                      value={editFormData.stock}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, stock: e.target.value }))}
                      inputProps={{ min: 0 }}
                    />
                  </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                  <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                  <Button variant="contained" onClick={handleEditSave}>Save Changes</Button>
                </DialogActions>
              </Dialog>
            </Box>
          )}

          {/* Inquiries Tab */}
          {tabValue === 4 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">Customer Inquiries</Typography>
              </Box>
              {inquiries.length === 0 ? (
                <Box textAlign="center" sx={{ py: 4 }}>
                  <Email sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">No inquiries yet</Typography>
                </Box>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Message</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {inquiries.map((inquiry) => (
                        <TableRow key={inquiry._id}>
                          <TableCell>{new Date(inquiry.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>{inquiry.name}</TableCell>
                          <TableCell>{inquiry.email}</TableCell>
                          <TableCell sx={{ maxWidth: 300 }}>{inquiry.message}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;
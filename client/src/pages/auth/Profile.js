import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Tab,
  Tabs,
  List,
  Divider,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  Person, 
  ShoppingBag, 
  LocationOn,
  Edit 
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { orderAPI } from '../../services/api';

const Profile = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getMyOrders();
      setOrders(response.data);
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending: 'default',
      confirmed: 'info',
      processing: 'primary',
      shipped: 'secondary',
      delivered: 'success',
      cancelled: 'error'
    };
    return statusColors[status] || 'default';
  };

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Please log in to view your profile.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        My Profile
      </Typography>

      <Grid container spacing={4}>
        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Person sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {user.username}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
                <Chip 
                  label={user.role?.charAt(0).toUpperCase() + user.role?.slice(1)} 
                  color="primary" 
                  size="small" 
                  sx={{ mt: 1 }}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2">
                <strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}
              </Typography>
              <Typography variant="body2">
                <strong>Total orders:</strong> {orders.length}
              </Typography>
              <Typography variant="body2">
                <strong>Loyalty points:</strong> {user.loyaltyPoints || 0}
              </Typography>
            </Box>
          </Paper>

          {/* Quick Stats */}
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Stats
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Box textAlign="center">
                  <Typography variant="h4" color="primary">
                    {orders.length}
                  </Typography>
                  <Typography variant="caption">Total Orders</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box textAlign="center">
                  <Typography variant="h4" color="success.main">
                    {orders.filter(o => o.status === 'delivered').length}
                  </Typography>
                  <Typography variant="caption">Completed</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 0 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab icon={<Person />} label="Profile Info" />
              <Tab icon={<ShoppingBag />} label="Order History" />
              <Tab icon={<LocationOn />} label="Addresses" />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {/* Profile Info Tab */}
              {tabValue === 0 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5">
                      Personal Information
                    </Typography>
                    <Button startIcon={<Edit />} variant="outlined">
                      Edit Profile
                    </Button>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Username
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {user.username}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {user.email}
                      </Typography>
                    </Grid>
                    {user.profile?.firstName && (
                      <>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            First Name
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 2 }}>
                            {user.profile.firstName}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Last Name
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 2 }}>
                            {user.profile.lastName}
                          </Typography>
                        </Grid>
                      </>
                    )}
                    {user.profile?.phone && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          Phone
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {user.profile.phone}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )}

              {/* Order History Tab */}
              {tabValue === 1 && (
                <Box>
                  <Typography variant="h5" gutterBottom>
                    Order History
                  </Typography>

                  {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      {error}
                    </Alert>
                  )}

                  {loading ? (
                    <Box textAlign="center" sx={{ py: 4 }}>
                      <CircularProgress />
                      <Typography variant="h6" sx={{ mt: 2 }}>
                        Loading orders...
                      </Typography>
                    </Box>
                  ) : orders.length === 0 ? (
                    <Box textAlign="center" sx={{ py: 4 }}>
                      <ShoppingBag sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        No orders yet
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Start shopping to see your orders here
                      </Typography>
                      <Button variant="contained" href="/products">
                        Start Shopping
                      </Button>
                    </Box>
                  ) : (
                    <List>
                      {orders.map((order) => (
                        <Card key={order._id} sx={{ mb: 2 }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                              <Box>
                                <Typography variant="h6" gutterBottom>
                                  Order #{order.orderNumber}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                                </Typography>
                              </Box>
                              <Chip 
                                label={order.status?.replace(/_/g, ' ')} 
                                color={getStatusColor(order.status)}
                                size="small"
                              />
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">
                                  Items
                                </Typography>
                                <Typography variant="body1">
                                  {order.items?.length} items
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">
                                  Total Amount
                                </Typography>
                                <Typography variant="body1" fontWeight="bold">
                                  ${order.total?.toFixed(2)}
                                </Typography>
                              </Grid>
                            </Grid>

                            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                              <Button size="small" variant="outlined">
                                View Details
                              </Button>
                              {order.status === 'delivered' && (
                                <Button size="small" variant="outlined">
                                  Reorder
                                </Button>
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </List>
                  )}
                </Box>
              )}

              {/* Addresses Tab */}
              {tabValue === 2 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5">
                      Saved Addresses
                    </Typography>
                    <Button variant="contained">
                      Add New Address
                    </Button>
                  </Box>

                  {user.addresses && user.addresses.length > 0 ? (
                    <Grid container spacing={2}>
                      {user.addresses.map((address, index) => (
                        <Grid item xs={12} md={6} key={index}>
                          <Card variant="outlined">
                            <CardContent>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="h6">
                                  {address.type?.charAt(0).toUpperCase() + address.type?.slice(1)}
                                </Typography>
                                {address.isDefault && (
                                  <Chip label="Default" color="primary" size="small" />
                                )}
                              </Box>
                              <Typography variant="body2">
                                {address.firstName} {address.lastName}
                              </Typography>
                              <Typography variant="body2">
                                {address.street}
                              </Typography>
                              <Typography variant="body2">
                                {address.city}, {address.state} {address.zipCode}
                              </Typography>
                              <Typography variant="body2">
                                {address.country}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                <Button size="small">Edit</Button>
                                <Button size="small" color="error">
                                  Remove
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Box textAlign="center" sx={{ py: 4 }}>
                      <LocationOn sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        No saved addresses
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Add your addresses for faster checkout
                      </Typography>
                      <Button variant="contained">
                        Add Your First Address
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
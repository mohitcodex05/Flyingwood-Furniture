import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { ArrowBack, Save, CloudUpload } from '@mui/icons-material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { productAPI } from '../../services/api';

const ProductForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // For edit mode
  
  const isEditMode = Boolean(id);
  const backPath = user?.role === 'admin' ? '/admin' : '/vendor';
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories] = useState([
    'sofas', 'chairs', 'tables', 'beds', 'storage',
    'lighting', 'decor', 'office', 'outdoor', 'dining'
  ]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    stock: '',
    category: '',
    status: 'draft',
    has3D: false
  });
  const [imageFile, setImageFile] = useState(null);
  const [modelFiles, setModelFiles] = useState([]); // Array for multiple 3D assets

  // Fetch product data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getById(id);
      const product = response.data;
      
      // Check if current user owns this product (or is an admin)
      if (product.vendor?.toString() !== user._id && user.role !== 'admin') {
        setError('You do not have permission to edit this product');
        return;
      }

      setFormData({
        name: product.name || '',
        description: product.description || '',
        shortDescription: product.shortDescription || '',
        price: product.price || '',
        stock: product.stock || '',
        category: product.category || '',
        status: product.status || 'draft',
        has3D: product.has3D || false
      });
    } catch (err) {
      setError('Failed to load product: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      
      // Append all text fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      // Append vendor info
      formDataToSend.append('vendor', user._id);
      formDataToSend.append('vendorName', user.vendorInfo?.companyName || user.username);
      
      // Append Files
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }
      if (modelFiles.length > 0) {
        modelFiles.forEach(file => {
          formDataToSend.append('model', file);
        });
      }

      if (isEditMode) {
        await productAPI.update(id, formDataToSend);
      } else {
        await productAPI.create(formDataToSend);
      }
      
      navigate(user.role === 'admin' ? '/admin' : '/vendor');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.name === 'image') {
      setImageFile(e.target.files[0]);
    } else if (e.target.name === 'model') {
      setModelFiles(Array.from(e.target.files));
    }
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Button
          component={Link}
          to={backPath}
          startIcon={<ArrowBack />}
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>
        <Typography variant="h4" component="h1">
          {isEditMode ? 'Edit Product' : 'Create New Product'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isEditMode ? 'Update your product information' : 'Add a new product to your store'}
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Short Description"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                placeholder="Brief description for product listings"
                helperText="This appears in product cards and lists"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="Full Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Detailed product description"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="number"
                label="Price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                InputProps={{ startAdornment: '$' }}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="number"
                label="Stock Quantity"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  label="Category"
                  onChange={handleChange}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Select a product category</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  label="Status"
                  onChange={handleChange}
                >
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
                <FormHelperText>Product visibility status</FormHelperText>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>Media & 3D Experience</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    startIcon={<CloudUpload />}
                    sx={{ p: 2, borderStyle: 'dashed' }}
                  >
                    {imageFile ? imageFile.name : (isEditMode ? 'Change Image' : 'Upload Product Image')}
                    <input
                      type="file"
                      hidden
                      name="image"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </Button>
                  <FormHelperText>Recommended size: 800x800px</FormHelperText>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="has3D"
                        checked={formData.has3D}
                        onChange={handleChange}
                      />
                    }
                    label="Enable 3D Experience"
                  />
                </Grid>

                {formData.has3D && (
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      color="secondary"
                      startIcon={<CloudUpload />}
                      sx={{ p: 2, borderStyle: 'dotted' }}
                    >
                      {modelFiles.length > 0 
                        ? `${modelFiles.length} files selected` 
                        : (isEditMode ? 'Replace 3D Model Set' : 'Upload 3D Model Assets (.glb, .gltf, .bin)')}
                      <input
                        type="file"
                        hidden
                        multiple
                        name="model"
                        accept=".glb,.gltf,.bin"
                        onChange={handleFileChange}
                      />
                    </Button>
                    
                    {modelFiles.length > 0 && (
                      <Box sx={{ mt: 1, p: 1, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1 }}>
                        <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}>
                          Selected Assets:
                        </Typography>
                        {modelFiles.map((file, idx) => (
                          <Typography key={idx} variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                            • {file.name} ({(file.size / 1024).toFixed(1)} KB)
                          </Typography>
                        ))}
                      </Box>
                    )}

                    <FormHelperText sx={{ 
                      color: modelFiles.some(f => f.name.endsWith('.gltf')) && !modelFiles.some(f => f.name.endsWith('.bin')) 
                        ? 'warning.main' 
                        : 'text.secondary' 
                    }}>
                      {modelFiles.some(f => f.name.endsWith('.gltf')) && !modelFiles.some(f => f.name.endsWith('.bin'))
                        ? '⚠️ Missing .bin file! .gltf models require the companion .bin file to load.' 
                        : 'For .gltf models, ensure you select BOTH the .gltf and the .bin file together.'}
                    </FormHelperText>
                  </Grid>
                )}
              </Grid>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<Save />}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : (isEditMode ? 'Update Product' : 'Create Product')}
                </Button>
                <Button
                  component={Link}
                  to={backPath}
                  variant="outlined"
                  size="large"
                  disabled={loading}
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default ProductForm;
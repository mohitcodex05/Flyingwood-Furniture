import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  
  const { register, registrationSuccess, clearRegistrationSuccess } = useAuth();
  const navigate = useNavigate();

  // Reset registration success when component unmounts
  useEffect(() => {
    return () => {
      clearRegistrationSuccess();
    };
  }, [clearRegistrationSuccess]);

  // Redirect on successful registration
  useEffect(() => {
    if (registrationSuccess) {
      const timer = setTimeout(() => {
        navigate('/');
        clearRegistrationSuccess();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [registrationSuccess, navigate, clearRegistrationSuccess]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      if (result.success) {
        setActiveStep(1); // Move to success step
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const steps = ['Create Account', 'Success'];

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Typography variant="h4" component="h1" gutterBottom align="center">
          {activeStep === 0 ? 'Create Account' : 'Welcome to FlyingWood!'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Step 1: Registration Form */}
        {activeStep === 0 && (
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
              helperText="Must be at least 6 characters"
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
            <Box textAlign="center">
              <Typography variant="body2">
                Already have an account?{' '}
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  Login here
                </Link>
              </Typography>
            </Box>
          </Box>
        )}

        {/* Step 2: Success Message */}
        {activeStep === 1 && (
          <Box textAlign="center" sx={{ py: 4 }}>
            <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom color="success.main">
              Registration Successful!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Welcome to FlyingWood Furniture, {formData.username}! 
              Your account has been created successfully.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Redirecting you to the homepage in a few seconds...
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              sx={{ mr: 2 }}
            >
              Go Home Now
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/products')}
            >
              Start Shopping
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Register;
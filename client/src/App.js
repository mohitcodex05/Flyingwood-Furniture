import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress } from '@mui/material';
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FlynnAssistant from './components/ai/FlynnAssistant';

// Lazy-loaded Pages
const Home = React.lazy(() => import('./pages/Home'));
const Products = React.lazy(() => import('./pages/Products'));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'));
const Login = React.lazy(() => import('./pages/auth/Login'));
const Register = React.lazy(() => import('./pages/auth/Register'));
const Profile = React.lazy(() => import('./pages/auth/Profile'));
const Cart = React.lazy(() => import('./pages/Cart'));
const Checkout = React.lazy(() => import('./pages/Checkout'));
const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const VendorDashboard = React.lazy(() => import('./pages/vendor/Dashboard'));
const ProductForm = React.lazy(() => import('./pages/vendor/ProductForm'));
const About = React.lazy(() => import('./pages/About'));
const Journal = React.lazy(() => import('./pages/Journal'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Experience3D = React.lazy(() => import('./pages/Experience3D'));

// ─── Luxury Modern Theme ─────────────────────────────────────────────────────
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#e5dfd4', // Beige
      light: '#f8f6f0', // Off-white
      dark: '#bfa780', // Soft Gold
      contrastText: '#0c0c0c',
    },
    secondary: {
      main: '#bfa780',
    },
    background: {
      default: '#0c0c0c', // Black
      paper: '#161616',   // Charcoal
    },
    text: {
      primary: '#f8f6f0',
      secondary: 'rgba(248,246,240,0.65)',
    },
    divider: 'rgba(229, 223, 212, 0.15)',
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", sans-serif',
    h1: { fontFamily: '"Outfit", sans-serif', fontWeight: 500, letterSpacing: '-0.02em' },
    h2: { fontFamily: '"Outfit", sans-serif', fontWeight: 500, letterSpacing: '-0.01em' },
    h3: { fontFamily: '"Outfit", sans-serif', fontWeight: 500 },
    h4: { fontFamily: '"Outfit", sans-serif', fontWeight: 500 },
    h5: { fontFamily: '"Outfit", sans-serif', fontWeight: 500 },
    h6: { fontFamily: '"Outfit", sans-serif', fontWeight: 500 },
    button: { fontFamily: '"Outfit", sans-serif', fontWeight: 500, letterSpacing: '0.05em' },
  },
  shape: { borderRadius: 4 }, // Architectural, less rounded
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0c0c0c',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#161616',
          border: '1px solid rgba(229, 223, 212, 0.08)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          borderRadius: 8,
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'uppercase',
          fontWeight: 500,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          }
        },
        containedPrimary: {
          background: '#e5dfd4',
          color: '#0c0c0c',
          '&:hover': {
            background: '#f8f6f0',
          },
        },
        outlinedPrimary: {
          borderColor: 'rgba(229, 223, 212, 0.3)',
          color: '#f8f6f0',
          '&:hover': {
            borderColor: '#e5dfd4',
            backgroundColor: 'rgba(229, 223, 212, 0.05)',
          }
        }
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontFamily: '"Outfit", sans-serif',
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 4,
            background: 'rgba(255,255,255,0.02)',
            '& fieldset': { borderColor: 'rgba(229, 223, 212, 0.15)' },
            '&:hover fieldset': { borderColor: 'rgba(229, 223, 212, 0.4)' },
            '&.Mui-focused fieldset': { borderColor: '#e5dfd4' },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

// ─── Route Guards ────────────────────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress sx={{ color: 'var(--lx-beige)' }} />
      </Box>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
};

const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress sx={{ color: 'var(--lx-beige)' }} />
      </Box>
    );
  }
  return !user ? children : <Navigate to="/" replace />;
};

// ─── App ─────────────────────────────────────────────────────────────────────
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flexGrow: 1 }}>
              <Suspense fallback={
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                  <CircularProgress sx={{ color: 'var(--lx-beige)' }} />
                </Box>
              }>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/journal" element={<Journal />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/experience-3d" element={<Experience3D />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetail />} />

                  <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
                  <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />

                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                  <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                  <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/vendor" element={<ProtectedRoute><VendorDashboard /></ProtectedRoute>} />
                  <Route path="/vendor/products/new" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
                  <Route path="/vendor/products/edit/:id" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
            {/* Grounded AI Assistant */}
            <FlynnAssistant />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import {
  Badge,
  Box,
  Divider,
  Menu,
  MenuItem,
  Typography,
  IconButton,
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingCartOutlined,
  PersonOutline,
  DashboardOutlined,
  Inventory2Outlined,
  LogoutOutlined,
  StorefrontOutlined,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { cartAPI } from '../../services/api';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Collections', to: '/products' },
  { label: 'Heritage', to: '/about' },
  { label: 'Journal', to: '/journal' },
  { label: 'Contact', to: '/contact' },
  { label: '3D Experience', to: '/experience-3d' },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const fetchCartCount = async () => {
      if (user) {
        try {
          const response = await cartAPI.get();
          const count = response.data.cart?.items?.reduce((t, i) => t + i.quantity, 0) || 0;
          setCartCount(count);
        } catch {
          /* ignore */
        }
      } else {
        setCartCount(0);
      }
    };
    fetchCartCount();
    const interval = setInterval(fetchCartCount, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setAnchorEl(null);
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1200,
        background: scrolled ? 'var(--lx-black)' : 'var(--lx-black)',
        borderBottom: scrolled ? '1px solid var(--lx-border-light)' : '1px solid transparent',
        transition: 'all 0.3s ease',
        padding: '0 40px',
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          height: 80,
        }}
      >
        {/* Left: Navigation Links */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 4 }}>
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              style={{
                textDecoration: 'none',
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 500,
                fontSize: '0.85rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: isActive(to) ? 'var(--lx-beige)' : 'var(--lx-text-secondary)',
                transition: 'color 0.2s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--lx-beige)'; }}
              onMouseLeave={(e) => { if (!isActive(to)) e.currentTarget.style.color = 'var(--lx-text-secondary)'; }}
            >
              {label}
            </Link>
          ))}
        </Box>

        {/* Center: Logo */}
        <Link
          to="/"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 600,
              fontSize: '1.6rem',
              letterSpacing: '0.05em',
              color: 'var(--lx-text-primary)'
            }}
          >
            FlyingWood
          </span>
        </Link>

        {/* Right: Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
          {/* Cart */}
          <IconButton
            component={Link}
            to="/cart"
            disableRipple
            sx={{
              color: 'var(--lx-text-primary)',
              transition: 'opacity 0.2s ease',
              '&:hover': { opacity: 0.7, background: 'transparent' },
            }}
          >
            <Badge
              badgeContent={cartCount}
              sx={{
                '& .MuiBadge-badge': {
                  background: 'var(--lx-beige)',
                  color: 'var(--lx-black)',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  fontFamily: '"Outfit", sans-serif',
                  minWidth: 16,
                  height: 16,
                  padding: '0 4px',
                },
              }}
            >
              <ShoppingCartOutlined sx={{ fontSize: 22 }} />
            </Badge>
          </IconButton>

          {user ? (
            <>
              <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                disableRipple
                sx={{
                  color: 'var(--lx-text-primary)',
                  transition: 'opacity 0.2s ease',
                  '&:hover': { opacity: 0.7, background: 'transparent' },
                }}
              >
                <PersonOutline sx={{ fontSize: 24 }} />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                PaperProps={{
                  sx: {
                    mt: 2,
                    minWidth: 240,
                    background: 'var(--lx-charcoal)',
                    border: '1px solid var(--lx-border-light)',
                    borderRadius: '4px',
                    boxShadow: 'var(--lx-shadow-md)',
                    '& .MuiMenuItem-root': {
                      fontFamily: '"Outfit", sans-serif',
                      fontSize: '0.85rem',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      py: 1.5,
                      px: 3,
                      color: 'var(--lx-text-secondary)',
                      '&:hover': {
                        background: 'var(--lx-surface-elevated)',
                        color: 'var(--lx-beige)',
                      },
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Box sx={{ px: 3, py: 2.5 }}>
                  <Typography
                    sx={{
                      fontFamily: '"Outfit", sans-serif',
                      fontWeight: 500,
                      fontSize: '1rem',
                      color: 'var(--lx-text-primary)',
                      mb: 0.5
                    }}
                  >
                    {user.username}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '0.8rem',
                      color: 'var(--lx-text-tertiary)',
                      mb: 1.5
                    }}
                  >
                    {user.email}
                  </Typography>
                  <span className="badge-lx">{user.role}</span>
                </Box>

                <Divider sx={{ borderColor: 'var(--lx-border-light)', mx: 2 }} />

                <MenuItem onClick={() => { navigate('/profile'); setAnchorEl(null); }}>
                  <PersonOutline sx={{ mr: 2, fontSize: 18 }} /> Account Details
                </MenuItem>

                {user.role === 'admin' && [
                  <MenuItem key="admin" onClick={() => { navigate('/admin'); setAnchorEl(null); }}>
                    <DashboardOutlined sx={{ mr: 2, fontSize: 18 }} /> Administration
                  </MenuItem>,
                  <MenuItem key="vendors" onClick={() => { navigate('/vendor'); setAnchorEl(null); }}>
                    <StorefrontOutlined sx={{ mr: 2, fontSize: 18 }} /> Vendor Directory
                  </MenuItem>,
                ]}

                {user.role === 'vendor' && [
                  <MenuItem key="vendor" onClick={() => { navigate('/vendor'); setAnchorEl(null); }}>
                    <Inventory2Outlined sx={{ mr: 2, fontSize: 18 }} /> Catalog Management
                  </MenuItem>,
                ]}

                <Divider sx={{ borderColor: 'var(--lx-border-light)', mx: 2 }} />

                <MenuItem onClick={handleLogout}>
                  <LogoutOutlined sx={{ mr: 2, fontSize: 18 }} /> Sign Out
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Link
              to="/login"
              style={{
                textDecoration: 'none',
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 500,
                fontSize: '0.85rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--lx-text-primary)',
                transition: 'color 0.2s ease',
                marginLeft: 16
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--lx-beige)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--lx-text-primary)'; }}
            >
              Sign In
            </Link>
          )}
        </Box>
      </div>
    </nav>
  );
};

export default Navbar;
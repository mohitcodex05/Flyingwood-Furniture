import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Link, 
  IconButton,
  Divider 
} from '@mui/material';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  LinkedIn,
  Email,
  Phone,
  LocationOn 
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 8
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              🪑 Flyingwood Furniture
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
              Sustainable, beautifully crafted furniture for modern living spaces. 
              We believe in creating pieces that last a lifetime while protecting our planet.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton color="inherit" size="small">
                <Facebook fontSize="small" />
              </IconButton>
              <IconButton color="inherit" size="small">
                <Twitter fontSize="small" />
              </IconButton>
              <IconButton color="inherit" size="small">
                <Instagram fontSize="small" />
              </IconButton>
              <IconButton color="inherit" size="small">
                <LinkedIn fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom>
              Shop
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/products" color="inherit" sx={{ textDecoration: 'none', opacity: 0.9, '&:hover': { opacity: 1 } }}>
                All Products
              </Link>
              <Link href="/products?category=sofas" color="inherit" sx={{ textDecoration: 'none', opacity: 0.9, '&:hover': { opacity: 1 } }}>
                Sofas
              </Link>
              <Link href="/products?category=chairs" color="inherit" sx={{ textDecoration: 'none', opacity: 0.9, '&:hover': { opacity: 1 } }}>
                Chairs
              </Link>
              <Link href="/products?category=tables" color="inherit" sx={{ textDecoration: 'none', opacity: 0.9, '&:hover': { opacity: 1 } }}>
                Tables
              </Link>
              <Link href="/products?featured=true" color="inherit" sx={{ textDecoration: 'none', opacity: 0.9, '&:hover': { opacity: 1 } }}>
                Featured
              </Link>
            </Box>
          </Grid>

          {/* Company */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom>
              Company
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/about" color="inherit" sx={{ textDecoration: 'none', opacity: 0.9, '&:hover': { opacity: 1 } }}>
                About Us
              </Link>
              <Link href="/sustainability" color="inherit" sx={{ textDecoration: 'none', opacity: 0.9, '&:hover': { opacity: 1 } }}>
                Sustainability
              </Link>
              <Link href="/careers" color="inherit" sx={{ textDecoration: 'none', opacity: 0.9, '&:hover': { opacity: 1 } }}>
                Careers
              </Link>
              <Link href="/press" color="inherit" sx={{ textDecoration: 'none', opacity: 0.9, '&:hover': { opacity: 1 } }}>
                Press
              </Link>
            </Box>
          </Grid>

          {/* Support */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom>
              Support
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/contact" color="inherit" sx={{ textDecoration: 'none', opacity: 0.9, '&:hover': { opacity: 1 } }}>
                Contact Us
              </Link>
              <Link href="/shipping" color="inherit" sx={{ textDecoration: 'none', opacity: 0.9, '&:hover': { opacity: 1 } }}>
                Shipping Info
              </Link>
              <Link href="/returns" color="inherit" sx={{ textDecoration: 'none', opacity: 0.9, '&:hover': { opacity: 1 } }}>
                Returns
              </Link>
              <Link href="/faq" color="inherit" sx={{ textDecoration: 'none', opacity: 0.9, '&:hover': { opacity: 1 } }}>
                FAQ
              </Link>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom>
              Contact
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email fontSize="small" sx={{ opacity: 0.9 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  hello@flyingwood.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone fontSize="small" sx={{ opacity: 0.9 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  (555) 123-4567
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <LocationOn fontSize="small" sx={{ opacity: 0.9, mt: 0.25 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  123 Sustainable St<br />
                  Green City, GC 12345
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, opacity: 0.3 }} />

        {/* Bottom Section */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2 
        }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © 2024 Flyingwood Furniture. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link href="/privacy" color="inherit" sx={{ textDecoration: 'none', opacity: 0.8, fontSize: '0.875rem', '&:hover': { opacity: 1 } }}>
              Privacy Policy
            </Link>
            <Link href="/terms" color="inherit" sx={{ textDecoration: 'none', opacity: 0.8, fontSize: '0.875rem', '&:hover': { opacity: 1 } }}>
              Terms of Service
            </Link>
            <Link href="/cookies" color="inherit" sx={{ textDecoration: 'none', opacity: 0.8, fontSize: '0.875rem', '&:hover': { opacity: 1 } }}>
              Cookie Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
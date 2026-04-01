import React from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';

const About = () => {
  return (
    <Box sx={{ minHeight: '100vh', background: 'var(--lx-black)', pt: 8, pb: 12 }}>
      <Container maxWidth="lg">
         <Box textAlign="center" mb={10}>
            <span className="badge-lx" style={{ marginBottom: 24 }}>The Heritage</span>
            <Typography variant="h2" sx={{ color: 'var(--lx-text-primary)', fontFamily: '"Outfit", sans-serif', mb: 3 }}>
               A Legacy of Craftsmanship
            </Typography>
            <Typography sx={{ color: 'var(--lx-text-secondary)', maxWidth: 600, mx: 'auto', fontSize: '1.1rem', lineHeight: 1.8 }}>
               Founded on the principle that luxury is defined by longevity, FlyingWood Furniture creates architectural pieces designed to endure generations.
            </Typography>
         </Box>
         <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
               <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80" alt="Craftsmanship" style={{ width: '100%', borderRadius: 'var(--lx-radius)', filter: 'grayscale(30%)' }} />
            </Grid>
            <Grid item xs={12} md={6}>
               <Typography variant="h4" sx={{ color: 'var(--lx-text-primary)', mb: 3, fontFamily: '"Outfit", sans-serif' }}>The Artisan's Touch</Typography>
               <Typography sx={{ color: 'var(--lx-text-secondary)', mb: 3, lineHeight: 1.8 }}>
                  Our workshops in Northern Europe fuse traditional woodworking techniques with cutting-edge sustainable engineering. Every joint, curve, and finish is executed with uncompromising precision.
               </Typography>
               <Typography sx={{ color: 'var(--lx-text-secondary)', lineHeight: 1.8 }}>
                  We believe that what you invite into your home should carry weight, history, and a quiet, undeniable presence.
               </Typography>
            </Grid>
         </Grid>
      </Container>
    </Box>
  );
};

export default About;

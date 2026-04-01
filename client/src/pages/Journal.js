import React from 'react';
import { Container, Typography, Box, Grid, Card, CardMedia, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';

const Journal = () => {
  const articles = [
    {
      title: 'The Art of Organic Woodworking',
      excerpt: 'Exploring the intersection of deep historical techniques and modern architectural spaces.',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
      category: 'Design Philosophy'
    },
    {
      title: 'Our Sustainable Forestry Initiative',
      excerpt: 'How FlyingWood guarantees material traceability from seed to showroom.',
      image: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800&h=600&fit=crop',
      category: 'Environment'
    },
    {
      title: 'Curating the Minimalist Home',
      excerpt: 'Why negative space is the most valuable material in interior design.',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop',
      category: 'Interior Architecture'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'var(--lx-black)', pt: 8, pb: 12 }}>
      <Container maxWidth="xl">
         <Box textAlign="center" mb={10}>
            <span className="badge-lx" style={{ marginBottom: 24 }}>The Journal</span>
            <Typography variant="h2" sx={{ color: 'var(--lx-text-primary)', fontFamily: '"Outfit", sans-serif', mb: 3 }}>
               Thoughts & Practices
            </Typography>
            <Typography sx={{ color: 'var(--lx-text-secondary)', maxWidth: 600, mx: 'auto', fontSize: '1.1rem' }}>
               A curated selection of essays on design, architecture, and the philosophy behind our creations.
            </Typography>
         </Box>

         <Grid container spacing={4}>
            {articles.map((article, i) => (
               <Grid item xs={12} md={4} key={i}>
                  <Card sx={{ 
                     background: 'var(--lx-charcoal)', 
                     border: '1px solid var(--lx-border)', 
                     borderRadius: 'var(--lx-radius)', 
                     height: '100%', 
                     display: 'flex', 
                     flexDirection: 'column',
                     transition: 'var(--lx-transition)',
                     '&:hover': { transform: 'translateY(-4px)', borderColor: 'var(--lx-border-light)', boxShadow: 'var(--lx-shadow-lg)' }
                  }}>
                     <CardMedia
                        component="img"
                        height="340"
                        image={article.image}
                        alt={article.title}
                        sx={{ objectFit: 'cover', filter: 'brightness(0.9) grayscale(10%)' }}
                     />
                     <CardContent sx={{ flexGrow: 1, p: 4, display: 'flex', flexDirection: 'column' }}>
                        <Typography sx={{ color: 'var(--lx-beige)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', mb: 2 }}>
                           {article.category}
                        </Typography>
                        <Typography variant="h5" sx={{ color: 'var(--lx-text-primary)', fontFamily: '"Outfit", sans-serif', mb: 2, lineHeight: 1.3 }}>
                           {article.title}
                        </Typography>
                        <Typography sx={{ color: 'var(--lx-text-secondary)', mb: 4, flexGrow: 1, lineHeight: 1.6 }}>
                           {article.excerpt}
                        </Typography>
                        <Link to="#" style={{ color: 'var(--lx-text-primary)', textDecoration: 'none', borderBottom: '1px solid var(--lx-border)', paddingBottom: 4, alignSelf: 'flex-start', fontFamily: '"Outfit", sans-serif', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                           Read Article
                        </Link>
                     </CardContent>
                  </Card>
               </Grid>
            ))}
         </Grid>
      </Container>
    </Box>
  );
};

export default Journal;

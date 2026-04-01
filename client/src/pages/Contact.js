import React, { useState } from 'react';
import { Container, Typography, Box, Grid, TextField, Button, Alert, CircularProgress } from '@mui/material';
import { contactAPI } from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      return;
    }
    try {
      setLoading(true);
      await contactAPI.submit(formData);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus('server_error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'var(--lx-black)', pt: 8, pb: 12 }}>
      <Container maxWidth="lg">
         <Box textAlign="center" mb={10}>
            <span className="badge-lx" style={{ marginBottom: 24 }}>Concierge Desk</span>
            <Typography variant="h2" sx={{ color: 'var(--lx-text-primary)', fontFamily: '"Outfit", sans-serif', mb: 3 }}>
               Private Consultations
            </Typography>
            <Typography sx={{ color: 'var(--lx-text-secondary)', maxWidth: 600, mx: 'auto', fontSize: '1.1rem', lineHeight: 1.8 }}>
               For bespoke inquiries, white-glove delivery coordination, or architectural collaboration, our client relations team is at your disposal.
            </Typography>
         </Box>
         <Grid container spacing={8} justifyContent="center">
            <Grid item xs={12} md={5}>
               <Box sx={{ p: 6, background: 'var(--lx-charcoal)', border: '1px solid var(--lx-border)', borderRadius: 'var(--lx-radius-lg)', boxShadow: 'var(--lx-shadow-lg)' }}>
                  <Typography variant="h4" sx={{ color: 'var(--lx-text-primary)', mb: 4, fontFamily: '"Outfit", sans-serif' }}>Direct Inquiry</Typography>
                  {status === 'success' && <Alert severity="success" sx={{ mb: 3, bgcolor: 'var(--lx-black)', color: 'var(--lx-beige)' }}>Your inquiry has been received. A representative will contact you shortly.</Alert>}
                  {status === 'error' && <Alert severity="error" sx={{ mb: 3, bgcolor: 'var(--lx-black)', color: 'error.main' }}>Please provide complete details.</Alert>}
                  {status === 'server_error' && <Alert severity="error" sx={{ mb: 3, bgcolor: 'var(--lx-black)', color: 'error.main' }}>Server error. Please try again later.</Alert>}
                  <form onSubmit={handleSubmit}>
                     <TextField 
                        fullWidth 
                        label="Architect / Client Name" 
                        variant="outlined" 
                        margin="normal" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        sx={{ input: { color: 'var(--lx-text-primary)' }, label: { color: 'var(--lx-text-secondary)' } }} 
                     />
                     <TextField 
                        fullWidth 
                        label="Professional Email" 
                        variant="outlined" 
                        margin="normal" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        sx={{ input: { color: 'var(--lx-text-primary)' }, label: { color: 'var(--lx-text-secondary)' } }} 
                     />
                     <TextField 
                        fullWidth 
                        label="Project Details & Inquiry" 
                        variant="outlined" 
                        margin="normal" 
                        multiline 
                        rows={4} 
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        sx={{ textarea: { color: 'var(--lx-text-primary)' }, label: { color: 'var(--lx-text-secondary)' } }} 
                     />
                     <Button type="submit" disabled={loading} variant="contained" fullWidth sx={{ mt: 4, py: 2, bgcolor: 'var(--lx-beige)', color: 'var(--lx-black)', fontSize: '0.95rem', '&:hover': { bgcolor: 'var(--lx-text-primary)' } }}>
                        {loading ? <CircularProgress size={24} sx={{ color: 'var(--lx-black)' }} /> : 'Dispatch Protocol'}
                     </Button>
                  </form>
               </Box>
            </Grid>
            <Grid item xs={12} md={4}>
               <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 4 }}>
                  <Typography sx={{ color: 'var(--lx-beige)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem', mb: 2 }}>Headquarters</Typography>
                  <Typography variant="h5" sx={{ color: 'var(--lx-text-primary)', mb: 3, fontFamily: '"Outfit", sans-serif' }}>Stockholm Atelier</Typography>
                  <Typography sx={{ color: 'var(--lx-text-secondary)', mb: 1, lineHeight: 1.8 }}>Nybrogatan 11</Typography>
                  <Typography sx={{ color: 'var(--lx-text-secondary)', mb: 6, lineHeight: 1.8 }}>114 39 Stockholm, Sweden</Typography>

                  <Typography sx={{ color: 'var(--lx-beige)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem', mb: 2 }}>Direct Lines</Typography>
                  <Typography sx={{ color: 'var(--lx-text-primary)', mb: 1, fontFamily: '"Inter", sans-serif' }}>concierge@flyingwood.luxury</Typography>
                  <Typography sx={{ color: 'var(--lx-text-primary)', fontFamily: '"Inter", sans-serif' }}>+46 8 123 456 78</Typography>
               </Box>
            </Grid>
         </Grid>
      </Container>
    </Box>
  );
};

export default Contact;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Rating,
  Avatar,
  Chip,
  Button
} from '@mui/material';
import { ThumbUp } from '@mui/icons-material';
import api from '../../services/api';

const ReviewList = ({ productId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/reviews/product/${productId}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Failed to fetch reviews');
    }
  };

  const handleHelpful = async (reviewId) => {
    try {
      await api.patch(`/reviews/${reviewId}/helpful`);
      // Update local state
      setReviews(reviews.map(review => 
        review._id === reviewId 
          ? { ...review, helpful: review.helpful + 1 }
          : review
      ));
    } catch (error) {
      console.error('Failed to mark as helpful');
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Customer Reviews ({reviews.length})
      </Typography>
      
      {reviews.map((review) => (
        <Card key={review._id} sx={{ p: 3, mb: 2 }}>
          <Box display="flex" alignItems="center" mb={1}>
            <Avatar src={review.user.avatar} sx={{ mr: 2 }}>
              {review.user.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="subtitle1">{review.user.name}</Typography>
              <Box display="flex" alignItems="center">
                <Rating value={review.rating} size="small" readOnly />
                <Typography variant="caption" sx={{ ml: 1 }}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Typography variant="h6" gutterBottom>{review.title}</Typography>
          <Typography variant="body2" paragraph>{review.comment}</Typography>
          
          <Box display="flex" justifyContent="space-between" alignItems="center">
            {review.verifiedPurchase && (
              <Chip label="Verified Purchase" color="success" size="small" />
            )}
            
            <Button
              startIcon={<ThumbUp />}
              size="small"
              onClick={() => handleHelpful(review._id)}
            >
              Helpful ({review.helpful})
            </Button>
          </Box>
        </Card>
      ))}
    </Box>
  );
};

export default ReviewList;
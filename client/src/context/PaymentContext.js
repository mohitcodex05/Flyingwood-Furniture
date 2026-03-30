import React, { createContext, useContext, useReducer } from 'react';
import api from '../services/api';

const PaymentContext = createContext();

const paymentReducer = (state, action) => {
  switch (action.type) {
    case 'PAYMENT_START':
      return { ...state, loading: true, error: null };
    case 'PAYMENT_SUCCESS':
      return { ...state, loading: false, error: null };
    case 'PAYMENT_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const initialState = {
  loading: false,
  error: null
};

export const PaymentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(paymentReducer, initialState);

  const createPaymentIntent = async (orderId) => {
    try {
      dispatch({ type: 'PAYMENT_START' });
      const response = await api.post('/payment/create-payment-intent', { orderId });
      dispatch({ type: 'PAYMENT_SUCCESS' });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'Payment failed';
      dispatch({ type: 'PAYMENT_FAILURE', payload: message });
      throw new Error(message);
    }
  };

  const confirmPayment = async (orderId, paymentId) => {
    try {
      dispatch({ type: 'PAYMENT_START' });
      const response = await api.post('/payment/confirm-payment', { 
        orderId, 
        paymentId 
      });
      dispatch({ type: 'PAYMENT_SUCCESS' });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'Payment confirmation failed';
      dispatch({ type: 'PAYMENT_FAILURE', payload: message });
      throw new Error(message);
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <PaymentContext.Provider value={{
      ...state,
      createPaymentIntent,
      confirmPayment,
      clearError
    }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within PaymentProvider');
  }
  return context;
};
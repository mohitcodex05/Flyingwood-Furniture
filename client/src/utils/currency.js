export const EXPERIMENTAL_EXCHANGE_RATE = 84; // 1 USD = 84 INR (Approx today's value)

export const formatPrice = (usdPrice) => {
  if (typeof usdPrice !== 'number') {
    usdPrice = parseFloat(usdPrice);
  }
  
  if (isNaN(usdPrice)) return '₹0';
  
  const inrPrice = usdPrice * EXPERIMENTAL_EXCHANGE_RATE;
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(inrPrice);
};

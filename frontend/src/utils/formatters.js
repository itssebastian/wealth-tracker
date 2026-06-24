export const formatCurrency = (amount, currency = 'INR') => {
  const num = parseFloat(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatNumber = (num) =>
  new Intl.NumberFormat('en-IN').format(parseFloat(num) || 0);

export const formatPercent = (val) => `${parseFloat(val).toFixed(1)}%`;

export const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const calcProfitLossColor = (val) => {
  const n = parseFloat(val);
  if (n > 0) return 'success.main';
  if (n < 0) return 'error.main';
  return 'text.secondary';
};

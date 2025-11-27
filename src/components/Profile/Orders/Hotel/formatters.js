export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateTime = (dateTimeString) => {
  return new Date(dateTimeString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatBDTCurrency = (amount) => {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
  }).format(parseFloat(amount || 0));
};

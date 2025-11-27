export const getStatusBadge = (status, paymentStatus) => {
  const statusConfig = {
    confirmed: { color: "bg-blue-100 text-blue-800", text: "Confirmed" },
    completed: { color: "bg-green-100 text-green-800", text: "Completed" },
    cancelled: { color: "bg-red-100 text-red-800", text: "Cancelled" },
    pending: {
      color:
        paymentStatus === "paid"
          ? "bg-purple-100 text-purple-800"
          : "bg-yellow-100 text-yellow-800",
      text:
        paymentStatus === "paid"
          ? "Pending Confirmation"
          : "Payment Pending",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}
    >
      {config.text}
    </span>
  );
};

export const getPaymentBadge = (paymentStatus) => {
  const paymentConfig = {
    paid: { color: "bg-green-100 text-green-800", text: "Paid" },
    unpaid: { color: "bg-red-100 text-red-800", text: "Unpaid" },
    pending: { color: "bg-yellow-100 text-yellow-800", text: "Pending" },
    refunded: { color: "bg-blue-100 text-blue-800", text: "Refunded" },
  };

  const config = paymentConfig[paymentStatus] || paymentConfig.pending;

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
    >
      {config.text}
    </span>
  );
};

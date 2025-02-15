export const formatCurrency = (amountString) => {
  const amount = parseFloat(amountString);
  if (isNaN(amount)) {
    return "";
  }
  return amount?.toLocaleString("en-US", {
    style: "currency",
    currency: "AED",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

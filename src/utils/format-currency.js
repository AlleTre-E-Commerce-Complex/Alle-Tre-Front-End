export const formatCurrency = (amountString, currencyCode = "AED") => {
  const amount = parseFloat(amountString);
  if (isNaN(amount)) {
    return "";
  }

  // Ensure currencyCode is a valid string, fallback to AED if not
  const code = (typeof currencyCode === 'string' && currencyCode.length === 3) 
    ? currencyCode.toUpperCase() 
    : "AED";

  try {
    return amount?.toLocaleString("en-US", {
      style: "currency",
      currency: code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0, // Auctions usually don't show cents here
    });
  } catch (e) {
    // Final fallback in case toLocaleString still throws for some reason
    return amount?.toLocaleString("en-US", {
      style: "currency",
      currency: "AED",
    });
  }
};

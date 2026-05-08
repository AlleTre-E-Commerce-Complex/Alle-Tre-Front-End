import { loadStripe } from "@stripe/stripe-js";

// Clean the key: remove any accidental quotes or whitespace
const rawKey = process.env.REACT_APP_STRIPE_API_KEY || "";
const cleanKey = rawKey.replace(/['"]+/g, '').trim();

if (!cleanKey) {
  console.error("STRIPE CONFIG ERROR: REACT_APP_STRIPE_API_KEY is missing or empty!");
}

// Single shared instance
export const stripePromise = loadStripe(cleanKey);

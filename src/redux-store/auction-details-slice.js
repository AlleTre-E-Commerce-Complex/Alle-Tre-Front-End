import { createSlice } from "@reduxjs/toolkit";

export const auctionDetailsSlice = createSlice({
  name: "auctionDetails",
  initialState: {
    auctionDetails: {},
    type: {},
    duration: {},
    isBuyNow: {},
    auctionsId: {},
    deliveryPolicy:{},
    returnPolicy:{},
    warrantyPolicy:{},
    offerPrice:{},
  },
  reducers: {
    auctionDetails: (state, action) => {
      state.auctionDetails = action.payload;
    },
    type: (state, action) => {
      state.type = action.payload;
    },
    duration: (state, action) => {
      state.duration = action.payload;
    },
    isBuyNow: (state, action) => {
      state.isBuyNow = action.payload;
    },
    auctionsId: (state, action) => {
      state.auctionsId = action.payload;
    },
    deliveryPolicy:(state,action)=>{
      state.deliveryPolicy = action.payload
    },
    returnPolicy:(state,action)=>{
      state.returnPolicy = action.payload
    },
    warrantyPolicy:(state,action)=>{
      state.warrantyPolicy = action.payload
    },
    OfferPrice:(state,action)=>{
      state.offerPrice = action.payload
    }

  },
});

export const { 
  auctionDetails, 
  type, 
  duration, 
  isBuyNow, 
  auctionsId,
  deliveryPolicy,
  returnPolicy,
  warrantyPolicy, 
  OfferPrice,
} = auctionDetailsSlice.actions;
export default auctionDetailsSlice.reducer;

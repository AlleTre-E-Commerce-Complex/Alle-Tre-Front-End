import React from "react";

// DRAFTED - PENDING_OWNER_DEPOIST-PUBLISHED-ARCHIVED-SOLD-EXPIRED
// ON_TIME - SCHEDULED

const AuctionsStatus = ({ status, small, big, absolute }) => {
  return (
    <div>
      {status === "ACTIVE" && (
        <button
          className={`state-button
          ${small && "w-14 h-4 text-[8px]"}
          ${big && "w-24 h-7"}
          ${absolute && "absolute"}
          font-normal text-green bg-green-light top-0`}
        >
          Active Now
        </button>
      )}
      {status === "IN_SCHEDULED" && (
        <button
          className={`state-button
          ${small && "w-14 h-4 text-[8px]"}
          ${big && "w-24 h-7"}
          ${absolute && "absolute"}
          font-normal text-yellow bg-yellow-light top-0`}
        >
          Scheduled
        </button>
      )}
      {status === "SOLD" && (
        <button
          className={`state-button  
          ${small && "w-14 h-4 text-[8px]"}
          ${big && "w-24 h-7"}
          ${absolute && "absolute"}
          font-normal text-primary-dark bg-primary-veryLight top-0`}
        >
          Sold
        </button>
      )}
      {status === "PENDING_OWNER_DEPOIST" && (
        <button
          className={`state-button 
          ${small && "w-14 h-4 text-[8px]"}
          ${big && "w-24 h-7"}
          ${absolute && "absolute"}
            font-normal text-secondary bg-secondary-light top-0`}
        >
          Pending
        </button>
      )}
      {status === "EXPIRED" && (
        <button
          className={`state-button 
          ${small && "w-14 h-4 text-[8px]"}
          ${big && "w-24 h-7"}
          ${absolute && "absolute"}
          font-normal text-gray-dark bg-gray-veryLight top-0`}
        >
          Expired
        </button>
      )}
    </div>
  );
};

export default AuctionsStatus;

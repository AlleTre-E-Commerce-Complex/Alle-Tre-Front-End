import React from "react";
import { useChat } from "../../context/chat-context";
import { formatCurrency } from "../../utils/format-currency";

const ProductBar = ({ isWidget = false }) => {
  const { activeConversation } = useChat();

  if (!activeConversation || !activeConversation.product) return null;

  const product = activeConversation.product;

  return (
    <div className={`flex items-center gap-3 p-3 bg-gray-50/80 dark:bg-[#0b1120]/90 border-b border-gray-100 dark:border-blue-900/30 backdrop-blur-sm sticky top-[73px] z-10 transition-all duration-300 ${isWidget ? "px-4" : "px-6"}`}>
      <div className="shrink-0">
        <img
          src={product.images?.[0]?.imageLink || "/logo512.png"}
          alt={product.title}
          className={`${isWidget ? "w-10 h-10" : "w-12 h-12"} rounded-lg object-cover shadow-sm ring-2 ring-white`}
          onError={(e) => { e.target.src = "/logo512.png" }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className={`font-bold text-gray-800 truncate mb-0.5 ${isWidget ? "text-xs" : "text-sm"}`}>
          {product.title}
        </h4>
        <div className="flex items-center justify-between">
          <p className={`font-bold text-primary ${isWidget ? "text-xs" : "text-sm"}`}>
            {formatCurrency(product.ProductListingPrice || 0)}
          </p>
          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
            {product.usageStatus || "Used"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductBar;

import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";

const useFilter = (name, value = "") => {
  const [filter, setFilter] = React.useState(value);
  const history = useHistory();
  const { search } = useLocation();

  const onFilterChange = (newVal, shouldResetPagination = true) => {
    const parsed = queryString.parse(search, { arrayFormat: "bracket" });
    
    // List of pagination parameters that should reset when other filters change
    const PAGINATION_PARAMS = ["page", "productPage", "auctionPage", "UpcomingauctionPage"];
    
    // If we are changing a filter that is NOT a pagination parameter, reset pointers to 1
    // But ONLY if shouldResetPagination is true (not an initial sync)
    if (shouldResetPagination && !PAGINATION_PARAMS.includes(name)) {
      PAGINATION_PARAMS.forEach(param => {
        if (parsed[param]) {
          parsed[param] = "1"; // Set to 1 explicitly instead of delete
        }
      });
    }

    if(name === 'categories'){
      delete parsed.subCategory
    }

    // Handle arrays properly
    if (Array.isArray(newVal)) {
      parsed[name] = newVal.filter(v => v != null && v !== '');
    } else {
      parsed[name] = newVal;
    }

    // Remove empty arrays or empty strings
    if (Array.isArray(parsed[name]) && parsed[name].length === 0) {
      delete parsed[name];
    } else if (parsed[name] === '') {
      delete parsed[name];
    }

    const newSearch = `?${queryString.stringify(parsed, { arrayFormat: "bracket" })}`;
    
    // Only update if something actually changed to avoid re-render loops
    if (newSearch !== search) {
      history.replace(newSearch);
    }
  };

  React.useEffect(() => {
    const parsed = queryString.parse(search, { arrayFormat: "bracket" });
    // Handle initial value
    if (!parsed[name] && (value || (Array.isArray(value) && value.length))) {
      onFilterChange(value, false); // Don't reset pagination on initial sync
      setFilter(value);
    } else {
      // Convert string arrays back to actual arrays
      let parsedValue = parsed[name];
      if (Array.isArray(value) && typeof parsedValue === 'string') {
        parsedValue = [parsedValue];
      }
      setFilter(parsedValue || value);
    }
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  return [filter, onFilterChange];
};

export default useFilter;

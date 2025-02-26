import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";

const useFilter = (name, value = "") => {
  const [filter, setFilter] = React.useState(value);
  const history = useHistory();
  const { search } = useLocation();

  const onFilterChange = (newVal) => {
    const parsed = queryString.parse(search, { arrayFormat: "bracket" });
    
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

    history.replace(
      `?${queryString.stringify(parsed, { arrayFormat: "bracket" })}`
    );
  };

  React.useEffect(() => {
    const parsed = queryString.parse(search, { arrayFormat: "bracket" });

    // Handle initial value
    if (!parsed[name] && (value || (Array.isArray(value) && value.length))) {
      onFilterChange(value);
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

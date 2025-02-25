// Default page number
export const DEFAULT_PAGE = "1";

// Items per page for different screen sizes
export const MOBILE_PER_PAGE = "12";
export const TABLET_PER_PAGE = "18";
export const DESKTOP_PER_PAGE = "24";

// Get default per page based on screen width
export const getDefaultPerPage = () => {
  const width = window.innerWidth;
  if (width < 768) { // Mobile
    return MOBILE_PER_PAGE;
  } else if (width < 1024) { // Tablet
    return TABLET_PER_PAGE;
  } else { // Desktop
    return DESKTOP_PER_PAGE;
  }
};

// Get default pagination string
export const getDefaultPaginationString = () => {
  return `page=${DEFAULT_PAGE}&perPage=${getDefaultPerPage()}`;
};

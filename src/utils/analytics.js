import ReactGA from 'react-ga4';

// Initialize Google Analytics
export const initGA = () => {
  ReactGA.initialize('G-JP9K1Z75DN');
};

// Track page views
export const logPageView = () => {
  ReactGA.send({ 
    hitType: "pageview", 
    page: window.location.pathname + window.location.search 
  });
};

// Track events
export const logEvent = (category = '', action = '') => {
  if (category && action) {
    ReactGA.event({
      category,
      action
    });
  }
};

// Track user interactions
export const logUserInteraction = (action, label = '') => {
  ReactGA.event({
    category: 'User Interaction',
    action,
    label
  });
};

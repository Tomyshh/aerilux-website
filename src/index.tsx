import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';

// Désactiver l'overlay d'erreur de React en développement
if (process.env.NODE_ENV === 'development') {
  // Gestionnaire pour les promesses rejetées (AbortError)
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    const errorMessage = error?.message || String(error) || '';
    const errorName = error?.name || '';
    
    if (errorName === 'AbortError' || 
        errorMessage.includes('aborted') ||
        errorMessage.includes('The user aborted a request')) {
      // Ignorer les erreurs AbortError - elles sont normales lors du rechargement
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      return false;
    }
  }, true);

  // Gestionnaire pour les erreurs synchrones
  window.addEventListener('error', (event) => {
    const message = event.message || '';
    if (message.includes('aborted') || 
        message.includes('AbortError') ||
        message.includes('The user aborted a request')) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      return false;
    }
  }, true);

  // Fonction pour supprimer l'overlay d'erreur de React
  const removeErrorOverlay = () => {
    // Supprimer l'overlay principal
    const errorOverlay = document.getElementById('react-error-overlay');
    if (errorOverlay) {
      errorOverlay.remove();
    }
    
    // Supprimer tous les divs d'erreur
    const errorDivs = document.querySelectorAll('div[data-react-error-overlay], div[style*="position: fixed"][style*="z-index: 9999"]');
    errorDivs.forEach((div: Element) => {
      const html = div.innerHTML || '';
      if (html.includes('Uncaught runtime errors') || 
          html.includes('aborted') || 
          html.includes('AbortError')) {
        div.remove();
      }
    });

    // Supprimer les iframes d'erreur
    const errorIframes = document.querySelectorAll('iframe[src*="react-error-overlay"]');
    errorIframes.forEach(iframe => iframe.remove());
  };

  // Observer pour supprimer l'overlay quand il apparaît
  const observer = new MutationObserver(() => {
    removeErrorOverlay();
  });

  // Observer les changements dans le body
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false
  });

  // Supprimer immédiatement et périodiquement
  removeErrorOverlay();
  setInterval(removeErrorOverlay, 100);
  
  // Supprimer au chargement
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeErrorOverlay);
  } else {
    removeErrorOverlay();
  }
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 
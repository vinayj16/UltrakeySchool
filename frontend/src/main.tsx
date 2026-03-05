import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/global.css';
import './index.css';
import { shouldBypassAuth, ensureBypassSession } from './utils/bypassAuth';
import { isDemoMode, setDemoUser } from './utils/demoMode';
import { useAuthStore } from './store/authStore';

/**
 * Main Application Entry Point
 * 
 * Initializes the React application with global error handling
 * and service worker registration.
 */

// Suppress console errors in demo mode BEFORE anything else loads
if (isDemoMode()) {
  const originalError = console.error;
  const originalWarn = console.warn;
  const originalLog = console.log;
  
  console.error = (...args: any[]) => {
    const message = args[0]?.toString() || '';
    // Suppress ALL network/API errors in demo mode
    if (
      message.includes('GET http://localhost:5000') ||
      message.includes('POST http://localhost:5000') ||
      message.includes('PUT http://localhost:5000') ||
      message.includes('DELETE http://localhost:5000') ||
      message.includes('PATCH http://localhost:5000') ||
      message.includes('net::ERR_CONNECTION_REFUSED') ||
      message.includes('ERR_CONNECTION_REFUSED') ||
      message.includes('Failed to load resource: net::ERR_CONNECTION_REFUSED') ||
      message.includes('401') ||
      message.includes('404') ||
      message.includes('500') ||
      message.includes('Unauthorized') ||
      message.includes('Not Found') ||
      message.includes('apiService.get is not a function') ||
      message.includes('Error fetching') ||
      message.includes('Failed to load resource') ||
      message.includes('Network Error') ||
      message.includes('AxiosError') ||
      message.includes('Request failed') ||
      message.includes('jQuery') ||
      message.includes('slimScroll') ||
      message.includes('Deferred exception') ||
      message.includes('schools/dashboard/stats') ||
      message.includes('schools/analytics/subscriptions') ||
      message.includes('transactions/stats') ||
      message.includes('transactions/analytics/revenue')
    ) {
      return; // Suppress
    }
    originalError.apply(console, args);
  };
  
  console.warn = (...args: any[]) => {
    const message = args[0]?.toString() || '';
    // Suppress network warnings
    if (
      message.includes('401') || 
      message.includes('404') ||
      message.includes('Failed to load resource') ||
      message.includes('net::ERR_CONNECTION_REFUSED') ||
      message.includes('ERR_CONNECTION_REFUSED') ||
      message.includes('schools/dashboard/stats') ||
      message.includes('schools/analytics/subscriptions') ||
      message.includes('transactions/stats') ||
      message.includes('transactions/analytics/revenue')
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };
  
  // Also suppress network logs
  console.log = (...args: any[]) => {
    const message = args[0]?.toString() || '';
    // Don't suppress our own debug logs, only network logs
    if (
      !message.includes('[') && // Keep our tagged logs like [MockAPI], [DemoMode], etc.
      (message.includes('GET http://localhost:5000') ||
       message.includes('POST http://localhost:5000') ||
       message.includes('Failed to load resource') ||
       message.includes('net::ERR_CONNECTION_REFUSED') ||
       message.includes('schools/dashboard/stats') ||
       message.includes('schools/analytics/subscriptions') ||
       message.includes('transactions/stats') ||
       message.includes('transactions/analytics/revenue'))
    ) {
      return; // Suppress
    }
    originalLog.apply(console, args);
  };
}

/**
 * Handle unauthorized access
 * Clears tokens and redirects to login page
 */
function handleUnauthorized() {
  console.warn('[Auth] Unauthorized access detected. Redirecting to login...');
  
  // Clear authentication tokens
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  
  // Redirect to login page
  window.location.href = '/login';
}

/**
 * Handle service unavailable
 * Shows user-friendly message
 */
function handleServiceUnavailable() {
  console.error('[Service] Service temporarily unavailable');
  // You can show a toast notification here
}

// Global error handler for uncaught promise rejections
window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason;
  const message = reason?.message || reason?.toString() || '';
  
  // Suppress jQuery errors
  if (message.includes('slimScroll') || message.includes('jQuery') || message.includes('Deferred')) {
    event.preventDefault();
    return;
  }
  
  // Suppress network errors in demo mode
  if (isDemoMode()) {
    // Suppress ALL API/network errors in demo mode
    if (
      message.includes('401') ||
      message.includes('404') ||
      message.includes('500') ||
      message.includes('Unauthorized') ||
      message.includes('Not Found') ||
      message.includes('Network Error') ||
      message.includes('AxiosError') ||
      message.includes('Request failed') ||
      message.includes('apiService') ||
      message.includes('Error fetching') ||
      reason?.response?.status === 401 ||
      reason?.response?.status === 404 ||
      reason?.response?.status === 500 ||
      reason?.code === 'ERR_NETWORK' ||
      reason?.code === 'ECONNREFUSED'
    ) {
      event.preventDefault();
      return;
    }
    
    // Suppress any other errors in demo mode
    console.log('[Demo Mode] Suppressed unhandled rejection:', message);
    event.preventDefault();
    return;
  }
  
  console.error('[Unhandled Rejection]', event.reason);
  
  // Check if it's an API error
  if (event.reason?.response) {
    const status = event.reason.response.status;
    const errorMessage = event.reason.response.data?.error?.message || 'An error occurred';
    
    // Handle specific status codes
    if (status === 401) {
      handleUnauthorized();
    } else if (status === 503) {
      handleServiceUnavailable();
    } else if (status >= 500) {
      console.error('[Server Error]', errorMessage);
    }
  }
});

// Global error handler for uncaught errors
window.addEventListener('error', (event) => {
  const message = event.error?.message || event.message || '';
  
  // Suppress React's javascript: URL security warning - these are from legacy HTML templates
  if (message.includes('React has blocked a javascript: URL')) {
    event.preventDefault();
    return;
  }
  
  // Suppress jQuery slimScroll errors - non-critical UI enhancement
  if (message.includes('slimScroll') || message.includes('jQuery') || message.includes('Deferred')) {
    event.preventDefault();
    return;
  }
  
  // Suppress network/CORS errors in demo mode
  if (isDemoMode()) {
    if (
      message.includes('401') ||
      message.includes('404') ||
      message.includes('500') ||
      message.includes('Unauthorized') ||
      message.includes('Not Found') ||
      message.includes('Network Error') ||
      message.includes('Failed to fetch') ||
      message.includes('CORS') ||
      message.includes('AxiosError') ||
      message.includes('Request failed') ||
      message.includes('apiService') ||
      message.includes('Error fetching') ||
      event.filename?.includes('localhost:5000') // Suppress errors from failed API calls
    ) {
      event.preventDefault();
      return;
    }
    
    console.log('[Demo Mode] Suppressed error:', message);
    event.preventDefault();
    return;
  }
  
  console.error('[Uncaught Error]', event.error);
});

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found. Make sure there is a <div id="root"></div> in your HTML.');
}

const renderApp = () => {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

const bootstrap = async () => {
  console.log('[Bootstrap] AUTH_BYPASS_MODE:', shouldBypassAuth());
  
  if (shouldBypassAuth()) {
    console.log('[Bootstrap] Bypass auth is enabled, loading demo session');
    await ensureBypassSession();
  } else {
    console.log('[Bootstrap] Bypass auth is disabled, using real authentication');
    const token = localStorage.getItem('accessToken');
    if (token && !isDemoMode()) {
      try {
        const authService = (await import('./api/authService')).default;
        const user = await authService.getProfile();
        if (user) {
          useAuthStore.setState({
            user: user as any,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        }
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
  }

  renderApp();
};

bootstrap().catch((error) => {
  console.error('[App Bootstrap] Failed', error);
});

// Log environment info in development
if (import.meta.env.DEV) {
  console.log('[APP] Started in development mode');
  console.log('Auth store state:', useAuthStore.getState());
  console.log('[API] URL:', import.meta.env.VITE_API_URL || 'http://localhost:5000');
  console.log('[ENV] Environment:', import.meta.env.MODE);
  console.log('[ENV] Node Version:', import.meta.env.VITE_NODE_VERSION || 'unknown');
}

// Service Worker registration for PWA (optional)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('[SW] Service Worker registered:', registration.scope);
        
        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 1000 * 60 * 60); // Check every hour
      })
      .catch((error) => {
        console.error('[SW] Service Worker registration failed:', error);
      });
  });
}

// Performance monitoring in development
if (import.meta.env.DEV && 'performance' in window) {
  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (perfData) {
      console.log('[Performance] Page Load Time:', Math.round(perfData.loadEventEnd - perfData.fetchStart), 'ms');
      console.log('[Performance] DOM Content Loaded:', Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart), 'ms');
    }
  });
}

// Detect online/offline status
window.addEventListener('online', () => {
  console.log('[Network] Connection restored');
});

window.addEventListener('offline', () => {
  console.warn('[Network] Connection lost. Working in offline mode.');
});

// Log initial network status
if (import.meta.env.DEV) {
  console.log('[Network] Status:', navigator.onLine ? 'Online' : 'Offline');
}

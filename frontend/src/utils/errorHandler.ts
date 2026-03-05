/**
 * Global Error Handler Utility
 * Suppresses non-critical errors in demo mode
 */

import { toast } from 'react-toastify';
import { isDemoMode } from './demoMode';

/**
 * Show error toast only if not in demo mode or if it's a critical error
 */
export function showError(message: string, isCritical: boolean = false) {
  // In demo mode, only show critical errors
  if (isDemoMode() && !isCritical) {
    // Silently suppress in demo mode
    return;
  }
  
  toast.error(message);
}

/**
 * Show success toast
 */
export function showSuccess(message: string) {
  toast.success(message);
}

/**
 * Show info toast
 */
export function showInfo(message: string) {
  toast.info(message);
}

/**
 * Show warning toast
 */
export function showWarning(message: string) {
  toast.warning(message);
}

/**
 * Handle API errors gracefully
 * Returns a user-friendly error message
 */
export function handleApiError(error: any, defaultMessage: string = 'An error occurred'): string {
  const message = error?.response?.data?.message || error?.message || defaultMessage;
  
  // Only log in non-demo mode
  if (!isDemoMode()) {
    console.error('[API Error]', message, error);
  }
  
  return message;
}

/**
 * Safe async wrapper that catches errors and shows appropriate messages
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  errorMessage: string = 'Operation failed',
  showToast: boolean = true
): Promise<T | null> {
  try {
    return await fn();
  } catch (error: any) {
    const message = handleApiError(error, errorMessage);
    
    if (showToast && !isDemoMode()) {
      showError(message);
    }
    
    return null;
  }
}

/**
 * Suppress console errors in demo mode
 * Wraps a function and catches any errors, suppressing them in demo mode
 */
export function suppressErrorsInDemo<T extends (...args: any[]) => any>(fn: T): T {
  return ((...args: any[]) => {
    try {
      const result = fn(...args);
      
      // If it's a promise, catch errors
      if (result instanceof Promise) {
        return result.catch((error) => {
          if (isDemoMode()) {
            // Silently suppress in demo mode
            return null;
          }
          throw error;
        });
      }
      
      return result;
    } catch (error) {
      if (isDemoMode()) {
        // Silently suppress in demo mode
        return null;
      }
      throw error;
    }
  }) as T;
}

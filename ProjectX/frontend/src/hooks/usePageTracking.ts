import { useEffect, useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Get or create visitor ID (synchronous, fast)
function getVisitorId(): string {
  try {
    let visitorId = localStorage.getItem('visitor_id');
    if (!visitorId) {
      visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('visitor_id', visitorId);
    }
    return visitorId;
  } catch (error) {
    // If localStorage fails, create temporary ID
    return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Track page view (fire and forget - completely non-blocking)
function trackPageView(pageType: string, pageId?: string) {
  // Use setTimeout to ensure this runs after page render
  setTimeout(() => {
    try {
      const visitorId = getVisitorId();
      
      // Use fetch with keepalive to ensure request completes even if page unloads
      fetch(`${API_URL}/api/analytics/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageType,
          pageId,
          visitorId,
          userAgent: navigator.userAgent,
          referrer: document.referrer || null,
        }),
        keepalive: true, // Ensures request completes even if page closes
      }).catch(() => {
        // Silently fail - don't disrupt user experience
        // No console.error to avoid noise
      });
    } catch (error) {
      // Silently fail
    }
  }, 0);
}

/**
 * Hook to track page views (non-blocking, runs in background)
 * @param pageType - Type of page: 'home', 'article', 'daily-tech', 'article-detail'
 * @param pageId - Optional page/article ID
 */
export function usePageTracking(pageType: string, pageId?: string) {
  const tracked = useRef(false);

  useEffect(() => {
    // Only track once per mount to avoid duplicates
    if (!tracked.current) {
      tracked.current = true;
      trackPageView(pageType, pageId);
    }
  }, [pageType, pageId]);
}

export default usePageTracking;

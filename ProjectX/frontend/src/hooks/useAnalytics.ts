import { useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Get or create visitor ID
const getVisitorId = (): string => {
  let visitorId = localStorage.getItem('visitor_id');
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('visitor_id', visitorId);
  }
  return visitorId;
};

interface TrackPageViewParams {
  pageType: 'home' | 'article' | 'daily-tech' | 'article-detail';
  pageId?: string;
}

export const trackPageView = async ({ pageType, pageId }: TrackPageViewParams) => {
  try {
    const visitorId = getVisitorId();
    
    await fetch(`${API_URL}/api/analytics/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pageType,
        pageId,
        visitorId,
        userAgent: navigator.userAgent,
        referrer: document.referrer || null
      })
    });
  } catch (error) {
    // Silently fail - don't disrupt user experience
    console.error('Analytics tracking error:', error);
  }
};

export const usePageView = (pageType: TrackPageViewParams['pageType'], pageId?: string) => {
  useEffect(() => {
    trackPageView({ pageType, pageId });
  }, [pageType, pageId]);
};

export default usePageView;

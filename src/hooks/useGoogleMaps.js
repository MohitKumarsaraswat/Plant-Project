import { useState, useEffect } from 'react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

export function useGoogleMaps() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      console.warn('VITE_GOOGLE_MAPS_API_KEY is not set. Google Maps features will be limited.');
      return;
    }

    if (window.google?.maps) {
      setLoaded(true);
      return;
    }

    const existing = document.querySelector('script[data-google-maps]');
    if (existing) {
      existing.addEventListener('load', () => setLoaded(true));
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.setAttribute('data-google-maps', 'true');
    script.onload = () => setLoaded(true);
    script.onerror = () => console.error('Google Maps API failed to load');
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return loaded;
}


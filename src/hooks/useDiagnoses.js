import { useState, useEffect } from 'react';
import { fetchDiagnoses } from '../services/api';

export function useDiagnoses(fallback = []) {
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    function load() {
      try {
        const data = fetchDiagnoses();
        if (!cancelled) setDiagnoses(data);
      } catch (err) {
        console.error('Error fetching diagnoses:', err);
        if (!cancelled) setDiagnoses(fallback);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [fallback]);

  return { diagnoses, loading };
}


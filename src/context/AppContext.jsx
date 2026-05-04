import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { fetchDiagnoses, saveDiagnosis } from '../services/api';

const AppContext = createContext(undefined);

export function AppProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const [diagnosis, setDiagnosis] = useState(null);
  const [history, setHistory] = useState([]);

  // Load history from localStorage on init
  useEffect(() => {
    const loadedHistory = fetchDiagnoses();
    setHistory(loadedHistory);
  }, []);

  const addToHistory = useCallback((d) => {
    setDiagnosis(d);
    const newHistory = [d, ...history];
    setHistory(newHistory);
    saveDiagnosis(d);  // Persist to localStorage
  }, [history]);

  return (
    <AppContext.Provider value={{ language, setLanguage, diagnosis, setDiagnosis, history, addToHistory }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}


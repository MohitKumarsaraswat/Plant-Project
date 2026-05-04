import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import App from './App';

const AppProviders = () => {
  return (
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  );
};

export default AppProviders;


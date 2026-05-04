import ReactDOM from 'react-dom/client';
import AppProviders from './AppProviders';
import '../index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

rootElement.style.minHeight = '100vh';
rootElement.style.width = '100%';

ReactDOM.createRoot(rootElement).render(
  <AppProviders />
);


import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import ResultPage from './pages/ResultPage';
import ShopsPage from './pages/ShopsPage';
import HistoryPage from './pages/HistoryPage';

const App = () => {
  return (
    <div className="min-h-screen" style={{ minHeight: '100vh', width: '100%' }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/shops" element={<ShopsPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </div>
  );
};

export default App;


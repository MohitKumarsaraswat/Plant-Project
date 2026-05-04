import { useState, useEffect } from 'react';
import { Sprout, Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { translations } from '../../constants/translations';
import LanguageSelector from './LanguageSelector';
import MobileMenu from './MobileMenu';

const navItems = [
  { id: 'home', labelKey: 'home', path: '/' },
  { id: 'upload', labelKey: 'upload', path: '/upload' },
  { id: 'result', labelKey: 'result', path: '/result' },
  { id: 'shops', labelKey: 'shops', path: '/shops' },
  { id: 'history', labelKey: 'history', path: '/history' }
];

const Navbar = () => {
  const { language, setLanguage } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const t = translations[language];
  const currentPath = location.pathname;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const currentPageId = navItems.find(item => item.path === currentPath)?.id || 'home';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <button
            onClick={() => handleNavigate('/')}
            className="flex items-center gap-2 group"
            data-testid="link-logo"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-md leaf-shadow animate-sway">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl hidden sm:block font-display">
              <span className="text-nature-gradient">CropCare</span>
            </span>
          </button>

          <div className="hidden md:flex items-center gap-1 bg-white/70 backdrop-blur-sm rounded-full p-1.5 shadow-sm">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.path)}
                className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-all ${
                  currentPath === item.path
                    ? 'bg-green-600 text-white shadow-md'
                    : 'text-green-800 hover:bg-green-100'
                }`}
                data-testid={`nav-${item.id}`}
              >
                {item.labelKey}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <LanguageSelector language={language} setLanguage={setLanguage} />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-white/50"
              data-testid="menu-toggle"
            >
              {menuOpen ? (
                <X className="w-5 h-5 text-green-800" />
              ) : (
                <Menu className="w-5 h-5 text-green-800" />
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <MobileMenu
            t={t}
            currentPage={currentPageId}
            onNavigate={(page) => {
              const item = navItems.find(i => i.id === page);
              if (item) handleNavigate(item.path);
            }}
            onClose={() => setMenuOpen(false)}
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;


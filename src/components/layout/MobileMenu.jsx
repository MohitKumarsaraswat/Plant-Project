import { Home, Camera, Leaf, Store, History } from 'lucide-react';

const navItems = [
  { id: 'home', icon: Home, labelKey: 'home' },
  { id: 'upload', icon: Camera, labelKey: 'upload' },
  { id: 'result', icon: Leaf, labelKey: 'result' },
  { id: 'shops', icon: Store, labelKey: 'shops' },
  { id: 'history', icon: History, labelKey: 'history' }
];

const MobileMenu = ({ t, currentPage, onNavigate, onClose }) => {
  return (
    <div className="md:hidden py-4 animate-fade-up">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-lg space-y-1">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => { onNavigate(item.id); onClose(); }}
            className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 text-left transition-all ${
              currentPage === item.id ? 'bg-green-100 text-green-700' : 'text-green-800 hover:bg-green-50'
            }`}
            data-testid={`mobile-${item.id}`}
          >
            <item.icon className="w-5 h-5" />
            {t[item.labelKey]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileMenu;


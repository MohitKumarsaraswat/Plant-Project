import { useNavigate } from 'react-router-dom';
import { Sun, Camera, ChevronRight, Flower2, TreeDeciduous, Leaf, Sprout } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations } from '../constants/translations';
import PageWrapper from '../components/layout/PageWrapper';
import FeatureCard from '../components/ui/FeatureCard';
import StatCard from '../components/ui/StatCard';

const HomePage = () => {
  const { language } = useApp();
  const navigate = useNavigate();
  const t = translations[language];

  return (
    <PageWrapper className="pt-20">
      <div className="text-center pt-8 sm:pt-16 mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-6 animate-fade-up shadow-sm">
          <Sun className="w-4 h-4 text-amber-500" />
          AI-Powered Plant Care
        </div>

        <div className="mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="w-28 h-28 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-300 to-green-500 rounded-full animate-pulse-soft" />
            <div className="absolute inset-2 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <Flower2 className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 animate-fade-up text-green-900 font-display leading-tight" style={{ animationDelay: '0.15s' }}>
          {t.welcome}
        </h1>

        <p className="text-lg sm:text-xl text-green-700/80 max-w-xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          {t.welcomeMsg}
        </p>

        <button
          onClick={() => navigate('/upload')}
          className="btn-warm px-8 py-4 rounded-full text-lg font-semibold inline-flex items-center gap-3 animate-fade-up"
          style={{ animationDelay: '0.25s' }}
          data-testid="btn-start"
        >
          <Camera className="w-5 h-5" />
          {t.getStarted}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mb-12">
        <FeatureCard
          icon={Camera}
          title="Snap"
          description="Take a photo of your crop"
          color="from-amber-400 to-orange-500"
          index={0}
        />
        <FeatureCard
          icon={Leaf}
          title="Analyze"
          description="AI identifies the problem"
          color="from-green-400 to-emerald-500"
          index={1}
        />
        <FeatureCard
          icon={Sprout}
          title="Heal"
          description="Get natural remedies"
          color="from-teal-400 to-green-500"
          index={2}
        />
      </div>

      <div className="leaf-card rounded-3xl p-6 sm:p-8 animate-fade-up" style={{ animationDelay: '0.6s' }}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
            <TreeDeciduous className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-green-900 font-display text-lg">Trusted by Farmers</h3>
            <p className="text-green-700/70 text-sm">Over 50,000 crops diagnosed</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <StatCard value="98%" label="Accuracy" />
          <StatCard value="150+" label="Diseases" />
          <StatCard value="4" label="Languages" />
        </div>
      </div>
    </PageWrapper>
  );
};

export default HomePage;


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, Sprout } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations } from '../constants/translations';
import { useDiagnoses } from '../hooks/useDiagnoses';
import PageWrapper from '../components/layout/PageWrapper';
import HistoryCard from '../components/ui/HistoryCard';

const HistoryPage = () => {
  const { language, history } = useApp();
  const navigate = useNavigate();
  const t = translations[language];

  const { diagnoses, loading } = useDiagnoses(history);
  const [query, setQuery] = useState('');

  const filtered = diagnoses.filter(h => h.disease.toLowerCase().includes(query.toLowerCase()));

  if (loading) {
    return (
      <PageWrapper className="flex items-center justify-center pt-0">
        <div className="text-center animate-fade-up">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center animate-sway">
            <Clock className="w-10 h-10 text-green-600" />
          </div>
          <p className="text-green-700/80">Loading your diagnosis history...</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8 animate-fade-up">
          <h1 className="text-3xl sm:text-4xl font-bold text-green-900 mb-2 font-display">{t.historyTitle}</h1>
          <p className="text-green-700/70">Your previous diagnoses</p>
        </div>

        {diagnoses.length > 0 && (
          <div className="leaf-card rounded-2xl p-2 mb-6 animate-fade-up">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
              <input
                type="text"
                placeholder={t.search}
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full input-nature pl-11 pr-4 py-3 rounded-xl text-sm"
                data-testid="input-search"
              />
            </div>
          </div>
        )}

        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((item, i) => <HistoryCard key={i} item={item} index={i} />)}
          </div>
        ) : (
          <div className="leaf-card rounded-3xl p-10 text-center animate-fade-up">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <Sprout className="w-10 h-10 text-green-400" />
            </div>
            <p className="text-lg text-green-800 mb-2">{t.noHistory}</p>
            <p className="text-sm text-green-600/70 mb-6">{t.uploadFirst}</p>
            <button onClick={() => navigate('/upload')} className="btn-nature px-6 py-3 rounded-xl font-semibold" data-testid="btn-start-scan">
              Upload First Photo
            </button>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default HistoryPage;


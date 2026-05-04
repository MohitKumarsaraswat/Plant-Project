import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, Beaker, ListChecks, Store, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations } from '../constants/translations';
import { formatDate } from '../lib/utils';
import PageWrapper from '../components/layout/PageWrapper';
import SeverityBadge from '../components/ui/SeverityBadge';
import StepCard from '../components/ui/StepCard';

const ResultPage = () => {
  const { language, diagnosis } = useApp();
  const navigate = useNavigate();
  const t = translations[language];

  if (!diagnosis) {
    return (
      <PageWrapper className="flex items-center justify-center pt-0">
        <div className="text-center animate-fade-up">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <Clock className="w-10 h-10 text-green-400" />
          </div>
          <p className="text-xl text-green-800 mb-6">No diagnosis yet</p>
          <button
            onClick={() => navigate('/upload')}
            className="btn-nature px-6 py-3 rounded-xl font-semibold"
            data-testid="btn-upload-first"
          >
            Upload a Photo
          </button>
        </div>
      </PageWrapper>
    );
  }

  const severityLabels = {
    mild: t.mild,
    moderate: t.moderate,
    severe: t.severe
  };

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium shadow-sm">
            <CheckCircle2 className="w-4 h-4" />
            {t.diagnosisTitle}
          </div>
        </div>

        <div className="space-y-4">
          <div className="leaf-card rounded-3xl p-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex flex-col sm:flex-row gap-5">
              {diagnosis.image && (
                <img src={diagnosis.image} alt="Crop" className="w-full sm:w-28 h-28 object-cover rounded-2xl shadow-md" />
              )}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-green-900 font-display">{diagnosis.disease}</h2>
                  <SeverityBadge severity={diagnosis.severity} label={severityLabels[diagnosis.severity]} />
                </div>
                <p className="text-sm text-green-700/70 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {formatDate(diagnosis.date)}
                </p>
              </div>
            </div>
          </div>

          <div className="leaf-card rounded-3xl p-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <Beaker className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-green-900 font-display">{t.scientific}</h3>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { label: 'Treatment', value: diagnosis.scientific.medicine },
                { label: 'Amount', value: diagnosis.scientific.dosage },
                { label: 'Schedule', value: diagnosis.scientific.frequency }
              ].map((item, i) => (
                <div key={i} className="bg-green-50 rounded-xl p-4">
                  <p className="text-xs text-green-600 uppercase tracking-wide mb-1">{item.label}</p>
                  <p className="font-semibold text-green-900 text-sm">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="leaf-card rounded-3xl p-6 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <ListChecks className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-green-900 font-display">{t.farmerFriendly}</h3>
            </div>
            <div className="space-y-3">
              {diagnosis.farmerSteps.map((step, i) => (
                <StepCard key={i} step={step} index={i} />
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/shops')}
            className="w-full leaf-card rounded-2xl p-5 flex items-center justify-between hover:shadow-lg transition-all animate-fade-up"
            style={{ animationDelay: '0.4s' }}
            data-testid="btn-shops"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-green-900">Find treatment nearby</span>
            </div>
            <ChevronRight className="w-5 h-5 text-green-600" />
          </button>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ResultPage;


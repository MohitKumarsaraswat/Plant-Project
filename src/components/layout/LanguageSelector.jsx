const langs = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'हि' },
  { code: 'mr', label: 'म' },
  { code: 'gu', label: 'ગુ' }
];

const LanguageSelector = ({ language, setLanguage }) => {
  return (
    <div className="flex gap-0.5 p-1 rounded-full bg-white/70 backdrop-blur-sm shadow-sm">
      {langs.map(l => (
        <button
          key={l.code}
          onClick={() => setLanguage(l.code)}
          className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
            language === l.code
              ? 'bg-green-600 text-white shadow'
              : 'text-green-700 hover:bg-green-100'
          }`}
          data-testid={`lang-${l.code}`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;


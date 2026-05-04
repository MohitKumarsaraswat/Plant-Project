const FeatureCard = ({ icon: Icon, title, description, color, index }) => {
  return (
    <div
      className="leaf-card rounded-3xl p-6 text-center animate-fade-up"
      style={{ animationDelay: `${0.3 + index * 0.1}s` }}
    >
      <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="text-xl font-bold text-green-900 mb-2 font-display">{title}</h3>
      <p className="text-green-700/70 text-sm">{description}</p>
    </div>
  );
};

export default FeatureCard;


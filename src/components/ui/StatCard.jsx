const StatCard = ({ value, label }) => {
  return (
    <div className="bg-green-50 rounded-xl p-3 text-center">
      <div className="text-2xl font-bold text-green-700">{value}</div>
      <div className="text-xs text-green-600">{label}</div>
    </div>
  );
};

export default StatCard;


const StepCard = ({ step, index }) => {
  return (
    <div className="flex gap-4 items-start bg-amber-50 rounded-xl p-4">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm shadow">
        {index + 1}
      </div>
      <p className="text-sm text-green-800">{step}</p>
    </div>
  );
};

export default StepCard;


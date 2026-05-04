import { Clock } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import SeverityBadge from './SeverityBadge';

const severityLabels = {
  mild: 'Mild',
  moderate: 'Moderate',
  severe: 'Severe'
};

const HistoryCard = ({ item, index }) => {
  return (
    <div
      className="leaf-card rounded-2xl p-4 animate-fade-up"
      style={{ animationDelay: `${index * 0.05}s` }}
      data-testid={`history-${index}`}
    >
      <div className="flex items-center gap-4">
        {item.image && (
          <img src={item.image} alt="" className="w-14 h-14 rounded-xl object-cover shadow" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-green-900 truncate">{item.disease}</h3>
            <SeverityBadge
              severity={item.severity}
              label={severityLabels[item.severity] || item.severity}
            />
          </div>
          <p className="text-xs text-green-600 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDate(item.date)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;


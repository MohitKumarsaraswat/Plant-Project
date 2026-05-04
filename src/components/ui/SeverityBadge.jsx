import { cn } from '../../lib/utils';

const severityClasses = {
  mild: 'severity-low',
  moderate: 'severity-medium',
  severe: 'severity-high'
};

const SeverityBadge = ({ severity, label, className }) => {
  return (
    <span className={cn('px-3 py-1 rounded-full text-xs font-bold text-white', severityClasses[severity], className)}>
      {label}
    </span>
  );
};

export default SeverityBadge;


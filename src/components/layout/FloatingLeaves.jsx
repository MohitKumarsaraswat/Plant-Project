import { useMemo } from 'react';
import { Leaf } from 'lucide-react';

const FloatingLeaves = () => {
  const leaves = useMemo(() =>
    [...Array(8)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 15 + Math.random() * 10,
      size: 20 + Math.random() * 30
    })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {leaves.map(leaf => (
        <div
          key={leaf.id}
          className="absolute animate-float-leaf text-green-500/20"
          style={{
            left: `${leaf.left}%`,
            top: '-50px',
            animationDelay: `${leaf.delay}s`,
            animationDuration: `${leaf.duration}s`
          }}
        >
          <Leaf style={{ width: leaf.size, height: leaf.size }} />
        </div>
      ))}
    </div>
  );
};

export default FloatingLeaves;


import FloatingLeaves from './FloatingLeaves';

const PageWrapper = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen pt-24 pb-16 px-4 nature-bg relative ${className}`}>
      <FloatingLeaves />
      <div className="max-w-4xl mx-auto relative z-10">
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;


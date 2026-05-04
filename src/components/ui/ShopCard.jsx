import { Navigation } from 'lucide-react';

const ShopCard = ({ shop, t, index }) => {
  return (
    <div
      className="leaf-card rounded-2xl p-5 animate-fade-up"
      style={{ animationDelay: `${index * 0.1}s` }}
      data-testid={`shop-${shop.id}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-green-900">{shop.name}</h3>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
              {shop.rating}
            </span>
          </div>
          <p className="text-sm text-green-700/70 mb-1">{shop.address}</p>
          <div className="flex items-center gap-3 text-xs text-green-600">
            <span className="font-semibold">{shop.distance}</span>
            <span>{shop.phone}</span>
          </div>
        </div>
        <button
          onClick={() => {
            if (shop.location) {
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${shop.location.latitude},${shop.location.longitude}`,
                '_blank'
              );
            }
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-100 hover:bg-green-200 text-green-700 text-sm font-medium transition-colors"
          data-testid={`nav-${shop.id}`}
        >
          <Navigation className="w-4 h-4" />
          {t.directions}
        </button>
      </div>
    </div>
  );
};

export default ShopCard;


import { useState, useEffect } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations } from '../constants/translations';
import { fetchShops } from '../services/api';
import { useGeolocation } from '../hooks/useGeolocation';
import PageWrapper from '../components/layout/PageWrapper';
import ShopCard from '../components/ui/ShopCard';

const ShopsPage = () => {
  const { language } = useApp();
  const t = translations[language];
  const { location, loading: locLoading, startWatching, stopWatching } = useGeolocation();

  const [shops, setShops] = useState([]);
  const [located, setLocated] = useState(false);

  const amityCenter = { latitude: 28.6139, longitude: 77.2090 };
  const [maxDistanceKm, setMaxDistanceKm] = useState(10);

  const toRad = (deg) => (deg * Math.PI) / 180;
  const haversineKm = (a, b) => {
    if (!a || !b) return Infinity;
    const R = 6371;
    const dLat = toRad(b.latitude - a.latitude);
    const dLon = toRad(b.longitude - a.longitude);
    const lat1 = toRad(a.latitude);
    const lat2 = toRad(b.latitude);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  };

  const userPoint = location || amityCenter;

  const filteredAndSortedShops = shops
    .map((s) => {
      const km = s?.location ? haversineKm(userPoint, s.location) : Infinity;
      const kmText = km === Infinity ? s.distance : `${km.toFixed(km < 10 ? 1 : 0)} km`;
      return { ...s, _distanceKm: km, distance: kmText };
    })
    .filter((s) => (Number.isFinite(s._distanceKm) ? s._distanceKm <= maxDistanceKm : true))
    .sort((a, b) => a._distanceKm - b._distanceKm);

  const loadShops = async () => {
    if (location) {
      try {
        const data = await fetchShops(location.latitude, location.longitude);
        setShops(data);
      } catch {
        setShops(await fetchShops(location.latitude, location.longitude));
      }
    } else {
      try {
        const data = await fetchShops();
        setShops(data);
      } catch {
        setShops(await fetchShops());
      }
    }
    setLocated(true);
  };

  useEffect(() => {
    if (location) loadShops();
    return () => stopWatching();
  }, [location]);

  useEffect(() => {
    if (!located || !location || !shops.length || !window.google) return;
    const mapEl = document.getElementById('map');
    if (!mapEl) return;
    const g = window.google.maps;
    const map = new g.Map(mapEl, { center: location, zoom: 13, styles: [{ featureType: 'poi', stylers: [{ visibility: 'off' }] }] });
    new g.Marker({ position: location, map, title: 'You', icon: { path: g.SymbolPath.CIRCLE, scale: 8, fillColor: '#10B981', fillOpacity: 1, strokeColor: '#fff', strokeWeight: 2 } });
    shops.forEach(s => {
      if (!s.location) return;
      const m = new g.Marker({ position: { lat: s.location.latitude, lng: s.location.longitude }, map, title: s.name });
      const iw = new g.InfoWindow({ content: `<div><h3 style="font-weight:bold;margin-bottom:5px">${s.name}</h3><p style="margin:2px 0">${s.address}</p><p style="margin:2px 0">${s.distance}</p><p style="margin:2px 0">Rating: ${s.rating}</p></div>` });
      m.addListener('click', () => iw.open(map, m));
    });
  }, [located, location, shops]);

  return (
    <PageWrapper>
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-4 sm:mb-8 animate-fade-up">
          <h1 className="text-3xl sm:text-4xl font-bold text-green-900 mb-2 font-display">{t.shopsTitle}</h1>
          <p className="text-green-700/70">Find supplies near you</p>
        </div>

        {!located ? (
          <div className="leaf-card rounded-3xl p-10 text-center animate-fade-up">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center animate-sway">
              <MapPin className="w-10 h-10 text-green-600" />
            </div>
            <p className="text-green-700/80 mb-6">Allow location access to find nearby shops</p>
            <button onClick={startWatching} disabled={locLoading} className="btn-nature px-8 py-4 rounded-xl font-semibold inline-flex items-center gap-3" data-testid="btn-locate">
              <Navigation className={locLoading ? 'animate-spin' : ''} />
              {locLoading ? 'Finding...' : t.getLocation}
            </button>
            <p className="text-xs text-green-600/80 mt-3">Real-time tracking is enabled while this page is active.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 px-2">
              <div className="text-xs text-green-700/70 font-semibold">{t.distance}</div>
              <div className="flex gap-2 items-center">
                {[1, 3, 5, 10, 20].map((km) => (
                  <button
                    key={km}
                    onClick={() => setMaxDistanceKm(km)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
                      maxDistanceKm === km
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white/70 text-green-800 border-green-200 hover:bg-green-100'
                    }`}
                    aria-pressed={maxDistanceKm === km}
                    data-testid={`radius-${km}`}
                  >
                    {km}km
                  </button>
                ))}
              </div>
            </div>

            {filteredAndSortedShops.map((shop, i) => (
              <ShopCard key={shop.id} shop={shop} t={t} index={i} />
            ))}
            <div id="map" className="w-full h-64 rounded-2xl mt-6 shadow-lg" />
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default ShopsPage;


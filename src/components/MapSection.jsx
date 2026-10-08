import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocateFixed } from 'lucide-react';
import Badge from './Badge';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '../lib/demoData';

const STATUS_COLORS = {
  perdida: '#DC2626',
  encontrada: '#16A34A',
  en_casa: '#78716C',
};

function statusIcon(estado) {
  const color = STATUS_COLORS[estado] || STATUS_COLORS.perdida;
  return L.divIcon({
    className: 'patitas-marker',
    html: `<span style="display:block;width:26px;height:26px;border-radius:9999px;background:${color};border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.35);"></span>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -13],
  });
}

const myLocationIcon = L.divIcon({
  className: 'patitas-my-location',
  html: `<span style="display:block;width:18px;height:18px;border-radius:9999px;background:#2563EB;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.35);"></span>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function FlyTo({ focus }) {
  const map = useMap();
  useEffect(() => {
    if (focus && typeof focus.lat === 'number' && typeof focus.lng === 'number') {
      map.flyTo([focus.lat, focus.lng], 15, { duration: 1.2 });
    }
  }, [map, focus]);
  return null;
}

export default function MapSection({ reports, focus }) {
  const [myPos, setMyPos] = useState(null);
  const [geoError, setGeoError] = useState(false);
  const mapRef = useRef(null);

  const withCoords = (reports || []).filter(
    (r) => typeof r.lat === 'number' && typeof r.lng === 'number'
  );

  const handleMyLocation = () => {
    setGeoError(false);
    if (!navigator.geolocation) {
      setGeoError(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setMyPos(coords);
        if (mapRef.current) {
          mapRef.current.flyTo([coords.lat, coords.lng], 15, { duration: 1.2 });
        }
      },
      () => setGeoError(true)
    );
  };

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="relative">
        <MapContainer
          center={DEFAULT_MAP_CENTER}
          zoom={DEFAULT_MAP_ZOOM}
          scrollWheelZoom={false}
          className="h-[420px] w-full rounded-2xl shadow-card z-0"
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <FlyTo focus={focus} />
          {withCoords.map((r) => (
            <Marker key={r.id} position={[r.lat, r.lng]} icon={statusIcon(r.estado)}>
              <Popup>
                <div className="space-y-1">
                  <p className="font-extrabold text-stone-900">{r.nombre}</p>
                  <Badge estado={r.estado} />
                  {r.zona && <p className="text-sm text-stone-600">{r.zona}</p>}
                </div>
              </Popup>
            </Marker>
          ))}
          {myPos && <Marker position={[myPos.lat, myPos.lng]} icon={myLocationIcon} />}
        </MapContainer>

        <button
          type="button"
          onClick={handleMyLocation}
          className="absolute top-3 right-3 z-[500] inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-sm font-bold text-stone-700 shadow-card transition hover:text-brand"
        >
          <LocateFixed className="h-4 w-4" /> Mi ubicación
        </button>
      </div>

      {geoError && (
        <p className="mt-3 rounded-xl bg-status-perdido/10 px-4 py-2.5 text-sm text-status-perdido animate-fade-in">
          No pudimos obtener tu ubicación. Revisá los permisos del navegador.
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-stone-600">
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: STATUS_COLORS.perdida }} />
          Perdidas
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: STATUS_COLORS.encontrada }} />
          Encontradas
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: STATUS_COLORS.en_casa }} />
          En casa
        </span>
      </div>
    </section>
  );
}

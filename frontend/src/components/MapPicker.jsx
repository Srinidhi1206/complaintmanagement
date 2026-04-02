import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation } from 'lucide-react';

// Fix Leaflet default icon issue
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ position, setPosition }) {
  const map = useMap();

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position} />
  );
}

function RecenterMap({ position }) {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.flyTo(position, 15);
        }
    }, [position, map]);
    return null;
}

export default function MapPicker({ position, setPosition, onAddressChange, className = "h-64" }) {
  const [loading, setLoading] = useState(false);

  const handleAutoDetect = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setLoading(false);
      },
      () => {
        alert("Could not detect location. Please select manually on the map.");
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    if (position && onAddressChange) {
      const fetchAddress = async () => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`);
          const data = await res.json();
          if (data && data.display_name) {
            onAddressChange(data.display_name);
          }
        } catch (err) {
          console.error("Reverse geocoding failed", err);
        }
      };
      const timeoutId = setTimeout(fetchAddress, 800);
      return () => clearTimeout(timeoutId);
    }
  }, [position, onAddressChange]);

  return (
    <div className={`relative rounded-xl overflow-hidden border border-white/10 ${className}`}>
      <MapContainer 
        center={position || [12.9716, 77.5946]} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={setPosition} />
        {position && <RecenterMap position={position} />}
      </MapContainer>

      <button
        type="button"
        onClick={handleAutoDetect}
        className="absolute bottom-4 right-4 z-[1000] flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-primary-600 transition-colors font-bold text-xs"
      >
        <Navigation size={14} className={loading ? 'animate-pulse' : ''} />
        {loading ? 'Detecting...' : 'Auto-Detect'}
      </button>

      <div className="absolute top-4 left-4 z-[1000] bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-white/10 flex items-center gap-2">
        <MapPin size={12} className="text-primary-400" />
        Click map to drop pin
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for leaflet default icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialPos?: [number, number];
}

function LocationMarker({ onLocationSelect, position }: { onLocationSelect: (lat: number, lng: number) => void, position: [number, number] | null }) {
  const map = useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
    locationfound(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

// Helper to update map center when initialPos changes
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export default function MapComponent({ onLocationSelect, initialPos }: MapComponentProps) {
  const [position, setPosition] = useState<[number, number] | null>(initialPos || null);

  const handleSelect = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    onLocationSelect(lat, lng);
  };

  return (
    <div className="h-[300px] w-full rounded-2xl overflow-hidden border border-[var(--border-subtle)] relative z-10">
      <MapContainer 
        center={initialPos || [20.5937, 78.9629]} 
        zoom={initialPos ? 15 : 5} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onLocationSelect={handleSelect} position={position} />
        {initialPos && <ChangeView center={initialPos} />}
      </MapContainer>
      <div className="absolute bottom-4 left-4 z-[400] bg-white/90 dark:bg-black/80 backdrop-blur-md p-2 rounded-lg shadow-lg pointer-events-none">
        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Click map to pin address</p>
      </div>
    </div>
  );
}

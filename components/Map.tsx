'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';

export default function Map() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fix for default marker icon in Leaflet with Next.js
        // We do this inside useEffect to ensure it only runs on the client
        // and doesn't interfere with potential SSR (though dynamic ssr:false is used)
        const DefaultIcon = L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
        });
        L.Marker.prototype.options.icon = DefaultIcon;

        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                const data = await res.json();
                if (data) setSettings(data);
            } catch (error) {
                console.error('Error loading map settings:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    if (loading || !settings) {
        return (
            <div className="w-full h-[500px] rounded-[3rem] border-2 border-gray-800 bg-gray-900/50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
            </div>
        );
    }

    const position: [number, number] = [settings.lat || 36.8391486, settings.lng || 10.3200549];

    return (
        <div className="w-full h-[500px] rounded-[3rem] overflow-hidden border-2 border-gray-800 shadow-3xl bg-gray-900/50 relative">
            <MapContainer
                key={`${position[0]}-${position[1]}`}
                center={position}
                zoom={16}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%', zIndex: 1 }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    <Popup>
                        <div className="text-gray-900 font-bold">
                            Mato's Carthage<br />
                            <span className="text-xs font-normal">{settings.address}</span>
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}

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

    // Tactical Marker Icon
    const tacticalIcon = new L.DivIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #fbbf24; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 20px #fbbf24;"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
    });

    return (
        <div className="w-full h-[500px] md:h-[600px] rounded-[3.5rem] overflow-hidden border border-white/5 shadow-3xl bg-gray-950 relative group">
            <MapContainer
                key={`${position[0]}-${position[1]}`}
                center={position}
                zoom={16}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%', zIndex: 1, background: '#0a0a0a' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                <Marker position={position} icon={tacticalIcon}>
                    <Popup className="tactical-popup">
                        <div className="text-gray-900 font-bold p-1">
                            <h3 className="text-sm font-black uppercase italic tracking-tighter text-yellow-500">Mato's HQ</h3>
                            <p className="text-[10px] font-medium leading-tight mt-1">{settings.address}</p>
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>

            {/* Tactical Overlay Label */}
            <div className="absolute top-8 left-8 z-[10]">
                <div className="bg-black/80 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] italic">Station Centrale</span>
                </div>
            </div>

            <style jsx global>{`
                .tactical-popup .leaflet-popup-content-wrapper {
                    background: rgba(0, 0, 0, 0.9) !important;
                    color: white !important;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border-radius: 1rem;
                }
                .tactical-popup .leaflet-popup-tip {
                    background: rgba(0, 0, 0, 0.9) !important;
                }
            `}</style>

            {/* Gloss Overlay */}
            <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 rounded-[3.5rem] z-[10]"></div>
        </div>
    );
}

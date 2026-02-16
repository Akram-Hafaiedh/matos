'use client';

import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Fix for Leaflet icons in Next.js
const initLeaflet = () => {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
};

const restaurantPos: [number, number] = [36.8391486, 10.3200549]; // Mato's Carthage

// Custom icons for the mission
const createIcon = (color: string) => {
    return new L.DivIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 15px ${color};"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
    });
};

const restaurantIcon = createIcon('#fbbf24'); // Yellow-400
const destinationIcon = createIcon('#ef4444'); // Red-500
const courierIcon = createIcon('#3b82f6'); // Blue-500

function MapUpdater({ center, bounds }: { center?: [number, number], bounds?: L.LatLngBoundsExpression }) {
    const map = useMap();
    useEffect(() => {
        if (bounds) {
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        } else if (center) {
            map.setView(center, map.getZoom());
        }
    }, [center, bounds, map]);
    return null;
}

interface MissionMapProps {
    status: string;
    orderNumber: string;
    lat?: number | null;
    lng?: number | null;
    distance?: number | null;
    timeLeft?: number | null;
}

export default function MissionMap({ status, orderNumber, lat, lng, distance, timeLeft }: MissionMapProps) {
    const [destinationPos, setDestinationPos] = useState<[number, number] | null>(null);
    const [courierPos, setCourierPos] = useState<[number, number] | null>(null);

    useEffect(() => {
        initLeaflet();

        if (lat && lng && lat !== 0 && lng !== 0) {
            setDestinationPos([lat, lng]);
        } else {
            // Seeding the "randomness" with orderNumber so it's consistent on reload
            // if geocoding failed or returned 0,0
            let seed = 0;
            if (orderNumber) {
                for (let i = 0; i < orderNumber.length; i++) {
                    seed += orderNumber.charCodeAt(i);
                }
            }

            const seededRandom = (s: number) => {
                const x = Math.sin(s) * 10000;
                return x - Math.floor(x);
            };

            const mockDest: [number, number] = [
                restaurantPos[0] + (seededRandom(seed) * 0.02 - 0.01),
                restaurantPos[1] - (seededRandom(seed + 1) * 0.015) // Move Westernly (inland)
            ];
            setDestinationPos(mockDest);
        }
    }, [lat, lng]);

    useEffect(() => {
        if (!destinationPos) return;

        if (status === 'out_for_delivery') {
            // Mock moving courier (staying at 60% of the way for now)
            const progress = 0.6;
            const mockCourier: [number, number] = [
                restaurantPos[0] + (destinationPos[0] - restaurantPos[0]) * progress,
                restaurantPos[1] + (destinationPos[1] - restaurantPos[1]) * progress
            ];
            setCourierPos(mockCourier);
        } else if (status === 'delivered') {
            setCourierPos(destinationPos);
        } else {
            setCourierPos(null);
        }
    }, [status, destinationPos]);

    const mapBounds = useMemo(() => {
        if (!destinationPos) return null;
        return L.latLngBounds([restaurantPos, destinationPos]);
    }, [destinationPos]);

    if (!destinationPos) return <div className="w-full h-[400px] bg-gray-900 animate-pulse rounded-[3rem]" />;

    return (
        <div className="w-full h-[400px] md:h-[500px] rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl relative group">
            <MapContainer
                center={restaurantPos}
                zoom={14}
                minZoom={10}
                maxZoom={18}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%', zIndex: 1, background: '#0a0a0a' }}
                zoomControl={false}
            >
                <ZoomControl position="bottomright" />
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                <Marker position={restaurantPos} icon={restaurantIcon}>
                    <Popup>
                        <div className="p-2">
                            <h4 className="font-black text-yellow-500 uppercase italic text-xs">Mato's HQ</h4>
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">Point d'origine</p>
                        </div>
                    </Popup>
                </Marker>

                <Marker position={destinationPos} icon={destinationIcon}>
                    <Popup>
                        <div className="p-2">
                            <h4 className="font-black text-red-500 uppercase italic text-xs">Destination</h4>
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">Point d'arrivée</p>
                        </div>
                    </Popup>
                </Marker>

                {courierPos && (
                    <>
                        <Marker position={courierPos} icon={courierIcon}>
                            <Popup>
                                <div className="p-2">
                                    <h4 className="font-black text-blue-500 uppercase italic text-xs">Livreur en Route</h4>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">Interception en cours</p>
                                </div>
                            </Popup>
                        </Marker>
                        <Polyline
                            positions={[restaurantPos, courierPos]}
                            color="#3b82f6"
                            weight={2}
                            dashArray="5, 10"
                            opacity={0.5}
                        />
                    </>
                )}

                <Polyline
                    positions={[restaurantPos, destinationPos]}
                    color="#ffffff"
                    weight={1}
                    opacity={0.1}
                    dashArray="10, 20"
                />

                <MapUpdater
                    center={courierPos || restaurantPos}
                    bounds={mapBounds || undefined}
                />
            </MapContainer>

            {/* Tactical HUD Overlay */}
            <div className="absolute top-6 left-6 z-[10] flex flex-col gap-2">
                <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${status === 'out_for_delivery' ? 'bg-blue-500 animate-pulse' : 'bg-yellow-400'}`} />
                    <span className="text-[9px] font-black text-white uppercase tracking-[0.2em] italic">
                        {status === 'out_for_delivery' ? 'SIGNAL ACTIF' : status === 'delivered' ? 'MISSION TERMINÉE' : 'PRÉPARATION BASE'}
                    </span>
                </div>
                {distance && (
                    <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic">DISTANCE:</span>
                        <span className="text-[9px] font-black text-white uppercase italic">{distance.toFixed(1)} KM</span>
                    </div>
                )}
                {timeLeft !== undefined && timeLeft !== null && (
                    <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic">LIVRAISON:</span>
                        <span className="text-[9px] font-black text-blue-400 uppercase italic">{timeLeft} MIN</span>
                    </div>
                )}
            </div>

            <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 rounded-[3rem] z-[10]"></div>
        </div>
    );
}

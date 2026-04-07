import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Map, MapPin } from 'lucide-react';
import { getNgos, getCases } from '../api';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icon for Cases
const caseIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const ngoIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const CoverageMap = () => {
    const [ngos, setNgos] = useState([]);
    const [cases, setCases] = useState([]);

    // Hardcode some approximate coordinates based on standard districts
    const geocodeMap = {
        "North District": [28.7041, 77.1025],
        "Central District": [28.6139, 77.2090],
        "East District": [28.6258, 77.3026],
        "South District": [28.4962, 77.2155],
    };

    useEffect(() => {
        const load = async () => {
            const fetchedNgos = await getNgos();
            const fetchedCases = await getCases();
            setNgos(fetchedNgos);
            setCases(fetchedCases);
        };
        load();
    }, []);

    // Fallback static center
    const center = [28.6139, 77.2090]; 

    return (
        <div className="p-8 h-full flex flex-col overflow-hidden relative">
            <header className="flex justify-between items-end mb-6 relative z-10 flex-shrink-0">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
                        <Map className="w-8 h-8 text-primary" />
                        Coverage Map
                    </h2>
                    <p className="text-subText">Geographical overview of NGOs and reported cases.</p>
                </div>
            </header>

            <div className="flex-1 rounded-2xl overflow-hidden glass-panel border border-white/5 shadow-2xl relative z-10 isolate">
                <MapContainer center={center} zoom={11} style={{ height: '100%', width: '100%', background: '#0f172a' }}>
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />
                    
                    {/* Render NGOs */}
                    {ngos.map(ngo => {
                        const pos = geocodeMap[ngo.location];
                        if (!pos) return null;
                        return (
                            <React.Fragment key={`ngo-${ngo.id}`}>
                                <Marker position={pos} icon={ngoIcon}>
                                    <Popup className="custom-popup">
                                        <div className="font-sans">
                                            <strong className="block text-primary text-base font-bold mb-1">{ngo.name}</strong>
                                            <span className="text-sm block mb-2">{ngo.services_offered.replace(',', ', ')}</span>
                                            <span className="text-xs text-gray-500">Capacity: {ngo.capacity}</span>
                                        </div>
                                    </Popup>
                                </Marker>
                                <Circle 
                                    center={pos} 
                                    radius={4000} 
                                    pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.1, weight: 1 }}
                                />
                            </React.Fragment>
                        );
                    })}

                    {/* Render Cases */}
                    {cases.map(c => {
                        let pos = null;
                        if (c.location && geocodeMap[c.location]) {
                            // Perfect match
                            pos = [geocodeMap[c.location][0] + (Math.random() * 0.02 - 0.01), geocodeMap[c.location][1] + (Math.random() * 0.02 - 0.01)];
                        } else if (c.ngo && geocodeMap[c.ngo.location]) {
                            // Fallback to NGO location slightly jittered
                            const basePos = geocodeMap[c.ngo.location];
                            pos = [basePos[0] + (Math.random() * 0.03 - 0.015), basePos[1] + (Math.random() * 0.03 - 0.015)];
                        }
                        
                        if (!pos) return null;
                        
                        return (
                            <Marker key={`case-${c.id}`} position={pos} icon={caseIcon}>
                                <Popup>
                                    <div className="font-sans">
                                        <strong className="block text-red-500 font-bold mb-1 uppercase text-xs">Priority: {c.priority}</strong>
                                        <span className="text-sm block">Case #{c.id} - {c.status}</span>
                                        <span className="text-xs text-gray-500 mt-2 block line-clamp-2">"{c.description}"</span>
                                    </div>
                                </Popup>
                            </Marker>
                        )
                    })}
                </MapContainer>
            </div>
        </div>
    );
};

export default CoverageMap;

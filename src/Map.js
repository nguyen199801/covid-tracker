import React from 'react';
import './Map.css';
import { MapContainer as LeafletMap, TileLayer, useMap } from "react-leaflet";
import { showDataOnMap } from './util';

function SetViewOnClick({ center }) {
    const map = useMap();
    map.setView(center, map.getZoom());

    return null;
}

function Map({ center, casesType, countries }) {
    console.log(center);
    return (
        <div className="map">
            <LeafletMap center={center} zoom={4}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />

                <SetViewOnClick center={center} />
                {showDataOnMap(countries, casesType)}
            </LeafletMap>
        </div>
    );
}

export default Map

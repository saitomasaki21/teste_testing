// MapboxMap.js
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export const MapboxMap = ({ accessToken, trails, selectedTrail, onTrailSelect }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: selectedTrail.coordinates[0],
      zoom: 15
    });

    // Adicionar cada trilha
    trails.forEach((trail, index) => {
      map.current.on('load', () => {
        // Adicionar fonte de dados
        map.current.addSource(`trail-${trail.id}`, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: trail.coordinates
            }
          }
        });

        // Adicionar camada de linha
        map.current.addLayer({
          id: `trail-${trail.id}`,
          type: 'line',
          source: `trail-${trail.id}`,
          layout: {},
          paint: {
            'line-color': trail.id === selectedTrail.id ? '#ff0000' : '#555555',
            'line-width': 4,
            'line-opacity': 0.75
          }
        });
      });

      // Evento de clique
      map.current.on('click', `trail-${trail.id}`, (e) => {
        onTrailSelect(trail);
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [trails, selectedTrail.id, onTrailSelect]);

  return <div ref={mapContainer} className="w-2/3 h-full" />;
};

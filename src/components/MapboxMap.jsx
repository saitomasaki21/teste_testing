import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { createMarkerElement, addMarkersToMap, drawPathOnMap, updateFieldOfView } from '../utils/mapUtils';

export const MapboxMap = ({ accessToken, trails, selectedTrail, onTrailSelect, viewerRef }) => {
  const mapboxContainerRef = useRef(null);
  const mapRef = useRef(null);
  const fovLayerRef = useRef(null);
  const markersRef = useRef([]);
  const [currentImageId, setCurrentImageId] = useState(null);

  // Função para atualizar as trilhas
  const updateTrails = useCallback((map) => {
    // Remove camadas e fontes antigas
    trails.forEach(trail => {
      if (map.getSource(`trail-${trail.id}`)) {
        map.removeLayer(`trail-${trail.id}`);
        map.removeSource(`trail-${trail.id}`);
      }
    });

    // Adiciona novas trilhas
    trails.forEach(trail => {
      map.addSource(`trail-${trail.id}`, {
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

      map.addLayer({
        id: `trail-${trail.id}`,
        type: 'line',
        source: `trail-${trail.id}`,
        paint: {
          'line-color': trail.id === selectedTrail.id ? '#ff0000' : '#555555',
          'line-width': 4,
          'line-opacity': 0.75
        }
      });

      // Evento de clique na trilha
      map.on('click', `trail-${trail.id}`, (e) => {
        onTrailSelect(trail);
      });
    });
  }, [trails, selectedTrail, onTrailSelect]);

  useEffect(() => {
    if (!mapboxContainerRef.current) return;

    mapboxgl.accessToken = accessToken;
    const map = new mapboxgl.Map({
      container: mapboxContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: selectedTrail.coordinates[0],
      zoom: 15,
    });

    mapRef.current = map;

    map.on('load', () => {
      // Configurações originais
      markersRef.current = addMarkersToMap(map, selectedTrail.coordinates, selectedTrail.imageIds, viewerRef, setCurrentImageId);
      drawPathOnMap(map, selectedTrail.coordinates);
      updateTrails(map);

      // Controles do mapa
      const scale = new mapboxgl.ScaleControl({ maxWidth: 80, unit: 'metric' });
      map.addControl(scale, 'bottom-left');

      // North Arrow Control (mantido do código original)
      class NorthArrowControl {
        onAdd(map) {
          this._map = map;
          this._container = document.createElement('div');
          this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
          this._container.innerHTML = `
            <div class="north-arrow">
              <div class="north-arrow-pointer"></div>
              <div class="north-arrow-n">N</div>
            </div>
          `;
          return this._container;
        }

        onRemove() {
          this._container.parentNode.removeChild(this._container);
          this._map = undefined;
        }
      }
      map.addControl(new NorthArrowControl(), 'top-right');

      // FOV Layer (mantido do código original)
      map.addSource('fov', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: selectedTrail.coordinates[0],
          },
        },
      });

      map.addLayer({
        id: 'fov',
        type: 'symbol',
        source: 'fov',
        layout: {
          'icon-image': 'triangle-15',
          'icon-rotate': ['get', 'bearing'],
          'icon-rotation-alignment': 'map',
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
        },
        paint: {
          'icon-color': '#3FB1CE',
          'icon-opacity': 0.8,
        },
      });

      fovLayerRef.current = map.getSource('fov');
    });

    return () => map.remove();
  }, [accessToken, selectedTrail, updateTrails]);

  useEffect(() => {
    if (viewerRef.current && mapRef.current && fovLayerRef.current) {
      const updateFOV = () => {
        const pov = viewerRef.current.getPointOfView();
        if (pov) {
          updateFieldOfView(mapRef.current, fovLayerRef.current, pov);
          const currentId = viewerRef.current.getCurrentId();
          if (currentId) {
            setCurrentImageId(currentId);
          }
        }
      };

      viewerRef.current.on('position', updateFOV);
      return () => viewerRef.current.off('position', updateFOV);
    }
  }, [viewerRef]);

  useEffect(() => {
    if (currentImageId && markersRef.current) {
      markersRef.current.forEach((marker, index) => {
        const el = marker.getElement();
        el.style.backgroundColor = selectedTrail.imageIds[index] === currentImageId 
          ? '#FF0000' 
          : '#3FB1CE';
      });
    }
  }, [currentImageId, selectedTrail.imageIds]);

  return <div ref={mapboxContainerRef} className="w-2/3 h-full" />;
};

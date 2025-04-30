import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Viewer } from 'mapillary-js';
import 'mapillary-js/dist/mapillary.css';
import { MapboxMap } from '../components/MapboxMap';
import { MapillaryViewer } from '../components/MapillaryViewer';
import { trails } from '../utils/mapData';

const mapillaryAccessToken = 'MLY|9269492676456633|a6293e72d833fa0f80c33e4fb48d14f5';
const mapboxAccessToken = 'pk.eyJ1IjoiYW5kcmVtZW5kb25jYSIsImEiOiJjbGxrMmRidjYyaGk4M21tZ2hhanFjMjVwIn0.4_fHgnbXRc1Hxg--Bs_kkg';

const MapPage = () => {
  const viewerRef = useRef(null);
  const [selectedTrail, setSelectedTrail] = useState(trails[0]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleTrailSelect = (trail) => {
    setSelectedTrail(trail);
    setCurrentImageIndex(0);
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % selectedTrail.imageIds.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + selectedTrail.imageIds.length) % selectedTrail.imageIds.length);
  };

  useEffect(() => {
    return () => {
      if (viewerRef.current) {
        viewerRef.current.remove();
      }
    };
  }, []);

  return (
    <div className="flex h-screen">
      <div className="w-1/3 flex flex-col">
        <MapillaryViewer
          accessToken={mapillaryAccessToken}
          imageId={selectedTrail.imageIds[currentImageIndex]}
          viewerRef={viewerRef}
        />
        <div className="bg-white p-4 shadow">
          <h2 className="text-xl font-bold mb-2">{selectedTrail.name}</h2>
          <div className="flex gap-2">
            <button 
              onClick={handlePrevImage}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Anterior
            </button>
            <button
              onClick={handleNextImage}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
      
      <MapboxMap
        accessToken={mapboxAccessToken}
        trails={trails}
        selectedTrail={selectedTrail}
        onTrailSelect={handleTrailSelect}
        viewerRef={viewerRef}
      />
    </div>
  );
};

export default MapPage;

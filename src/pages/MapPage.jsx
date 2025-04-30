import React, { useEffect, useRef, useState } from 'react';
import { MapboxMap } from '../components/MapboxMap';
import { MapillaryViewer } from '../components/MapillaryViewer';
import { trails } from '../utils/mapData';

const mapillaryAccessToken = 'MLY|9269492676456633|a6293e72d833fa0f80c33e4fb48d14f5';
const mapboxAccessToken = 'pk.eyJ1IjoiYW5kcmVtZW5kb25jYSIsImEiOiJjbGxrMmRidjYyaGk4M21tZ2hhanFjMjVwIn0.4_fHgnbXRc1Hxg--Bs_kkg';

const MapPage = () => {
  const viewerRef = useRef(null);
  const [selectedTrail, setSelectedTrail] = useState(() => trails[0]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Debug: Verifique os dados iniciais
  useEffect(() => {
    console.log('Trilha selecionada:', selectedTrail);
    console.log('Image ID atual:', selectedTrail.imageIds[currentImageIndex]);
  }, [selectedTrail, currentImageIndex]);

  // Atualize o Mapillary quando a imagem mudar
  useEffect(() => {
    if (!viewerRef.current || !selectedTrail.imageIds.length) return;

    const loadImage = async () => {
      try {
        await viewerRef.current.moveTo(selectedTrail.imageIds[currentImageIndex]);
        viewerRef.current.resize();
      } catch (error) {
        console.error('Erro ao carregar imagem:', error);
      }
    };

    loadImage();
  }, [currentImageIndex, selectedTrail]);

  useEffect(() => {
    return () => {
      if (viewerRef.current) {
        viewerRef.current.remove();
      }
    };
  }, []);

  return (
    <div className="flex h-screen">
      <div className="w-1/2 h-full bg-gray-800">
        <MapillaryViewer
          accessToken={mapillaryAccessToken}
          imageId={selectedTrail.imageIds[currentImageIndex]}
          viewerRef={viewerRef}
        />
      </div>

      <div className="w-1/2 h-full">
        <MapboxMap
          accessToken={mapboxAccessToken}
          trails={trails}
          selectedTrail={selectedTrail}
          onTrailSelect={(trail) => {
            setSelectedTrail(trail);
            setCurrentImageIndex(0); // Resetar para primeira imagem
          }}
          onMarkerClick={(index) => setCurrentImageIndex(index)}
          viewerRef={viewerRef}
        />
      </div>
    </div>
  );
};

export default MapPage;

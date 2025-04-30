import React, { useEffect, useRef } from 'react';
import { Viewer } from 'mapillary-js';

export const MapillaryViewer = ({ accessToken, imageId, viewerRef }) => {
  const mapillaryContainerRef = useRef(null);

  useEffect(() => {
    if (!mapillaryContainerRef.current) return;

    viewerRef.current = new Viewer({
      accessToken,
      container: mapillaryContainerRef.current,
      imageId,
      component: {
        cover: false,
        direction: true,  // Habilitado para melhor navegação
        sequence: true,   // Mostra a sequência de imagens
        zoom: true,       // Habilita controles de zoom
      },
      renderMode: 'fill', // Preenche o container disponível
    });

    // Ajusta o tamanho quando a janela muda
    const resizeObserver = new ResizeObserver(() => {
      viewerRef.current.resize();
    });
    
    resizeObserver.observe(mapillaryContainerRef.current);

    return () => {
      if (viewerRef.current) {
        viewerRef.current.remove();
      }
      resizeObserver.disconnect();
    };
  }, [accessToken, imageId, viewerRef]);

  return (
    <div 
      ref={mapillaryContainerRef} 
      className="w-full h-full relative"
      style={{ minHeight: '500px' }} // Altura mínima garantida
    />
  );
};

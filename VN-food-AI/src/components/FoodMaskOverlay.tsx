import React from 'react';
import Svg, { Polygon } from 'react-native-svg';

const formatPolygonPoints = (polygonCoordinates: number[][]) => {
  return polygonCoordinates.map(point => `${point[0]},${point[1]}`).join(' ');
};

interface FoodMaskOverlayProps {
  items: any[];
  imageSize: { width: number, height: number } | null;
}

export const FoodMaskOverlay = ({ items, imageSize }: FoodMaskOverlayProps) => {
  if (!items || items.length === 0 || !imageSize) return null;

  return (
    <Svg 
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10 }}
      viewBox={`0 0 ${imageSize.width} ${imageSize.height}`}
      preserveAspectRatio="xMidYMid slice"
    >
      {items.map((item, index) => (
        item.polygons && item.polygons.map((poly: number[][], pIndex: number) => (
          <Polygon 
            key={`${index}-${pIndex}`}
            points={formatPolygonPoints(poly)}
            fill="rgba(46, 204, 113, 0.3)" 
            stroke="rgb(46, 204, 113)"     
            strokeWidth="4"
          />
        ))
      ))}
    </Svg>
  );
};

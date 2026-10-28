import React from "react";
import Svg, { Polygon } from "react-native-svg";

export interface FoodMaskOverlayProps {
  items: import("@/features/analyzer/mapping/analyzeMapper").DetectedItem[];
  imageSize: { width: number; height: number } | null;
}

export const FoodMaskOverlay = ({ items, imageSize }: FoodMaskOverlayProps) => {
  if (!items || items.length === 0 || !imageSize) return null;

  // Format polygon points for SVG
  const formatPolygonPoints = (polygonCoordinates: number[][]) => {
    return polygonCoordinates.map((point) => `${point[0]},${point[1]}`).join(" ");
  };

  return (
    <Svg
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 10 }}
      viewBox={`0 0 ${imageSize.width} ${imageSize.height}`}
      preserveAspectRatio="xMidYMid slice"
    >
      {items.map((item, index) => (
        <Polygon
          key={index}
          points={formatPolygonPoints(item.maskPolygons?.[0] || [])}
          fill="rgba(46, 204, 113, 0.3)"
          stroke="rgb(46, 204, 113)"
          strokeWidth={4}
        />
      ))}
    </Svg>
  );
};
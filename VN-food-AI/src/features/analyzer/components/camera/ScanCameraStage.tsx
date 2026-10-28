import React from "react";
import { CameraView, type CameraType, useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";
import { Button, View, StyleSheet, Text } from "react-native";
import Svg, { Polygon } from "react-native-svg";

export interface ScanCameraStageProps {
  activeImageUri: string | null;
  resultImageUri: string | null;
  detected: import("@/features/analyzer/mapping/analyzeMapper").DetectedItem[];
  imageSize: { width: number; height: number } | null;
  isAnalyzing: boolean;
  foodName: string | null;
  confidence: number | null;
  cameraFacing: CameraType;
}

export function ScanCameraStage({
  activeImageUri,
  resultImageUri,
  detected,
  imageSize,
  isAnalyzing,
  foodName,
  confidence,
  cameraFacing,
}: ScanCameraStageProps) {
  const [permission, requestPermission] = useCameraPermissions();
  // Format polygon points for SVG
  const formatPolygonPoints = (polygonCoordinates: number[][]) => {
    return polygonCoordinates
      .map((point) => `${point[0]},${point[1]}`)
      .join(" ");
  };

  const maskPolygons = detected.flatMap((item) => item.maskPolygons);

  return (
    <View style={styles.container}>
      <View style={styles.frame}>
        {activeImageUri ? (
          <View style={styles.cameraContainer}>
            <Image
              source={{ uri: resultImageUri || activeImageUri }}
              style={styles.camera}
              contentFit="cover"
            />
            {!isAnalyzing && (
              <Svg
                style={styles.overlay}
                viewBox={`0 0 ${imageSize?.width || 0} ${imageSize?.height || 0}`}
                preserveAspectRatio="xMidYMid slice"
              >
                {maskPolygons.map((points, idx) => (
                  <Polygon
                    key={idx}
                    points={formatPolygonPoints(points)}
                    fill="rgba(46, 204, 113, 0.3)"
                    stroke="rgb(46, 204, 113)"
                    strokeWidth={4}
                  />
                ))}
              </Svg>
            )}
          </View>
        ) : permission?.granted ? (
            <CameraView style={styles.camera} facing={cameraFacing} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>
                Cho phép camera để chụp ảnh món ăn
              </Text>
              {permission && (
                <Button title="Cho phép camera" onPress={requestPermission} />
              )}
            </View>
        )}

        {!activeImageUri && (
          <View style={styles.hintContainer}>
            <View style={styles.hint}>
              <Text style={styles.hintText}>
                Hãy chụp toàn bộ đĩa từ hướng từ trên xuống
              </Text>
            </View>
          </View>
        )}

        {!isAnalyzing && activeImageUri && (
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {foodName || "Món ăn"}
                {confidence !== null && ` ${Math.round(confidence * 100)}%`}
              </Text>
            </View>
          </View>
        )}

        {isAnalyzing && (
          <View style={styles.loadingOverlay}>
            <Text style={styles.loadingText}>AI đang phân tích...</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  frame: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 36,
    overflow: "hidden",
    backgroundColor: "#18181B",
    borderWidth: 1,
    borderColor: "rgba(228, 228, 231, 0.5)",
    position: "relative",
  },
  cameraContainer: {
    ...StyleSheet.absoluteFill,
  },
  camera: {
    ...StyleSheet.absoluteFill,
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  placeholderText: {
    color: "#666",
    fontSize: 16,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  badgeContainer: {
    position: "absolute",
    bottom: 16,
    width: "100%",
    paddingHorizontal: 16,
    pointerEvents: "none",
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(24, 24, 27, 0.8)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 8,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "Montserrat-Medium",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Montserrat-Medium",
  },
  hintContainer: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    alignItems: "center",
  },
  hint: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  hintText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Montserrat-Medium",
    textAlign: "center",
  },
});
import { useState } from "react";
import { ColorValue, LayoutChangeEvent, View } from "react-native";
import Svg, { Path } from "react-native-svg";

export interface VerticalWavyDashedLineProps {
  className?: string;
  amplitude?: number;
  wavelength?: number;
  color?: ColorValue;
}

export default function VerticalWavyDashedLine({
  className,
  amplitude = 6,
  wavelength = 24,
  color = "black",
}: VerticalWavyDashedLineProps) {
  const [height, setHeight] = useState(0);

  const half = wavelength / 2;
  const count = Math.ceil(height / wavelength);

  let d = `M ${amplitude} 0 Q 0 ${wavelength / 4} ${amplitude} ${half}`;
  for (let i = 1; i < count * 2; i++) {
    d += ` T ${amplitude} ${half * (i + 1)}`;
  }

  return (
    <View
      className={`items-center ${className ?? ""}`}
      onLayout={(e: LayoutChangeEvent) =>
        setHeight(e.nativeEvent.layout.height)
      }>
      {height > 0 && (
        <Svg width={amplitude * 2} height={height}>
          <Path
            d={d}
            stroke={color}
            strokeWidth={2}
            strokeDasharray="6 4"
            strokeLinecap="round"
            fill="none"
          />
        </Svg>
      )}
    </View>
  );
}

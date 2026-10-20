import { LinearGradient } from "expo-linear-gradient";
import { memo, useCallback, useMemo, useState } from "react";
import { LayoutChangeEvent, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import Svg, { G, Path, Text as SvgText } from "react-native-svg";

import { TriangleIcon } from "lucide-react-native";
import { useWeightSliderRuler } from "./hooks/useWeightSliderRuler";
import { SliderRulerProps } from "./ruler";

const LINE_START_Y_DIFF = 16;

export interface WeightSliderRulerProps extends SliderRulerProps {
  rulerHeight?: number;
  lineStartY?: number;
  onFinishLoading?: () => void;
}

export const WeightSliderRuler = memo(function SliderRuler({
  rulerHeight = 80,
  lineStartY = 32,
  minorPerMediumSegment = 1,
  mediumPerMajorSegment = 1,
  onFinishLoading,
  ...props
}: WeightSliderRulerProps) {
  const [isRulerReady, setIsRulerReady] = useState(false);
  const {
    formatTickValue,
    UIProps: sliderProps,
    UIstyle: sliderStyle,
  } = useWeightSliderRuler(props);

  const { ticks, SNAP, pan, tickCount, viewportPadding } = sliderProps;

  const { TICK_WIDTH, centerLeft, rulerLeft, rulerStyle, setContainerWidth } =
    sliderStyle;

  const handleLayout = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    setContainerWidth(nativeEvent.layout.width);

    if (nativeEvent.layout.width > 0) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsRulerReady(true);
          onFinishLoading?.();
        });
      });
    }
  }, []);

  const getPath = (index: number, y: number) => {
    const x = viewportPadding + TICK_WIDTH / 2 + index * SNAP;
    return `M ${x} 0 V ${y}`;
  };

  const { majorTicks, majorPath, mediumPath, minorPath } = useMemo(() => {
    if (!isRulerReady) {
      return { majorPath: "", minorPath: "" };
    }

    const majorTicks: number[] = [];
    const majorLineStartY = lineStartY + LINE_START_Y_DIFF;
    const minorLineStartY = lineStartY - LINE_START_Y_DIFF;

    let majorPath = "";
    let mediumPath = "";
    let minorPath = "";

    let minorTickRemain = minorPerMediumSegment;
    let mediumTickRemain = mediumPerMajorSegment;
    let isDrawMajor = false;

    for (const tick of ticks) {
      if (!isDrawMajor) {
        const path = getPath(tick, majorLineStartY);
        majorPath += path;
        majorTicks.push(tick);

        isDrawMajor = true;
        minorTickRemain = minorPerMediumSegment;
        mediumTickRemain = mediumPerMajorSegment;
        continue;
      }

      if (minorTickRemain > 0) {
        minorTickRemain--;
        const path = getPath(tick, minorLineStartY);
        minorPath += path;
      } else {
        mediumTickRemain--;
        const path = getPath(tick, lineStartY);
        mediumPath += path;
        minorTickRemain = minorPerMediumSegment;
      }

      if (mediumTickRemain == 0 && minorTickRemain == 0) isDrawMajor = false;
    }

    return { majorTicks, majorPath, mediumPath, minorPath };
  }, [
    ticks,
    isRulerReady,
    SNAP,
    TICK_WIDTH,
    viewportPadding,
    props.step,
    rulerHeight,
    mediumPerMajorSegment,
    minorPerMediumSegment,
  ]);

  return (
    <View className="items-center h-full">
      <GestureDetector gesture={pan}>
        <View
          className="w-full flex-1 overflow-hidden justify-end relative"
          onLayout={handleLayout}>
          {isRulerReady && (
            <>
              <Animated.View
                className="absolute top-7 h-full"
                style={[rulerLeft, rulerStyle]}>
                <Svg
                  width={tickCount * SNAP + viewportPadding * 2}
                  height={rulerHeight + 20}>
                  <G>
                    <Path
                      d={minorPath}
                      stroke="#a3a3a3"
                      strokeWidth={TICK_WIDTH}
                    />
                    <Path
                      d={mediumPath}
                      stroke="#a3a3a3"
                      strokeWidth={TICK_WIDTH}
                    />
                    <Path
                      d={majorPath}
                      stroke="#404040"
                      strokeWidth={TICK_WIDTH}
                    />
                    {majorTicks?.map((index) => {
                      const x = viewportPadding + TICK_WIDTH / 2 + index * SNAP;
                      return (
                        <SvgText
                          key={index}
                          x={x}
                          y={lineStartY + LINE_START_Y_DIFF * 2}
                          fill="#404040"
                          fontSize={10}
                          textAnchor="middle">
                          {formatTickValue(index)}
                        </SvgText>
                      );
                    })}
                  </G>
                </Svg>
              </Animated.View>

              <LinearGradient
                pointerEvents="none"
                colors={["white", "rgba(255,255,255,0)"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 48,
                  zIndex: 2,
                }}
              />
              <LinearGradient
                pointerEvents="none"
                colors={["rgba(255,255,255,0)", "white"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: 48,
                  zIndex: 2,
                }}
              />

              <View
                pointerEvents="none"
                className="absolute w-[3px] items-center"
                style={{
                  ...centerLeft,
                  height: rulerHeight,
                  top: 0,
                }}>
                <View className="w-fit rotate-180">
                  <TriangleIcon
                    fill={"black"}
                    color={"black"}
                    size={20}></TriangleIcon>
                </View>
              </View>
            </>
          )}
        </View>
      </GestureDetector>
    </View>
  );
});

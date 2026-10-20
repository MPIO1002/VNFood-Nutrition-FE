import { LinearGradient } from "expo-linear-gradient";
import { memo, useCallback, useMemo, useState } from "react";
import { LayoutChangeEvent, Platform, Text, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedProps } from "react-native-reanimated";
import Svg, { G, Path, Text as SvgText } from "react-native-svg";

import { AnimatedTextInput } from "@/components/animated-components";
import { Circle } from "lucide-react-native";
import { useHeightSliderRuler } from "./hooks/useHeightSliderRuler";
import { SliderRulerProps } from "./ruler";

const LINE_START_X_DIFF = 32;
const RULER_OFFSET_LEFT = 20;
const LABEL_WIDTH = 56;
const LABEL_GAP = 4;

export interface HeightSliderRulerProps extends SliderRulerProps {
  rulerWidth?: number;
  lineStartX?: number;
  onFinishLoading?: () => void;
}

export const HeightSliderRuler = memo(function HeightSliderRuler({
  rulerWidth = 80,
  lineStartX = 48,
  minorPerMediumSegment = 1,
  mediumPerMajorSegment = 1,
  onFinishLoading,
  ...props
}: HeightSliderRulerProps) {
  const majorLineStartX = lineStartX - LINE_START_X_DIFF;
  const minorLineStartX = lineStartX + LINE_START_X_DIFF;

  const [isRulerReady, setIsRulerReady] = useState(false);
  const { screenValue } = props;

  const {
    formatTickValue,
    UIProps: sliderProps,
    UIstyle: sliderStyle,
  } = useHeightSliderRuler(props);

  const { ticks, SNAP, pan, tickCount, viewportPadding } = sliderProps;

  const { TICK_HEIGHT, centerTop, rulerTop, rulerStyle, setContainerHeight } =
    sliderStyle;

  const handleLayout = useCallback(
    ({ nativeEvent }: LayoutChangeEvent) => {
      sliderStyle.setContainerHeight(nativeEvent.layout.height);

      if (nativeEvent.layout.height > 0) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsRulerReady(true);
            onFinishLoading?.();
          });
        });
      }
    },
    [onFinishLoading, sliderStyle],
  );

  const getPath = (index: number, x: number, endX: number) => {
    const y = viewportPadding + TICK_HEIGHT / 2 + index * SNAP;
    const startX = LABEL_WIDTH + x;
    return `M ${startX} ${y} H ${endX}`;
  };

  const { majorTicks, majorPath, mediumPath, minorPath } = useMemo(() => {
    if (!isRulerReady) {
      return { majorPath: "", minorPath: "" };
    }

    const rulerEndX = LABEL_WIDTH + rulerWidth - TICK_HEIGHT / 2;
    const majorTicks: number[] = [];

    let majorPath = "";
    let mediumPath = "";
    let minorPath = "";

    let minorTickRemain = minorPerMediumSegment;
    let mediumTickRemain = mediumPerMajorSegment;
    let isDrawMajor = false;

    for (const tick of ticks) {
      if (!isDrawMajor) {
        const path = getPath(tick, majorLineStartX, rulerEndX);
        majorPath += path;
        majorTicks.push(tick);

        isDrawMajor = true;
        minorTickRemain = minorPerMediumSegment;
        mediumTickRemain = mediumPerMajorSegment;
        continue;
      }

      if (minorTickRemain > 0) {
        minorTickRemain--;
        const path = getPath(tick, minorLineStartX, rulerEndX);
        minorPath += path;
      } else {
        mediumTickRemain--;
        const path = getPath(tick, lineStartX, rulerEndX);
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
    TICK_HEIGHT,
    viewportPadding,
    rulerWidth,
    props.step,
    mediumPerMajorSegment,
    minorPerMediumSegment,
  ]);

  const unitLabel = props.unitLabel || "";
  const textProps = useAnimatedProps(() => {
    const v = screenValue?.value ?? 0;
    const str = unitLabel ? `${v} ${unitLabel}` : `${v}`;
    return {
      text: str,
      defaultValue: str,
    };
  }, [unitLabel]);

  return (
    <View className="items-center h-full">
      <GestureDetector gesture={pan}>
        <View
          className="w-full flex-1 bg-gray-100 overflow-hidden relative rounded-xl"
          onLayout={handleLayout}>
          {isRulerReady && (
            <>
              <Animated.View
                className="absolute h-full"
                style={[
                  rulerTop,
                  { right: RULER_OFFSET_LEFT, width: rulerWidth + LABEL_WIDTH },
                  rulerStyle,
                ]}>
                <Svg
                  width={rulerWidth + LABEL_WIDTH}
                  height={tickCount * SNAP + viewportPadding * 2}>
                  <G>
                    <Path
                      d={minorPath}
                      stroke="#a3a3a3"
                      strokeWidth={TICK_HEIGHT}
                    />
                    <Path
                      d={mediumPath}
                      stroke="#a3a3a3"
                      strokeWidth={TICK_HEIGHT}
                    />
                    <Path
                      d={majorPath}
                      stroke="black"
                      strokeWidth={TICK_HEIGHT}
                    />
                    {majorTicks?.map((index) => {
                      const y =
                        viewportPadding + TICK_HEIGHT / 2 + index * SNAP;

                      return (
                        <SvgText
                          key={index}
                          x={LABEL_WIDTH + majorLineStartX - LABEL_GAP}
                          y={y + 4}
                          fill="#404040"
                          fontSize={10}
                          textAnchor="end">
                          {formatTickValue(index)}
                        </SvgText>
                      );
                    })}
                  </G>
                </Svg>
              </Animated.View>

              <LinearGradient
                pointerEvents="none"
                colors={["#e5e7eb", "rgba(255,255,255,0)"]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                  height: 48,
                  zIndex: 2,
                }}
              />
              <LinearGradient
                pointerEvents="none"
                colors={["rgba(255,255,255,0)", "#e5e7eb"]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: 48,
                  zIndex: 2,
                }}
              />

              <View
                pointerEvents="none"
                className="absolute flex-row items-center overflow-visible self-end"
                style={{
                  top: centerTop.top + TICK_HEIGHT / 2,
                  right: RULER_OFFSET_LEFT - 3,
                  width: "85%",
                  transform: [{ translateY: "-50%" }],
                }}>
                <View className="rounded-xl bg-black px-3 mr-2 h-[30px] justify-center items-center">
                  <AnimatedTextInput
                    editable={false}
                    scrollEnabled={false}
                    multiline={false}
                    animatedProps={textProps}
                    className="font-montserrat-medium text-white text-sm text-center"
                    style={{
                      includeFontPadding: false,
                      padding: 0,
                      paddingTop: 0,
                      paddingBottom: 0,
                      margin: 0,
                      minWidth: 58,
                      height: 24,
                      textAlign: "center",
                      textAlignVertical: "center",
                      transform: [{ translateY: Platform.OS === "ios" ? -1 : 0 }],
                    }}
                  />
                </View>
                <View className="h-[3px] flex-1 bg-green-300" />
                <Circle size={10} color="#86efac" fill="#86efac" />
              </View>
            </>
          )}
        </View>
      </GestureDetector>
    </View>
  );
});

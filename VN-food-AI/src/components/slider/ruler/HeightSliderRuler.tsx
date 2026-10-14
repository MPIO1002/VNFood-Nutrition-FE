import { LinearGradient } from "expo-linear-gradient";
import { cssInterop } from "nativewind";
import { memo, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Text, TextInput, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import Svg, { G, Path, Text as SvgText } from "react-native-svg";

import { Circle, MoveVertical } from "lucide-react-native";
import { useHeightSliderRuler } from "./hooks/useHeightSliderRuler";
import { SliderRulerProps } from "./ruler";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
cssInterop(AnimatedTextInput, { className: "style" });

const LINE_START_X = 16;
const MAJOR_LINE_START_X = 0;
const RULER_OFFSET_LEFT = 20;
const LABEL_WIDTH = 32;

export const HeightSliderRuler = memo(function HeightSliderRuler(
  props: SliderRulerProps,
) {
  const [isRulerReady, setIsRulerReady] = useState(false);
  const {
    formatTickValue,
    handleLayout,
    props: sliderProps,
    style: sliderStyle,
  } = useHeightSliderRuler(props);

  const {
    TICKS,
    MAJOR_TICKS,
    SNAP,
    majorTickInterval,
    pan,
    textProps,
    tickCount,
    viewportPadding,
  } = sliderProps;
  const { TICK_WIDTH, centerTop, rulerTop, rulerStyle, rulerWidth } =
    sliderStyle;

  useEffect(() => {
    const idleCallback =
      typeof requestIdleCallback === "function"
        ? requestIdleCallback
        : (callback: () => void) => setTimeout(callback, 0);
    const cancelIdleCallback =
      typeof window !== "undefined" && window.cancelIdleCallback
        ? window.cancelIdleCallback
        : clearTimeout;
    const callbackId = idleCallback(() => setIsRulerReady(true));

    return () => cancelIdleCallback(callbackId);
  }, []);

  const { majorPath, minorPath, spinePath } = useMemo(() => {
    if (!isRulerReady) {
      return { majorPath: "", minorPath: "", spinePath: "" };
    }

    let majorPath = "";
    let minorPath = "";
    const spineX = LABEL_WIDTH + rulerWidth - TICK_WIDTH / 2;
    const spinePath = `M ${spineX} 0 V ${tickCount * SNAP + viewportPadding * 2}`;

    TICKS.forEach((index) => {
      const major = index % majorTickInterval === 0;
      const y = viewportPadding + TICK_WIDTH / 2 + index * SNAP;
      const startX = LABEL_WIDTH + (major ? MAJOR_LINE_START_X : LINE_START_X);
      const path = `M ${startX} ${y} H ${spineX}`;

      if (major) {
        majorPath += path;
      } else {
        minorPath += path;
      }
    });

    return { majorPath, minorPath, spinePath };
  }, [
    TICKS,
    isRulerReady,
    SNAP,
    TICK_WIDTH,
    majorTickInterval,
    rulerWidth,
    tickCount,
    viewportPadding,
  ]);

  return !isRulerReady ? (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="black" />
    </View>
  ) : (
    <View className="items-center h-full">
      <View className="flex-row items-center">
        <AnimatedTextInput
          editable={false}
          animatedProps={textProps}
          className="text-[42px] font-mono text-black"
        />
        {props.unitLabel && (
          <Text className="text-[20px] font-montserrat mt-5">
            {props.unitLabel}
          </Text>
        )}
      </View>

      <GestureDetector gesture={pan}>
        <View
          className="w-full flex-1 bg-gray-200 overflow-hidden relative rounded-xl"
          onLayout={handleLayout}>
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
                <Path d={minorPath} stroke="#a3a3a3" strokeWidth={TICK_WIDTH} />
                <Path d={majorPath} stroke="#a3a3a3" strokeWidth={TICK_WIDTH} />
                <Path d={spinePath} stroke="#a3a3a3" strokeWidth={TICK_WIDTH} />
                {MAJOR_TICKS.map((index) => {
                  const y = viewportPadding + TICK_WIDTH / 2 + index * SNAP;

                  return (
                    <SvgText
                      key={index}
                      x={LABEL_WIDTH - 4}
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
            className="absolute w-full left-0 right-0 top-0 bottom-0 overflow-visible">
            <View
              className="absolute flex-row items-center overflow-visible"
              style={{
                top: centerTop.top + 2,
                right: RULER_OFFSET_LEFT - 3,
                width: "85%",
                transform: [{ translateY: "-50%" }],
              }}>
              <View className="rounded bg-black gap-2 flex-row px-3 py-0.5 justify-center items-center">
                <MoveVertical size={10} color="white" />
                <AnimatedTextInput
                  editable={false}
                  animatedProps={textProps}
                  className="font-montserrat text-white text-sm w-[55px] text-center"
                />
              </View>
              <View className="h-[3px] flex-1 bg-black" />
              <Circle size={10} fill="black" color="black" />
            </View>
          </View>
        </View>
      </GestureDetector>
    </View>
  );
});

import { LinearGradient } from "expo-linear-gradient";
import { cssInterop } from "nativewind";
import { memo, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Text, TextInput, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import Svg, { G, Path, Text as SvgText } from "react-native-svg";

import { DiamondIcon } from "lucide-react-native";
import { useWeightSliderRuler } from "./hooks/useWeightSliderRuler";
import { SliderRulerProps } from "./ruler";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
cssInterop(AnimatedTextInput, { className: "style" });

const LINE_START_Y = 64;
const MAJOR_LINE_START_Y = 48;

export const WeightSliderRuler = memo(function SliderRuler(
  props: SliderRulerProps,
) {
  const [isRulerReady, setIsRulerReady] = useState(false);
  const {
    formatTickValue,
    handleLayout,
    props: sliderProps,
    style: sliderStyle,
  } = useWeightSliderRuler(props);

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

  const { TICK_WIDTH, centerLeft, rulerHeight, rulerLeft, rulerStyle } =
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
    const callbackId = idleCallback(() => {
      setIsRulerReady(true);
    });

    return () => cancelIdleCallback(callbackId);
  }, []);

  const { majorPath, minorPath } = useMemo(() => {
    if (!isRulerReady) {
      return { majorPath: "", minorPath: "" };
    }

    let majorPath = "";
    let minorPath = "";

    TICKS.forEach((index) => {
      const major = index % majorTickInterval === 0;
      const x = viewportPadding + TICK_WIDTH / 2 + index * SNAP;
      const path = `M ${x} ${major ? MAJOR_LINE_START_Y : LINE_START_Y} V ${rulerHeight}`;

      if (major) {
        majorPath += path;
      } else {
        minorPath += path;
      }
    });

    return { majorPath, minorPath };
  }, [
    TICKS,
    isRulerReady,
    SNAP,
    TICK_WIDTH,
    majorTickInterval,
    rulerHeight,
    viewportPadding,
  ]);

  return !isRulerReady ? (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color={"black"} />
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
          className="w-full h-full overflow-hidden justify-end relative"
          onLayout={handleLayout}>
          {isRulerReady && (
            <Animated.View
              className="absolute bottom-0 h-full"
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
                    d={majorPath}
                    stroke="#404040"
                    strokeWidth={TICK_WIDTH}
                  />
                  {MAJOR_TICKS.map((index) => {
                    const x = viewportPadding + TICK_WIDTH / 2 + index * SNAP;

                    return (
                      <SvgText
                        key={index}
                        x={x}
                        y={rulerHeight + 10}
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
          )}

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
            className="absolute top-0 w-[3px] items-center"
            style={{
              ...centerLeft,
              height: rulerHeight,
            }}>
            <View className="w-fit h-1/4">
              <DiamondIcon
                fill={"#ef4444"}
                color={"#ef4444"}
                size={20}></DiamondIcon>
            </View>
            <View className="w-full h-2/4 bg-red-500"></View>
          </View>
        </View>
      </GestureDetector>
    </View>
  );
});

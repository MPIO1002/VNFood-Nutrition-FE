import { LinearGradient } from "expo-linear-gradient";
import { memo, useCallback, useMemo, useState } from "react";
import { LayoutChangeEvent, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { G, Text as SvgText } from "react-native-svg";

import { useHorizontalSliderRuler } from "./hooks/useHorizontalSliderRuler";
import { SliderRulerProps } from "./ruler";

const AnimatedG = Animated.createAnimatedComponent(G);

export interface NumberSliderRulerProps extends SliderRulerProps {
  rulerHeight?: number;
  numberFontSize?: number;
  activeNumberFontSize?: number;
  onFinishLoading?: () => void;
}

export const NumberSliderRuler = memo(function NumberSliderRuler({
  rulerHeight = 80,
  numberFontSize = 40,
  activeNumberFontSize = 60,
  tickGap = 90,
  onFinishLoading,
  ...props
}: NumberSliderRulerProps) {
  const [isRulerReady, setIsRulerReady] = useState(false);
  const [currentValue, setCurrentValue] = useState(props.initialValue);
  const internalScreenValue = useSharedValue(props.initialValue);
  const screenValue = props.screenValue ?? internalScreenValue;
  const step = props.step ?? 1;

  const currentIndex = useMemo(
    () => Math.round((currentValue - props.min) / step),
    [currentValue, props.min, step],
  );

  const startScale = numberFontSize / activeNumberFontSize;

  const {
    formatTickValue,
    UIProps: sliderProps,
    UIstyle: sliderStyle,
  } = useHorizontalSliderRuler({
    ...props,
    tickGap,
    screenValue,
    onChange: (value) => {
      setCurrentValue(value);
      props.onChange?.(value);
    },
  });

  const { ticks, SNAP, pan, tickCount, viewportPadding } = sliderProps;
  const { TICK_WIDTH, rulerLeft, rulerStyle, setContainerWidth } = sliderStyle;

  const textX = viewportPadding + TICK_WIDTH / 2 + currentIndex * SNAP;
  const textY = rulerHeight / 2 + activeNumberFontSize / 3;

  const activeScale = useDerivedValue(() => {
    const currentNumber = props.min + currentIndex * step;
    const distanceFromCenter =
      Math.abs(screenValue.value - currentNumber) / step;
    const targetScale = Math.max(startScale, 1 - distanceFromCenter);

    return withTiming(targetScale, {
      duration: 120,
      easing: Easing.out(Easing.cubic),
    });
  }, [currentIndex, props.min, startScale, step]);

  const activeProps = useAnimatedProps(
    () => ({
      transform: [{ scale: activeScale.value }],
    }),
    [activeScale],
  );

  const handleLayout = useCallback(
    ({ nativeEvent }: LayoutChangeEvent) => {
      setContainerWidth(nativeEvent.layout.width);

      if (nativeEvent.layout.width > 0) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsRulerReady(true);
            onFinishLoading?.();
          });
        });
      }
    },
    [onFinishLoading, setContainerWidth],
  );

  return (
    <View className="items-center h-full">
      <GestureDetector gesture={pan}>
        <View
          className="w-full flex-1 overflow-hidden justify-center relative"
          onLayout={handleLayout}>
          {isRulerReady && (
            <>
              <Animated.View
                className="absolute top-1/3"
                style={[rulerLeft, rulerStyle]}>
                <Svg
                  width={tickCount * SNAP + viewportPadding * 2}
                  height={rulerHeight}>
                  <G>
                    {ticks.map((index) => (
                      <SvgText
                        key={index}
                        x={viewportPadding + TICK_WIDTH / 2 + index * SNAP}
                        y={textY}
                        fill="#737373"
                        fontFamily="Montserrat_400Regular"
                        fillOpacity={index === currentIndex ? 0 : 1}
                        fontSize={numberFontSize}
                        fontWeight="400"
                        textAnchor="middle">
                        {formatTickValue(index)}
                      </SvgText>
                    ))}
                    <G
                      transform={[
                        { translateX: textX },
                        { translateY: textY },
                      ]}>
                      <AnimatedG animatedProps={activeProps}>
                        <SvgText
                          x={0}
                          y={0}
                          fill="#171717"
                          fontFamily="Montserrat_600SemiBold"
                          fontSize={activeNumberFontSize}
                          textAnchor="middle">
                          {formatTickValue(currentIndex)}
                        </SvgText>
                      </AnimatedG>
                    </G>
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
            </>
          )}
        </View>
      </GestureDetector>
    </View>
  );
});

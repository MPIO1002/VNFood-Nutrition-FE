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

import { useVerticalSliderRuler } from "./hooks/useVerticalSliderRuler";
import { SliderRulerProps } from "./ruler";

const AnimatedG = Animated.createAnimatedComponent(G);

export interface NumberSliderRulerProps extends SliderRulerProps {
  rulerWidth?: number;
  numberFontSize?: number;
  activeNumberFontSize?: number;
  onFinishLoading?: () => void;
}

export const NumberSliderRuler = memo(function NumberSliderRuler({
  rulerWidth = 160,
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
  } = useVerticalSliderRuler({
    ...props,
    tickGap,
    screenValue,
    onChange: (value) => {
      setCurrentValue(value);
      props.onChange?.(value);
    },
  });

  const { ticks, SNAP, pan, tickCount, viewportPadding } = sliderProps;
  const { TICK_HEIGHT, rulerTop, rulerStyle, setContainerHeight } = sliderStyle;

  const textX = rulerWidth / 2;
  const textY =
    viewportPadding +
    TICK_HEIGHT / 2 +
    currentIndex * SNAP +
    activeNumberFontSize / 3;

  const activeScale = useDerivedValue(() => {
    const currentNumber = props.min + currentIndex * step;
    const distanceFromCenter =
      Math.abs(screenValue.value - currentNumber) / step;
    const targetScale = Math.max(startScale, 1 - distanceFromCenter);

    return withTiming(targetScale, {
      duration: 200,
      easing: Easing.out(Easing.cubic),
    });
  }, [currentIndex, props.min, startScale, step]);

  const activeProps = useAnimatedProps(() => {
    const centerOffset = -activeNumberFontSize / 3;

    return {
      transform: [
        { translateY: centerOffset },
        { scale: activeScale.value },
        { translateY: -centerOffset },
      ],
    };
  }, [activeNumberFontSize, activeScale]);

  const handleLayout = useCallback(
    ({ nativeEvent }: LayoutChangeEvent) => {
      setContainerHeight(nativeEvent.layout.height);

      if (nativeEvent.layout.height > 0) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsRulerReady(true);
            onFinishLoading?.();
          });
        });
      }
    },
    [onFinishLoading, setContainerHeight],
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
                className="absolute"
                style={[
                  rulerTop,
                  rulerStyle,
                  {
                    left: "50%",
                    marginLeft: -rulerWidth / 2,
                  },
                ]}>
                <Svg
                  width={rulerWidth}
                  height={tickCount * SNAP + viewportPadding * 2}>
                  <G>
                    {ticks.map((index) => (
                      <SvgText
                        key={index}
                        x={textX}
                        y={
                          viewportPadding +
                          TICK_HEIGHT / 2 +
                          index * SNAP +
                          numberFontSize / 3
                        }
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
                colors={["rgba(255,255,255,0)", "white"]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={{
                  position: "absolute",
                  right: 0,
                  left: 0,
                  bottom: 0,
                  height: 48,
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

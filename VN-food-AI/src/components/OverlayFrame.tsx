import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export function OverlayFrame({
  shape,
  widthRatio,
  heightRatio,
}: {
  shape: 'circle' | 'rect';
  widthRatio: number;
  heightRatio: number;
}) {
  const [sz, setSz] = useState({ w: 0, h: 0 });
  const animVal = useRef(new Animated.Value(shape === 'circle' ? 0 : 1)).current;

  useEffect(() => {
    Animated.timing(animVal, {
      toValue: shape === 'circle' ? 0 : 1,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [shape]);

  const circleSize = Math.min(sz.w, sz.h) * 0.72;
  const boxW       = sz.w * widthRatio;
  const boxH       = sz.h * heightRatio;

  const circleTop  = (sz.h - circleSize) / 2;
  const circleLeft = (sz.w - circleSize) / 2;
  const boxTop     = (sz.h - boxH) / 2;
  const boxLeft    = (sz.w - boxW) / 2;

  const animWidth  = animVal.interpolate({ inputRange: [0, 1], outputRange: [circleSize, boxW] });
  const animHeight = animVal.interpolate({ inputRange: [0, 1], outputRange: [circleSize, boxH] });
  const animTop    = animVal.interpolate({ inputRange: [0, 1], outputRange: [circleTop,   boxTop] });
  const animLeft   = animVal.interpolate({ inputRange: [0, 1], outputRange: [circleLeft,  boxLeft] });
  const animRadius = animVal.interpolate({ inputRange: [0, 1], outputRange: [circleSize / 2, 18] });

  return (
    <View
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
      onLayout={e => {
        const { width, height } = e.nativeEvent.layout;
        setSz({ w: width, h: height });
      }}
    >
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.38)' }]} />
      {sz.w > 0 && (
        <Animated.View
          style={[
            styles.frameBox,
            {
              position: 'absolute',
              top: animTop,
              left: animLeft,
              width: animWidth,
              height: animHeight,
              borderRadius: animRadius,
            },
          ]}
        >
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
        </Animated.View>
      )}
      <View style={styles.guideTextWrap}>
        <Text style={styles.guideText}>
          Để điện thoại song song mặt bàn, đưa món ăn vừa vặn vào khung
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frameBox: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.85)',
    borderStyle: 'dashed',
  },
  corner: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderColor: '#FFFFFF',
    borderWidth: 3,
  },
  cornerTL: { top: -2, left: -2, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 6 },
  cornerTR: { top: -2, right: -2, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 6 },
  cornerBL: { bottom: -2, left: -2, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 6 },
  cornerBR: { bottom: -2, right: -2, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 6 },
  guideTextWrap: {
    position: 'absolute',
    bottom: 14,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  guideText: {
    color: 'rgba(255,255,255,0.93)',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Montserrat-Medium',
    backgroundColor: 'rgba(0,0,0,0.48)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    overflow: 'hidden',
  },
});

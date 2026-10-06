import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, PanResponder, StyleSheet } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { MIN_SIZE, MAX_SIZE } from '../constants/containers';

export function SwipeSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const trackRef   = useRef<View>(null);
  const trackWidth = useRef(0);
  const trackPageX = useRef(0);
  const lastEmitted = useRef(value);

  useEffect(() => { lastEmitted.current = value; }, [value]);

  const xToValue = (relX: number): number => {
    const clamped = Math.max(0, Math.min(trackWidth.current, relX));
    const raw = (clamped / trackWidth.current) * (MAX_SIZE - MIN_SIZE) + MIN_SIZE;
    return Math.round(raw);
  };

  const tryEmit = (relX: number) => {
    if (trackWidth.current <= 0) return;
    const newVal = xToValue(relX);
    if (newVal !== lastEmitted.current) {
      lastEmitted.current = newVal;
      onChange(newVal);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        trackRef.current?.measure((_x, _y, _w, _h, pageX) => {
          trackPageX.current = pageX;
          tryEmit(evt.nativeEvent.pageX - pageX);
        });
      },
      onPanResponderMove: (_evt, gestureState) => {
        tryEmit(gestureState.moveX - trackPageX.current);
      },
    }),
  ).current;

  const percent = ((value - MIN_SIZE) / (MAX_SIZE - MIN_SIZE)) * 100;

  return (
    <View style={styles.sliderRow}>
      <View className="flex-row items-center justify-between mb-1.5">
        <Text className="font-montserrat-semibold text-xs text-zinc-500 uppercase tracking-widest">
          {label}
        </Text>
        <Text className="font-montserrat-bold text-sm text-charcoal-pure">{value} cm</Text>
      </View>

      <View className="flex-row items-center gap-3">
        <TouchableOpacity
          onPress={() => onChange(Math.max(MIN_SIZE, value - 1))}
          style={styles.sliderBtn}
          activeOpacity={0.7}
        >
          <Minus size={14} color="#18181B" />
        </TouchableOpacity>

        <View
          ref={trackRef}
          style={styles.trackOuter}
          onLayout={e => {
            trackWidth.current = e.nativeEvent.layout.width;
            trackRef.current?.measure((_x, _y, _w, _h, pageX) => {
              trackPageX.current = pageX;
            });
          }}
          {...panResponder.panHandlers}
        >
          <View style={[styles.trackFill, { width: `${percent}%` }]} />
          <View style={[styles.thumb, { left: `${percent}%` }]} />
        </View>

        <TouchableOpacity
          onPress={() => onChange(Math.min(MAX_SIZE, value + 1))}
          style={styles.sliderBtn}
          activeOpacity={0.7}
        >
          <Plus size={14} color="#18181B" />
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between mt-1">
        <Text className="font-montserrat-medium text-[10px] text-zinc-400">{MIN_SIZE} cm</Text>
        <Text className="font-montserrat-medium text-[10px] text-zinc-400">{MAX_SIZE} cm</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sliderRow: {
    backgroundColor: '#F4F4F5',
    borderRadius: 20,
    padding: 14,
  },
  sliderBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  trackOuter: {
    flex: 1,
    height: 6,
    backgroundColor: '#E4E4E7',
    borderRadius: 3,
    position: 'relative',
    justifyContent: 'center',
  },
  trackFill: {
    position: 'absolute',
    left: 0,
    height: 6,
    backgroundColor: '#18181B',
    borderRadius: 3,
  },
  thumb: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#18181B',
    marginLeft: -9,
    top: -6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
  },
});

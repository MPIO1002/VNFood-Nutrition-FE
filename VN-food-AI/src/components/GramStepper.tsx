import React from 'react';
import { Pressable, TextInput, View, Text } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';

interface GramStepperProps {
  value: number;
  step: number;
  onChange: (v: number) => void;
  className?: string;
}

export function GramStepper({ value, step, onChange, className }: GramStepperProps) {
  return (
    <View className={`flex-row items-center bg-zinc-100 rounded-full p-1 border border-border-hairline shrink-0 ${className || ''}`}>
      <Pressable
        className="w-7 h-7 rounded-full bg-canvas-white items-center justify-center shadow-sm"
        onPress={() => onChange(Math.max(0, value - step))}
      >
        <Minus size={15} color="#18181B" />
      </Pressable>
      <View className="flex-row items-baseline px-2 min-w-[46px] justify-center">
        <TextInput
          className="font-montserrat-bold text-[13px] text-charcoal-pure text-center p-0 m-0"
          keyboardType="numeric"
          value={String(value)}
          onChangeText={(text) => {
            const num = parseInt(text, 10);
            if (!isNaN(num)) onChange(num);
            else if (text === '') onChange(0);
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        />
        <Text className="font-montserrat-bold text-[13px] text-charcoal-pure">g</Text>
      </View>
      <Pressable
        className="w-7 h-7 rounded-full bg-canvas-white items-center justify-center shadow-sm"
        onPress={() => onChange(value + step)}
      >
        <Plus size={15} color="#18181B" />
      </Pressable>
    </View>
  );
}

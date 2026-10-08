import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Package } from 'lucide-react-native';
import { CONTAINERS, ContainerConfig } from '../constants/containers';

interface Props {
  selectedContainer: ContainerConfig;
  onSelectContainer: (c: ContainerConfig) => void;
}

export function ContainerSelector({ selectedContainer, onSelectContainer }: Props) {
  return (
    <View className="mt-4 mb-2">
      <View className="flex-row items-end justify-between px-4 mb-3">
        <View className="flex-row items-center gap-1.5">
          <Package size={18} color="#18181B" />
          <Text className="font-montserrat-bold text-charcoal-pure text-base">Đồ đựng</Text>
        </View>
        <Text className="font-montserrat-medium text-zinc-500 text-[11px] mb-0.5">
          Chọn để AI ước lượng tốt hơn
        </Text>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.containerRow}
      >
        {CONTAINERS.map(c => {
          const active = c.key === selectedContainer.key;
          const IconComponent = c.icon;
          return (
            <TouchableOpacity
              key={c.key}
              onPress={() => onSelectContainer(c)}
              activeOpacity={0.75}
              style={[styles.chip, active && styles.chipActive]}
            >
              <IconComponent size={24} color={active ? '#FFFFFF' : '#52525B'} strokeWidth={1.5} />
              <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>
                {c.label}
              </Text>
              <Text style={[styles.chipSubtitle, active && styles.chipSubtitleActive]}>
                {c.subtitle}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  containerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 2,
  },
  chip: {
    paddingHorizontal: 12,
    minWidth: 72,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F4F4F5',
    borderWidth: 1.5,
    borderColor: 'transparent',
    gap: 3,
  },
  chipActive: {
    backgroundColor: '#18181B',
    borderColor: '#18181B',
  },
  chipLabel: {
    fontSize: 11,
    color: '#52525B',
    fontFamily: 'Montserrat-SemiBold',
  },
  chipLabelActive: {
    color: '#FFFFFF',
  },
  chipSubtitle: {
    fontSize: 9,
    color: '#A1A1AA',
    fontFamily: 'Montserrat-Medium',
  },
  chipSubtitleActive: {
    color: '#D4D4D8',
  },
});

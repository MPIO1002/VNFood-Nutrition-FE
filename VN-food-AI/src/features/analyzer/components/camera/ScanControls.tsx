import React from "react";
import { View, TouchableOpacity } from "react-native";
import { ImagePlus, SwitchCamera, X } from "lucide-react-native";
import { PressScale } from "@/components/PressScale";

export interface ScanControlsProps {
  hasImage: boolean;
  onPickImage: () => void;
  onShutter: () => void;
  onToggleFacing: () => void;
}

export function ScanControls({ hasImage, onPickImage, onShutter, onToggleFacing }: ScanControlsProps) {
  return (
    <View className="flex-row items-center justify-center gap-10 mt-5 mb-6">
      {/* Gallery Button */}
      <PressScale onPress={onPickImage}>
        <View className="w-14 h-14 rounded-full bg-zinc-100 items-center justify-center border border-zinc-200">
          <ImagePlus size={22} color="#18181B" />
        </View>
      </PressScale>

      {/* Main Shutter / Retake Button */}
      <TouchableOpacity
        onPress={onShutter}
        activeOpacity={0.8}
        className="w-20 h-20 rounded-full border-[8px] border-[#333333] items-center justify-center"
      >
        <View className="w-[66px] h-[66px] rounded-full bg-white items-center justify-center">
          {hasImage ? <X size={28} color="#333333" /> : null}
        </View>
      </TouchableOpacity>

      {/* Flip Camera Button */}
      <PressScale onPress={onToggleFacing}>
        <View className="w-14 h-14 rounded-full bg-zinc-100 items-center justify-center border border-zinc-200">
          <SwitchCamera size={22} color="#18181B" />
        </View>
      </PressScale>
    </View>
  );
}
import { Macros } from "@/features/analyzer";
import debounce from "lodash.debounce";
import { useEffect, useMemo, useState } from "react";
import { Text, TextInput, View } from "react-native";

export interface NutritionBoxProps {
  name: Macros;
  title: string;
  value: number;
  disabled?: boolean;
  onValueChanged?: (value: number) => void;
}

export default function MarcrosBox({
  name,
  title,
  value,
  disabled,
  onValueChanged,
}: NutritionBoxProps) {
  const [textValue, setTextValue] = useState(`${value}`);
  const MACROS_OPTIONS = {
    min: 0,
    max: name === "calories" ? 1000 : 100,
    step: 10,
    getMacrosValue: (text: string) => {
      const v = Number(text);
      if (v < MACROS_OPTIONS.min || !text) return MACROS_OPTIONS.min;
      else if (v > MACROS_OPTIONS.max) return MACROS_OPTIONS.max;

      return v;
    },
  } as const;

  const handleValueChange = useMemo(
    () =>
      debounce((v: number) => {
        onValueChanged?.(v);
      }, 300),
    [onValueChanged],
  );

  useEffect(() => {
    return () => handleValueChange.cancel();
  }, [handleValueChange]);

  const handleUpdateValue = (input: string) => {
    if (input === "") {
      setTextValue("");
      return;
    }

    const cleaned = input
      .replace(",", ".")
      .replace(/[^0-9.]/g, "")
      .replace(/^(\d*\.?\d?).*$/, "$1");

    const value = MACROS_OPTIONS.getMacrosValue(cleaned);
    setTextValue(cleaned);
    handleValueChange(value);
  };

  const handleInputBlur = () => {
    const v = MACROS_OPTIONS.getMacrosValue(textValue);
    setTextValue(`${v}`);
    handleValueChange(v);
  };

  return (
    <View
      onStartShouldSetResponder={() => true}
      className={`items-center px-3 py-2.5 rounded-2xl w-[68px] bg-zinc-50 border border-zinc-100 ${disabled && "opacity-70"}`}>
      <Text className="font-montserrat-bold text-xs text-zinc-500">
        {title}
      </Text>
      <View className="flex-row items-center relative">
        <TextInput
          editable={!disabled}
          value={textValue}
          onChangeText={(text) => handleUpdateValue(text)}
          onBlur={() => handleInputBlur()}
          keyboardType="numeric"
          maxLength={name === "calories" ? 6 : 5}
          textAlign="center"
          className="font-montserrat-bold text-charcoal-pure w-14 p-0 m-0 border-0 z-0"
          style={{
            textAlignVertical: "center",
            includeFontPadding: false,
          }}
        />
      </View>
    </View>
  );
}

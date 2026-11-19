import { Input } from "@/components/ui/input";
import { LegendList } from "@legendapp/list/react-native";
import { Portal } from "@rn-primitives/portal";
import { useCallback, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useIngredient } from "../hooks/useIngredient";
import IngredientItemBox from "./IngredientItemBox";

export interface IngredientPickerScreenProps {
  selectedIngredientIds: number[];
}

export default function IngredientPickerScreen({
  selectedIngredientIds,
}: IngredientPickerScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const formatId = (id: number) => {
    return `ingredient-${id}`;
  };

  const { ingredients, searchQueryDebounce } = useIngredient();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => {
    const ids = selectedIngredientIds.map((id) => formatId(id));
    return new Set(ids);
  });

  const toggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  return (
    <Portal name="ingredient-picker">
      <SafeAreaView edges={["top", "bottom"]} className="bg-surface z-10">
        <View className="w-full h-full bg-surface gap-10 px-5">
          <View className="w-full px-2 mt-5">
            <Input
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                searchQueryDebounce(text);
              }}
              placeholder="Tìm kiếm nguyên liệu"
              style={{
                includeFontPadding: false,
                textAlignVertical: "center",
              }}
              className="border-0 border-b-2 rounded-xl bg-transparent text-black font-montserrat px-2 py-0"
            />
          </View>
          <View className="w-full flex-1 rounded-3xl bg-white overflow-hidden px-1">
            <View className="w-full p-2">
              <Text className="font-montserrat-semibold text-xl">
                Danh sách thành phần
              </Text>
            </View>
            <LegendList
              data={ingredients}
              extraData={selectedIds}
              keyExtractor={(item) => `ingredient-${item.id}`}
              recycleItems
              ItemSeparatorComponent={() => <View className="h-2 w-full" />}
              renderItem={({ item }) => (
                <IngredientItemBox
                  data={item}
                  activated={selectedIds.has(formatId(item.id))}
                  onPress={() => toggle(formatId(item.id))}
                />
              )}
            />
          </View>
        </View>
      </SafeAreaView>
    </Portal>
  );
}

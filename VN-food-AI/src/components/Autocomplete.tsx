import { LegendList } from "@legendapp/list/react-native";
import { Portal } from "@rn-primitives/portal";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  Text,
  TextInput,
  View,
  ViewInstance,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeOutUp,
  LinearTransition,
} from "react-native-reanimated";

const ITEM_HEIGHT = 48;
const MAX_LIST_HEIGHT = 240;

type AutocompleteProps<T> = {
  data: T[];
  getLabel: (item: T) => string;
  onQueryChange: (query: string) => void;
  query: string;
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
  placeholder?: string;
  showIsEmpty?: boolean;
  className?: string;
  inputClassName?: string;
  onSelect?: (item: T) => void;
  onEndReached?: () => void;
  onBlur?: () => void;
  onFocus?: () => void;
  dropPosition?: "top" | "bottom";
  listWidthExpand?: number;
};

export function Autocomplete<T>({
  data,
  getLabel,
  onSelect,
  query,
  onQueryChange,
  onEndReached,
  onFocus,
  onBlur,
  isLoading = false,
  isFetchingNextPage = false,
  showIsEmpty = true,
  placeholder = "Search...",
  className,
  inputClassName,
  dropPosition = "bottom",
  listWidthExpand = 0,
}: AutocompleteProps<T>) {
  const [open, setOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    left: 0,
    top: 0,
    width: 0,
  });
  const inputContainerRef = useRef<ViewInstance>(null);

  const hasQuery = query.trim().length > 0;
  const isEmpty = hasQuery && !isLoading && data.length === 0;
  const showList = open && hasQuery && !isEmpty;
  const desiredDropdownHeight =
    isLoading && data.length === 0
      ? ITEM_HEIGHT
      : Math.min(data.length * ITEM_HEIGHT, MAX_LIST_HEIGHT);
  const availableHeightAbove = Math.max(0, dropdownPosition.top - 8);
  const dropdownHeight =
    dropPosition === "top"
      ? Math.min(desiredDropdownHeight, availableHeightAbove)
      : desiredDropdownHeight;
  const dropdownTop =
    dropPosition === "top"
      ? dropdownPosition.top - dropdownHeight - ITEM_HEIGHT
      : dropdownPosition.top + 4;
  const noResultHeight =
    dropPosition === "top"
      ? Math.min(ITEM_HEIGHT, availableHeightAbove)
      : ITEM_HEIGHT;
  const noResultTop =
    dropPosition === "top"
      ? dropdownPosition.top - noResultHeight - 4
      : dropdownPosition.top + 4;

  useEffect(() => {
    if (!showList) return;

    inputContainerRef.current?.measureInWindow((left, top, width, height) => {
      setDropdownPosition({
        left,
        top: top + height,
        width: width + listWidthExpand,
      });
    });
  }, [showList, query, data.length]);

  const handleSelect = (item: T) => {
    onQueryChange(getLabel(item));
    setOpen(false);
    Keyboard.dismiss();
    onSelect?.(item);
  };

  const handleQueryChange = (text: string) => {
    onQueryChange(text);
    setOpen(true);
  };

  return (
    <View
      ref={inputContainerRef}
      className={`z-10 ${className ?? ""} relative`}>
      <TextInput
        value={query}
        onChangeText={handleQueryChange}
        onFocus={() => {
          onFocus?.();
          setOpen(true);
        }}
        onBlur={() => {
          onBlur?.();
          setOpen(false);
        }}
        placeholder={placeholder}
        placeholderTextColor="#a1a1aa"
        autoCorrect={false}
        autoCapitalize="none"
        className={`px-3 py-3 ${inputClassName || ""}`}
      />

      {isEmpty && showIsEmpty && (
        <Portal name="autocomplete-noresult">
          <Animated.View
            entering={FadeInDown.duration(150)}
            exiting={FadeOutUp.duration(120)}
            layout={LinearTransition.duration(150)}
            style={{
              position: "absolute",
              left: dropdownPosition.left,
              top: noResultTop,
              width: dropdownPosition.width,
              zIndex: 1000,
              elevation: 20,
            }}
            className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
            <View
              style={{ height: ITEM_HEIGHT }}
              className="justify-center px-3">
              <Text className="text-base text-zinc-500">
                Không có kết quả nào
              </Text>
            </View>
          </Animated.View>
        </Portal>
      )}

      {showList && (
        <Portal name="autocomplete">
          <Animated.View
            entering={FadeInDown.duration(150)}
            exiting={FadeOutUp.duration(120)}
            layout={LinearTransition.duration(150)}
            style={{
              position: "absolute",
              left: dropdownPosition.left,
              top: dropdownTop,
              width: dropdownPosition.width,
              height: dropdownHeight,
              zIndex: 1000,
              elevation: 20,
            }}
            className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
            {isLoading && data.length === 0 ? (
              <View
                style={{ height: ITEM_HEIGHT }}
                className="items-center justify-center">
                <ActivityIndicator />
              </View>
            ) : (
              <LegendList
                data={data}
                keyExtractor={(item, index) => `${getLabel(item)}-${index}`}
                recycleItems
                scrollEnabled
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
                style={{
                  height: dropdownHeight,
                }}
                ListFooterComponent={
                  isFetchingNextPage ? (
                    <View
                      style={{ height: ITEM_HEIGHT }}
                      className="items-center justify-center">
                      <ActivityIndicator />
                    </View>
                  ) : null
                }
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => handleSelect(item)}
                    style={{ height: ITEM_HEIGHT }}
                    className="justify-center px-3 active:bg-zinc-100 dark:active:bg-zinc-800">
                    <Text
                      className="text-base text-zinc-900 dark:text-zinc-100"
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      {getLabel(item)}
                    </Text>
                  </Pressable>
                )}
              />
            )}
          </Animated.View>
        </Portal>
      )}
    </View>
  );
}

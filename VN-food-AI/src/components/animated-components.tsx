import { cssInterop } from "nativewind";
import { TextInput } from "react-native";
import Animated from "react-native-reanimated";

export const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
cssInterop(AnimatedTextInput, { className: "style" });

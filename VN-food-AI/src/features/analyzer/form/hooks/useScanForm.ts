import * as ImagePicker from "expo-image-picker";
import type { CameraType } from "expo-camera";
import { useState } from "react";
import { AnalyzeRequestInput, AnalyzeRequestSchema } from "@/features/analyzer/validation/analyzeSchema";
import { useAnalyzer } from "../../hooks/useAnalyzer";
import type { AnalyzeResult } from "@/features/analyzer/mapping/analyzeMapper";
import { CONTAINER_KEYS, type ContainerKey } from "@/constants/containers";

export type ScanFormState = {
  activeImageUri: string | null;
  selectedContainer: ContainerKey;
  result: AnalyzeResult | null;
  totals: { kcal: number; protein: number; carbs: number; fat: number };
  isAnalyzing: boolean;
  error: Error | null;
  warnings: string[];
};

export type ScanFormHandlers = {
  pickImage: () => Promise<void>;
  takePicture: () => Promise<void>;
  retake: () => void;
  setContainer: (container: string) => void;
  submit: () => Promise<import("@/features/analyzer/mapping/analyzeMapper").AnalyzeResult | null>;
  toggleFacing: () => void;
  cameraFacing: CameraType;
  updateName: (idx: number, name: string) => void;
  updateWeight: (idx: number, weight: number) => void;
  adjustWeight: (idx: number, delta: number) => void;
  removeComponent: (idx: number) => void;
  addComponent: () => void;
};

export function useScanForm(initialImageUri?: string): ScanFormState & ScanFormHandlers {
  const [activeImageUri, setActiveImageUri] = useState<string | null>(
    initialImageUri || null,
  );
  const [selectedContainer, setSelectedContainer] = useState<ContainerKey>("chen");
  const [cameraType, setCameraType] = useState<ImagePicker.CameraType>(
    ImagePicker.CameraType.back,
  );
  const { analyze, isAnalyzing, error, reset } = useAnalyzer();
  const [warnings, setWarnings] = useState<string[]>([]);
  const [result, setResult] = useState<AnalyzeResult | null>(null);

  const pickImage = async () => {
    // Expo ImagePicker logic - simplified
    // In real implementation, use expo-image-picker
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setWarnings(["Không có quyền truy cập camera"]);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setActiveImageUri(result.assets[0]?.uri ?? null);
      setWarnings([]);
    }
  };

  const takePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      setWarnings(["Không có quyền truy cập camera"]);
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      cameraType,
    });
    if (!result.canceled) {
      setActiveImageUri(result.assets[0]?.uri ?? null);
      setWarnings([]);
    }
  };

  const retake = () => {
    setActiveImageUri(null);
    setWarnings([]);
    // Reset form state
    reset();
  };

  const setContainer = (container: string) => {
    if (CONTAINER_KEYS.includes(container as ContainerKey)) {
      setSelectedContainer(container as ContainerKey);
    }
  };

  const submit = async (): Promise<AnalyzeResult | null> => {
    if (!activeImageUri) return null;

    try {
      const input: AnalyzeRequestInput = {
        imageUri: activeImageUri,
        containerType: selectedContainer,
        responseFormat: "full",
      };

      // Validate input thông qua schema
      const parsed = AnalyzeRequestSchema.safeParse(input);
      if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ");
      }

      const analyzedResult = await analyze(input);
      setWarnings(analyzedResult ? analyzedResult.warnings || [] : ["AI không nhận diện được món ăn trong ảnh"]);
      setResult(analyzedResult);
      return analyzedResult;
    } catch (e: any) {
      setWarnings([e.message || "Có lỗi xảy ra khi phân tích"]);
      return null;
    }
  };

  const toggleFacing = () => {
    setCameraType((current) =>
      current === ImagePicker.CameraType.back
        ? ImagePicker.CameraType.front
        : ImagePicker.CameraType.back,
    );
  };

  const updateName = (idx: number, name: string) => {
    setResult((previous) => {
      if (!previous?.nutrition) return previous;
      const components = [...previous.nutrition.components];
      if (!components[idx]) return previous;
      components[idx] = { ...components[idx], name };
      return { ...previous, nutrition: { ...previous.nutrition, components } };
    });
  };

  const updateWeight = (idx: number, weight: number) => {
    setResult((previous) => {
      if (!previous?.nutrition) return previous;
      const components = [...previous.nutrition.components];
      const component = components[idx];
      if (!component) return previous;
      const ratio = component.originalWeight > 0 ? weight / component.originalWeight : 0;
      components[idx] = {
        ...component,
        weight,
        calories: Math.round(component.originalCalories * ratio),
        protein: Math.round(component.originalProtein * ratio),
        fat: Math.round(component.originalFat * ratio),
        carbs: Math.round(component.originalCarbs * ratio),
      };
      return {
        ...previous,
        nutrition: {
          ...previous.nutrition,
          components,
          calories: components.reduce((sum, item) => sum + item.calories, 0),
          protein: components.reduce((sum, item) => sum + item.protein, 0),
          fat: components.reduce((sum, item) => sum + item.fat, 0),
          carbs: components.reduce((sum, item) => sum + item.carbs, 0),
        },
      };
    });
  };

  const adjustWeight = (idx: number, delta: number) => {
    const component = result?.nutrition?.components[idx];
    if (component) updateWeight(idx, Math.max(0, component.weight + delta));
  };

  const removeComponent = (idx: number) => {
    setResult((previous) => {
      if (!previous?.nutrition) return previous;
      const components = previous.nutrition.components.filter((_, index) => index !== idx);
      return { ...previous, nutrition: { ...previous.nutrition, components } };
    });
  };

  const addComponent = () => {
    setResult((previous) => {
      if (!previous?.nutrition) return previous;
      const component = {
        name: "Nguyên liệu mới",
        weight: 100,
        calories: 100,
        protein: 0,
        fat: 0,
        carbs: 0,
        originalWeight: 100,
        originalCalories: 100,
        originalProtein: 0,
        originalFat: 0,
        originalCarbs: 0,
      };
      return {
        ...previous,
        nutrition: {
          ...previous.nutrition,
          components: [...previous.nutrition.components, component],
        },
      };
    });
  };

  return {
    activeImageUri,
    selectedContainer,
    result,
    totals: result?.nutrition
      ? {
          kcal: result.nutrition.calories,
          protein: result.nutrition.protein,
          carbs: result.nutrition.carbs,
          fat: result.nutrition.fat,
        }
      : { kcal: 0, protein: 0, carbs: 0, fat: 0 },
    isAnalyzing,
    error,
    pickImage,
    takePicture,
    retake,
    setContainer,
    submit,
    toggleFacing,
    updateName,
    updateWeight,
    adjustWeight,
    removeComponent,
    addComponent,
    warnings,
    cameraFacing: cameraType,
  };
}
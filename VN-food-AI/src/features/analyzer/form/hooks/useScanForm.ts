import { MealCreateRequest, MealResponse } from "@/api/generated/model";
import { APIMutatorOptions } from "@/api/types/api";
import { CONTAINER_KEYS, type ContainerKey } from "@/constants/containers";
import type { AnalyzeResult } from "@/features/analyzer/mapping/analyzeMapper";
import {
  AnalyzeRequestInput,
  AnalyzeRequestSchema,
} from "@/features/analyzer/validation/analyzeSchema";
import { useMeal } from "@/features/meal/hooks/useMeal";
import type { CameraType, CameraView } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { RefObject, useCallback, useState } from "react";
import { MealType } from "../../components/result/MealTypeSelect";
import { useAnalyzer } from "../../hooks/useAnalyzer";

export type ScanFormState = {
  activeImageUri: string | null;
  selectedContainer: ContainerKey;
  result: AnalyzeResult | null;
  totals: { kcal: number; protein: number; carbs: number; fat: number };
  isTakingPicture: boolean;
  isAnalyzing: boolean;
  error: Error | null;
  warnings: string[];
};

export type ScanFormHandlers = {
  pickImage: () => Promise<void>;
  takePicture: () => Promise<void>;
  retake: () => void;
  setContainer: (container: string) => void;
  submit: () => Promise<
    import("@/features/analyzer/mapping/analyzeMapper").AnalyzeResult | null
  >;
  toggleFacing: () => void;
  cameraFacing: CameraType;
  updateName: (idx: number, name: string) => void;
  updateWeight: (idx: number, weight: number) => void;
  adjustWeight: (idx: number, delta: number) => void;
  removeComponent: (idx: number) => void;
  addComponent: () => void;
  setMealType: (type: MealType) => void;
  onSaveMeal: (
    options?: APIMutatorOptions<MealResponse, MealCreateRequest>,
  ) => void;
};

export function useScanForm(
  cameraRef: RefObject<CameraView | null>,
  initialImageUri?: string,
): ScanFormState & ScanFormHandlers {
  const [activeImageUri, setActiveImageUri] = useState<string | null>(
    initialImageUri || null,
  );
  const [mealType, setMealType] = useState<MealType>("breakfast");
  const [selectedContainer, setSelectedContainer] =
    useState<ContainerKey>("chen");
  const [cameraType, setCameraType] = useState<ImagePicker.CameraType>(
    ImagePicker.CameraType.back,
  );
  const { analyze, isAnalyzing, error, reset } = useAnalyzer();
  const { handleCreateMeal } = useMeal();
  const [warnings, setWarnings] = useState<string[]>([]);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [isTaking, setIsTaking] = useState(false);

  const pickImage = useCallback(async () => {
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
  }, []);

  const takePicture = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      setWarnings(["Không có quyền truy cập camera"]);
      return;
    }

    setIsTaking(true);
    try {
      const camera = cameraRef.current;
      if (!camera) {
        setWarnings(["Camera chưa sẵn sàng, vui lòng thử lại"]);
        return;
      }

      const result = await camera.takePictureAsync({
        quality: 0.8,
        skipProcessing: true,
      });

      if (!result?.uri) {
        setWarnings(["Không thể lưu ảnh từ camera, vui lòng thử lại"]);
        return;
      }

      setActiveImageUri(result.uri);
      setWarnings([]);
    } catch (error) {
      setWarnings([
        error instanceof Error
          ? error.message
          : "Không thể chụp ảnh, vui lòng thử lại",
      ]);
    } finally {
      setIsTaking(false);
    }
  }, [cameraRef]);

  const retake = useCallback(() => {
    setActiveImageUri(null);
    setWarnings([]);
    setResult(null);
    setMealType("breakfast");
    // Reset form state
    reset();
  }, [reset]);

  const setContainer = useCallback((container: string) => {
    if (CONTAINER_KEYS.includes(container as ContainerKey)) {
      setSelectedContainer(container as ContainerKey);
    }
  }, []);

  const submit = useCallback(async (): Promise<AnalyzeResult | null> => {
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
        throw new Error(
          parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ",
        );
      }

      const analyzedResult = await analyze(input);
      setWarnings(
        analyzedResult
          ? analyzedResult.warnings || []
          : ["AI không nhận diện được món ăn trong ảnh"],
      );
      setResult(analyzedResult);
      return analyzedResult;
    } catch (e: any) {
      setWarnings([e.message || "Có lỗi xảy ra khi phân tích"]);
      return null;
    }
  }, [activeImageUri, analyze, selectedContainer]);

  const toggleFacing = useCallback(() => {
    setCameraType((current) =>
      current === ImagePicker.CameraType.back
        ? ImagePicker.CameraType.front
        : ImagePicker.CameraType.back,
    );
  }, []);

  const updateName = useCallback((idx: number, name: string) => {
    setResult((previous) => {
      if (!previous?.nutrition) return previous;
      const components = [...previous.nutrition.components];
      if (!components[idx]) return previous;
      components[idx] = { ...components[idx], name };
      return { ...previous, nutrition: { ...previous.nutrition, components } };
    });
  }, []);

  const updateWeight = useCallback((idx: number, weight: number) => {
    setResult((previous) => {
      if (!previous?.nutrition) return previous;
      const components = [...previous.nutrition.components];
      const component = components[idx];
      if (!component) return previous;
      const ratio =
        component.originalWeight > 0 ? weight / component.originalWeight : 0;
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
  }, []);

  const adjustWeight = useCallback(
    (idx: number, delta: number) => {
      const component = result?.nutrition?.components[idx];
      if (component) updateWeight(idx, Math.max(0, component.weight + delta));
    },
    [result, updateWeight],
  );

  const removeComponent = useCallback((idx: number) => {
    setResult((previous) => {
      if (!previous?.nutrition) return previous;
      const components = previous.nutrition.components.filter(
        (_, index) => index !== idx,
      );
      return { ...previous, nutrition: { ...previous.nutrition, components } };
    });
  }, []);

  const onSaveMeal = useCallback(
    (options?: APIMutatorOptions<MealResponse, MealCreateRequest>) => {
      const data: MealCreateRequest = {
        dish_id: result?.dish_id,
        meal_type: mealType,
        quantity: 1,
        consumed_at: new Date().toISOString(),
        image_url: result?.imageUrl,
      };

      handleCreateMeal(data, options);
    },
    [handleCreateMeal],
  );

  const addComponent = useCallback(() => {
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
  }, []);

  return {
    activeImageUri,
    selectedContainer,
    result,
    isTakingPicture: isTaking,
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
    setMealType,
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
    onSaveMeal,
    warnings,
    cameraFacing: cameraType,
  };
}

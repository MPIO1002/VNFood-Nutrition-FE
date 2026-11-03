import { PressScale } from "@/components/PressScale";
import type { ContainerKey } from "@/constants/containers";
import { CONTAINERS } from "@/constants/containers";
import {
  ContainerSelector,
  NutritionResults,
  ScanCameraStage,
  ScanControls,
} from "@/features/analyzer/components";
import MealSaveCompleteScreen from "@/features/analyzer/components/result/MealSaveCompleteScreen";
import { useScanForm } from "@/features/analyzer/form/hooks/useScanForm";
import { CameraView } from "expo-camera";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronDownIcon } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ScanScreen() {
  const router = useRouter();
  const { imageUri } = useLocalSearchParams<{ imageUri?: string }>();
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const submittedUri = useRef<string | null>(null);
  const cameraRef = useRef<CameraView | null>(null);
  const scan = useScanForm(cameraRef, imageUri);
  const { activeImageUri, isAnalyzing, submit, error } = scan;

  useEffect(() => {
    if (!activeImageUri) {
      submittedUri.current = null;
      return;
    }
    if (activeImageUri !== submittedUri.current && !isAnalyzing) {
      submittedUri.current = activeImageUri;
      void submit();
    }
  }, [activeImageUri, isAnalyzing, submit]);

  useEffect(() => {
    if (error) {
      Alert.alert("Lỗi", error.message);
    }
  }, [error]);

  const handleSave = () => {
    setSaveState("saving");
    scan.onSaveMeal({
      onSuccess: () => {
        setTimeout(() => {
          setSaveState("saved");
        }, 500);
      },
    });
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView edges={["top"]} className="bg-white z-10">
        <View className="h-16 px-4 flex-row items-center">
          <PressScale onPress={() => router.back()}>
            <View className="w-11 h-11 rounded-full items-center justify-center -ml-2">
              <ChevronDownIcon size={24} color="#18181B" />
            </View>
          </PressScale>
          <Text className="font-montserrat-bold text-xl text-charcoal-pure tracking-tight">
            Quét AI
          </Text>
        </View>
      </SafeAreaView>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}>
        <View className="relative">
          <ScanCameraStage
            activeImageUri={scan.activeImageUri}
            resultImageUri={scan.result?.visualBase64 || null}
            detected={scan.result?.detected || []}
            imageSize={scan.result?.imageSize || null}
            isAnalyzing={scan.isAnalyzing}
            foodName={scan.result?.nutrition?.name || null}
            confidence={scan.result?.nutrition?.confidence || null}
            cameraFacing={scan.cameraFacing}
            cameraRef={cameraRef}
          />
          {scan.isTakingPicture && (
            <View className="absolute inset-0 items-center justify-center pt-2 px-5">
              <View className="bg-black/60 rounded-[35px] w-full h-full items-center justify-center gap-3">
                <ActivityIndicator size="large" color="#fff" />
                <Text className="text-white font-montserrat">
                  Đang xử lý...
                </Text>
              </View>
            </View>
          )}
        </View>

        {!scan.activeImageUri && (
          <ContainerSelector
            selectedContainer={
              CONTAINERS.find(
                (container) => container.key === scan.selectedContainer,
              ) || CONTAINERS[0]
            }
            onSelectContainer={(container) =>
              scan.setContainer(container.key as ContainerKey)
            }
          />
        )}

        <ScanControls
          hasImage={Boolean(scan.activeImageUri)}
          onPickImage={scan.pickImage}
          onShutter={scan.activeImageUri ? scan.retake : scan.takePicture}
          onToggleFacing={scan.toggleFacing}
          disabled={
            scan.isTakingPicture ||
            saveState === "saving" ||
            saveState === "saved"
          }
        />

        {scan.warnings.map((warning) => (
          <Text key={warning} className="px-4 mb-3 text-center text-amber-700">
            {warning}
          </Text>
        ))}

        {scan.isAnalyzing && (
          <View className="items-center py-4">
            <ActivityIndicator color="#18181B" />
          </View>
        )}

        {scan.result?.nutrition && !scan.isAnalyzing && (
          <NutritionResults
            nutrition={scan.result.nutrition}
            totals={scan.totals}
            onUpdateName={scan.updateName}
            onUpdateWeight={scan.updateWeight}
            onAdjustWeight={scan.adjustWeight}
            onRemoveComponent={scan.removeComponent}
            onAddComponent={scan.addComponent}
            onMealTypeChange={scan.setMealType}
            onSave={handleSave}
            saveState={saveState}
            disabled={saveState === "saving" || saveState === "saved"}
          />
        )}
      </ScrollView>
      <MealSaveCompleteScreen show={saveState === "saved"} />
    </View>
  );
}

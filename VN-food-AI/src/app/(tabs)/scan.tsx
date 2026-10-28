import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { PressScale } from "@/components/PressScale";
import {
  ContainerSelector,
  NutritionResults,
  ScanCameraStage,
  ScanControls,
} from "@/features/analyzer/components";
import { useScanForm } from "@/features/analyzer/form/hooks/useScanForm";
import type { ContainerKey } from "@/constants/containers";
import { CONTAINERS } from "@/constants/containers";

export default function ScanScreen() {
  const router = useRouter();
  const { imageUri } = useLocalSearchParams<{ imageUri?: string }>();
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const scan = useScanForm(imageUri);
  const submittedUri = useRef<string | null>(null);
  const {
    activeImageUri,
    isAnalyzing,
    submit,
    error,
  } = scan;

  useEffect(() => {
    if (!activeImageUri) {
      submittedUri.current = null;
      return;
    }
    if (
      activeImageUri !== submittedUri.current &&
      !isAnalyzing
    ) {
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
    setTimeout(() => setSaveState("saved"), 700);
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView edges={["top"]} className="bg-white z-10">
        <View className="h-16 px-4 flex-row items-center">
          <PressScale onPress={() => router.back()}>
            <View className="w-11 h-11 rounded-full items-center justify-center -ml-2">
              <ChevronLeft size={24} color="#18181B" />
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
        <ScanCameraStage
          activeImageUri={scan.activeImageUri}
          resultImageUri={scan.result?.visualBase64 || null}
          detected={scan.result?.detected || []}
          imageSize={scan.result?.imageSize || null}
          isAnalyzing={scan.isAnalyzing}
          foodName={scan.result?.nutrition?.name || null}
          confidence={scan.result?.nutrition?.confidence || null}
          cameraFacing={scan.cameraFacing}
        />

        {!scan.activeImageUri && (
          <ContainerSelector
            selectedContainer={
              CONTAINERS.find((container) => container.key === scan.selectedContainer) ||
              CONTAINERS[0]
            }
            onSelectContainer={(container) => scan.setContainer(container.key as ContainerKey)}
          />
        )}

        <ScanControls
          hasImage={Boolean(scan.activeImageUri)}
          onPickImage={scan.pickImage}
          onShutter={scan.activeImageUri ? scan.retake : scan.takePicture}
          onToggleFacing={scan.toggleFacing}
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
            onSave={handleSave}
            saveState={saveState}
          />
        )}

      </ScrollView>
    </View>
  );
}

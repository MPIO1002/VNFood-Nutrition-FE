/**
 * CaloViet AI — Chi tiết món ăn (Scan Result Screen & Live Camera)
 */
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ChevronLeft, Plus, ImagePlus, SwitchCamera, X
} from 'lucide-react-native';
import { useMemo, useState, useEffect, useRef } from 'react';
import {
  ScrollView, Text, View, Pressable, Alert, ActivityIndicator, TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PressScale } from '@/components/PressScale';
import { analyzeFoodImage } from '@/services/api';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

import { CONTAINERS, ContainerConfig } from '@/constants/containers';
import { SwipeSlider } from '@/components/SwipeSlider';
import { ContainerSelector } from '@/components/ContainerSelector';
import { NutritionResults } from '@/components/NutritionResults';
import { FoodMaskOverlay } from '@/components/FoodMaskOverlay';

export default function ScanScreen() {
  const router = useRouter();

  // Camera permissions & ref
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>('back');

  // Save state
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Input states
  const { imageUri: initialImageUri } = useLocalSearchParams<{ imageUri?: string }>();
  const [activeImageUri, setActiveImageUri] = useState<string | null>(initialImageUri || null);

  // Container selection state
  const [selectedContainer, setSelectedContainer] = useState<ContainerConfig>(CONTAINERS[0]);
  const [containerWidth, setContainerWidth]   = useState<number>(CONTAINERS[0].defaultSize ?? 20);
  const [containerHeight, setContainerHeight] = useState<number>(CONTAINERS[0].defaultHeight ?? CONTAINERS[0].defaultSize ?? 20);

  const handleSelectContainer = (c: ContainerConfig) => {
    setSelectedContainer(c);
    if (c.shape === 'rect') {
      setContainerWidth(c.defaultSize ?? 20);
      setContainerHeight(c.defaultHeight ?? c.defaultSize ?? 20);
    }
  };

  // API states
  const [loading, setLoading] = useState(false);
  const [resultImg, setResultImg] = useState<string | null>(null);
  const [foodData, setFoodData] = useState<any>(null);
  const [allDetected, setAllDetected] = useState<any[]>([]);
  const [imageSize, setImageSize] = useState<{width: number, height: number} | null>(null);

  useEffect(() => {
    if (activeImageUri) {
      handleScan(activeImageUri);
    }
  }, [activeImageUri]);

  const handleScan = async (selectedImageUri: string) => {
    setLoading(true);
    setResultImg(null); // Reset previous results
    setFoodData(null);
    try {
      const result = await analyzeFoodImage(selectedImageUri, {
        containerType: selectedContainer.key,
        ...(selectedContainer.shape === 'rect'
          ? { containerLengthCm: containerWidth, containerWidthCm: containerHeight }
          : {}),
      });
      if (result.success) {
        if (result.visualBase64) setResultImg(result.visualBase64);
        setAllDetected(result.allDetected || []);
        if (result.nutrition) {
          setFoodData(result.nutrition);
        } else {
          Alert.alert('Thông báo', 'AI không nhận diện được món ăn nào trong ảnh!');
        }
      } else {
        Alert.alert('Lỗi', result.error);
      }
    } catch (e: any) {
      Alert.alert('Lỗi', e.message);
    }
    setLoading(false);
  };

  const totals = useMemo(() => {
    if (foodData?.components) {
      let kcal = 0, protein = 0, carbs = 0, fat = 0;
      foodData.components.forEach((c: any) => {
        kcal += c.calories || 0;
        protein += c.protein || 0;
        carbs += c.carbs || 0;
        fat += c.fat || 0;
      });
      return {
        kcal: Math.round(kcal),
        protein: Math.round(protein),
        carbs: Math.round(carbs),
        fat: Math.round(fat),
      };
    } else if (foodData) {
      return {
        kcal: foodData.calories || foodData.calo || Math.round(foodData.kcal || 0),
        protein: Math.round(foodData.protein || 0),
        carbs: Math.round(foodData.carbs || foodData.carb || 0),
        fat: Math.round(foodData.fat || 0),
      };
    }
    return { kcal: 0, protein: 0, carbs: 0, fat: 0 };
  }, [foodData]);

  const updateComponentWeight = (idx: number, newWeightStr: string) => {
    const newWeight = parseInt(newWeightStr.replace(/[^0-9]/g, '')) || 0;
    setFoodData((prev: any) => {
      if (!prev || !prev.components) return prev;
      const newComps = [...prev.components];
      const comp = newComps[idx];

      const ratio = comp.originalWeight ? (newWeight / comp.originalWeight) : 0;

      newComps[idx] = {
        ...comp,
        weight: newWeightStr === '' ? '' : newWeight, // Cho phép nhập rỗng tạm thời
        calories: Math.round((comp.originalCalories || 0) * ratio),
        protein: Math.round((comp.originalProtein || 0) * ratio),
        fat: Math.round((comp.originalFat || 0) * ratio),
        carbs: Math.round((comp.originalCarbs || 0) * ratio),
      };
      return { ...prev, components: newComps };
    });
  };

  const adjustWeight = (idx: number, delta: number) => {
    if (!foodData || !foodData.components) return;
    const currentWeight = parseInt(foodData.components[idx].weight) || 0;
    let newWeight = currentWeight + delta;
    if (newWeight < 0) newWeight = 0;
    updateComponentWeight(idx, newWeight.toString());
  };

  const updateComponentName = (idx: number, newName: string) => {
    setFoodData((prev: any) => {
      if (!prev || !prev.components) return prev;
      const newComps = [...prev.components];
      newComps[idx] = { ...newComps[idx], name: newName };
      return { ...prev, components: newComps };
    });
  };

  const removeComponent = (idx: number) => {
    setFoodData((prev: any) => {
      if (!prev || !prev.components) return prev;
      const newComps = [...prev.components];
      newComps.splice(idx, 1);
      return { ...prev, components: newComps };
    });
  };

  const addComponent = () => {
    setFoodData((prev: any) => {
      if (!prev) return prev;
      const newComps = prev.components ? [...prev.components] : [];
      newComps.push({
        name: 'Nguyên liệu mới',
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
      });
      return { ...prev, components: newComps };
    });
  };

  function handleSave() {
    setSaveState('saving');
    setTimeout(() => setSaveState('saved'), 700);
  }

  // Handle taking a photo
  const takePicture = async () => {
    if (activeImageUri) {
      // If we already have an image, pressing the main button acts as a "Retake"
      setActiveImageUri(null);
      setResultImg(null);
      setFoodData(null);
      setAllDetected([]);
      setImageSize(null);
      return;
    }

    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ base64: false });
      if (photo?.uri) {
        setActiveImageUri(photo.uri);
        setImageSize({ width: photo.width, height: photo.height });
      }
    }
  };

  // Handle picking from gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setActiveImageUri(result.assets[0].uri);
      setImageSize({ width: result.assets[0].width, height: result.assets[0].height });
    }
  };

  // Toggle camera facing
  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  if (!permission) {
    return <View className="flex-1 bg-white justify-center items-center"><ActivityIndicator color="#000" /></View>;
  }
  if (!permission.granted) {
    return (
      <View className="flex-1 bg-white justify-center items-center px-6">
        <Text className="text-charcoal-pure font-montserrat-medium text-center mb-6 text-base">
          Chúng mình cần quyền truy cập camera để quét món ăn nhé!
        </Text>
        <PressScale onPress={requestPermission}>
          <View className="bg-charcoal-pure px-6 py-3 rounded-full">
            <Text className="font-montserrat-bold text-white text-base">Cấp quyền Camera</Text>
          </View>
        </PressScale>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView edges={['top']} className="bg-white z-10">
        <View className="h-16 px-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-1">
            <Pressable
              className="w-11 h-11 rounded-full items-center justify-center -ml-2"
              onPress={() => router.back()}
              accessibilityLabel="Quay lại"
            >
              <ChevronLeft size={24} color="#18181B" />
            </Pressable>
            <Text className="font-montserrat-bold text-xl text-charcoal-pure tracking-tight">Quét AI</Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>

        {/* (Container Selector was moved below) */}

        {/* ── CAMERA / IMAGE FRAME ──────────────────────────────────────── */}
        <View className="aspect-square mx-4 mt-2 rounded-[36px] overflow-hidden bg-zinc-900 shadow-sm border border-zinc-200/50 relative">
          {!activeImageUri ? (
            <CameraView style={StyleSheet.absoluteFill} facing={facing} ref={cameraRef} />
          ) : (
            <>
              <Image
                source={resultImg ? { uri: resultImg } : { uri: activeImageUri }}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
              />
              <FoodMaskOverlay items={allDetected} imageSize={imageSize} />
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} locations={[0.5, 1]} className="absolute bottom-0 left-0 right-0 h-1/2" />
            </>
          )}

          {/* Camera hint — only in live camera mode */}
          {!activeImageUri && (
            <View className="absolute top-4 left-4 right-4 items-center z-20">
              <View className="bg-black/40 rounded-full px-4 py-2 border border-white/20 backdrop-blur-md">
                <Text className="text-white font-montserrat-medium text-xs text-center">
                  Hãy chụp toàn bộ đĩa từ hướng từ trên xuống
                </Text>
              </View>
            </View>
          )}

          {/* Loading overlay */}
          {loading && (
            <View className="absolute inset-0 bg-black/40 items-center justify-center z-20">
              <ActivityIndicator size="large" color="#FFFFFF" />
              <Text className="text-white font-montserrat-medium mt-3">AI đang phân tích...</Text>
            </View>
          )}

          {/* Result badge */}
          {!loading && activeImageUri && (
            <View className="absolute bottom-4 left-4 right-4 flex-row items-center justify-between z-10">
              <View className="flex-row items-center gap-1.5 px-3 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20">
                <View className="w-2 h-2 rounded-full bg-green-400" />
                <Text className="font-montserrat-semibold text-[11px] text-white">
                  {foodData?.name ? `Độ tin cậy ${foodData.confidence ? Math.round(foodData.confidence * 100) : 98}%` : 'Hoàn tất'}
                </Text>
              </View>
              {foodData?.name && (
                <Text className="font-montserrat-bold text-white text-sm" numberOfLines={1}>
                  {foodData.name}
                </Text>
              )}
            </View>
          )}
        </View>

        {/* ── Container Selector ─────────────────────────────────────────── */}
        {!activeImageUri && (
          <ContainerSelector
            selectedContainer={selectedContainer}
            onSelectContainer={handleSelectContainer}
          />
        )}

        {/* ── Size Slider(s) — only in live camera mode (Hộp) ─────────────────── */}
        {!activeImageUri && selectedContainer.shape === 'rect' && (
          <View className="mx-4 mt-1" style={{ gap: 8 }}>
            <SwipeSlider
              label="Chiều dài (cm)"
              value={containerWidth}
              onChange={setContainerWidth}
            />
            <SwipeSlider
              label="Chiều rộng (cm)"
              value={containerHeight}
              onChange={setContainerHeight}
            />
          </View>
        )}

        {/* ── 3 Camera Controls ────────────────────────────────────────── */}
        <View className="flex-row items-center justify-center gap-10 mt-5 mb-6">
          {/* Gallery Button */}
          <PressScale onPress={pickImage}>
            <View className="w-14 h-14 rounded-full bg-zinc-100 items-center justify-center border border-zinc-200">
              <ImagePlus size={22} color="#18181B" />
            </View>
          </PressScale>

          {/* Main Shutter / Retake Button */}
          <TouchableOpacity
            onPress={takePicture}
            activeOpacity={0.8}
            className="w-20 h-20 rounded-full border-[8px] border-[#333333] items-center justify-center"
          >
            <View className="w-[66px] h-[66px] rounded-full bg-white items-center justify-center">
              {activeImageUri ? (
                <X size={28} color="#333333" />
              ) : null}
            </View>
          </TouchableOpacity>

          {/* Flip Camera Button */}
          <PressScale onPress={toggleCameraFacing}>
            <View className="w-14 h-14 rounded-full bg-zinc-100 items-center justify-center border border-zinc-200">
              <SwitchCamera size={22} color="#18181B" />
            </View>
          </PressScale>
        </View>


        {/* NUTRITION INFO (Appears below when scanned) */}
        {activeImageUri && foodData && !loading && (
          <NutritionResults
            foodData={foodData}
            totals={totals}
            saveState={saveState}
            onUpdateComponentName={updateComponentName}
            onUpdateComponentWeight={updateComponentWeight}
            onAdjustWeight={adjustWeight}
            onRemoveComponent={removeComponent}
            onAddComponent={addComponent}
            onSave={handleSave}
          />
        )}
      </ScrollView>
    </View>
  );
}

// Styles for this screen can go here if needed in the future
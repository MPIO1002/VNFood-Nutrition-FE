/**
 * CaloViet AI — Chi tiết món ăn (Scan Result Screen & Live Camera)
 */
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowRight, BookmarkCheck, ChevronLeft, Plus, ImagePlus, SwitchCamera, X, Minus, Trash2
} from 'lucide-react-native';
import { useMemo, useState, useEffect, useRef } from 'react';
import {
  ScrollView, Text, View, Pressable, Alert, ActivityIndicator, TouchableOpacity,
  StyleSheet, TextInput, Animated, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PressScale } from '../components/PressScale';
import { analyzeFoodImage } from '../services/api';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

import { CONTAINERS, ContainerConfig, MAX_SIZE } from '../constants/containers';
import { OverlayFrame } from '../components/OverlayFrame';
import { SwipeSlider } from '../components/SwipeSlider';

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
  const [containerWidth, setContainerWidth]   = useState<number>(CONTAINERS[0].defaultSize);
  const [containerHeight, setContainerHeight] = useState<number>(CONTAINERS[0].defaultHeight ?? CONTAINERS[0].defaultSize);

  const handleSelectContainer = (c: ContainerConfig) => {
    setSelectedContainer(c);
    setContainerWidth(c.defaultSize);
    setContainerHeight(c.defaultHeight ?? c.defaultSize);
  };

  // API states
  const [loading, setLoading] = useState(false);
  const [resultImg, setResultImg] = useState<string | null>(null);
  const [foodData, setFoodData] = useState<any>(null);

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
        ...(selectedContainer.shape === 'circle'
          ? { containerDiameterCm: containerWidth }
          : { containerLengthCm: containerWidth, containerWidthCm: containerHeight }),
      });
      if (result.success) {
        if (result.visualBase64) setResultImg(result.visualBase64);
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
      return;
    }

    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ base64: false });
      if (photo?.uri) {
        setActiveImageUri(photo.uri);
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

        {/* ── Container Selector ─────────────────────────────────────────── */}
        {!activeImageUri && (
          <View style={styles.containerRow}>
            {CONTAINERS.map(c => {
              const active = c.key === selectedContainer.key;
              const IconComponent = c.icon;
              return (
                <TouchableOpacity
                  key={c.key}
                  onPress={() => handleSelectContainer(c)}
                  activeOpacity={0.75}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <IconComponent size={24} color={active ? '#FFFFFF' : '#52525B'} strokeWidth={1.5} />
                  <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>
                    {c.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

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
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} locations={[0.5, 1]} className="absolute bottom-0 left-0 right-0 h-1/2" />
            </>
          )}

          {/* Overlay guide frame — only in live camera mode */}
          {!activeImageUri && (
            <OverlayFrame
              shape={selectedContainer.shape}
              widthRatio={selectedContainer.shape === 'circle' ? 0.72 : Math.min(0.92, containerWidth / MAX_SIZE * 0.9 + 0.4)}
              heightRatio={selectedContainer.shape === 'circle' ? 0.72 : Math.min(0.85, containerHeight / MAX_SIZE * 0.9 + 0.3)}
            />
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

        {/* ── Size Slider(s) — only in live camera mode ─────────────────── */}
        {!activeImageUri && (
          <View className="mx-4 mt-3" style={{ gap: 8 }}>
            {selectedContainer.shape === 'circle' ? (
              <SwipeSlider
                label="Đường kính"
                value={containerWidth}
                onChange={setContainerWidth}
              />
            ) : (
              <>
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
              </>
            )}
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
          <View className="px-4 mt-2">
            <View className="bg-white rounded-3xl p-5 flex-row items-center justify-between gap-4 shadow-sm border border-zinc-100 mb-6">
              {/* Total energy */}
              <View className="flex-1 min-w-0">
                <Text className="font-montserrat-semibold text-[10px] text-zinc-500 uppercase tracking-widest">TỔNG NĂNG LƯỢNG</Text>
                <View className="flex-row items-baseline mt-1">
                  <Text className="font-montserrat-bold text-[32px] text-charcoal-pure leading-10 tracking-tight">{totals.kcal}</Text>
                  <Text className="font-montserrat-semibold text-xs text-zinc-500 ml-1"> kcal</Text>
                </View>
              </View>

              {/* Macro trio */}
              <View className="flex-row gap-2">
                <View className="items-center px-3 py-2.5 rounded-2xl min-w-[64px] bg-charcoal-pure shadow-sm">
                  <Text className="font-montserrat-bold text-xs text-white/80">Pro</Text>
                  <Text className="font-montserrat-semibold text-sm text-white mt-0.5">{totals.protein}g</Text>
                </View>
                <View className="items-center px-3 py-2.5 rounded-2xl min-w-[64px] bg-zinc-50 border border-zinc-100">
                  <Text className="font-montserrat-bold text-xs text-zinc-500">Carb</Text>
                  <Text className="font-montserrat-semibold text-sm text-charcoal-pure mt-0.5">{totals.carbs}g</Text>
                </View>
                <View className="items-center px-3 py-2.5 rounded-2xl min-w-[64px] bg-zinc-50 border border-zinc-100">
                  <Text className="font-montserrat-bold text-xs text-zinc-500">Fat</Text>
                  <Text className="font-montserrat-semibold text-sm text-charcoal-pure mt-0.5">{totals.fat}g</Text>
                </View>
              </View>
            </View>

            {/* COMPONENTS BREAKDOWN */}
            {foodData?.components && (
              <View className="mb-6">
                <View className="mb-4">
                  <View className="flex-row items-baseline justify-between">
                    <Text className="font-montserrat-bold text-lg text-charcoal-pure">Thành phần chi tiết</Text>
                    <Text className="font-montserrat-semibold text-sm text-charcoal-pure">
                      {foodData.components.length} <Text className="font-montserrat-medium text-xs text-zinc-500">món nhận diện</Text>
                    </Text>
                  </View>
                  <Text className="font-montserrat-medium text-xs text-zinc-500 mt-1">
                    Chạm +/- để cân đối khẩu phần thực tế
                  </Text>
                </View>

                <View className="gap-3">
                  {foodData.components.map((comp: any, idx: number) => (
                    <View
                      key={idx}
                      className="bg-white border border-zinc-100 rounded-[20px] p-3 flex-row items-center shadow-sm"
                    >
                      {/* Text info */}
                      <View className="flex-1 min-w-0 mr-2 pl-2 justify-center">
                        <TextInput
                          value={comp.name}
                          onChangeText={(text) => updateComponentName(idx, text)}
                          placeholder="Tên nguyên liệu"
                          className="font-montserrat-semibold text-charcoal-pure"
                          style={{
                            padding: 0,
                            margin: 0,
                            fontSize: 16,
                            lineHeight: 22,
                            height: 22,
                            textAlignVertical: 'center',
                            includeFontPadding: false,
                          }}
                        />
                        <View className="flex-row items-center mt-1" style={{ height: 16 }}>
                          <Text
                            className="font-montserrat-bold text-charcoal-pure"
                            style={{ fontSize: 11, lineHeight: 16, includeFontPadding: false }}
                          >
                            {comp.calories}
                          </Text>
                          <Text
                            className="font-montserrat-medium text-zinc-500"
                            style={{ fontSize: 11, lineHeight: 16, includeFontPadding: false }}
                            numberOfLines={1}
                          >
                            {' '}kcal • {comp.protein}g P • {comp.carbs}g C
                          </Text>
                        </View>
                      </View>

                      {/* Controls (+/- Pill) */}
                      <View className="flex-row items-center bg-zinc-100/80 rounded-full px-1" style={{ height: 36 }}>
                        <TouchableOpacity
                          onPress={() => adjustWeight(idx, -10)}
                          className="w-8 h-8 items-center justify-center"
                        >
                          <Minus size={16} color="#18181B" />
                        </TouchableOpacity>

                        <View className="flex-row items-center justify-center" style={{ minWidth: 48, height: 32 }}>
                          <TextInput
                            value={comp.weight.toString()}
                            onChangeText={(text) => updateComponentWeight(idx, text)}
                            keyboardType="numeric"
                            textAlign="center"
                            className="font-montserrat-bold text-charcoal-pure"
                            style={{
                              padding: 0,
                              margin: 0,
                              fontSize: 14,
                              lineHeight: 18,
                              height: 32,
                              minWidth: 28,
                              textAlignVertical: 'center',
                              includeFontPadding: false,
                            }}
                          />
                          <Text
                            className="font-montserrat-semibold text-charcoal-pure"
                            style={{ fontSize: 12, lineHeight: 18, marginLeft: 2, includeFontPadding: false }}
                          >
                            g
                          </Text>
                        </View>

                        <TouchableOpacity
                          onPress={() => adjustWeight(idx, 10)}
                          className="w-8 h-8 items-center justify-center"
                        >
                          <Plus size={16} color="#18181B" />
                        </TouchableOpacity>
                      </View>

                      {/* Nút xoá */}
                      <TouchableOpacity
                        onPress={() => removeComponent(idx)}
                        className="ml-2 w-9 h-9 bg-red-50 rounded-full items-center justify-center"
                      >
                        <Trash2 size={16} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Bottom Actions */}
            <View className="gap-3">
              <PressScale onPress={addComponent}>
                <View className="h-14 flex-row items-center justify-center gap-2 px-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <Plus size={20} color="#18181B" />
                  <Text className="font-montserrat-semibold text-sm text-charcoal-pure">Thêm thành phần</Text>
                </View>
              </PressScale>

              <PressScale onPress={handleSave} toValue={0.99}>
                <View className={`h-16 flex-row items-center justify-between px-6 rounded-2xl shadow-sm ${saveState === 'saved' ? 'bg-green-600' : 'bg-charcoal-pure'}`}>
                  <View className="flex-row items-center gap-3">
                    <BookmarkCheck size={24} color="#FFFFFF" />
                    <Text className="font-montserrat-bold text-base text-white">
                      {saveState === 'saved' ? 'Đã ghi vào bữa trưa!' : saveState === 'saving' ? 'Đang lưu...' : 'Lưu nhật ký'}
                    </Text>
                  </View>
                  {saveState === 'idle' && (
                    <View className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20">
                      <ArrowRight size={18} color="#FFFFFF" />
                    </View>
                  )}
                </View>
              </PressScale>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ─── StyleSheet ───────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Container chip selector
  containerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 2,
  },
  chip: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F4F4F5',
    borderWidth: 1.5,
    borderColor: 'transparent',
    gap: 3,
  },
  chipActive: {
    backgroundColor: '#18181B',
    borderColor: '#18181B',
  },
  chipLabel: {
    fontSize: 11,
    color: '#52525B',
    fontFamily: 'Montserrat-SemiBold',
  },
  chipLabelActive: {
    color: '#FFFFFF',
  },
});
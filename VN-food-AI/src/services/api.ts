import { getStoredTokens } from './auth';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8000';
const API_URL = `${BASE_URL}/api/v1/food/analyze`;

/**
 * Chuẩn hóa mã container theo danh sách hợp lệ của backend: 'dia' | 'to' | 'hop' | 'ly'
 */
function normalizeContainerType(key?: string): string | undefined {
  if (!key) return undefined;
  const lower = key.toLowerCase();
  if (lower === 'hop') return 'hop';
  if (lower === 'ly' || lower === 'coc') return 'ly';
  if (lower.includes('dia')) return 'dia';
  if (lower === 'chen' || lower.includes('to')) return 'to';
  return key;
}

/**
 * Hàm gọi API Phân tích món ăn
 * Lưu ý: vật đựng hộp ('hop') không còn cần truyền chiều dài / chiều rộng.
 * @param imageUri - Đường dẫn ảnh (VD: lấy từ expo-image-picker result.assets[0].uri)
 * @param options - Tùy chọn vật đựng
 * @returns { success, visualBase64, nutrition, allDetected, error }
 */
export async function analyzeFoodImage(
  imageUri: string,
  options?: {
    containerType?: string;
    containerDiameterCm?: number;
    containerLengthCm?: number;
    containerWidthCm?: number;
  }
) {
  try {
    // Lấy Blob từ file ảnh local
    const localRes = await fetch(imageUri);
    const blob = await localRes.blob();

    const formData = new FormData();
    formData.append('image', blob, 'scan.jpg');

    if (options?.containerType) {
      const normalizedType = normalizeContainerType(options.containerType);
      if (normalizedType) {
        formData.append('container_type', normalizedType);
      }

      // Vật đựng hộp không còn cần truyền chiều dài, chiều rộng!
      // Chỉ truyền đường kính cho các vật tròn (đĩa, tô) nếu có
      if (normalizedType !== 'hop' && options.containerDiameterCm !== undefined) {
        formData.append('container_diameter_cm', options.containerDiameterCm.toString());
      }
    }

    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    // Đính kèm token xác thực nếu người dùng đã đăng nhập
    try {
      const { accessToken } = await getStoredTokens();
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
    } catch {
      // Bỏ qua nếu chưa đăng nhập hoặc lỗi đọc token
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
      headers,
    });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      console.error('Lỗi parse JSON:', e);
      throw new Error('Server trả về lỗi không mong muốn (không phải định dạng JSON).');
    }

    if (!response.ok) {
      const errorMsg = typeof data?.detail === 'string'
        ? data.detail
        : (data?.detail?.[0]?.msg || 'Lỗi server không xác định');
      throw new Error(errorMsg);
    }

    // Bóc tách dữ liệu sạch sẽ trả về cho UI
    const items = data.items || [];
    const firstItem = items.length > 0 ? items[0] : null;

    let nutrition = null;
    if (firstItem?.food) {
      const totals = firstItem.food.estimated_totals || {};
      const rawComponents = firstItem.food.estimated_components || [];
      nutrition = {
        name: firstItem.food.name,
        confidence: firstItem.detection_confidence,
        calories: Math.round(totals.calories_kcal || 0),
        protein: Math.round(totals.protein_g || 0),
        fat: Math.round(totals.fat_g || 0),
        carbs: Math.round(totals.carb_g || 0),
        components: rawComponents.map((c: any) => ({
          name: c.name,
          weight: Math.round(c.estimated_g || 0),
          calories: Math.round(c.calories_kcal || 0),
          protein: Math.round(c.protein_g || 0),
          fat: Math.round(c.fat_g || 0),
          carbs: Math.round(c.carb_g || 0),
          originalWeight: c.estimated_g || 0,
          originalCalories: c.calories_kcal || 0,
          originalProtein: c.protein_g || 0,
          originalFat: c.fat_g || 0,
          originalCarbs: c.carb_g || 0,
        })),
      };
    }

    return {
      success: true,
      visualBase64: data.visual_base64 ? `data:image/jpeg;base64,${data.visual_base64}` : null,
      nutrition,
      allDetected: items,
    };
  } catch (error: any) {
    console.error('Lỗi khi gọi API analyze:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

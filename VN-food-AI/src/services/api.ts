import * as FileSystem from 'expo-file-system/legacy';

// Thay bằng IPv4 của máy tính chạy backend (Sửa trong file .env ở thư mục gốc)
// LƯU Ý: Tuyệt đối không dùng 'localhost' hoặc '127.0.0.1' trên điện thoại thật!
const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/v1/food/analyze`;

/**
 * Hàm gọi API Phân tích món ăn
 * @param imageUri - Đường dẫn ảnh (VD: lấy từ expo-image-picker `result.assets[0].uri`)
 * @returns { visualBase64, nutrition, allDetected }
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

    if (options) {
      if (options.containerType) formData.append('container_type', options.containerType);
      if (options.containerDiameterCm !== undefined) formData.append('container_diameter_cm', options.containerDiameterCm.toString());
      if (options.containerLengthCm !== undefined) formData.append('container_length_cm', options.containerLengthCm.toString());
      if (options.containerWidthCm !== undefined) formData.append('container_width_cm', options.containerWidthCm.toString());
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      console.error("Lỗi parse JSON:", e);
      throw new Error(`Server trả về lỗi không mong muốn (không phải JSON).`);
    }

    if (!response.ok) {
      throw new Error(data.detail || 'Lỗi server không xác định');
    }

    // 4. Bóc tách dữ liệu sạch sẽ trả về cho UI
    const items = data.items || [];
    const firstItem = items.length > 0 ? items[0] : null;

    // Map "estimated_totals" sang shape mà UI đang dùng
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
        // Từng thành phần nguyên liệu
        components: rawComponents.map((c: any) => ({
          name: c.name,
          weight: Math.round(c.estimated_g || 0),
          calories: Math.round(c.calories_kcal || 0),
          protein: Math.round(c.protein_g || 0),
          fat: Math.round(c.fat_g || 0),
          carbs: Math.round(c.carb_g || 0),
          // Giữ lại giá trị gốc để tính tỷ lệ khi user đổi số gram
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
      // Chuỗi Base64 để nhúng thẳng vào <Image source={{ uri: visualBase64 }} />
      visualBase64: data.visual_base64 ? `data:image/jpeg;base64,${data.visual_base64}` : null,

      // Dữ liệu dinh dưỡng đã được chuẩn hóa
      nutrition,

      // Toàn bộ mảng món nếu ảnh có nhiều món
      allDetected: items,
    };

  } catch (error: any) {
    console.error("Lỗi khi gọi API analyze:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

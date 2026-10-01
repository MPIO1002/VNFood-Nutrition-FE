# Hướng dẫn tích hợp logic API vào Frontend đã có sẵn

Vì bạn đã có sẵn UI (như màn hình `scan.tsx`), tài liệu này chỉ tập trung vào phần **Logic cốt lõi (Core Logic)**. Bạn chỉ cần copy hàm Service dưới đây, import vào màn hình của bạn và gọi nó khi người dùng bấm nút phân tích.

---

## 1. Hàm Service gọi API (Core Logic)

Tạo một file riêng (ví dụ: `src/services/api.ts` hoặc nhúng thẳng vào file `.tsx` của bạn). Hàm này làm nhiệm vụ:
- Gói ảnh vào `FormData` đúng chuẩn React Native.
- Gửi POST request tới API cục bộ (cần trỏ đúng IP LAN).
- Tự động bắt lỗi và parse dữ liệu bóc tách được (Base64 ảnh, thông tin món ăn).

```typescript
// Thay bằng IPv4 của máy tính chạy backend (Mở cmd gõ ipconfig)
// LƯU Ý: Tuyệt đối không dùng 'localhost' hoặc '127.0.0.1' trên điện thoại thật!
const API_URL = 'http://192.168.1.15:8000/api/v1/food/analyze';

/**
 * Hàm gọi API Phân tích món ăn
 * @param imageUri - Đường dẫn ảnh (VD: lấy từ expo-image-picker `result.assets[0].uri`)
 * @returns { visualBase64, nutrition }
 */
export async function analyzeFoodImage(imageUri: string) {
  try {
    const formData = new FormData();
    
    // 1. Cấu trúc FormData bắt buộc trong React Native cho file upload
    formData.append('image', {
      uri: imageUri,
      name: 'food_image.jpg',
      type: 'image/jpeg',
    } as any);

    // 2. Yêu cầu format trả về gọn gàng nhất cho Mobile
    formData.append('response_format', 'nutrition');

    // 3. Thực hiện gọi API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Lỗi server không xác định');
    }

    // 4. Bóc tách dữ liệu sạch sẽ trả về cho UI
    const detectedItems = data.detected_items || [];
    
    return {
      success: true,
      // Chuỗi Base64 để nhúng thẳng vào <Image source={{ uri: visualBase64 }} />
      visualBase64: data.visual_base64 ? `data:image/jpeg;base64,${data.visual_base64}` : null,
      
      // Dữ liệu dinh dưỡng của món đầu tiên phát hiện được
      nutrition: detectedItems.length > 0 ? detectedItems[0].food : null,
      
      // Hoặc trả về toàn bộ mảng nếu ảnh có nhiều món ăn
      allDetected: detectedItems,
    };

  } catch (error: any) {
    console.error("Lỗi khi gọi API analyze:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
```

---

## 2. Cách tích hợp vào UI hiện có (Ví dụ trong `scan.tsx`)

Bên trong UI hiện tại của bạn, khi người dùng chụp ảnh/chọn ảnh xong và có được `uri`, bạn chỉ cần gọi hàm trên:

```typescript
import { analyzeFoodImage } from '../services/api';

// ... trong Component của bạn:
const [resultImg, setResultImg] = useState<string | null>(null);
const [foodData, setFoodData] = useState<any>(null);

const handleScan = async (selectedImageUri: string) => {
    // 1. Hiển thị loading (tùy UI của bạn)
    setLoading(true);

    // 2. Gọi logic xử lý
    const result = await analyzeFoodImage(selectedImageUri);

    // 3. Cập nhật state cho UI hiển thị
    if (result.success) {
        if (result.visualBase64) {
            setResultImg(result.visualBase64); // Hiển thị đè lên UI khung ảnh gốc
        }
        if (result.nutrition) {
            setFoodData(result.nutrition);     // Cập nhật các text Calo, Protein, Fat...
        } else {
            alert('AI không nhận diện được món ăn nào trong ảnh!');
        }
    } else {
        alert(`Lỗi: ${result.error}`);
    }
    
    setLoading(false);
};
```

---

## 3. Ba điểm Checklist trước khi chạy App:
1. Đảm bảo API server đang bật (`uvicorn calcucalo.api:app --host 0.0.0.0 --port 8000`).
2. Điện thoại thật (hoặc máy ảo) và máy tính đang truy cập **cùng 1 mạng Wifi**.
3. Đã đổi `API_URL` trong hàm fetch thành IPv4 cục bộ của máy tính chạy code Backend.

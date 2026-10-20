# 📚 TÀI LIỆU TÍCH HỢP API CALCUCALO (DÀNH CHO FRONTEND / MOBILE TEAM)

> **Dự án:** Ứng dụng AI Nhận diện món ăn & Quản lý Calo (CalcuCalo)  
> **Backend Framework:** FastAPI (Python 3.10+)  
> **Môi trường cục bộ:** `http://127.0.0.1:8000` (hoặc IP máy chủ mạng LAN nếu test trên thiết bị thật)  
> **Swagger UI Trực quan:** `http://127.0.0.1:8000/docs`  
> **ReDoc Alternative:** `http://127.0.0.1:8000/redoc`  
> **Web Test UI có sẵn:** `http://127.0.0.1:8000/test-ui/`

---

## 📌 1. TỔNG QUAN HỆ THỐNG & DANH SÁCH ENDPOINTS

Hệ thống hiện tại cung cấp **10 endpoints chính thức** được chia làm 3 nhóm:
1. **Authentication (Xác thực & Người dùng):** Đăng ký, đăng nhập, cấp lại token (rotation), đăng xuất, lấy thông tin cá nhân.
2. **Food AI Analysis (Thị giác máy tính & Dinh dưỡng):** Phân tích hình ảnh món ăn, phát hiện món, ước tính khối lượng, tính toán calo & macro, trả về ảnh vẽ bounding box/mask.
3. **System & Health Check:** Kiểm tra tình trạng server, model AI và cơ sở dữ liệu.

### Bảng tóm tắt nhanh API:

| # | Nhóm | Method | Endpoint | Yêu cầu Auth | Mô tả chức năng |
|---|---|---|---|:---:|---|
| 1 | **Auth** | `POST` | `/api/v1/auth/register` | ❌ Không | Đăng ký tài khoản người dùng mới |
| 2 | **Auth** | `POST` | `/api/v1/auth/login` | ❌ Không | Đăng nhập tài khoản bằng email & mật khẩu |
| 3 | **Auth** | `POST` | `/api/v1/auth/refresh` | ❌ Không | Làm mới access token bằng refresh token |
| 4 | **Auth** | `POST` | `/api/v1/auth/logout` | ❌ Không | Đăng xuất thiết bị hiện tại (thu hồi refresh token) |
| 5 | **Auth** | `POST` | `/api/v1/auth/logout-all` | 🔒 `Bearer` | Đăng xuất khỏi tất cả các thiết bị |
| 6 | **Auth** | `GET` | `/api/v1/auth/me` | 🔒 `Bearer` | Lấy profile người dùng hiện tại |
| 7 | **Auth** | `GET` | `/api/v1/auth/health` | ❌ Không | Kiểm tra kết nối dịch vụ Auth & DB PostgreSQL |
| 8 | **AI Core** | `POST` | `/api/v1/food/analyze` | ❌ Tùy chọn | Upload ảnh món ăn để AI nhận diện, đo khối lượng và tính calo |
| 9 | **AI Core** | `GET` | `/api/v1/model/info` | ❌ Không | Xem thông tin model AI YOLO/ONNX và pipeline |
| 10 | **System** | `GET` | `/health` | ❌ Không | Kiểm tra trạng thái hệ thống tổng thể |

---

## 🔐 2. CƠ CHẾ XÁC THỰC (AUTHENTICATION WORKFLOW)

- Chuẩn xác thực: **JWT (JSON Web Token)** theo cơ chế **Bearer Token**.
- **Access Token:** Hạn dùng ngắn (mặc định **15 phút**), truyền qua Header:
  ```http
  Authorization: Bearer <access_token>
  ```
- **Refresh Token:** Hạn dùng dài (mặc định **30 ngày**), dùng cơ chế **Token Rotation** (mỗi lần refresh sẽ sinh ra 1 refresh token mới và vô hiệu hóa token cũ trong database).
- **Lưu trữ ở FE / Mobile:**
  - Web: Lưu trữ trong `localStorage` / `sessionStorage` hoặc `Secure Cookie`.
  - React Native: Lưu vào `expo-secure-store` hoặc `react-native-keychain`.

---

## 📖 3. CHI TIẾT TỪNG API

### 3.1. Nhóm Authentication (Xác thực)

---

#### 3.1.1. Đăng ký tài khoản (`POST /api/v1/auth/register`)
- **Chức năng:** Tạo tài khoản mới cho người dùng. Nếu thành công, tự động cấp ngay cặp `access_token` và `refresh_token`.
- **Content-Type:** `application/json`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "Password123@",
    "full_name": "Nguyễn Văn A"
  }
  ```
  - `email` *(string, bắt buộc)*: Địa chỉ email hợp lệ.
  - `password` *(string, bắt buộc)*: Độ dài từ 8 đến 72 ký tự.
  - `full_name` *(string, tùy chọn)*: Họ và tên người dùng (tối đa 120 ký tự).
- **Phản hồi thành công (201 Created):**
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
    "token_type": "bearer",
    "expires_in": 900,
    "refresh_expires_in": 2592000,
    "user": {
      "id": 1,
      "email": "user@example.com",
      "full_name": "Nguyễn Văn A",
      "is_active": true,
      "created_at": "2026-10-20T14:30:00"
    }
  }
  ```
- **Mã lỗi thường gặp:**
  - `409 Conflict`: Email đã tồn tại trong hệ thống (`{"detail": "Email is already registered"}`).
  - `422 Unprocessable Entity`: Định dạng email không hợp lệ hoặc mật khẩu < 8 ký tự.

---

#### 3.1.2. Đăng nhập (`POST /api/v1/auth/login`)
- **Chức năng:** Xác thực email/mật khẩu và nhận cặp token.
- **Content-Type:** `application/json`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "Password123@"
  }
  ```
- **Phản hồi thành công (200 OK):** Cùng định dạng với response của `register`.
- **Mã lỗi thường gặp:**
  - `401 Unauthorized`: Sai email hoặc mật khẩu (`{"detail": "Invalid email or password"}`).
  - `403 Forbidden`: Tài khoản đã bị khóa (`{"detail": "User account is disabled"}`).

---

#### 3.1.3. Cấp mới Access Token (`POST /api/v1/auth/refresh`)
- **Chức năng:** Dùng khi `access_token` hết hạn (gặp lỗi 401). FE gửi `refresh_token` lên để lấy cặp token mới.
- **Content-Type:** `application/json`
- **Request Body:**
  ```json
  {
    "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
  }
  ```
- **Phản hồi thành công (200 OK):** Trả về cặp `access_token` mới và `refresh_token` mới.
- **Mã lỗi thường gặp:**
  - `401 Unauthorized`: Refresh token hết hạn, đã bị thu hồi hoặc không hợp lệ. Khi này FE cần điều hướng người dùng về màn hình Login.

---

#### 3.1.4. Đăng xuất (`POST /api/v1/auth/logout`)
- **Chức năng:** Đăng xuất phiên làm việc hiện tại, thu hồi refresh token này trong DB.
- **Content-Type:** `application/json`
- **Request Body:**
  ```json
  {
    "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
  }
  ```
- **Phản hồi thành công (200 OK):**
  ```json
  {
    "message": "Logged out"
  }
  ```

---

#### 3.1.5. Đăng xuất khỏi mọi thiết bị (`POST /api/v1/auth/logout-all`)
- **Chức năng:** Thu hồi toàn bộ refresh token của tài khoản trên tất cả các máy.
- **Headers:** `Authorization: Bearer <access_token>`
- **Request Body:** Không có.
- **Phản hồi thành công (200 OK):**
  ```json
  {
    "message": "Logged out from all devices"
  }
  ```

---

#### 3.1.6. Lấy thông tin tài khoản hiện tại (`GET /api/v1/auth/me`)
- **Chức năng:** Lấy thông tin hồ sơ của tài khoản đang đăng nhập.
- **Headers:** `Authorization: Bearer <access_token>`
- **Phản hồi thành công (200 OK):**
  ```json
  {
    "id": 1,
    "email": "user@example.com",
    "full_name": "Nguyễn Văn A",
    "is_active": true,
    "created_at": "2026-10-20T14:30:00"
  }
  ```

---

#### 3.1.7. Kiểm tra tình trạng Auth Service (`GET /api/v1/auth/health`)
- **Chức năng:** Ping kiểm tra bảng xác thực và PostgreSQL database.
- **Phản hồi (200 OK):**
  ```json
  {
    "status": "ok",
    "database": "reachable"
  }
  ```

---

### 3.2. Nhóm AI Phân Tích Hình Ảnh Món Ăn (Food AI Vision)

---

#### 3.2.1. Phân tích món ăn từ ảnh (`POST /api/v1/food/analyze`)
- **Chức năng:** Endpoint cốt lõi của ứng dụng. Nhận diện món ăn (68 nhãn món Việt), phân đoạn đối tượng (Segmentation), ước lượng kích thước/khối lượng (Gram) và tra cứu bảng dinh dưỡng chuẩn (Calories, Protein, Fat, Carb).
- **Content-Type:** `multipart/form-data`
- **Form Data Parameters:**

| Tên trường | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả & Hướng dẫn sử dụng |
|---|---|:---:|:---:|---|
| `image` | `File` (Binary) | **Có** | - | File ảnh định dạng JPEG/PNG, dung lượng tối đa **15MB**. |
| `container_type` | `string` | Không | `null` | Loại vật đựng: `"chen"` (chén), `"to"` (tô/bát), `"to_lon"` (tô lớn), `"dia"` (đĩa), `"dia_nho"` (đĩa nhỏ), `"dia_lon"` (đĩa lớn), `"hop"` (hộp). Giúp AI tối ưu thuật toán ước lượng khẩu phần. |
| `response_format` | `string` | Không | `"full"` | `"full"`: Trả về đầy đủ bounding box, mask polygon, ảnh vẽ overlay base64 và dinh dưỡng.<br>`"nutrition"`: Chỉ trả về mảng danh sách calo/dinh dưỡng rút gọn. |

- **Phản hồi thành công (200 OK) - Định dạng `full`:**
  ```json
  {
    "image": {
      "width": 1280,
      "height": 720
    },
    "image_quality": {
      "sharpness": 142.5,
      "brightness": 128.0,
      "is_blurry": false,
      "issues": [],
      "recommendations": []
    },
    "calibration": {
      "cm_per_pixel": 0.0452,
      "method": "detected_plate_contour",
      "confidence": 0.88,
      "reference": { "diameter_cm": 22.0 }
    },
    "items": [
      {
        "class_id": 47,
        "label": "Phở",
        "detection_confidence": 0.942,
        "bbox_xyxy": [150.2, 120.5, 890.0, 680.4],
        "mask_polygons": [
          [[150, 120], [180, 110], [890, 680], [150, 120]]
        ],
        "portion": {
          "weight_g": 520.0,
          "range_g": [470.0, 570.0],
          "method": "segmented_area_prior",
          "confidence": 0.85,
          "area_px": 284000,
          "volume_cm3": 510.5
        },
        "food": {
          "food_id": "DISH_PHO",
          "name": "Phở",
          "base_portion_g": 500,
          "estimated_portion_g": 520.0,
          "estimated_totals": {
            "calories_kcal": 485.6,
            "protein_g": 24.5,
            "fat_g": 12.8,
            "carb_g": 68.2
          },
          "estimated_components": [
            {
              "name": "Bánh phở",
              "estimated_g": 260.0,
              "calories_kcal": 286.0,
              "protein_g": 5.2,
              "fat_g": 1.0,
              "carb_g": 62.4
            },
            {
              "name": "Thịt bò tái/nạm",
              "estimated_g": 104.0,
              "calories_kcal": 156.0,
              "protein_g": 18.2,
              "fat_g": 9.2,
              "carb_g": 0.0
            }
          ]
        }
      }
    ],
    "foods": [
      /* Mảng tổng hợp các đối tượng food */
    ],
    "visual_base64": "/9j/4AAQSkZJRgABAQAAAQ...",
    "warnings": []
  }
  ```

> [!TIP]
> **Hiển thị ảnh kết quả vẽ sẵn trên Frontend:**  
> Bạn chỉ cần dùng trường `visual_base64` và gắn trực tiếp vào thẻ ảnh:
> ```html
> <img src={`data:image/jpeg;base64,${data.visual_base64}`} alt="Ket qua AI" />
> ```

- **Phản hồi (200 OK) - Định dạng `nutrition`:**
  ```json
  {
    "food_id": "DISH_PHO",
    "name": "Phở",
    "base_portion_g": 500,
    "components": [
      {
        "name": "Bánh phở",
        "default_g": 250,
        "cal_per_100g": 110,
        "protein": 2.0,
        "fat": 0.4,
        "carb": 24.0
      }
    ]
  }
  ```

---

#### 3.2.2. Kiểm tra thông tin Model AI (`GET /api/v1/model/info`)
- **Chức năng:** Lấy thông tin về trọng số YOLO, phiên bản detector và danh sách tính năng hỗ trợ.
- **Phản hồi thành công (200 OK):**
  ```json
  {
    "api_version": "0.5.1",
    "model_source": "environment",
    "model_exists": true,
    "detector": {
      "class_count": 68,
      "classes": ["Bánh canh", "Bánh chưng", "Bún bò Huế", "Phở", ...]
    },
    "readiness": {
      "status": "candidate",
      "detector_candidate": true
    }
  }
  ```

---

### 3.3. Nhóm System & Health

---

#### 3.3.1. System Health Check (`GET /health`)
- **Chức năng:** Kiểm tra sức khỏe toàn hệ thống (Database, Model AI đã nạp chưa).
- **Phản hồi thành công (200 OK):**
  ```json
  {
    "status": "ok",
    "model_configured": true,
    "model_exists": true,
    "model_file": "best.pt",
    "analyzer_loaded": true,
    "database_configured": true
  }
  ```

---

## 💻 4. CODE MẪU TÍCH HỢP (FRONTEND / REACT NATIVE)

### 4.1. Axios Interceptor tự động Refresh Token khi 401

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

// Gắn token vào mỗi Request
api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('access_token'); // hoặc lấy từ SecureStore
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xử lý khi Token hết hạn (401)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post('http://127.0.0.1:8000/api/v1/auth/refresh', {
          refresh_token: refreshToken,
        });

        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);

        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return api(originalRequest);
      } catch (refreshErr) {
        // Đăng xuất và điều hướng về trang Login
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

### 4.2. Gửi ảnh lên API Analyze Food (`/api/v1/food/analyze`)

#### Trong JavaScript / Web (Fetch API):
```javascript
async function analyzeFoodImage(file, containerType = 'to') {
  const formData = new FormData();
  formData.append('image', file);
  if (containerType) {
    formData.append('container_type', containerType);
  }

  const response = await fetch('http://127.0.0.1:8000/api/v1/food/analyze', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Analyze error: ${response.status}`);
  }

  const data = await response.json();
  return data;
}
```

#### Trong React Native (Expo Image Picker / Camera):
```typescript
import api from './api';

export async function uploadMealPhoto(imageUri: string, containerType = 'dia') {
  const formData = new FormData();
  
  const filename = imageUri.split('/').pop() || 'photo.jpg';
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : 'image/jpeg';

  formData.append('image', {
    uri: imageUri,
    name: filename,
    type,
  } as any);

  formData.append('container_type', containerType);

  const response = await api.post('/api/v1/food/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}
```

---


Theo đặc tả `Project_Features_Requirements.md`, các tính năng tiếp theo sẽ được bổ sung vào Backend:
1. **Khảo sát Onboarding & Tính chỉ số:**
   - Cập nhật thông tin: `age`, `gender`, `height`, `weight`, `activity_level`, `goal`.
   - Tính toán tự động: **BMI** và **TDEE / Target Calories** (theo thuật toán Mifflin-St Jeor).
2. **Nhật ký Bữa ăn (Meal Tracking):**
   - API lưu bữa ăn (Breakfast, Lunch, Dinner, Snack) sau khi AI nhận diện.
   - API lấy lịch sử bữa ăn theo ngày.
3. **Thống kê Dashboard:**
   - So sánh calo đã nạp vs calo mục tiêu trong ngày.

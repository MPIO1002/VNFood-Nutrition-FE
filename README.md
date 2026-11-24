# CaloViet AI

A mobile calorie and nutrition tracking application for Vietnamese food. Users can take or select a food photo, analyze its nutrition with AI, adjust the results, save meals, and track progress by day or week.

## Key Features

- Register, log in, and maintain user sessions
- Set up a health profile through a multi-step workflow
- Capture or select an image from the library to scan food
- Select a bowl, plate, or container type before analysis
- View calories, protein, carbohydrates, fat, and food components
- Adjust weight and nutrition values before saving
- Save meals as breakfast, lunch, dinner, or snack
- View meal logs by day and month
- Track calories, goals, and nutrition distribution by week or month
- Manage personal profile information

## Technology Stack

| Component | Technology |
|---|---|
| Platform | Expo SDK 58, React Native 0.88 |
| Language | TypeScript |
| Navigation | Expo Router |
| Data Management | TanStack React Query, Axios |
| UI | NativeWind/Tailwind CSS, React Native, Lucide |
| Forms and Validation | React Hook Form, Zod |
| Device Features | Expo Camera, Image Picker, Secure Store |
| API Client | Orval/OpenAPI |

## Application Screenshots

<p align="center">
  <img width="48%" alt="caloviet-homescreen" src="https://github.com/user-attachments/assets/ee465cef-99cf-4d6b-a744-7928f9bc1a8d" />
  <img width="48%" alt="caloviet-analytics-screen" src="https://github.com/user-attachments/assets/d7058dfd-a54a-4898-a5d2-04ad8c5a12d3" />

</p>

<p align="center">
  <img width="48%" alt="caloviet-diaryscreen" src="https://github.com/user-attachments/assets/59e28729-d8a6-4ec6-96de-ae83fe396105" />
  <img width="48%" alt="caloviet-profilescreen" src="https://github.com/user-attachments/assets/79f15127-c3c3-4f3b-84c7-1d6146ab17a9" />
</p>

<p align="center">
  <img width="48%" alt="caloviet-scanscreen" src="https://github.com/user-attachments/assets/28fe53ac-80ca-4da7-8261-08df834b71b3" />

</p>



## Project Architecture

```text
src/
├── app/                 # Expo Router routes and screens
├── api/                 # Axios, authentication sessions, and mutator
├── components/          # Shared components
├── features/            # Feature-based application modules
│   ├── analyzer/        # Camera, image analysis, and meal saving
│   ├── auth/            # Login, registration, and authentication
│   ├── health-register/ # Health profile setup
│   ├── meal/            # Meals and daily calorie totals
│   ├── diary/           # Monthly meal diary
│   ├── analytics/       # Statistics and nutrition distribution
│   └── profile/         # User profile
├── constants/           # Constants and configuration data
├── hooks/               # Shared hooks
├── lib/                 # Utility functions
└── types/               # Shared type definitions
```

## Navigation

| Route | Screen |
|---|---|
| `src/app/index.tsx` | Authentication screen |
| `src/app/(tabs)/home.tsx` | Home |
| `src/app/(tabs)/analytics.tsx` | Nutrition analytics |
| `src/app/(tabs)/diary.tsx` | Monthly diary |
| `src/app/(tabs)/profile.tsx` | Personal profile |
| `src/app/scan/index.tsx` | Capture/select image and analyze |
| `src/app/meal_detail/index.tsx` | Meal details |
| `src/app/register/` | Health profile setup |

The main navigation contains: Home, Analytics, AI Scanner, Diary, and Profile.

## Food Scanning and Meal Saving Flow

```text
Home
  -> AI Scanner
  -> Capture or select an image
  -> Select a container
  -> Send the image to the API
  -> Display nutrition results
  -> Adjust components or weight
  -> Select a meal type
  -> Save the meal
  -> Update Home, Diary, and Analytics
```

The image is sent as a multipart request together with the container type and response format. The frontend validates input and API responses with Zod, then converts the response into a model used by the interface before allowing the user to save the meal.

## Installation

### Requirements

- Node.js
- npm
- Expo CLI through `npx expo`
- Android Emulator, iOS Simulator, or a physical device
- A running backend API

### Start the App

```bash
npm install
npx expo start
```

You can also open the app with:

```bash
npx expo start --android
npx expo start --ios
npx expo start --web
```

## Environment Configuration

Create an `.env` file in the project root:

```env
EXPO_PUBLIC_API_URL=http://<backend-address>:8000
```

When testing on a physical device, replace `<backend-address>` with the development computer's LAN IP address. Do not store passwords, tokens, or secret keys in variables prefixed with `EXPO_PUBLIC_*`, because these variables may be bundled into the application.

## API and Code Generation

The project uses Orval to generate React Query clients and type definitions from OpenAPI.

```bash
npm run api:gen
```

The default OpenAPI source is configured in `orval.config.ts` at:

```text
http://localhost:8000/openapi.json
```

For endpoint and payload details, see [API_DOCUMENTATION_FE.md](API_DOCUMENTATION_FE.md).

## Development Commands

```bash
npm run start       # Start the Expo development server
npm run android     # Run the native Android app
npm run ios         # Run the native iOS app
npm run web         # Run the web app
npm run lint        # Run ESLint
npx tsc --noEmit    # Run the TypeScript type check
npm run api:gen     # Regenerate the API client from OpenAPI
```


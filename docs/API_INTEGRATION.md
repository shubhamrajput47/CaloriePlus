# CaloriePlus – API Integration

## Backend expectations

The app can work in **demo mode** (mock data) or with a real backend.

### 1. Nutrition analysis (scan/upload)

**Endpoint**: `POST /nutrition/analyze` (or `NUTRITION_AI_API_URL/analyze`)

**Request body** (one of):

- `{ "imageUri": "file://..." }` – local image URI (mobile)
- `{ "imageBase64": "data:image/..." }` – base64 image

**Response**:

```json
{
  "name": "Grilled chicken salad",
  "nutrition": {
    "calories": 350,
    "protein": 28,
    "carbs": 22,
    "fat": 16,
    "fiber": 4,
    "sugar": 6
  },
  "servingSize": "1 bowl",
  "servingUnit": "g"
}
```

**Implementation**: Implement this endpoint using any AI/vision API (e.g. OpenAI Vision, Google Cloud Vision, Nutritionix, or a custom model) and return the structure above.

### 2. Diet recommendations

**Endpoint**: `POST /diet/recommend`

**Request body**:

```json
{
  "dailyCalories": 1200,
  "consumedCalories": 800,
  "goalCalories": 2000,
  "totalProtein": 45,
  "totalCarbs": 90,
  "totalFat": 30
}
```

**Response**: Array of `DietRecommendation`:

```json
[
  {
    "id": "1",
    "title": "Add a healthy snack",
    "description": "You have room for a small snack.",
    "reason": "Calorie deficit",
    "priority": "high",
    "category": "calorie"
  }
]
```

### 3. Diet plan generation

**Endpoint**: `POST /diet/plan`

**Request body**:

```json
{
  "goalCalories": 2000,
  "durationDays": 7,
  "preference": "vegetarian"
}
```

**Response**: `DietPlan` (see `src/models/diet.ts`).

## Axios client

- **Base URL**: from `.env` `API_BASE_URL`.
- **Headers**: `X-API-Key: API_KEY` from `.env`.
- **Auth**: Token can be attached in `api` interceptors (see `src/services/api.ts`).

## When no backend is set

- **Nutrition**: `getMockAnalyzedFood()` returns sample `FoodItem`.
- **Diet**: `getMockRecommendations()` and `getMockDietPlan()` return in-memory data.
- **Auth**: Demo login/register (no Firebase) when Firebase config is missing.

# CaloriePlus – AI-Based Food Nutrition Scanner

**MCA Major Project** – Production-ready React Native application for scanning food, tracking calories, and generating diet plans.

## Features

- **Scan food** via camera or upload image
- **AI nutrition analysis** (backend/mock)
- **Daily calorie tracker** with chart and history
- **Diet recommendations** based on intake vs goal
- **Personalized diet plan** generation

## Tech stack

- React Native CLI (0.84), TypeScript (strict)
- Redux Toolkit, React Navigation v6
- Axios, Firebase (optional), Formik + Yup
- React Native Vision Camera, Image Picker, React Native Chart Kit
- Jest + React Native Testing Library, ESLint, Prettier

## Quick start

```bash
npm install
cp .env.example .env   # optional: add API/Firebase keys
npm run ios            # or: cd ios && pod install && cd .. && npm run ios
npm run android
```

See [docs/ENVIRONMENT_SETUP.md](docs/ENVIRONMENT_SETUP.md) and [docs/FIREBASE_SETUP.md](docs/FIREBASE_SETUP.md) for full setup.

## Project structure

```
src/
├── assets/
├── components/     # Button, Input, Card, CalorieChart, FoodItemRow
├── navigation/     # Auth, Main Tabs, Scanner/Tracker/Diet stacks
├── screens/        # auth/, scanner/, tracker/, diet/, Home, Profile
├── store/          # auth, scanner, tracker, diet slices
├── services/       # api, firebase, auth, nutrition, diet
├── hooks/, utils/, constants/, theme/, models/, config/
```

## Scripts

| Command           | Description        |
|------------------|--------------------|
| `npm start`      | Metro bundler      |
| `npm run ios`    | Run iOS            |
| `npm run android` | Run Android        |
| `npm run lint`   | ESLint             |
| `npm run typecheck` | TypeScript check |
| `npm test`       | Jest               |
| `npm run format` | Prettier           |

## Documentation

- [Environment setup](docs/ENVIRONMENT_SETUP.md)
- [Firebase setup](docs/FIREBASE_SETUP.md)
- [Architecture & UML/flowcharts](docs/ARCHITECTURE.md)
- [Project doc (scalability, comparison, limitations)](docs/PROJECT_DOCUMENTATION.md)

## License

Private – MCA Major Project.

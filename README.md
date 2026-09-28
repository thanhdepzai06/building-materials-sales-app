# VLXD Sales - Hỗ trợ bán hàng vật liệu xây dựng & Mô phỏng không gian 3D

React Native (Expo SDK 54, TypeScript strict) + React Navigation (Bottom Tabs).
Backend Spring Boot chưa implement -> đang dùng mock data (`src/data/mockData.ts`).

## Chạy dự án
```bash
npm install
npx expo start        # quét QR bằng Expo Go
npm run typecheck     # tsc --noEmit (đã pass)
```

## Cấu trúc thư mục
```
App.tsx                        # NavigationContainer + Dark theme #1A1A1A
src/
  types/index.ts               # Product, QuickAction, Project, RootTabParamList (no 'any')
  data/mockData.ts             # QUICK_ACTIONS(4), TRENDING_PRODUCTS(8), REFERENCE_PROJECTS(6), fetchHomeData()
  components/
    QuickActionItem.tsx        # Icon tròn 64px + label (props: action, onPress)
    ProductCard.tsx            # Card variant 'trending' (140x180) | 'project' (200x150)
  screens/HomeScreen/
    index.tsx                  # Màn hình HOME (Hypic layout, nghiệp vụ VLXD)
    styles.ts                  # StyleSheet.create + COLORS token
  navigation/index.tsx         # Bottom Tab: Home/Simulate/Quote/Profile (#E67E22 active)
```

## Navigation flow
Login -> BottomTabs(Home) -> Quick Action / Main Action -> navigate('Simulate'|'Quote').
Header title động: `route.params?.greeting ?? 'VLXD Sales'`.


// import React, { useState, useCallback } from 'react';
// import { View, Text, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native';
// import { useAppSelector } from '@store/hooks';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';
// import { Card, Button, CalorieChart } from '@components';
// import { colors, spacing, fontSizes } from '@theme';
// import { getMeals, getMealsGroupedByDate, MealData } from '@services/mealService';
// import { BarChart } from 'react-native-chart-kit';

// // ✅ ONLY GALLERY USED
// import { launchImageLibrary } from 'react-native-image-picker';

// const screenWidth = Dimensions.get('window').width;

// export default function HomeScreen() {
//   const navigation = useNavigation();
//   const user = useAppSelector((s) => s.auth.user);
  
//   const [todayMeals, setTodayMeals] = useState<MealData[]>([]);
//   const [totalCalories, setTotalCalories] = useState(0);
//   const [chartData, setChartData] = useState<{ labels: string[], datasets: { data: number[] }[] }>({
//     labels: [],
//     datasets: [{ data: [] }]
//   });

//   const loadData = useCallback(async () => {
//     const allMealsGrouped = await getMealsGroupedByDate();
//     const today = new Date().toISOString().split('T')[0];
//     const todayList = allMealsGrouped[today] || [];
    
//     setTodayMeals(todayList);
//     setTotalCalories(
//   todayList.reduce((acc, m) => acc + Number(m.calories || 0), 0)
// );

//     // Prepare chart data (last 7 days)
//     const last7Days = [];
//     for (let i = 6; i >= 0; i--) {
//       const d = new Date();
//       d.setDate(d.getDate() - i);
//       last7Days.push(d.toISOString().split('T')[0]);
//     }

//     const dataPoints = last7Days.map(date => {
//       const dayMeals = allMealsGrouped[date] || [];
//       return dayMeals.reduce((acc, m) => acc + Number(m.calories || 0), 0);
//     });

//     setChartData({
//       labels: last7Days.map(d => d.split('-')[2]), // Just the day
//       datasets: [{ data: dataPoints }]
//     });
//   }, []);

//   useFocusEffect(
//     useCallback(() => {
//       loadData();
//     }, [loadData])
//   );

//   const goal = user?.dailyCalorieGoal || 2000;

//   // 📸 Camera → Open Scanner Screen
//   const openCamera = () => {
//     (navigation as any).navigate('ScannerTab', { mode: 'camera' });
//   };

//   // 🖼️ Gallery → Pick image → send to Scanner
//   const openGallery = () => {
//     launchImageLibrary(
//       { mediaType: 'photo', quality: 0.8 },
//       (response) => {
//         if (response.didCancel) return;
//         if (response.errorCode) return;

//         const uri = response.assets?.[0]?.uri;

//         if (uri) {
//           (navigation as any).navigate('ScannerTab', {
//             mode: 'gallery',
//             imageUri: uri,
//           });
//         }
//       }
//     );
//   };

//   // 🔥 MAIN BUTTON
//   const handleScanPress = () => {
//     Alert.alert('Scan Food', 'Choose an option', [
//       { text: '📸 Camera', onPress: openCamera },
//       { text: '🖼️ Upload from Gallery', onPress: openGallery },
//       { text: 'Cancel', style: 'cancel' },
//     ]);
//   };

//   return (
//     <ScrollView
//       style={styles.container}
//       contentContainerStyle={styles.content}
//       showsVerticalScrollIndicator={false}
//     >
//       <Text style={styles.greeting}>
//         Hello, {user?.displayName ?? user?.email ?? 'User'}
//       </Text>

//       <Card style={styles.card}>
//         <CalorieChart
//           consumed={totalCalories}
//           goal={goal}
//           label="Today's intake"
//         />
//       </Card>

//       <Text style={styles.sectionTitle}>7-Day History</Text>
//       <Card style={styles.chartCard}>
//         <BarChart
//           data={chartData}
//           width={screenWidth - spacing.lg * 3}
//           height={200}
//           yAxisLabel=""
//           yAxisSuffix="cal"
//           chartConfig={{
//             backgroundColor: colors.surface,
//             backgroundGradientFrom: colors.surface,
//             backgroundGradientTo: colors.surface,
//             decimalPlaces: 0,
//             color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
//             labelColor: (opacity = 1) => `rgba(117, 117, 117, ${opacity})`,
//             style: { borderRadius: 16 },
//             propsForDots: { r: "6", strokeWidth: "2", stroke: colors.primary }
//           }}
//           verticalLabelRotation={0}
//           style={{ marginVertical: 8, borderRadius: 16 }}
//         />
//       </Card>

//       <Text style={styles.sectionTitle}>Recent Meals</Text>
//       {todayMeals.length === 0 ? (
//         <Card style={styles.emptyCard}>
//           <Text style={styles.emptyText}>No meals logged today yet.</Text>
//         </Card>
//       ) : (
//         todayMeals.slice(0, 5).map((meal, index) => (
//           <Card key={index} style={styles.mealCard}>
//             <View style={styles.mealRow}>
//               <View>
//                 <Text style={styles.mealName}>{meal.foodName}</Text>
//                 <Text style={styles.mealTime}>
//                   {new Date(meal.timestamp || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                 </Text>
//               </View>
//               <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
//             </View>
//           </Card>
//         ))
//       )}

//       <View style={styles.actions}>
//         <Button
//           title="Scan food"
//           onPress={handleScanPress}
//           style={styles.actionBtn}
//         />

//         <Button
//           title="View full tracker"
//           onPress={() => (navigation as any).navigate('TrackerTab')}
//           variant="outline"
//           style={styles.actionBtn}
//         />
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: colors.background },
//   content: { padding: spacing.lg, paddingBottom: spacing.xxl },
//   greeting: {
//     fontSize: fontSizes.h3,
//     fontWeight: '700',
//     color: colors.text,
//     marginTop: spacing.xl,
//     marginBottom: spacing.md,
//   },
//   card: { marginBottom: spacing.lg },
//   chartCard: { paddingRight: spacing.lg, alignItems: 'center' },
//   sectionTitle: {
//     fontSize: fontSizes.md,
//     fontWeight: '600',
//     color: colors.textSecondary,
//     marginBottom: spacing.sm,
//     marginTop: spacing.md,
//     textTransform: 'uppercase',
//     letterSpacing: 1,
//   },
//   mealCard: { marginBottom: spacing.xs, paddingVertical: spacing.sm },
//   mealRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   mealName: { fontSize: fontSizes.md, fontWeight: '600', color: colors.text },
//   mealTime: { fontSize: fontSizes.sm, color: colors.textSecondary },
//   mealCalories: { fontSize: fontSizes.md, fontWeight: '700', color: colors.primary },
//   emptyCard: { padding: spacing.lg, alignItems: 'center' },
//   emptyText: { color: colors.textSecondary, fontStyle: 'italic' },
//   actions: { marginTop: spacing.xl, gap: spacing.xs },
//   actionBtn: { marginTop: spacing.sm },
// });




import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native';
import { useAppSelector } from '@store/hooks';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Card, Button, CalorieChart } from '@components';
import { colors, spacing, fontSizes } from '@theme';
import { getMealsGroupedByDate, MealData } from '@services/mealService';
import { BarChart } from 'react-native-chart-kit';
import { launchImageLibrary } from 'react-native-image-picker';

const screenWidth = Dimensions.get('window').width;

// ✅ FIX: Local date function (NO timezone bug)
const getLocalDate = (d: Date) => d.toLocaleDateString('en-CA'); // YYYY-MM-DD

export default function HomeScreen() {
  const navigation = useNavigation();
  const user = useAppSelector((s) => s.auth.user);
  
  const [todayMeals, setTodayMeals] = useState<MealData[]>([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [] }]
  });

  const loadData = useCallback(async () => {
    const allMealsGrouped = await getMealsGroupedByDate();

    // ✅ FIX: use local date
    const today = getLocalDate(new Date());
    const todayList = allMealsGrouped[today] || [];

    setTodayMeals(todayList);

    setTotalCalories(
      todayList.reduce((acc, m) => acc + Number(m.calories || 0), 0)
    );

    // ✅ Prepare last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7Days.push(getLocalDate(d)); // ✅ FIX
    }

    // ✅ Calories per day
    const dataPoints = last7Days.map(date => {
      const dayMeals = allMealsGrouped[date] || [];
      return dayMeals.reduce((acc, m) => acc + Number(m.calories || 0), 0);
    });

    // ✅ FIX: Better labels (Mon, Tue...)
    const labels = last7Days.map(date => {
      const d = new Date(date);
      return d.toLocaleDateString('en-US', { weekday: 'short' });
    });

    setChartData({
      labels,
      datasets: [{ data: dataPoints }]
    });

  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const goal = user?.dailyCalorieGoal || 2000;

  const openCamera = () => {
    (navigation as any).navigate('ScannerTab', { mode: 'camera' });
  };

  const openGallery = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.8 },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) return;

        const uri = response.assets?.[0]?.uri;

        if (uri) {
          (navigation as any).navigate('ScannerTab', {
            mode: 'gallery',
            imageUri: uri,
          });
        }
      }
    );
  };

  const handleScanPress = () => {
    Alert.alert('Scan Food', 'Choose an option', [
      { text: '📸 Camera', onPress: openCamera },
      { text: '🖼️ Upload from Gallery', onPress: openGallery },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const isEmptyChart = chartData.datasets[0].data.every(v => v === 0);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.greeting}>
        Hello, {user?.displayName ?? user?.email ?? 'User'}
      </Text>

      <Card style={styles.card}>
        <CalorieChart
          consumed={totalCalories}
          goal={goal}
          label="Today's intake"
        />
      </Card>

      <Text style={styles.sectionTitle}>7-Day History</Text>

      <Card style={styles.chartCard}>
        {isEmptyChart ? (
          <Text style={{ color: colors.textSecondary }}>
            No data for last 7 days
          </Text>
        ) : (
          <BarChart
            data={chartData}
            width={screenWidth - spacing.lg * 3}
            height={200}
            yAxisSuffix="cal"
            chartConfig={{
              backgroundColor: colors.surface,
              backgroundGradientFrom: colors.surface,
              backgroundGradientTo: colors.surface,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(117, 117, 117, ${opacity})`,
            }}
            style={{ marginVertical: 8, borderRadius: 16 }}
          />
        )}
      </Card>

      <Text style={styles.sectionTitle}>Recent Meals</Text>

      {todayMeals.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyText}>No meals logged today yet.</Text>
        </Card>
      ) : (
        todayMeals.slice(0, 5).map((meal, index) => (
          <Card key={index} style={styles.mealCard}>
            <View style={styles.mealRow}>
              <View>
                <Text style={styles.mealName}>{meal.foodName}</Text>
                <Text style={styles.mealTime}>
                  {new Date(meal.timestamp || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
              <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
            </View>
          </Card>
        ))
      )}

      <View style={styles.actions}>
        <Button
          title="Scan food"
          onPress={handleScanPress}
          style={styles.actionBtn}
        />

        <Button
          title="View full tracker"
          onPress={() => (navigation as any).navigate('TrackerTab')}
          variant="outline"
          style={styles.actionBtn}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  greeting: {
    fontSize: fontSizes.h3,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  card: { marginBottom: spacing.lg },
  chartCard: { paddingRight: spacing.lg, alignItems: 'center' },
  sectionTitle: {
    fontSize: fontSizes.md,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  mealCard: { marginBottom: spacing.xs, paddingVertical: spacing.sm },
  mealRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mealName: { fontSize: fontSizes.md, fontWeight: '600', color: colors.text },
  mealTime: { fontSize: fontSizes.sm, color: colors.textSecondary },
  mealCalories: { fontSize: fontSizes.md, fontWeight: '700', color: colors.primary },
  emptyCard: { padding: spacing.lg, alignItems: 'center' },
  emptyText: { color: colors.textSecondary, fontStyle: 'italic' },
  actions: { marginTop: spacing.xl, gap: spacing.xs },
  actionBtn: { marginTop: spacing.sm },
});
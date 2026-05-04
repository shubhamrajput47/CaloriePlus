// import React, { useState } from "react";
// import { View, Text, StyleSheet, FlatList } from 'react-native';

// type NutritionListProps = {
//   data: any; // better: proper type use karo
// };
// const friends = [
//   { id: '1', name: 'Aman', age: 22 },
//   { id: '2', name: 'Riya', age: 21 },
//   { id: '3', name: 'Rahul', age: 23 },
//   { id: '4', name: 'Sneha', age: 20 },
// ];
// const renderItem = ({ item }) => {
//     console.log('shubham=-=-=',item);
    
//     return(  
//     <View style={styles.container}>
//       <Text  style={styles.name}> {item?.nutrientName}:   {item?.nutrientNumber} {item?.unitName}</Text>

//     </View>
    
//   );

// }
// export const NutritionList = ({ data }: NutritionListProps) => {
//  const [isnutritions,setnutritions]= useState('')
//   console.log('data=-=-=-=',data);
  
//     return(
        
//         <View style={styles.container}>
//       <FlatList
//         data={data?.nutrition}
//         renderItem={renderItem}
//         //keyExtractor={(item) => item.id}
//       />
//     </View>
//     );
// };
// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',   
//     justifyContent: 'space-between',
//     marginTop: 10,
//     marginHorizontal: 10,
//   },
//   // card: {
//   //   padding: 15,
//   //   marginBottom: 10,
//   //   backgroundColor: '#f2f2f2',
//   //   borderRadius: 10,
//   // },
//   name: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },

// });

import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import { colors, spacing, fontSizes } from '@theme';
import { Card } from '@components';
import { saveMeal } from '@services/mealService';

type NutritionItem = {
  nutrientName: string;
  nutrientNumber: number;
  unitName: string;
};

type NutritionListProps = {
  data: {
    name?: string;
    nutrition: NutritionItem[];
  };
};

export const NutritionList = ({ data }: NutritionListProps) => {
  const navigation = useNavigation();

  const renderItem = ({ item, index }: { item: NutritionItem; index: number }) => {
    return (
      <View style={styles.row}>
        <Text style={styles.nutrientName}>{item?.nutrientName}</Text>
        <Text style={styles.nutrientValue}>
          {item?.nutrientNumber} {item?.unitName}
        </Text>
      </View>
    );
  };

  const saveNutritionData = async () => {
    try {
      // 1. Extract Macros
      const findNutrient = (namePatterns: string[], unit?: string) => {
        return data.nutrition.find(n => 
          namePatterns.some(p => n.nutrientName.toLowerCase().includes(p.toLowerCase())) &&
          (!unit || n.unitName.toLowerCase() === unit.toLowerCase())
        )?.nutrientNumber || 0;
      };

      const mealData = {
        foodName: data.name || 'Unknown Food',
        calories: findNutrient(['energy', 'calories'], 'kcal'),
        protein: findNutrient(['protein']),
        fat: findNutrient(['fat', 'lipid']),
        carbs: findNutrient(['carbohydrate']),
      };

      // 2. Save to local storage (UID-scoped via MealService)
      await saveMeal(mealData);
      
      console.log('✅ Data Saved Locally');
      navigation.goBack();
    } catch (error) {
      console.log('❌ Error saving data:', error);
      Alert.alert('Save Error', 'Failed to save meal data.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Card style={styles.headerCard}>
          <Text style={styles.title}>{data?.name || 'Nutrition Facts'}</Text>
          <Text style={styles.subtitle}>Detailed nutrient breakdown</Text>
        </Card>

        <Card style={styles.listCard}>
          <FlatList
            data={data?.nutrition}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </Card>

        <TouchableOpacity style={styles.button} onPress={saveNutritionData}>
          <Text style={styles.buttonText}>Add to Daily Log</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  headerCard: {
    marginBottom: spacing.md,
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  listCard: {
    flex: 1,
    marginBottom: spacing.lg,
    padding: 0, // override default padding for the list
    overflow: 'hidden',
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: '700',
    color: colors.text,
    textTransform: 'capitalize',
  },
  subtitle: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  nutrientName: {
    fontSize: fontSizes.md,
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  nutrientValue: {
    fontSize: fontSizes.md,
    fontWeight: '600',
    color: colors.primary,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: colors.white,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
  backButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  backButtonText: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
});

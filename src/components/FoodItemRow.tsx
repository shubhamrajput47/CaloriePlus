/**
 * Single food item row for lists - optimized for FlatList
 */
import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FoodItem } from '@models/nutrition';
import { colors, spacing, fontSizes } from '@theme';

interface FoodItemRowProps {
  item: FoodItem;
  onPress?: () => void;
  onRemove?: () => void;
  showRemove?: boolean;
}

const FoodItemRow: React.FC<FoodItemRowProps> = ({
  item,
  onPress,
  onRemove,
  showRemove = false,
}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    style={styles.row}
    disabled={!onPress}
  >
    <View style={styles.info}>
      <Text style={styles.name} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.nutrition}>
        {item.nutrition.calories} kcal · P {item.nutrition.protein}g · C{' '}
        {item.nutrition.carbs}g · F {item.nutrition.fat}g
      </Text>
    </View>
    {showRemove && onRemove ? (
      <TouchableOpacity onPress={onRemove} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
        <Text style={styles.remove}>✕</Text>
      </TouchableOpacity>
    ) : null}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  info: { flex: 1 },
  name: {
    fontSize: fontSizes.md,
    fontWeight: '600',
    color: colors.text,
  },
  nutrition: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  remove: {
    fontSize: fontSizes.lg,
    color: colors.error,
    padding: spacing.xs,
  },
});

export default memo(FoodItemRow);

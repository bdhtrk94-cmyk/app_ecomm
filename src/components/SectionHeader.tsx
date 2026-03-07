import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS } from '../constants/theme';

interface SectionHeaderProps {
  title: string;
  showSeeAll?: boolean;
  onSeeAll?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  showSeeAll = false,
  onSeeAll,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {showSeeAll && (
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={styles.seeAll}>SEE ALL</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: SIZES.fontXl,
    color: COLORS.textPrimary,
    ...FONTS.bold,
  },
  seeAll: {
    fontSize: SIZES.fontSm,
    color: COLORS.secondary,
    ...FONTS.semiBold,
  },
});

export default SectionHeader;

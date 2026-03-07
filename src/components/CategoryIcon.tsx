import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS } from '../constants/theme';

interface CategoryIconProps {
  name: string;
  image: string;
  onPress?: () => void;
  size?: 'small' | 'large';
  isDome?: boolean;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({
  name,
  image,
  onPress,
  size = 'small',
  isDome = false,
}) => {
  const isLarge = size === 'large';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.container, isLarge && styles.containerLarge]}
    >
      <View
        style={[
          styles.imageWrapper,
          isLarge ? styles.imageWrapperLarge : styles.imageWrapperSmall,
          isDome && styles.domeShape,
        ]}
      >
        <Image
          source={{ uri: image }}
          style={[styles.image, isLarge && styles.imageLarge]}
          resizeMode="cover"
        />
      </View>
      <Text
        style={[styles.label, isLarge && styles.labelLarge]}
        numberOfLines={2}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 72,
    marginHorizontal: 4,
  },
  containerLarge: {
    width: '31%',
    marginBottom: 16,
  },
  imageWrapper: {
    overflow: 'hidden',
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapperSmall: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  imageWrapperLarge: {
    width: '100%',
    height: 110,
    borderRadius: SIZES.radiusLg,
  },
  domeShape: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: SIZES.radiusMd,
    borderBottomRightRadius: SIZES.radiusMd,
    backgroundColor: COLORS.primaryLight + '30',
  },
  image: {
    width: '85%',
    height: '85%',
    borderRadius: 28,
  },
  imageLarge: {
    width: '100%',
    height: '100%',
    borderRadius: SIZES.radiusLg,
  },
  label: {
    fontSize: SIZES.fontXs,
    color: COLORS.textPrimary,
    ...FONTS.medium,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 14,
  },
  labelLarge: {
    fontSize: SIZES.fontSm,
    marginTop: 8,
  },
});

export default CategoryIcon;

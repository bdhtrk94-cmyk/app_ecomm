import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  placeholder?: string;
  onPress?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'What are you looking for?',
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.container}
    >
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color="#888" style={styles.icon} />
        <Text style={styles.placeholderText} numberOfLines={1}>{placeholder}</Text>
        <View style={styles.divider} />
        <View style={styles.cameraBtn}>
          <Ionicons name="camera-outline" size={20} color="#666" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 16,
    height: 46,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  icon: {
    marginRight: 10,
  },
  placeholderText: {
    flex: 1,
    fontSize: 14,
    color: '#999',
    fontWeight: '400',
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 10,
  },
  cameraBtn: {
    padding: 4,
  },
});

export default SearchBar;

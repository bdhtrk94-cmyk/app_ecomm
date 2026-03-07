import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Image,
  Dimensions,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_WIDTH = SCREEN_WIDTH - 48; // Narrower to peek next slide
const BANNER_GAP = 8;

interface Banner {
  id: number;
  image: string;
  backgroundColor?: string;
}

interface BannerCarouselProps {
  banners: Banner[];
  height?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const BannerCarousel: React.FC<BannerCarouselProps> = ({
  banners,
  height = 160,
  autoPlay = true,
  autoPlayInterval = 3000,
}) => {
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay || banners.length <= 1) return;

    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % banners.length;
      scrollRef.current?.scrollTo({
        x: nextIndex * (BANNER_WIDTH + BANNER_GAP),
        animated: true,
      });
      setActiveIndex(nextIndex);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [activeIndex, autoPlay, autoPlayInterval, banners.length]);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / (BANNER_WIDTH + BANNER_GAP)
    );
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        snapToInterval={BANNER_WIDTH + BANNER_GAP}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
        style={[styles.scroll, { height }]}
      >
        {banners.map((banner, index) => (
          <View
            key={banner.id}
            style={[
              styles.slide,
              {
                width: BANNER_WIDTH,
                height,
                marginRight: index < banners.length - 1 ? BANNER_GAP : 0,
                backgroundColor: banner.backgroundColor || COLORS.primaryLight,
              },
            ]}
          >
            <Image
              source={{ uri: banner.image }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          </View>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  scroll: {
    overflow: 'visible',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  slide: {
    borderRadius: SIZES.radiusLg,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 18,
    borderRadius: 4,
  },
  inactiveDot: {
    backgroundColor: COLORS.border,
  },
});

export default BannerCarousel;

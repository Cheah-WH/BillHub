import React, { useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { COLORS } from "../constant";

const { width } = Dimensions.get('window');

const ImageSlider = ({ images, interval = 3000 }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  const intervalRef = useRef(null);

  const startAutoScroll = () => {
    intervalRef.current = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % images.length;
        flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
        return nextIndex;
      });
    }, interval);
  };

  const stopAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const resetAutoScroll = () => {
    stopAutoScroll();
    startAutoScroll();
  };

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, [images.length, interval]);

  const handlePaginationDot = (index) => {
    setActiveIndex(index);
    flatListRef.current.scrollToIndex({ index, animated: true });
    resetAutoScroll();
  };

  const renderItem = ({ item }) => (
    <Image source={item.uri} style={styles.image} resizeMode="cover" />
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={images}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(event) => {
          const slideIndex = Math.ceil(event.nativeEvent.contentOffset.x / width);
          if (slideIndex !== activeIndex) {
            setActiveIndex(slideIndex);
            resetAutoScroll();
          }
        }}
        keyExtractor={(item) => item.id.toString()}
      />
      <View style={styles.pagination}>
        {images.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.dot, index === activeIndex && styles.activeDot]}
            onPress={() => handlePaginationDot(index)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width,
    height: 600, 
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  dot: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: COLORS.plain,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: COLORS.primary, 
  },
});

export default ImageSlider;

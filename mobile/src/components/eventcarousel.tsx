import { useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, type NativeSyntheticEvent, type NativeScrollEvent } from 'react-native';
import { color, space } from '../theme/tokens';
import { EventCard } from './eventcard';
import type { event } from '../services/api';

const screenWidth = Dimensions.get('window').width;

export function EventCarousel({ events }: { events: event[] }) {
  const [pageWidth, setPageWidth] = useState(screenWidth);
  const [index, setIndex] = useState(0);

  if (events.length === 0) return null;

  function onScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    if (!pageWidth) return;
    setIndex(Math.round(e.nativeEvent.contentOffset.x / pageWidth));
  }

  return (
    <View onLayout={(e) => setPageWidth(e.nativeEvent.layout.width)}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {events.map((item) => (
          <View key={item.id} style={[styles.page, { width: pageWidth }]}>
            <EventCard title={item.title} subtitle={item.subtitle} />
          </View>
        ))}
      </ScrollView>
      {events.length > 1 ? (
        <View style={styles.dots}>
          {events.map((item, i) => (
            <View key={item.id} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: space.lg },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: space.xs, marginTop: space.sm },
  dot: { width: 6, height: 6, borderRadius: 999, backgroundColor: color.border },
  dotActive: { backgroundColor: color.brownInk },
});

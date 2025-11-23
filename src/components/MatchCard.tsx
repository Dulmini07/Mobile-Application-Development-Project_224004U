import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MatchCard({ item, onPress, onFavourite, onToggleFavourite, isFav, status }: any) {
  const handleFav = () => {
    // prefer a single handler
    if (onToggleFavourite) return onToggleFavourite();
    if (onFavourite) return onFavourite();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.card}
      activeOpacity={0.9}
    >
      {/* status badge */}
      {status ? (
        <View style={[styles.badge, status === 'Active' ? styles.badgeActive : status === 'Upcoming' ? styles.badgeUpcoming : styles.badgePopular]}>
          <Text style={styles.badgeText}>{status}</Text>
        </View>
      ) : null}

      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.time ?? item.score}</Text>
        </View>
        <TouchableOpacity
          onPress={(e: any) => {
            // prevent parent onPress
            e?.stopPropagation?.();
            handleFav();
          }}
          accessibilityRole="button"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="heart" size={24} color={isFav ? 'red' : 'gray'} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 2,
  },
  image: { width: '100%', height: 150 },
  row: { padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '700' },
  subtitle: { color: '#555', marginTop: 4 },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 10,
  },
  badgeText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  badgeActive: { backgroundColor: '#28a745' },
  badgeUpcoming: { backgroundColor: '#ffc107' },
  badgePopular: { backgroundColor: '#6f42c1' },
});

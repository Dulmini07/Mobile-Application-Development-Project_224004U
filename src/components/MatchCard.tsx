import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export default function MatchCard({ item, onPress, onFavourite, onToggleFavourite, isFav }: any) {
  const handleFav = () => {
    // prefer a single handler
    if (onToggleFavourite) return onToggleFavourite();
    if (onFavourite) return onFavourite();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        marginBottom: 20,
        overflow: 'hidden',
        elevation: 2,
      }}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.image }} style={{ width: '100%', height: 150 }} />
      <View
        style={{
          padding: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View style={{ flex: 1, paddingRight: 8 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
          {item.time ? (
            <Text style={{ color: '#666', marginTop: 4 }}>{item.time}</Text>
          ) : null}
          {item.score ? (
            <Text style={{ color: '#333', marginTop: 6, fontWeight: '600' }}>{item.score}</Text>
          ) : null}
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

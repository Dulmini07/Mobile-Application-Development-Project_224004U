import React, { useEffect, useRef } from 'react';
import { View, FlatList, Text } from 'react-native';
import { useAppSelector } from '@/src/store/hooks';
import MatchCard from '@/src/components/MatchCard';

export default function FavouritesScreen() {
  const favourites = useAppSelector((state) => state.favourites.items);

  // debug: track previous value
  const prevRef = useRef<any[]>([]);
  useEffect(() => {
    console.log('[FAVOURITES] current:', favourites.map((f) => f.id));
    console.log('[FAVOURITES] previous:', prevRef.current.map((f) => f.id));
    prevRef.current = favourites;
  }, [favourites]);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>
        My Favourites
      </Text>
      {favourites.length === 0 ? (
        <Text>No favourites yet</Text>
      ) : (
        <FlatList
          data={favourites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <MatchCard
              item={item}
              isFav
              // removal disabled for debugging
              onFavourite={() => {
                console.log('[FAVOURITES] heart pressed (debug, no remove)', item.id);
              }}
              onPress={() => {}}
            />
          )}
        />
      )}
    </View>
  );
}

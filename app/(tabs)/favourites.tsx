import MatchCard from '@/src/components/MatchCard';
import { useTheme } from '@/src/context/ThemeContext';
import { clearFavourites } from '@/src/store';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import React, { useEffect, useRef } from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';

export default function FavouritesScreen() {
  const { theme } = useTheme();
  const bgColor = theme === 'dark' ? '#12121bff' : '#ffffff';
  const favourites = useAppSelector((state) => state.favourites.items);
  const dispatch = useAppDispatch();

  // helper: derive status if not present on the item
  const deriveStatus = (item: any) => {
    if (item?.status) return item.status;
    const raw = (item as any).raw;
    const date = raw?.dateEvent ?? item?.date ?? item?.time?.split?.(' ')?.[0] ?? null;
    if (!date) return 'Popular';
    const today = new Date().toISOString().slice(0, 10);
    if (date === today) return 'Active';
    return date > today ? 'Upcoming' : 'Popular';
  };

  const confirmClearAll = () => {
    if (!favourites || favourites.length === 0) {
      return;
    }
    Alert.alert(
      'Remove all favourites',
      'Are you sure you want to remove all favourites?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => dispatch(clearFavourites()) },
      ]
    );
  };

  // debug: track previous value
  const prevRef = useRef<any[]>([]);
  useEffect(() => {
    console.log('[FAVOURITES] current:', favourites.map((f) => f.id));
    console.log('[FAVOURITES] previous:', prevRef.current.map((f) => f.id));
    prevRef.current = favourites;
  }, [favourites]);

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: bgColor }}>
      {/* header: title + clear button */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <Text style={{ fontSize: 20, fontWeight: '700', marginTop: 35, color: theme === 'dark' ? '#fff' : '#08122a' }}>My Favourites</Text>
        <TouchableOpacity onPress={confirmClearAll} style={{ paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#ff3b30', borderRadius: 999, elevation: 2 }}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Clear</Text>
        </TouchableOpacity>
      </View>

      {favourites.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 40 }}>
          <Text style={{ color: '#8a95ab' }}>No favourites yet</Text>
        </View>
      ) : (
        <FlatList
          data={favourites}
          keyExtractor={(item, index) =>
            // prefer stored `id`, then original event id from `raw` (casted), then a stable fallback using index
            String(item?.id ?? (item as any)?.raw?.idEvent ?? `${item?.title ?? 'fav'}-${index}`)
          }
          renderItem={({ item }) => (
            <MatchCard
              item={item}
              isFav
              status={deriveStatus(item)} // { changed code: pass status }
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

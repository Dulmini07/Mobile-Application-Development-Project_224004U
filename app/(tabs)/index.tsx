import MatchCard from '@/src/components/MatchCard';
import { addFavourite, removeFavourite } from '@/src/store';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Text, View } from 'react-native';

// Dummy match data
const matches = [
  {
    id: 1,
    title: 'Sri Lanka vs India',
    score: '250/6',
    image: 'https://upload.wikimedia.org/wikipedia/en/2/29/Sri_Lanka_Cricket_logo.svg',
  },
  {
    id: 2,
    title: 'Australia vs England',
    score: '310/8',
    image: 'https://upload.wikimedia.org/wikipedia/en/3/3a/Cricket_Australia_logo.svg',
  },
  {
    id: 3,
    title: 'Pakistan vs South Africa',
    score: '220/9',
    image: 'https://upload.wikimedia.org/wikipedia/en/e/ed/Pakistan_Cricket_Board_Logo.svg',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const favourites = useAppSelector((s) => s.favourites.items);

  const toggleFavourite = (match: any) => {
    const exists = favourites.some((m) => m.id === match.id);
    if (exists) dispatch(removeFavourite(match.id));
    else dispatch(addFavourite(match));
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 15 }}>
        Upcoming Matches
      </Text>

      <FlatList
        data={matches}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <MatchCard
            item={item}
            isFav={favourites.some((m) => m.id === item.id)}
            onFavourite={() => toggleFavourite(item)}
            onPress={() => router.push({ pathname: '/details/[id]', params: item })}
          />
        )}
      />
    </View>
  );
}

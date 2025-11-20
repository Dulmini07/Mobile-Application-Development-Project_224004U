import MatchCard from '@/src/components/MatchCard';
import { addFavourite, removeFavourite, RootState } from '@/src/store';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const favourites = useAppSelector((s) => s.favourites.items);

  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 🔥 Get logged-in user from Redux
  const user = useAppSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    let mounted = true;
    const fetchMatches = async () => {
      try {
        setLoading(true);
        // example league id used in instructions (replace id if you want another league)
        const res = await fetch(
          'https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=4328'
        );
        const json = await res.json();
        const events = json?.events ?? [];
        if (!mounted) return;
        // map to simple shape for MatchCard
        const mapped = events.map((e: any) => ({
          id: e.idEvent,
          title: e.strEvent,
          image: e.strThumb ?? e.strBadge ?? 'https://via.placeholder.com/400x200?text=Match',
          time:
            e.dateEvent && e.strTime
              ? `${e.dateEvent} ${e.strTime}`
              : e.strTime ?? e.dateEvent ?? 'TBD',
          score:
            e.intHomeScore != null && e.intAwayScore != null
              ? `${e.intHomeScore} - ${e.intAwayScore}`
              : 'TBD',
          raw: e,
        }));
        setMatches(mapped);
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load matches');
        Alert.alert('Error', e?.message ?? 'Failed to load matches');
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
    return () => {
      mounted = false;
    };
  }, []);

  // Toggle favourites
  const toggleFavourite = (match: any) => {
    const exists = favourites.some((m) => m.id === match.id);
    if (exists) dispatch(removeFavourite(match.id));
    else dispatch(addFavourite(match));
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 12 }}>Loading matches…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
      
      {/* 🔥 Logged-in username at top */}
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
        Welcome, {user?.name || 'Guest'}
      </Text>

      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 15 }}>
        Upcoming Matches
      </Text>

      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MatchCard
            item={item}
            isFav={favourites.some((m) => m.id === item.id)}
            onFavourite={() => toggleFavourite(item)}
            onPress={() =>
              router.push({ pathname: '/details/[id]', params: { id: item.id } })
            }
          />
        )}
      />
    </View>
  );
}

import MatchCard from '@/src/components/MatchCard';
import ImageOrSvg from '@/src/components/ui/ImageOrSvg';
import { useTheme } from '@/src/context/ThemeContext';
import { addFavourite, removeFavourite, RootState } from '@/src/store';
import { updateProfileImage } from '@/src/store/authSlice';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// resolve expo-image-manipulator at runtime (optional)
let ImageManipulator: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ImageManipulator = require('expo-image-manipulator');
} catch {
  ImageManipulator = null;
}

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const containerBg = theme === 'dark' ? '#0b131cff' : '#f6f7fb';
  const favourites = useAppSelector((s) => s.favourites.items);
  const user = useAppSelector((state: RootState) => state.auth.user);
  // Ensure Android content:// profile URIs are converted to file:// if possible
  useEffect(() => {
    (async () => {
      try {
        if (Platform.OS === 'android' && user?.image && String(user.image).startsWith('content://')) {
          if (!ImageManipulator) {
            // eslint-disable-next-line no-console
            console.warn('[HOME] expo-image-manipulator not installed — cannot convert content:// URI for Android');
            return;
          }
          try {
            const m = await ImageManipulator.manipulateAsync(String(user.image), [], {
              format: ImageManipulator.SaveFormat.PNG,
            });
            if (m?.uri) {
              dispatch(updateProfileImage(m.uri));
              // eslint-disable-next-line no-console
              console.log('[HOME] converted profile content:// ->', m.uri);
            }
          } catch (err) {
            // eslint-disable-next-line no-console
            console.log('[HOME] image conversion failed', err);
          }
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('[HOME] normalize image effect error', e);
      }
    })();
  }, [user?.image, dispatch]);

  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // debug: log user image URI when it changes (avoid placing console.log inside JSX)
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('[HOME] user.image ->', user?.image);
  }, [user?.image]);

  // Prefetch helper for home images (normalize svg -> png and prefetch)
  const prefetchImages = async (uris: (string | null | undefined)[], limit = 30) => {
    if (!uris || uris.length === 0) return;
    const normalize = (u: any) => {
      if (!u) return null;
      try {
        const s = String(u);
        if (s.startsWith('http')) {
          return s.endsWith('.svg') ? s.replace(/\.svg(\?.*)?$/i, '.png') : s;
        }
      } catch {}
      return null;
    };
    const candidates = uris.map(normalize).filter(Boolean) as string[];
    const slice = candidates.slice(0, limit);
    await Promise.all(slice.map((u) => Image.prefetch(u).catch(() => false)));
  };

  useEffect(() => {
    let mounted = true;
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          'https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=4328'
        );
        const json = await res.json();
        const events = json?.events ?? [];
        if (!mounted) return;

        const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
        // map to simple shape for MatchCard and add status
        const mapped = events.map((e: any) => {
          const date = e.dateEvent ?? '';
          const status =
            date
              ? date > today
                ? 'Upcoming'
                : date === today
                ? 'Active'
                : 'Popular'
              : 'Popular';
          return {
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
            status,
          };
        });

        // prefetch top match images to warm cache (limit 30)
        await prefetchImages(mapped.map((m: any) => m.image), 30);

        setMatches(mapped);
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load matches');
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
      <View style={localStyles.loadingWrap}>
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
    <View style={{ flex: 1, padding: 20, backgroundColor: containerBg }}>
      {/* header: welcome row (welcome + avatar) and section title below */}
      <View style={localStyles.headerContainer}>
        <View style={localStyles.headerTopRow}>
          {/* center the welcome text while keeping avatar on the right */}
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={[localStyles.welcomeText, { marginTop: 28, marginBottom:10, color: theme === 'dark' ? '#fff' : '#08122a' }]}>
              Welcome, {user?.name ?? user?.username ?? 'Guest'}
            </Text>
          </View>

          <TouchableOpacity onPress={() => router.push('/profile')} style={localStyles.avatarTouch}>
            <ImageOrSvg
              uri={user?.image || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
              style={localStyles.avatarSmall}
            />
          </TouchableOpacity>
        </View>

        <Text style={[localStyles.sectionTitleText, { color: theme === 'dark' ? '#fff' : '#08122a' }]}>
          Upcoming Matches
        </Text>
      </View>

      <FlatList
        data={matches}
        keyExtractor={(item, index) =>
          String(item?.id ?? item?.idEvent ?? `${item?.title ?? 'match'}-${index}`)
        }
        renderItem={({ item }) => (
          <MatchCard
            item={item}
            status={item.status}
            isFav={favourites.some((m) => m.id === item.id)}
            onFavourite={() => toggleFavourite(item)}
            onPress={() =>
              // navigate to details and pass the item; details screen will merge passed fields
              router.push({ pathname: '/details/[id]', params: item })
            }
          />
        )}
      />
    </View>
  );
}

const localStyles = StyleSheet.create({
  headerContainer: {
    marginBottom: 12,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  welcomeText: { fontSize: 22, fontWeight: '700', marginBottom: 0 },
  sectionTitleText: { fontSize: 20, fontWeight: '700' },
  avatarSmall: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: '#fff', marginTop: 18 },
  avatarTouch: { marginLeft: 8 },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

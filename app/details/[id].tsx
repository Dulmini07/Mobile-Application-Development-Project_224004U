import { addFavourite, removeFavourite } from '@/src/store';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// replace static import with runtime require + fallback
let LinearGradient: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  LinearGradient = require('expo-linear-gradient').LinearGradient;
} catch {
  // fallback: simple wrapper that renders a View with same style children
  // keeps UI working if expo-linear-gradient isn't installed
  // eslint-disable-next-line react/display-name
  LinearGradient = ({ children, style }: any) => {
    const { View } = require('react-native');
    return <View style={style}>{children}</View>;
  };
}

export default function MatchDetails() {
  const params = useLocalSearchParams() as Record<string, any>;
  const { id, title, image, score, time } = params;

  // redux hooks for favourites
  const dispatch = useAppDispatch();
  const favourites = useAppSelector((s) => s.favourites.items ?? []);
  const idKey = id ?? title ?? image;
  const isFav = favourites.some((f: any) => (f.idEvent ?? f.id ?? f.title) === idKey);

  // dummy data (local only)
  const dummyHighlights = [
    { id: 'h1', title: 'Match Highlights 1', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { id: 'h2', title: 'Top Goal', url: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ' },
  ];

  const dummyPlayers = [
    { id: 'p1', name: 'A. Silva', position: 'Forward', number: 9, nationality: 'BRA' },
    { id: 'p2', name: 'J. Smith', position: 'Midfielder', number: 8, nationality: 'ENG' },
    { id: 'p3', name: 'L. Gomez', position: 'Defender', number: 4, nationality: 'ESP' },
  ];

  const toggleFavourite = () => {
    // ensure payload matches FavouriteItem (includes `id`)
    const payload = { id: idKey, idEvent: idKey, title, image, score, time };
    if (isFav) dispatch(removeFavourite(idKey));
    else dispatch(addFavourite(payload));
  };

  // Fade + Slide Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* HEADER WITH GRADIENT */}
      <LinearGradient colors={['#0047AB', '#002F6C']} style={styles.header}>
        <Text style={styles.headerTitle}>{title ?? 'Match Details'}</Text>
      </LinearGradient>

      {/* ANIMATED MAIN CARD */}
      <Animated.View
        style={[
          styles.card,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}>
        {/* Team Logo */}
        {image ? (
          <Image source={{ uri: image }} style={styles.logo} />
        ) : (
          <View
            style={[
              styles.logo,
              { backgroundColor: '#eee', borderRadius: 12 },
            ]}
          />
        )}

        <Text style={styles.scoreText}>{score ?? 'Match Soon'}</Text>

        <Text style={styles.label}>Match Time</Text>
        <Text style={styles.value}>{time ?? 'Not Available'}</Text>

        {/* Add / Remove Favourite */}
        <TouchableOpacity
          onPress={toggleFavourite}
          style={{
            marginTop: 12,
            backgroundColor: isFav ? '#ff4444' : '#1e90ff',
            paddingVertical: 10,
            borderRadius: 10,
            alignItems: 'center',
          }}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>
            {isFav ? 'Remove from Favourites' : 'Add to Favourites'}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Animated Section: Highlights */}
      <Animated.View
        style={[
          styles.section,
          {
            opacity: fadeAnim,
          },
        ]}>
        <Text style={styles.sectionTitle}>📺 Highlights</Text>
        {dummyHighlights.map((h) => (
          <TouchableOpacity key={h.id} onPress={() => Linking.openURL(h.url)} style={{ paddingVertical: 8 }}>
            <Text style={{ color: '#1e90ff', fontWeight: '600' }}>{h.title}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>

      {/* Players Section Placeholder */}
      <Animated.View
        style={[
          styles.section,
          {
            opacity: fadeAnim,
          },
        ]}>
        <Text style={styles.sectionTitle}>👥 Players</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
          {dummyPlayers.map((p) => (
            <View key={p.id} style={{ width: 140, marginRight: 12, alignItems: 'center' }}>
              <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#eee', marginBottom: 8 }} />
              <Text style={{ fontWeight: '700' }}>{p.name}</Text>
              <Text style={{ color: '#666' }}>{p.position}</Text>
              <Text style={{ color: '#999' }}>#{p.number} • {p.nationality}</Text>
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginTop: -20,
    width: '90%',
    alignSelf: 'center',
    elevation: 4,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  value: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#f9f9f9',
    marginTop: 20,
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
  },
  sectionTitle: { fontSize: 20, fontWeight: '600' },
  sectionValue: {
    fontSize: 16,
    color: '#777',
    marginTop: 5,
  },
});

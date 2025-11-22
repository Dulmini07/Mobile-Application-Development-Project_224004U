import { addFavourite, removeFavourite } from '@/src/store';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function DetailsScreen() {
  const item = useLocalSearchParams() as any; // full match object passed from Home
  const dispatch = useAppDispatch();
  const favourites = useAppSelector((s) => s.favourites.items || []);
  const idKey = item.idEvent ?? item.id ?? item.id; // accept multiple id shapes
  const isFav = favourites.some((m: any) => (m.idEvent ?? m.id) === idKey);

  const toggleFavourite = () => {
    if (isFav) dispatch(removeFavourite(idKey));
    else dispatch(addFavourite(item));
  };

  const openVideo = (url?: string) => {
    if (!url) return;
    Linking.openURL(url).catch(() => {
      /* ignore errors */
    });
  };

  // friendly fallbacks when SportsDB fields are missing
  const league = item.strLeague ?? item.league ?? 'International Friendly';
  const stadium = item.strVenue ?? item.venue ?? 'National Stadium';
  const sport = item.strSport ?? item.sport ?? 'Football';

  return (
    // make contentContainer fill and center vertically
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* simple header fallback (no expo-linear-gradient required) */}
      <View style={styles.headerFallback}>
        <Text style={styles.headerTitle}>{item.strEvent ?? item.title}</Text>
        <Text style={styles.headerSub}>
          {(item.dateEvent ?? item.date) || ''} {item.strTime ?? item.time ?? ''}
        </Text>
      </View>

      {/* Centered hovering card */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          {/* Card header: repeat match name/details inside the card */}
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{item.strEvent ?? item.title}</Text>
            <Text style={styles.cardSubtitle}>
              {item.strLeague ?? item.league ?? ''} {item.dateEvent ? `• ${item.dateEvent}` : ''}
            </Text>
          </View>

          {/* Teams Row */}
          <View style={styles.teamsRow}>
            <View style={styles.team}>
              {item.strHomeTeamBadge || item.homeBadge || item.homeLogo ? (
                <Image
                  source={{ uri: item.strHomeTeamBadge ?? item.homeBadge ?? item.homeLogo }}
                  style={styles.teamLogo}
                />
              ) : null}
              <Text style={styles.teamName}>{item.strHomeTeam ?? item.homeTeam}</Text>
            </View>

            <View style={styles.vs}>
              <Text style={styles.vsText}>VS</Text>
              {item.intHomeScore != null && item.intAwayScore != null ? (
                <Text style={styles.scoreText}>
                  {item.intHomeScore} - {item.intAwayScore}
                </Text>
              ) : item.score ? (
                <Text style={styles.scoreText}>{item.score}</Text>
              ) : null}
            </View>

            <View style={styles.team}>
              {item.strAwayTeamBadge || item.awayBadge || item.awayLogo ? (
                <Image
                  source={{ uri: item.strAwayTeamBadge ?? item.awayBadge ?? item.awayLogo }}
                  style={styles.teamLogo}
                />
              ) : null}
              <Text style={styles.teamName}>{item.strAwayTeam ?? item.awayTeam}</Text>
            </View>
          </View>

          {/* Info */}
          <View style={styles.info}>
            <Text style={styles.sectionTitle}>Match Info</Text>
            <Text style={styles.infoText}>🏆 League: {league}</Text>
            <Text style={styles.infoText}>🏟 Stadium: {stadium}</Text>
            <Text style={styles.infoText}>⚽ Sport: {sport}</Text>

            <TouchableOpacity
              onPress={toggleFavourite}
              style={[styles.favBtn, { backgroundColor: isFav ? '#ff4444' : '#1e90ff' }]}>
              <Text style={styles.favBtnText}>
                {isFav ? 'Remove from Favourites' : 'Add to Favourites'}
              </Text>
            </TouchableOpacity>

            {item.strDescriptionEN ? (
              <>
                <Text style={styles.sectionTitle}>Overview</Text>
                <Text style={styles.descText}>{item.strDescriptionEN}</Text>
              </>
            ) : null}

            {item.strVideo ? (
              <>
                <Text style={styles.sectionTitle}>Highlights</Text>
                <TouchableOpacity
                  onPress={() => openVideo(item.strVideo)}
                  style={styles.videoBtn}>
                  <Text style={styles.videoBtnText}>Watch on YouTube 🎬</Text>
                </TouchableOpacity>
              </>
            ) : null}
          </View>
        </View>
      </View>

      {/* Meta below the card */}
      <View style={styles.meta}>
        <Text style={styles.metaText}>Match ID: {idKey}</Text>
        {item.strStatus && <Text style={styles.metaText}>Status: {item.strStatus}</Text>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f7fb' },

  // center content vertically & horizontally
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 12,
  },
  /* fallback header styling (solid / two-tone look) */
  headerFallback: {
    width: '100%',
    padding: 18,
    paddingBottom: 14,
    backgroundColor: '#1e3c72',
    alignItems: 'center',
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  headerSub: { color: '#e6eefc', marginTop: 6 },

  /* Card container that centers the card */
  cardContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  card: {
    width: '96%',
    maxWidth: 820,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    // Elevation for Android
    elevation: 12,
    // subtle border for contrast
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  // new card header inside the white card
  cardHeader: {
    backgroundColor: '#eaf2ff',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e3c72',
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#4a6fae',
    marginTop: 4,
  },

  teamsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    alignItems: 'center',
    marginBottom: 6,
  },
  team: { alignItems: 'center', width: 120 },
  teamLogo: { width: 90, height: 90, resizeMode: 'contain', marginBottom: 8 },
  teamName: { fontWeight: '600', textAlign: 'center' },
  vs: { alignItems: 'center' },
  vsText: { fontSize: 14, color: '#666' },
  scoreText: { fontSize: 18, fontWeight: '700', marginTop: 6 },

  info: { paddingTop: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  infoText: { fontSize: 15, marginBottom: 6 },
  favBtn: {
    padding: 12,
    borderRadius: 10,
    marginTop: 14,
    alignItems: 'center',
  },
  favBtnText: { color: '#fff', fontWeight: '700' },
  descText: { color: '#444', lineHeight: 20 },
  videoBtn: {
    backgroundColor: '#ffcc00',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  videoBtnText: { fontWeight: '700' },
  meta: { paddingHorizontal: 20, paddingTop: 18 },
  metaText: { color: '#666', marginTop: 6 },
});

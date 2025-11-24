import { useTheme } from '@/src/context/ThemeContext';
import { fetchEventDetails, fetchPlayers } from '@/src/services/sportsApi';
import { addFavourite, removeFavourite } from '@/src/store';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DetailsScreen() {

  const params = useLocalSearchParams() as Record<string, any>;
  const id = (params?.id ?? params?.idEvent ?? params?.eventId) as string | undefined;

  const [details, setDetails] = useState<any>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // local tab state (Overview | Stats | Players)
  const [activeTab, setActiveTab] = useState<'Overview' | 'Stats' | 'Players'>('Overview');

  const dispatch = useAppDispatch();
  const favs = useAppSelector((s) => s.favourites.items ?? []);
  const idKey = id ?? details?.idEvent ?? String(details?.idEvent ?? '');
  const isFav = favs.some((x: any) => String(x.id) === String(idKey));

  const toggleFavourite = () => {
    if (!details) return;

    // build normalized favourite item so it matches Home's shape
    const banner = details?.strThumb ?? details?.strBanner ?? details?.strThumbHome ?? details?.strThumbAway ?? null;
    const timeStr = `${details?.dateEvent ?? details?.date ?? ''} ${details?.strTime ?? details?.time ?? ''}`.trim();
    const scoreStr =
      details?.intHomeScore != null && details?.intAwayScore != null
        ? `${details.intHomeScore} - ${details.intAwayScore}`
        : details?.score ?? undefined;

    const favItem = {
      id: idKey,
      title: details?.strEvent ?? details?.title ?? `${details?.strHomeTeam ?? ''} vs ${details?.strAwayTeam ?? ''}`,
      image: banner,
      time: timeStr,
      score: scoreStr,
      raw: details,
      status: details?.status ?? 'Popular',
    };

    if (isFav) dispatch(removeFavourite(idKey));
    else dispatch(addFavourite(favItem));
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);

        // If caller passed a full item, use it as base (immediate header display)
        const passedItem = params && (params.strEvent || params.title || params.idEvent || params.id)
          ? (params as any)
          : null;

        // fetch details if we have an id
        const fetched = id ? await fetchEventDetails(id) : null;

        if (!mounted) return;

        // Merge: prefer passedItem values for header fields (strEvent/title, date/time, image)
        // but keep other fetched properties (description, league, venue, etc.)
        const merged = {
          // start with fetched data (if any)
          ...(fetched ?? {}),
          // then overlay passedItem so passed fields overwrite fetched header fields
          ...(passedItem ? {
            // prefer common header props if present in passedItem
            strEvent: passedItem.strEvent ?? passedItem.title ?? (fetched?.strEvent),
            strThumb: passedItem.image ?? fetched?.strThumb,
            strBanner: passedItem.image ?? fetched?.strBanner,
            strTime: passedItem.time ?? fetched?.strTime,
            dateEvent: passedItem.date ?? fetched?.dateEvent ?? passedItem.dateEvent,
            // keep any other passedItem fields as well
            ...passedItem,
          } : {}),
        };

        setDetails(merged);

        // fetch players for home team if available from merged/fetched
        const homeTeamId = merged?.idHomeTeam ?? merged?.idTeamHome ?? merged?.idHomeTeam;
        const p = homeTeamId ? await fetchPlayers(String(homeTeamId)) : [];
        if (!mounted) return;
        setPlayers(p);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('Error loading details:', e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id, JSON.stringify(params)]);

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;

  // use merged details (which now prefers passed header fields)
  const banner = details?.strThumb ?? details?.strBanner ?? details?.strThumbHome ?? null;
  const title = details?.strEvent ?? details?.title ?? `${details?.strHomeTeam ?? ''} vs ${details?.strAwayTeam ?? ''}`;
  const dateText = `${details?.dateEvent ?? details?.date ?? ''} ${details?.strTime ?? details?.time ?? ''}`.trim();

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        {banner ? (
          <Image source={{ uri: banner }} style={styles.banner} />
        ) : (
          <View style={[styles.banner, { backgroundColor: '#e6e6e6' }]} />
        )}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>{dateText}</Text>

        <TouchableOpacity onPress={toggleFavourite} style={styles.favBtn}>
          <Text style={{ color: 'white' }}>{isFav ? 'Remove Favourite' : 'Add Favourite'}</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Bar */}
      <View style={styles.localTabRow}>
        {(['Overview', 'Stats', 'Players'] as const).map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setActiveTab(t)}
            style={[styles.localTabBtn, activeTab === t && styles.localTabActive]}
          >
            <Text style={[styles.localTabText, activeTab === t && styles.localTabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      {activeTab === 'Overview' && (
        <ScrollView style={styles.tabContent}>
          <Text style={styles.sectionTitle}>Match Overview</Text>
          <Text style={styles.desc}>{details?.strDescriptionEN ?? 'No description available.'}</Text>

          {/* added: dummy overview paragraph */}
          <Text style={[styles.desc, { marginTop: 12 }]}>
            This match promises to deliver a thrilling and highly competitive contest, as both teams enter the fixture with impressive recent performances and strong momentum. Fans can expect an intense battle across all departments — batting, bowling, and fielding — with each side boasting match-winners capable of changing the course of the game at any moment. The top-order players from both teams have been in exceptional form, consistently scoring runs and building solid partnerships, while the middle-order units have shown the ability to accelerate under pressure.</Text>
        </ScrollView>
      )}

      {activeTab === 'Stats' && (
        <ScrollView style={styles.tabContent}>
          <Text style={styles.sectionTitle}>Statistics</Text>

          <View style={styles.statCard}>
            <Text>League</Text>
            <Text style={styles.statValue}>{details?.strLeague ?? 'N/A'}</Text>
          </View>

          <View style={styles.statCard}>
            <Text>Venue</Text>
            <Text style={styles.statValue}>{details?.strVenue ?? 'N/A'}</Text>
          </View>

          <View style={styles.statCard}>
            <Text>Country</Text>
            <Text style={styles.statValue}>{details?.strCountry ?? 'N/A'}</Text>
          </View>
        </ScrollView>
      )}

      {activeTab === 'Players' && (
        <ScrollView style={styles.tabContent}>
          <Text style={styles.sectionTitle}>Players</Text>

          {players.length === 0 ? (
            <Text style={{ color: '#666' }}>Players not available</Text>
          ) : (
            <>
              {players.map((p: any) => (
                <View key={p.idPlayer} style={styles.playerCard}>
                  {p.strCutout || p.strThumb ? (
                    <Image source={{ uri: p.strCutout ?? p.strThumb }} style={styles.playerImg} />
                  ) : (
                    <View style={[styles.playerImg, { backgroundColor: '#eee' }]} />
                  )}
                  <View>
                    <Text style={styles.playerName}>{p.strPlayer}</Text>
                    <Text style={styles.playerPos}>{p.strPosition ?? p.strNationality}</Text>
                  </View>
                </View>
              ))}
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingBottom: 10 },
  banner: { width: '100%', height: 180 },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 10, textAlign: 'center' },
  date: { textAlign: 'center', color: 'gray' },

  favBtn: {
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 10,
  },

  localTabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  localTabBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  localTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#1e90ff',
  },
  localTabText: { color: '#666' },
  localTabTextActive: { color: '#1e90ff', fontWeight: '700' },

  tabContent: { padding: 15 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  desc: { fontSize: 16, opacity: 0.7 },

  statCard: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  statValue: { fontSize: 18, fontWeight: 'bold' },

  playerCard: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    alignItems: 'center',
  },
  playerImg: { width: 60, height: 60, marginRight: 10, borderRadius: 6 },
  playerName: { fontSize: 18, fontWeight: 'bold' },
  playerPos: { fontSize: 14, color: 'gray' },
});

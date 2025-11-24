import ImageOrSvg from '@/src/components/ui/ImageOrSvg';
import { useTheme } from '@/src/context/ThemeContext';
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";



export default function ExploreScreen() {
  const { theme } = useTheme();
  const containerBg = theme === 'dark' ? '#12121bff' : '#f6f7fb';
  const [teams, setTeams] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<'teams' | 'players'>('teams');

  // Prefetch helper: normalize .svg -> .png where reasonable and prefetch up to limit
  const prefetchImages = async (uris: (string | null | undefined)[], limit = 30) => {
    if (!uris || uris.length === 0) return;
    const normalize = (u: any) => {
      if (!u) return null;
      try {
        const s = String(u);
        if (s.startsWith('http')) {
          // try .png replacement for svg urls
          return s.endsWith('.svg') ? s.replace(/\.svg(\?.*)?$/i, '.png') : s;
        }
      } catch {}
      return null;
    };

    const candidates = uris.map(normalize).filter(Boolean) as string[];
    const slice = candidates.slice(0, limit);
    // fire-and-forget prefetches (ignore failures)
    await Promise.all(slice.map((u) => Image.prefetch(u).catch(() => false)));
  };

  // fetch all players for a team id (used as initial list when entering "players" mode)
  const fetchPlayersByTeam = async (teamId?: string) => {
    if (!teamId) {
      setFiltered([]);
      return;
    }
    try {
      const res = await fetch(
        `https://www.thesportsdb.com/api/v1/json/3/lookup_all_players.php?id=${encodeURIComponent(teamId)}`
      );
      const data = await res.json();
      // limit to 30 players
      const playersList = (data.player || []).slice(0, 30);
      // prefetch player thumbs
      await prefetchImages(playersList.map((p: any) => p?.strCutout ?? p?.strThumb));
      setFiltered(playersList);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('Players by team API Error:', err);
      setFiltered([]);
    }
  };

  const fetchTeams = async () => {
    try {
      // use NBA teams endpoint (PNG logos) for reliable images
      const res = await fetch(
        "https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=NBA"
      );
      const data = await res.json();
      const teamsList = data.teams || [];
      // prefetch team logos (badge/logo/fanart/banner)
      await prefetchImages(
        teamsList.flatMap((t: any) => [t?.strTeamBadge, t?.strBadge, t?.strTeamLogo, t?.strLogo, t?.strTeamFanart1, t?.strFanart1, t?.strTeamBanner, t?.strBanner])
      );
      setTeams(teamsList);
      setFiltered(teamsList);
       setLoading(false);
     } catch (error) {
       // eslint-disable-next-line no-console
       console.log("API Error:", error);
       setLoading(false);
     }
   };

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchPlayers = async (query: string) => {
    if (!query) {
      setFiltered([]);
      return;
    }
    try {
      const res = await fetch(
        `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      // show up to 30 search results
      const results = (data.player || []).slice(0, 30);
      await prefetchImages(results.map((p: any) => p?.strCutout ?? p?.strThumb));
      setFiltered(results);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('Player API Error:', err);
      setFiltered([]);
    }
  };


  const filterItems = (text: string) => {
    setSearch(text);
    if (!text) {
      if (mode === 'teams') setFiltered(teams);
      else setFiltered([]);
      return;
    }

    if (mode === 'teams') {
      const results = teams.filter((t: any) =>
        String(t.strTeam).toLowerCase().includes(text.toLowerCase())
      );
      setFiltered(results);
    } else {
      // dynamic fetch for players
      fetchPlayers(text);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1b4d80ff" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: containerBg }]}>
      <Text style={[styles.pageTitle, { color: theme === 'dark' ? '#fff' : '#08122a' }]}>
        Explore Teams and Players
      </Text>

      {/* mode toggle */}
      <View style={styles.modeRow}>
        <TouchableOpacity
          style={[
            styles.modeBtn,
            theme === 'dark' ? styles.modeBtnDark : undefined,
            mode === 'teams' ? (theme === 'dark' ? styles.activeModeBtnDark : styles.activeModeBtn) : undefined,
          ]}
          onPress={() => { setMode('teams'); setFiltered(teams); setSearch(''); }}
        >
          <Text style={[
            styles.modeText,
            theme === 'dark' ? { color: '#fff' } : (mode === 'teams' ? { color: '#fff' } : undefined)
          ]}>Teams</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.modeBtn,
            theme === 'dark' ? styles.modeBtnDark : undefined,
            mode === 'players' ? (theme === 'dark' ? styles.activeModeBtnDark : styles.activeModeBtn) : undefined,
          ]}
          onPress={() => {
            setMode('players');
            setSearch('');
            const defaultTeamId = teams && teams.length > 0 ? teams[0].idTeam : undefined;
            if (defaultTeamId) {
              fetchPlayersByTeam(defaultTeamId);
            } else {
              setFiltered([]);
            }
          }}
        >
          <Text style={[
            styles.modeText,
            theme === 'dark' ? { color: '#fff' } : (mode === 'players' ? { color: '#fff' } : undefined)
          ]}>Players</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <TextInput
        style={[styles.search, theme === 'dark' ? styles.searchDarkActive : undefined]}
        placeholder={mode === 'teams' ? 'Search teams...' : 'Search players...'}
        placeholderTextColor={theme === 'dark' ? '#ffffff' : '#8a95ab'}
        value={search}
        onChangeText={filterItems}
      />

      {/* Grid List */}
      <FlatList
        data={filtered}
        keyExtractor={(item, index) => {
          // teams: prefer idTeam, then id, then team name + index
          if (mode === 'teams') {
            return String(item?.idTeam ?? item?.id ?? `${item?.strTeam ?? 'team'}-${index}`);
          }
          // players: prefer idPlayer, then id, then player name + index
          return String(item?.idPlayer ?? item?.id ?? `${item?.strPlayer ?? 'player'}-${index}`);
        }}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => {
          // debug output
          console.log('Explore item raw:', item);

          const name = mode === 'teams' ? item.strTeam : item.strPlayer;
          const country = mode === 'teams' ? item.strCountry : item.strNationality;

          // choose candidate image fields for teams or players
          const candidate = mode === 'teams'
            ? (item?.strTeamBadge || item?.strBadge || item?.strTeamLogo || item?.strLogo || item?.strTeamFanart1 || item?.strFanart1 || item?.strTeamBanner || item?.strBanner)
            : (item?.strPlayerThumb || item?.strThumb || null);

          const finalUri = candidate || `https://ui-avatars.com/api/?name=${encodeURIComponent(name ?? 'Person')}&background=0D47A1&color=fff&size=120`;

          console.log('logo urls', candidate, 'final:', finalUri);

          return (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: theme === 'dark' ? '#696a88ff': '#fff' }]}
              activeOpacity={0.8}
            >
              <ImageOrSvg uri={finalUri} style={styles.logo} placeholder="https://via.placeholder.com/120" />
              <Text style={[styles.teamName, { color: theme === 'dark' ? '#fff' : '#08122a' }]}>{name}</Text>
              <Text style={[styles.smallText, { color: theme === 'dark' ? '#e6e6ef' : '#8a95ab' }]}>{country}</Text>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f6f7fb" },
  // increased bottom margin so there's more space between title and the buttons
  pageTitle: { fontSize: 22, fontWeight: '800', marginTop: 20, marginBottom: 15, color: '#08122a' },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 15 },
  search: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    // subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  // applied to search when dark mode is active (matches activeModeBtn)
  searchDarkActive: {
    backgroundColor: '#0b131cff',
    borderColor: '#2c92ffff',
    borderWidth: 1,
  },
  // add a little top spacing to separate from title
  modeRow: { flexDirection: 'row', marginTop: 8, marginBottom: 12 },
  // light-mode base
  modeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: 'rgba(6,20,34,0.04)',
  },
  // dark-mode base
  modeBtnDark: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#0b131cff',
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#2c92ffff',
  },
  // light-mode active
  activeModeBtn: { backgroundColor: '#2c92ffff', borderColor: '#1e90ff' },
  // dark-mode active (user requested swapped colors)
  activeModeBtnDark: { backgroundColor: '#2c92ffff', borderColor: '#0b131cff' },
  modeText: { color: '#000', fontWeight: '600' },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 14,
    marginBottom: 18,
    alignItems: "center",
    // soft shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 2,
  },
  logo: { width: 64, height: 64, marginBottom: 10, borderRadius: 8 },
  teamName: { fontSize: 15, fontWeight: "700", textAlign: "center", color: '#08122a' },
  smallText: { fontSize: 12, color: "#8a95ab" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});

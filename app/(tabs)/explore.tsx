import ImageOrSvg from '@/src/components/ui/ImageOrSvg';
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ExploreScreen() {
  const [teams, setTeams] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchTeams = async () => {
    try {
      // use NBA teams endpoint (PNG logos) for reliable images
      const res = await fetch(
        "https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=NBA"
      );
      const data = await res.json();
      setTeams(data.teams || []);
      setFiltered(data.teams || []);
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

  const filterTeams = (text: string) => {
    setSearch(text);
    if (!text) return setFiltered(teams);

    const results = teams.filter((t: any) =>
      String(t.strTeam).toLowerCase().includes(text.toLowerCase())
    );
    setFiltered(results);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1e90ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Explore Teams</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.search}
        placeholder="Search teams..."
        value={search}
        onChangeText={filterTeams}
      />

      {/* Grid List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.idTeam)}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => {
          // debug: print whole item to inspect which fields are present
          console.log('Explore item raw:', item);

          // Try all common field names the API may return (variant coverage)
          const candidate =
            item?.strTeamBadge ||
            item?.strBadge ||
            item?.strTeamLogo ||
            item?.strLogo ||
            item?.strTeamFanart1 ||
            item?.strFanart1 ||
            item?.strTeamBanner ||
            item?.strBanner ||
            null;

          const finalUri =
            candidate ||
            // fallback: generate a PNG avatar with team initials (always returns PNG)
            `https://ui-avatars.com/api/?name=${encodeURIComponent(item?.strTeam ?? 'Team')}&background=0D47A1&color=fff&size=120`;

          // debug: show chosen finalUri
          console.log('logo urls', item?.strBadge ?? item?.strTeamBadge, item?.strLogo ?? item?.strTeamLogo, item?.strFanart1 ?? item?.strTeamFanart1, 'final:', finalUri);

          return (
            <TouchableOpacity style={styles.card} activeOpacity={0.8}>
              <ImageOrSvg uri={finalUri} style={styles.logo} placeholder="https://via.placeholder.com/120" />
              <Text style={styles.teamName}>{item.strTeam}</Text>
              <Text style={styles.smallText}>{item.strCountry}</Text>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#ffffff" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 15 },
  search: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 18,
    alignItems: "center",
    elevation: 3,
  },
  logo: { width: 60, height: 60, marginBottom: 10 },
  teamName: { fontSize: 16, fontWeight: "600", textAlign: "center" },
  smallText: { fontSize: 12, color: "#555" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});

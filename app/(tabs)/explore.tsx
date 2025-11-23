import ImageWithFallback from "@/src/components/ui/image-with-fallback";
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
      const res = await fetch(
        "https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=English%20Premier%20League"
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
          // build ordered list of possible images (PNG-first, then banner/fanart, then converted svg->png)
          const logoCandidates = [
            item?.strTeamLogo,
            item?.strTeamBanner,
            item?.strTeamFanart1,
            item?.strTeamJersey,
            // try converting SVG url to PNG if possible
            item?.strTeamBadge
              ? String(item.strTeamBadge).replace(".svg", ".png")
              : undefined,
          ];
          return (
            <TouchableOpacity style={styles.card} activeOpacity={0.8}>
              <ImageWithFallback uris={logoCandidates} style={styles.logo} />
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

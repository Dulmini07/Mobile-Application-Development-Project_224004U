import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import ParallaxScrollView from '@/src/components/parallax-scroll-view';
import { ThemedText } from '@/src/components/themed-text';
import { ExternalLink } from '@/src/components/external-link';

export default function ExploreScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#fff', dark: '#111' }}
      headerImage={
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?auto=format&fit=crop&w=1350&q=80',
          }}
          style={styles.headerImage}
        />
      }
    >
      <View style={styles.contentContainer}>
        <ThemedText style={styles.heading}>Explore Sports & Lifestyle</ThemedText>
        <ThemedText style={styles.subHeading}>
          Discover trending matches, top players, and inspiring moments in sports.
        </ThemedText>

        <View style={styles.card}>
          <Image
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/en/2/29/Sri_Lanka_Cricket_logo.svg' }}
            style={styles.cardImage}
          />
          <ThemedText style={styles.cardTitle}>Sri Lanka Cricket Team</ThemedText>
          <ThemedText>Champion spirit and unity on the field 🇱🇰</ThemedText>
          <ExternalLink
            url="https://www.espncricinfo.com/team/sri-lanka-8"
            title="View on ESPN CricInfo"
          />
        </View>

        <View style={styles.card}>
          <Image
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/en/3/3a/Cricket_Australia_logo.svg' }}
            style={styles.cardImage}
          />
          <ThemedText style={styles.cardTitle}>Australia Cricket Team</ThemedText>
          <ThemedText>Powerful batting and strategic gameplay 🏏</ThemedText>
          <ExternalLink
            url="https://www.espncricinfo.com/team/australia-2"
            title="View on ESPN CricInfo"
          />
        </View>

        <View style={styles.card}>
          <Image
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/en/5/5c/Federer_Logo.svg' }}
            style={styles.cardImage}
          />
          <ThemedText style={styles.cardTitle}>Roger Federer</ThemedText>
          <ThemedText>Elegance, skill, and legacy in tennis 🎾</ThemedText>
          <ExternalLink
            url="https://www.atptour.com/en/players/roger-federer/f324/overview"
            title="View Player Profile"
          />
        </View>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subHeading: {
    marginBottom: 20,
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

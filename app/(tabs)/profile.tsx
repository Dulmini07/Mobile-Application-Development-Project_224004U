import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';
// resolve expo-image-manipulator at runtime if installed; fall back to null
let ImageManipulator: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ImageManipulator = require('expo-image-manipulator');
} catch {
  // module not installed, we'll skip conversion on Android
  ImageManipulator = null;
}

import ImageOrSvg from '@/src/components/ui/image-with-fallback';
import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Animated, Easing, Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { Colors } from '@/constants/theme';
import { useTheme } from '@/src/context/ThemeContext';
import { RootState } from '@/src/store';
import { logout, setAuth, updateProfileImage } from '@/src/store/authSlice';
import { useDispatch, useSelector } from 'react-redux';

// resolve expo-linear-gradient at runtime and fallback to a plain View when unavailable
let LinearGradient: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  LinearGradient = require('expo-linear-gradient').LinearGradient;
} catch {
  // fallback: simple wrapper that renders a View with same style/children
  // keeps UI working if expo-linear-gradient isn't installed
  // eslint-disable-next-line react/display-name
  LinearGradient = ({ children, style }: any) => {
    const { View } = require('react-native');
    return <View style={style}>{children}</View>;
  };
}

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  // { changed code } dark mode background (updated)
  const bgColor = theme === 'dark' ? '#12121bff' : Colors[theme].background;
  const user = useSelector((state: RootState) => state.auth.user);

  const [modalVisible, setModalVisible] = useState(false);
  const [editName, setEditName] = useState(user?.username);
  const [editEmail, setEditEmail] = useState(user?.email);

  // animated value to slide the knob when theme changes
  const knobAnim = React.useRef(new Animated.Value(theme === 'dark' ? 1 : 0)).current;
  React.useEffect(() => {
    Animated.timing(knobAnim, {
      toValue: theme === 'dark' ? 1 : 0,
      duration: 260,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [theme, knobAnim]);

  const themeStyles = {
    text: { color: Colors[theme].text },
    cardBg: { backgroundColor: Colors[theme].tint },
  };

  // normalize & prefetch user image to avoid intermittent blank avatar
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!user?.image) return;
        let uri = String(user.image);

        // If Android content uri => try to convert to cache file:// so <Image> can render reliably
        if (Platform.OS === 'android' && uri.startsWith('content://')) {
          if (ImageManipulator) {
            try {
              const m = await ImageManipulator.manipulateAsync(uri, [], { format: ImageManipulator.SaveFormat.PNG });
              if (mounted && m?.uri) {
                uri = m.uri;
                // update store with converted uri so header uses stable file:// path
                dispatch(updateProfileImage(uri));
              }
            } catch (err) {
              // eslint-disable-next-line no-console
              console.log('[PROFILE] image conversion failed', err);
            }
          } else {
            // eslint-disable-next-line no-console
            console.warn('[PROFILE] expo-image-manipulator not installed — content:// may not render on Android');
          }
        }

        // If SVG URL, try prefetching the PNG variant to warm cache (helps RN Image)
        const maybePng = uri.endsWith('.svg') ? uri.replace(/\.svg(\?.*)?$/i, '.png') : uri;
        if (maybePng.startsWith('http')) {
          // prefetch (ignore failure)
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          (async () => {
            try {
              // Image.prefetch returns a promise, but not all platforms support; ignore errors
              // eslint-disable-next-line @typescript-eslint/no-var-requires
              const { Image: RNImage } = require('react-native');
              await RNImage.prefetch(maybePng);
            } catch {
              // ignore
            }
          })();
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('[PROFILE] normalize/prefetch error', e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user?.image, dispatch]);

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission required to upload image");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      let uri = result.assets[0].uri;
      // debug: show picked uri
      console.log('[PROFILE] picked image uri ->', uri);

      // Android may return content:// URIs — convert to a cache file:// if ImageManipulator is available
      if (Platform.OS === 'android' && uri && uri.startsWith('content://')) {
        if (ImageManipulator) {
          try {
            const manipulated = await ImageManipulator.manipulateAsync(uri, [], { compress: 1, format: ImageManipulator.SaveFormat.PNG });
            if (manipulated?.uri) {
              uri = manipulated.uri;
              // eslint-disable-next-line no-console
              console.log('[PROFILE] converted content:// ->', uri);
            }
          } catch (err) {
            // eslint-disable-next-line no-console
            console.log('[PROFILE] ImageManipulator convert failed', err);
          }
        } else {
          // expo-image-manipulator not installed — cannot convert content://; leave original URI
          // eslint-disable-next-line no-console
          console.warn('[PROFILE] expo-image-manipulator not installed — content:// URI may not render on Android');
        }
      }

      dispatch(updateProfileImage(uri));
    }
  };

  const saveProfile = () => {
    dispatch(
      setAuth({
        user: { ...user, username: editName, email: editEmail, image: user?.image, id: user?.id },
        token: user?.token,
      })
    );
    setModalVisible(false);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Top header */}
      <View style={styles.headerBar}>
        <Text style={[styles.headerTitle, themeStyles.text]}>My profile</Text>
      </View>

      {/* Gradient Header */}
      <LinearGradient
        colors={['#1e90ff', '#4facfe']}
        style={styles.headerGradient}
      >
        {/* Avatar */}
        <TouchableOpacity onPress={handlePickImage} style={styles.avatarWrap}>
          <ImageOrSvg
            uris={[user?.image, 'https://cdn-icons-png.flaticon.com/512/149/149071.png']}
            style={styles.avatar}
            placeholder="https://cdn-icons-png.flaticon.com/512/149/149071.png"
          />
        </TouchableOpacity>

        <Text style={[styles.name, themeStyles.text]}>{user?.username}</Text>
        {user?.email && <Text style={[styles.email, themeStyles.text]}>{user.email}</Text>}
      </LinearGradient>

      {/* Edit Profile Button */}
      <TouchableOpacity
        style={styles.editBtn}
        onPress={() => setModalVisible(true)}
      >
        <Feather name="edit" size={18} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.editText}>Edit Profile</Text>
      </TouchableOpacity>

      {/* Achievements Card */}
      <View style={[styles.card, theme === 'dark' ? { backgroundColor: '#696a88ff' } : undefined]}>
        <Text style={[styles.sectionTitle, styles.sectionTitleStatic]}>Achievements</Text>
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Image
              source={{ uri: "https://cdn-icons-png.flaticon.com/512/2583/2583313.png" }}
              style={styles.badgeIcon}
            />
            <Text style={[styles.badgeLabel, styles.badgeLabelStatic]}>Rookie</Text>
          </View>
          <View style={styles.badge}>
            <Image
              source={{ uri: "https://cdn-icons-png.flaticon.com/512/2583/2583343.png" }}
              style={styles.badgeIcon}
            />
            <Text style={[styles.badgeLabel,styles.badgeLabelStatic]}>Fan Level 1</Text>
          </View>
          <View style={styles.badge}>
            <Image
              source={{ uri: "https://cdn-icons-png.flaticon.com/512/2583/2583352.png" }}
              style={styles.badgeIcon}
            />
            <Text style={[styles.badgeLabel,styles.badgeLabelStatic]}>Collector</Text>
          </View>
        </View>
      </View>

      {/* Theme Card - toggle UI */}
      <View
        // keep shared card styles but reduce internal padding so overall height is smaller
        style={[
          styles.card,
          theme === 'dark' ? { backgroundColor: '#696a88ff' } : undefined,
          { paddingVertical: 12, paddingHorizontal: 16 }, // reduced height
        ]}
      >
        {/* smaller gap below title to bring toggle closer */}
        <Text style={[styles.sectionTitle, styles.sectionTitleStatic, { marginBottom: 4 }]}>Theme</Text>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => toggleTheme()}
          style={{ alignSelf: 'center', marginVertical: 2 }} // tighter vertical spacing
        >
          <View style={[styles.toggleContainer, theme === 'dark' ? styles.toggleDarkBg : styles.toggleLightBg]}>
            <View style={styles.toggleIconLeft}>
              <Feather name="sun" size={34} color={theme === 'dark' ? '#999' : '#666'} />
            </View>
            <View style={styles.toggleIconRight}>
              <Feather name="moon" size={34} color={theme === 'dark' ? '#fff' : '#666'} />
            </View>
            <Animated.View
              style={[
                styles.toggleKnob,
                {
                  transform: [
                    {
                      translateX: knobAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 66],
                      }),
                    },
                  ],
                },
              ]}
            />
          </View>
        </TouchableOpacity>
      </View>


      <View>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => dispatch(logout())}>
          <Feather name="log-out" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Profile Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: '#fff' }]}>
            <Text style={[styles.modalTitle, themeStyles.text]}>Edit Profile</Text>

            <TextInput
              value={editName}
              onChangeText={setEditName}
              style={styles.input}
              placeholder="Username"
            />
            <TextInput
              value={editEmail}
              onChangeText={setEditEmail}
              style={styles.input}
              placeholder="Email"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtn}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={saveProfile}>
                <Text style={styles.saveBtn}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBar: {
    paddingHorizontal: 20,
    paddingTop: 40,   // reduced top spacing
    paddingBottom: 4, // reduced bottom spacing
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
  },

  // Header Gradient
  headerGradient: {
    paddingTop: 20,    // reduce top padding so avatar sits closer to header title
    paddingBottom: 30, // keep some bottom padding
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  avatarWrap: {
    borderRadius: 80,
    borderWidth: 3,
    borderColor: '#fff',
    marginBottom: 6, // slightly reduced gap under avatar
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  avatar: { width: 120, height: 120, borderRadius: 70 },

  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  email: { fontSize: 16, marginBottom: 10 },

  editBtn: {
    backgroundColor: '#2c92ffff',
    paddingVertical: 10,
    paddingHorizontal: 20, // slightly reduced so icon+text fit nicely
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: -20,
    marginBottom: 20,
    elevation: 4,
    flexDirection: 'row', // place icon and text on a single row
    alignItems: 'center',
  },
  editText: { color: '#fff', fontWeight: '600', fontSize: 16 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },

  sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 15 },
  // always black heading (used for Achievements and Theme)
  sectionTitleStatic: { color: '#000' },
  badgeLabelStatic: { color: '#000' },

  badgeContainer: { flexDirection: 'row', justifyContent: 'space-around' },
  badge: { alignItems: 'center' },
  badgeIcon: { width: 60, height: 60, marginBottom: 5 },
  badgeLabel: { fontWeight: '600' },

  themeBtn: {
    backgroundColor: '#1e90ff',
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  themeText: { color: '#fff', fontWeight: '600', fontSize: 16 },

  logoutBtn: {
    backgroundColor: '#e02117ff',
    paddingVertical: 10,
    paddingHorizontal: 18, // slightly smaller to accommodate icon
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    minWidth: 150,
  },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  // Modal
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '85%', borderRadius: 20, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },

  input: { backgroundColor: '#f1f1f1', padding: 12, borderRadius: 12, marginBottom: 12 },

  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  cancelBtn: { fontSize: 16, color: '#ff3b30', fontWeight: 'bold' },
  saveBtn: { fontSize: 16, color: '#2c92ffff', fontWeight: 'bold' },

  // larger toggle control
  toggleContainer: {
    width: 140,         // larger width
    height: 60,         // larger height
    borderRadius: 36,
    padding: 16,
    justifyContent: 'center',
    position: 'relative',
    alignSelf: 'center',
  },
  toggleLightBg: {
    backgroundColor: '#e8e8ee',
  },
  toggleDarkBg: {
    backgroundColor: '#222430',
  },
  toggleKnob: {
    position: 'absolute',
    left: 16,             // match padding
    width: 50,          // bigger knob
    height: 40,
    borderRadius: 40,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleIconLeft: {
    position: 'absolute',
    left: 25,            // reposition for larger control
    zIndex: 0,
  },
  toggleIconRight: {
    position: 'absolute',
    right: 25,           // reposition for larger control
    zIndex: 0,
  },
});

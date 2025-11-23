import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Colors } from '@/constants/theme';
import { useTheme } from '@/src/context/ThemeContext';
import { RootState } from '@/src/store';
import { logout, setAuth, updateProfileImage } from '@/src/store/authSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  const user = useSelector((state: RootState) => state.auth.user);

  const [modalVisible, setModalVisible] = useState(false);
  const [editName, setEditName] = useState(user?.username);
  const [editEmail, setEditEmail] = useState(user?.email);

  const themeStyles = {
    text: { color: Colors[theme].text },
    cardBg: { backgroundColor: Colors[theme].tint },
  };

  // === PICK IMAGE FROM GALLERY OR CAMERA ===
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
      const uri = result.assets[0].uri;
      dispatch(updateProfileImage(uri)); // save to redux
    }
  };

  const saveProfile = () => {
    dispatch(
      setAuth({
        user: {
          ...user,
          username: editName,
          email: editEmail,
          image: user?.image,
          id: user?.id,
        },
        token: user?.token,
      })
    );
    setModalVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors[theme].background }]}>
      {/* Avatar */}
      <TouchableOpacity onPress={handlePickImage}>
        <Image
          source={{
            uri:
              user?.image ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
          style={styles.avatar}
        />
      </TouchableOpacity>

      <Text style={{ marginBottom: 5, opacity: 0.7 }}>
        Tap to change photo
      </Text>

      {/* Username */}
      <Text style={[styles.name, themeStyles.text]}>
        {user?.username}
      </Text>

      {/* Email */}
      {user?.email && (
        <Text style={[styles.email, themeStyles.text]}>{user.email}</Text>
      )}

      {/* Edit Profile Button */}
      <TouchableOpacity style={styles.editBtn} onPress={() => setModalVisible(true)}>
        <Text style={styles.editText}>Edit Profile</Text>
      </TouchableOpacity>

      {/* Badges Section */}
      <Text style={[styles.sectionTitle, themeStyles.text]}>Achievements</Text>

      <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/2583/2583313.png" }}
            style={styles.badgeIcon}
          />
          <Text style={[styles.badgeLabel, themeStyles.text]}>Rookie</Text>
        </View>

        <View style={styles.badge}>
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/2583/2583343.png" }}
            style={styles.badgeIcon}
          />
          <Text style={[styles.badgeLabel, themeStyles.text]}>Fan Level 1</Text>
        </View>

        <View style={styles.badge}>
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/2583/2583352.png" }}
            style={styles.badgeIcon}
          />
          <Text style={[styles.badgeLabel, themeStyles.text]}>Collector</Text>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => dispatch(logout())}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Edit Profile Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, themeStyles.cardBg]}>
            <Text style={[styles.modalTitle, themeStyles.text]}>
              Edit Profile
            </Text>

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

      {/* Theme selector */}
      <Text style={[styles.sectionTitle, themeStyles.text]}>Theme</Text>
      <TouchableOpacity style={[styles.themeBtn]} onPress={() => toggleTheme()}>
        <Text style={styles.themeText}>Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, alignItems: "center" },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: "#1e90ff",
    marginBottom: 10,
  },
  name: { fontSize: 24, fontWeight: "bold" },
  email: { fontSize: 16, opacity: 0.7, marginBottom: 20 },

  editBtn: {
    backgroundColor: "#1e90ff",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 25,
  },
  editText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },

  badgeContainer: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 30,
  },

  badge: { alignItems: "center" },
  badgeIcon: { width: 60, height: 60 },
  badgeLabel: { marginTop: 5, fontWeight: "600" },

  logoutBtn: {
    backgroundColor: "#ff3b30",
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 8,
  },
  logoutText: { color: "#fff", fontWeight: "bold", fontSize: 18 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },

  input: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  cancelBtn: { fontSize: 16, color: "#ff3b30", fontWeight: "bold" },
  saveBtn: { fontSize: 16, color: "#061422ff", fontWeight: "bold" },

  themeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#ddd',
  },
  themeActive: {
    backgroundColor: '#1e90ff',
  },
  themeText: {
    color: '#000',
    fontWeight: '600',
  },

  // Floating Save button styles
  floatingSave: {
    position: 'absolute',
    right: 20,
    bottom: 28,
    backgroundColor: '#1e90ff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  floatingSaveText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});

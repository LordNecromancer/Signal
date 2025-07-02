import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { supabase } from "../app/supabase";
import { useTheme } from "../context/ThemeContext";

export default function HeaderDropdown() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [themeMenuVisible, setThemeMenuVisible] = useState(false);
  const { toggleTheme } = useTheme();

  const router = useRouter();

  /*
  Change the theme using the toggleTheme context defined in ThemeContext context.
  */
  const changeTheme = async (selectedTheme) => {
    await AsyncStorage.setItem("theme", selectedTheme); // Save theme to storage
    toggleTheme(selectedTheme); // Inform parent of theme change
    setThemeMenuVisible(false);
    setDropdownVisible(false);
  };

  /*
  Sign out using supabase.
  */
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  /*
  A dropdown is displayed on the right side of the header.  This is the component for it. If user clicks on it the dropdown
  appears. By clicking on themes, a Modal page is created so the user can choose dark or light themes.
  */
  return (
    <View>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setDropdownVisible(!dropdownVisible)}
      >
        <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
      </TouchableOpacity>

      {dropdownVisible && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setThemeMenuVisible(true)}
          >
            <Ionicons name="color-palette" size={20} color="#6e48aa" />
            <Text style={styles.menuText}>Theme</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
            <Ionicons name="log-out" size={20} color="#6e48aa" />
            <Text style={styles.menuText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        transparent
        visible={themeMenuVisible}
        animationType="fade"
        onRequestClose={() => setThemeMenuVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.themeMenu}>
            <Text style={styles.themeMenuTitle}>Choose Theme</Text>
            <FlatList
              data={["Light", "Dark"]}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.themeMenuItem}
                  onPress={() => changeTheme(item.toLowerCase())}
                >
                  <Text style={styles.themeMenuItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  dropdownButton: {
    marginRight: 10,
    padding: 5,
  },
  dropdownMenu: {
    position: "absolute",
    top: 55,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
    zIndex: 1000,
    paddingVertical: 5,
    paddingHorizontal: 10,
    width: 150,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  menuText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  themeMenu: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    width: 250,
  },
  themeMenuTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  themeMenuItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  themeMenuItemText: {
    fontSize: 16,
    color: "#6e48aa",
  },
});

import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  TouchableOpacity,
  Text,
  TextInput,
  Button,
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Switch,
  Platform,
  Dimensions,
} from "react-native";
import { supabase } from "../supabase";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
//import RNFS from 'react-native-fs';
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

import DietUI from "../../components/DietUI";

import { useTheme } from "../../context/ThemeContext";

export default function Main() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("male");
  const [family, setFamily] = useState([{ name: "", age: "", sex: "male" }]);
  const [includeFamily, setIncludeFamily] = useState(false);

  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { width } = Dimensions.get("window");

  /*
Defining the light and dark themes. The currentTheme holds the name of the theme that needs to be applied.
*/

  const themes = {
    light: {
      gradientColors: ["#c8a2c8", "#e8d5e8"],
      pickerBackgroundColor: "#EFEFEF",
      //pickerBackgroundColor: '#6e48aa',
      text: "#333",
    },
    dark: {
      gradientColors: ["#232526", "#414345"],
      pickerBackgroundColor: "#3a3a3a",
      text: "#FFF",
    },
  };
  let currentTheme = themes[theme];

  /*
Load the theme when the screen loads. This is done via reading storage value which is saved when a change in theme happens. 
The default theme is light. This makes the theme persistant. 
*/
  useEffect(() => {
    // Load theme from storage on mount
    console.log(theme);
    console.log(toggleTheme);

    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem("theme");
      if (savedTheme) {
        toggleTheme(savedTheme);
        currentTheme = themes[savedTheme];
      }
    };
    loadTheme();
  }, [theme]);

  /*
On mount, get the user and the active session and set the user state based on the information that comes from the database.
We read all the entries of the user with active session. I the active session doesn't exist, redirect user to login page.
*/

  const fetchUser = async () => {
    const { data: session, error } = await supabase.auth.getSession();
    if (session?.session) {
      const user = session.session.user;
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", user.id);
      if (data && data[0]) {
        setUser({
          _id: user.id,
          name: data[0]?.name,
          sex: data[0]?.sex || "male",
          age: data[0]?.age || 25,
          family: data[0]?.family || {},
        });
        if (data[0].sex && data[0].age && data[0].name) {
          setFormSubmitted(true);
          setName(data[0].name);
          setAge(data[0].age);
          setSex(data[0].sex);
          setFamily(data[0].family);
        }

        setLoading(false);
      }
    } else {
      console.error("No active session or error fetching user:", error);
      setUser(null);
      router.replace("/login");
    }
  };

  /*
On mount, call the fetchUser function to get user data
*/
  useEffect(() => {
    fetchUser();
  }, []);

  /*
While the data is loading, show a spinner.
*/

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading</Text>
      </View>
    );
  }

  /*
If user data doesn't exist, it means the user is not logged in. So we redirect them to login page.
*/
  if (!user) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.text}>Please log in to find your ideal diet.</Text>
        {router.replace("/login")}
      </View>
    );
  }

  /*
When the user submits their data, check if required fields are filled. If so, update the user state and the data in the database. 
*/
  const handleSubmit = async () => {
    if (!name || !age || !sex) {
      alert("Please complete all fields");
      return;
    }

    const payload = {
      user_id: user._id,
      name,
      age: parseInt(age),
      sex,
      family: family.filter((f) => f.name && f.age && f.sex),
      //email: user.email,
    };
    setUser({
      _id: user._id,
      name: payload.name,
      sex: payload.sex || "male",
      age: payload.age || 25,
      family: payload.family || {},
    });

    const { error } = await supabase
      .from("users")
      .upsert(payload, { onConflict: ["user_id"] }); // upsert handles insert/update

    if (error) {
      console.error(error);
      alert("Error saving profile");
    } else {
      setFormSubmitted(true);
    }
  };

  /*
Helper functions to add, update or delete family members.
*/
  const handleFamilyChange = (index, field, value) => {
    const updated = [...family];
    updated[index][field] = value;
    setFamily(updated);
  };

  const addFamilyMember = () => {
    setFamily([...family, { name: "", age: "", sex: "male" }]);
  };

  const removeFamilyMember = (index) => {
    const updated = [...family];
    updated.splice(index, 1);
    setFamily(updated);
  };

  /*
If the user has submitted their data, show them their diet and servings. An edit button is also provided to edit the data.
Text inputs for name and age and a picker for sex is provided. A switch is added so the user can decide whether they want 
to add family member data as well. The header of the page is which contains themes and signout options is handled by 
HeaderDropDown component. The diet is displayed by DietUI component.

*/

  return (
    <LinearGradient
      colors={currentTheme.gradientColors}
      style={[
        styles.background,
        { color: themes[theme].backgroundColor, flex: 1 },
      ]}
    >
      {formSubmitted && (
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setFormSubmitted(false)}
          >
            <Text style={styles.backButtonText}>← Edit Info</Text>
          </TouchableOpacity>

          <View
            style={{
              flex: 1,
              backgroundColor: themes[theme].backgroundColor,
              marginTop: 100,
            }}
          >
            <DietUI mainUser={user} family={family} />
          </View>
        </View>
      )}
      {!formSubmitted && (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <View style={styles.container}>
            <View
              style={[
                styles.form_container,
                { width: Platform.OS !== "web" || width < 800 ? "90%" : "50%" },
              ]}
            >
              <Text style={[styles.label, { color: themes[theme].text }]}>
                Name:
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                style={[styles.textInput, { color: themes[theme].text }]}
              />

              <Text style={[styles.label, { color: themes[theme].text }]}>
                Age:
              </Text>
              <TextInput
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                style={[styles.textInput, { color: themes[theme].text }]}
              />

              <View style={styles.row}>
                <Text
                  style={[styles.labelSmall, { color: themes[theme].text }]}
                >
                  Sex:
                </Text>
                <Picker
                  selectedValue={sex}
                  onValueChange={setSex}
                  style={[
                    styles.smallPicker,
                    {
                      color: themes[theme].text,
                      backgroundColor: themes[theme].pickerBackgroundColor,
                    },
                  ]}
                >
                  <Picker.Item label="Male" value="male" />
                  <Picker.Item label="Female" value="female" />
                </Picker>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 10,
                }}
              >
                <Text style={[{ marginRight: 10, color: themes[theme].text }]}>
                  Include family members?
                </Text>
                <Switch
                  value={includeFamily}
                  onValueChange={(value) => setIncludeFamily(value)}
                />
              </View>
              {includeFamily && (
                <>
                  <Text
                    style={[styles.familyTitle, { color: themes[theme].text }]}
                  >
                    Family Members
                  </Text>
                  {family.map((member, index) => (
                    <View key={index} style={styles.familyCard}>
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeFamilyMember(index)}
                      >
                        <Text style={styles.removeButtonText}>×</Text>
                      </TouchableOpacity>

                      <Text
                        style={[
                          styles.memberTitle,
                          { color: themes[theme].text },
                        ]}
                      >
                        Member {index + 1}
                      </Text>
                      <TextInput
                        placeholder="Name"
                        value={member.name}
                        onChangeText={(text) =>
                          handleFamilyChange(index, "name", text)
                        }
                        style={[
                          styles.textInput,
                          { color: themes[theme].text },
                        ]}
                      />
                      <TextInput
                        placeholder="Age"
                        value={member.age}
                        onChangeText={(text) =>
                          handleFamilyChange(index, "age", text)
                        }
                        keyboardType="numeric"
                        style={[
                          styles.textInput,
                          { color: themes[theme].text },
                        ]}
                      />
                      <View style={styles.row}>
                        <Text
                          style={[
                            styles.labelSmall,
                            { color: themes[theme].text },
                          ]}
                        >
                          Sex:
                        </Text>
                        <Picker
                          selectedValue={member.sex}
                          onValueChange={(value) =>
                            handleFamilyChange(index, "sex", value)
                          }
                          style={[
                            styles.smallPicker,
                            {
                              color: themes[theme].text,
                              backgroundColor:
                                themes[theme].pickerBackgroundColor,
                            },
                          ]}
                        >
                          <Picker.Item label="Male" value="male" />
                          <Picker.Item label="Female" value="female" />
                        </Picker>
                      </View>
                    </View>
                  ))}

                  <View style={{ marginTop: 10 }}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={addFamilyMember}
                    >
                      <Text style={styles.buttonText}>
                        Add Another Family Member
                      </Text>
                    </TouchableOpacity>{" "}
                  </View>
                </>
              )}
              <View style={{ marginTop: 10 }}>
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>{" "}
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    paddingRight: 25,
    paddingLeft: 25,
    paddingBottom: 65,
    // backgroundColor: '#a5b5b3',
    paddingHorizontal: 10,
    justifyContent: "center",
    //backgroundColor: '#fff',
    alignItems: "center",
    backgroundColor: "linear-gradient(to bottom, #74ebd5, #9face6)", // Gradient background
  },
  form_container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },

  button: {
    backgroundColor: "#9d50bb", // Vibrant coral color
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signOutButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    zIndex: 1,
  },
  signOutButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4f7",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  sendButton: {
    backgroundColor: "#6e48aa", // Matching gradient color
    padding: 10,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  textInput: {
    flex: 1,

    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 3,
    marginTop: 10,

    //backgroundColor: '#fff',
    fontSize: 18,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 10,

    color: "#fff",
  },

  picker: {
    flex: 0.5,
    marginBottom: 15,
    marginTop: 10,

    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    color: "#fff",
    alignItems: "left",
  },

  familyTitle: {
    marginTop: 25,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },

  memberTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    marginTop: 10,
    color: "#fff",
  },

  familyCard: {
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    position: "relative",
  },

  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 2,
    padding: 5,
  },

  removeButtonText: {
    color: "#ff4d4d",
    fontSize: 20,
    fontWeight: "bold",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },

  labelSmall: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginRight: 10,
    flex: 1,
  },

  smallPicker: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    color: "#fff",
    height: 40,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 2,
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },

  backButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

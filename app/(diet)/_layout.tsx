import { Stack } from 'expo-router';
import { TouchableOpacity, StyleSheet, Text, View,Image } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { supabase } from '../supabase';
import logo from '../../assets/images/logo2.png';
import { Appbar, Menu, Divider } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import HeaderDropDown from '../../components/HeaderDropDown'
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function ChatLayout() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [themeVisible, setThemeVisible] = useState(false);


/*
Display the main page. The header has a title which includes the name of app (Dietitian) and a logo. The right header displays a custom component named HeaderDropDown which shows the 
signout and themes options. The left header is nothing.
*/
  return (
    <Stack
      screenOptions={{
        headerStyle: styles.headerStyle,
        headerShadowVisible: false,
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen
        name="main"
        options={{
          title:'Dietitian',
          headerStyle: styles.headerStyle,
          headerTintColor: '#fff',
          //headerTitleStyle: styles.headerTitleStyle,
          headerTitleAlign: 'center', // Align title to center
          headerTitle: () => (
            <View style={styles.headerTitleContainer}>
              <Image
                source={logo} // Path to logo file
                style={styles.logo}
              />
              <Text style={styles.headerTitle}>Dietitian</Text>
            </View>
          ),
          headerRight: () => (
            

            <HeaderDropDown/>
        
          ),
          headerLeft: () => null
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#5C4B79', // Muted plum for header
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#F1E9FC',
    marginLeft: 15, // Space between logo and title
  },
  logo: {
    width: 50, // Adjust size based on logo
    height: 50,
    resizeMode: 'contain',
    borderRadius: 25, // Makes the logo circular

  },
  signOutButton: {
    backgroundColor: '#8c6acb', // Soft purple
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    marginRight: 10,
  },
  themeButton:{
      backgroundColor: '#8c6acb', // Soft purple
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 3,
      marginRight: 10,
    },
  
  signOutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

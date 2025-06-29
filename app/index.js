import React, { useState, useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { supabase } from './supabase';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

export default function App() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Fetch the current user
      const { data: session } = await supabase.auth.getSession();

      if (session?.session) {
        // If a session exists, navigate to main
        router.replace('/main');
      } else {
        // Otherwise, navigate to login
        router.replace('/login');
      }

      setLoading(false);
    };

    checkAuth();

    // Listen to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        router.replace('/main');
      } else if (event === 'SIGNED_OUT') {
        router.replace('/login');
      }
    });

    // Cleanup the listener
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    // Display a loading spinner while determining the user's auth status
    return (

      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />

      </View>

    );
  }

  return null;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

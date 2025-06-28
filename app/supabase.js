// supabase.js
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage'


const SUPABASE_URL = 'https://ddfaomxlzexmcejrcswx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZmFvbXhsemV4bWNlanJjc3d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4ODkxODEsImV4cCI6MjA2NjQ2NTE4MX0.MqTrv04OF2duC3eRbOVa5DRBKYZecVLImClkUGf2Ujo';

//export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const supabase = createClient( SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          storage: AsyncStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      })
import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, TextInput, Button, Text, StyleSheet, Dimensions, Platform, Image } from 'react-native';
//import { auth, db, createUserWithEmailAndPassword } from '../../firebase';
import { useRouter } from 'expo-router';
import { supabase } from '../supabase';
import logo from '../../assets/images/logo2.png'
import { LinearGradient } from 'expo-linear-gradient';



/*
Signing Up users using supabase (email & password)
If user is signed up successfully, they are directed to login page.

*/
export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [isButtonDisabled, setButtonDisabled]= useState(false)

  const [error, setError] = useState(null);
  const router = useRouter();
  const { width } = Dimensions.get('window');



  useEffect(() => {
    const checkAuth = async () => {
      // Fetch the current user
      const { data: session } = await supabase.auth.getSession();

      if (session?.session) {
        // If a session exists, navigate to main
        router.replace('/main');
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

  

  const handleSignup = async () => {
    if (password!=confirmPassword) {
      setError("Passwords don't match")
      return
    }
    
      const { data: { user }, error } = await supabase.auth.signUp( { email, password });
      if (!error){
        setIsSignedUp(true)
        router.push('/login'); 

      }else{
      setError(error.message)
      }
  };



  if(!isSignedUp){

  return (
    <LinearGradient
    colors={['#74ebd5', '#9face6']} 
    style={{ flex: 1 }}
  >
    <View style={styles.container}>
    <View style={[styles.form_container, { width: (Platform.OS !== 'web' || width < 800) ? '90%' : '33%' }]}>
    <Text style={styles.motto}>Your smart guide to healthy eating.</Text>

        <Image source={logo} style={styles.logo} />


      <Text style={styles.header}>Create Account</Text>

      <Text>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholder="Enter your email"
      />
      
      <Text>Password:</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Enter your password"
      />

      <Text>Confirm Password:</Text>
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholder="Confirm your password"
      />
      
      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
      <Text style={styles.loginText}>
      Already have an account?{' '}
        <Text style={styles.linkText} onPress={() => router.push('/login')}>
        Login
                </Text>
      </Text>
      

      </View>
    </View>
    </LinearGradient>
  );
}

}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    alignItems: 'center',
    backgroundColor: 'linear-gradient(to bottom, #74ebd5, #9face6)', // Gradient background




  },
  form_container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',

  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  loginText: {
    marginTop: 10,
    textAlign: 'center',
  },
  linkText: {
    color: '#0066cc',
    textDecorationLine: 'underline',
  },
 
  logoWrapper: {
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'transparent',
    borderRadius: 100, 
    overflow: 'hidden',
    padding: 20, 
    marginBottom: 150, 
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf:'center',
    borderRadius: 95,
    resizeMode: 'cover', 
    marginBottom: 80
  },
  button: {
    backgroundColor: '#9d50bb', // Vibrant coral color
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  motto: {
    textAlign: 'center',
    fontSize: 32,
    color: '#333',
    marginBottom: 100,
    fontStyle: 'italic',
  },
});

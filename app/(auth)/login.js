import React, { useState } from 'react';
import { TouchableOpacity, View, TextInput, Button, Text, StyleSheet, Dimensions, Platform , Image} from 'react-native';
import { supabase } from '../supabase';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import logo from '../../assets/images/logo2.png'



export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router= useRouter();
  const { width } = Dimensions.get('window');


  const handleLogin = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      const { data: session, error } = await supabase.auth.getSession();
      if (session?.session) {
        const user = session.session.user;
        const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user.id)
        console.log(data)
        if (data && data[0]){
          console.log(data[0])
          router.replace('/main');
        } else {

          const { data, error } = await supabase  
          .from('users')
          .insert({
             user_id: user.id,
             created_at: new Date(),
      });
      console.log(error)
          if (!error){
            router.replace('/main');

          }else{
            console.log(error)
          }

        
      }

        }
      }
    
  
    setLoading(false);
  };

  return (
    <LinearGradient
    colors={['#74ebd5', '#9face6']} 
    style={{ flex: 1 }}
  >
    <View style={styles.container}>

    <View style={[styles.form_container, {       width: (Platform.OS !== 'web' || width < 800) ? '90%' : '33%' 
 }]}>

<Text style={styles.motto}>Your smart guide to healthy eating.</Text>


    <Image source={logo} style={styles.logo} />

      <Text style={styles.header}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      <TouchableOpacity title={loading ? 'Logging In...' : 'Log In'} style={[styles.button,, loading && { opacity: 0.5 }]} onPress={handleLogin} >
              <Text style={styles.buttonText}>{loading ? 'Logging In...' : 'Log In'}</Text>
            </TouchableOpacity>

      {/* <Button title={loading ? 'Logging In...' : 'Log In'} onPress={handleLogin} disabled={loading} /> */}

      <Text style={styles.signupText}>
        Don't have an account?{' '}
        <Text style={styles.linkText} onPress={() => router.push('/signup')}>
          Sign Up
        </Text>
      </Text>
    </View>
    </View>
    </LinearGradient>
  );
}

// Styling for the Login page
const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center',
    //backgroundColor: '#fff',
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
  signupText: {
    marginTop: 10,
    textAlign: 'center',
  },
  linkText: {
    color: '#0066cc',
    textDecorationLine: 'underline',
  },
  logoWrapper: {
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    backgroundColor: 'transparent',
    borderRadius: 100, // Increase border radius for larger logo
    overflow: 'hidden',
    padding: 20, // Increase padding for spacing
    marginBottom: 200, // Add space below the logo
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf:'center',
    borderRadius: 95, // Makes the logo circular
    resizeMode: 'cover', 
    marginBottom: 80// Ensures it covers the space proportionally
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
})

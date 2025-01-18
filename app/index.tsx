import React , {useState} from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, Button, View , Platform} from 'react-native';
import { Link, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { BASEURL } from '@/utils/functions';




const saveToken = async (token: string) => {
  try {
    if (Platform.OS === 'web') {
      localStorage.setItem('userToken', token);
    } else {
      await SecureStore.setItemAsync('userToken', token);
    }
  } catch (error) {
    console.error('Error storing token:', error);
  }
};


const parseJWT = (successMessage: string) => {
  const tokenIndex = successMessage.indexOf('Here is your token:') + 'Here is your token:'.length;
  const token = successMessage.substring(tokenIndex).trim();
  return token;
};

export default function LoginScreen() {
  const router = useRouter();
  const [text, setText] = useState(''); // State to store response or error message
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const login = async () =>
  {
    setText(''); // Reset message
    try {
      const response = await fetch(`${BASEURL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });


      if (!response.ok) {
        const errorData = await response.text(); // Parse error response
        setText(`Error: ${errorData}`);
        return;
      }

      const successMessage = await response.text(); // Parse success response
      const token = parseJWT(successMessage);
      await saveToken(token)
      router.replace("/friends");

    } catch (error) {
        setText(`Network Error`);
      }
  }


  return (
    <View style={styles.container}>

      <Text style={styles.welcomeText}>How U Doin?</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />


      <TouchableOpacity style={styles.button} onPress={login}>
          <Text style={{color: "#000", fontFamily: "Consolas"}}>Login</Text>
      </TouchableOpacity>


      <Text style={styles.registerText}>
        Not a user?{' '} 
        <Link href="/register" style={styles.registerLink}>
          Register
        </Link>
      </Text>

      {/* Success Message */}
      {text ? <Text style={{color: '#000', fontFamily: "Consolas"}}>{text}</Text> : null}
    </View>
  );
}





const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center',   // centers content vertically
    alignItems: 'center',      // centers content horizontally
    backgroundColor: '#fff',
  },
  
  welcomeText: {
    alignSelf: 'flex-start',  // To align itself
    marginLeft: '26%',        // Align horizontally above left edge of 50% wide inputs
    marginBottom: 0,
    fontSize: 30,
    color: '#ff3060',
    fontFamily: 'Consolas',
  },
  input: {
    width: '50%',
    height: 50,
    marginVertical: 5,
    paddingHorizontal: 15,
    borderWidth: 1.3,
    borderColor: '#ccc',
    borderRadius: 20,
    fontSize: 16,
    fontFamily: 'Consolas'
  },
  registerText: {
    marginTop: 20,
    color: '#000',
    fontSize: 14,
    fontFamily: 'Consolas',
  },
  registerLink: {
    color: '#ff3060',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#faa',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
  }
});

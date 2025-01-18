import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, Button, View } from 'react-native';
import { Link } from 'expo-router';
import { BASEURL } from '@/utils/functions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  welcomeText: {
    alignSelf: 'flex-start',
    marginLeft: '26%',
    marginBottom: 10,
    fontSize: 30,
    color: '#ff3060',
    fontFamily: 'Consolas',
  },
  input: {
    width: '50%',
    height: 50,
    marginVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1.3,
    borderColor: '#ccc',
    borderRadius: 20,
    fontSize: 16,
    fontFamily: 'Consolas',
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
  messageText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
    fontFamily: 'Consolas',
  },
  button: {
    backgroundColor: '#faa',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
});



export default function RegisterScreen() {
  const [text, setText] = useState(''); // State to store response or error message
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');

  const register = async () => {
    setText(''); // Reset message
    try {
      const response = await fetch(`${BASEURL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Ensure JSON content type
        },
        body: JSON.stringify({
          email,
          password,
          name,
          lastname,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text(); // Parse error response
        setText(`Error: ${errorData}`);
        return;
      }

      const successMessage = await response.text(); // Parse success response
        setText(successMessage);
      } catch (error) {
        setText(`Network Error`);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
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
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Lastname"
        placeholderTextColor="#aaa"
        value={lastname}
        onChangeText={setLastname}
      />

      {/* Button */}

      <TouchableOpacity style={styles.button} onPress={register}>
          <Text style={{color: "#000", fontFamily: "Consolas"}}> Register</Text>
      </TouchableOpacity>
      
      {/* Login Link */}
      <Text style={styles.registerText}>
        Already a user?{' '}
        <Link href="/" dismissTo style={styles.registerLink}>
          Login
        </Link>
      </Text>

      {/* Success Message */}
      {text ? <Text style={styles.messageText}>{text}</Text> : null}
    </View>
  );
}
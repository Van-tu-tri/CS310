import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Platform, TextInput } from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { loadToken, BASEURL } from "@/utils/functions";



export default function addFriend() 
{
    const [email, setEmail] = useState("");
    const [response, setResponse] = useState("");
    const [sending, setSending] = useState([]);
    const router = useRouter();


    const requestSendingList = async () => {
      try {
        const token = await loadToken();
        if (token) {
          const response = await fetch(
            `${BASEURL}/friends/sendings`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Auth: token,
              },
            }
          );
  
          if (!response.ok) {
            const errorData = await response.text();
            Alert.alert('Error', errorData || 'Failed to load sending list.');
            setSending([])
            return;
          }
  
          const successMessage = await response.json();
          setSending(successMessage); // successMessage should be an array of emails
        } else {
          router.replace('/'); // Redirect to login if no token
        }
      } catch (error) {
        Alert.alert('Error', 'Something went wrong');
      }
    };


    useEffect(() => {
      if (sending) {
        requestSendingList();
      } else {
        Alert.alert("Error", "Receiver not specified!");
      }
    }, [sending]); // Dependency array ensures this runs when 'friends' changes


    const add = async () => {
        try {
            setResponse("");
          const token = await loadToken();
          if (token) {
            const response = await fetch(`${BASEURL}/friends/add`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Auth: token,
              },
              body: JSON.stringify({
                email,
              }),
            });
    
            if (!response.ok) {
              const errorData = await response.text();
              setResponse("Error: " + errorData);
              return;
            }
    
            const successMessage = await response.text();
            setResponse(successMessage);
          } else {
            router.push("/"); // Redirect to login if no token
          }
        } catch (error) {
          console.error("Error requesting friend list:", error);
          Alert.alert("Error", "Something went wrong while fetching friends.");
        }
      };

    
    return (
        <View style={styles.container}>


            <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
            />

            <TouchableOpacity style={styles.button} onPress={add}>
                <Text style={{color: "#000", fontFamily: "Consolas"}}> Add</Text>
            </TouchableOpacity>

            <View style={{backgroundColor: '#f0a050', borderRadius: 20, justifyContent: 'center', marginTop: '1%', marginBottom: '1%' }}> 
              <Text style={styles.registerText}> {response} </Text>
            </View>
            
            <View style={{ backgroundColor: '#ffffff', flex: 1 }}>
              {sending.length > 0 ? (
                // IF friends length is bigger than zero
                <FlatList
                  data={[...sending].sort((a, b) => String(a).localeCompare(String(b)))}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <View style={{ backgroundColor: 'powderblue', padding: 10, marginVertical: 5, borderRadius: 5 }}>
                      <Text>{item}</Text>
                    </View>
                  )}
                />
              ) : (
                // ELSE
                <Text>No sending found.</Text>
              )}
            </View>

            
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
      flex: 1, 
      justifyContent: 'center', // centers content vertically
      alignItems: 'center',      // centers content horizontally
      backgroundColor: '#fff',
      
    },
    
    welcomeText: {
      alignSelf: 'flex-start',
      marginLeft: '26%',  // Align horizontally above left edge of 50% wide inputs
      marginBottom: 10,
      
      fontSize: 30,
      color: '#ff3060',
      fontFamily: 'Consolas',
    },
    input: {
      width: '50%',
      height: 50,
      alignSelf: "center",
      marginVertical: 10,
      marginTop: '20%',
      padding: 15,
      borderWidth: 1.3,
      borderColor: '#ccc',
      borderRadius: 20,
      fontSize: 16,
      fontFamily: 'Consolas'
    },
    registerText: {
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
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, Platform, FlatList, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { loadToken, BASEURL, convertToDateTime } from "../utils/functions";
import { useSearchParams } from "expo-router/build/hooks";
import AntDesign from '@expo/vector-icons/AntDesign';



type Message = {
  sender: string;
  message: string;
  time: string; // If you have a timestamp field
};

export default function SendMessage() {

    const searchParams = useSearchParams();
    const receiver = searchParams.get("receiver"); // Access 'receiver' parameter

    const [message, setMessage] = useState("");              // State for the message
    const [history, setHistory] = useState<Message[]>([]);   // State for message history
    const router = useRouter();                              // Expo Router Navigation
    const [username, setUsername] = useState("");

    const sendMessage = async () => {
        try {
        const token = await loadToken();
        if (!token) {
            window.alert("Authentication token is missing. Please log in again.");
            router.push("/"); // Redirect to login if token is missing
            return;
        }

        const response = await fetch(`${BASEURL}/groups/${receiver}/send`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Auth: token, // Pass token in header
            },
            body: JSON.stringify({message}),
        });

        if (response.ok) {
            setMessage(""); // Clear message input
        } else {
            const errorData = await response.text();
            Alert.alert("Error", errorData || "Failed to send message.");
            window.alert(`${receiver}`);
            window.alert(`${token}`);
            
        }
        getHistory();
        } catch (error) {
        console.error("Error sending message:", error);
        Alert.alert("Error", "Something went wrong. Please try again.");
        }
    };

  
    const getUsername = async () => 
    {
      try {
        const token = await loadToken();
        if (token) 
        {
          const response = await fetch(`${BASEURL}/username`, {
            method: "GET",
            headers: 
            {
              "Content-Type": "application/json",
              Auth: token,
            },
          });
          if (!response.ok) 
            {
              return;
            }
          const successMessage = await response.text();
          setUsername(successMessage);
        }
        else
        {

        }
      } catch (error) {
        console.error("Error requesting friend list:", error);
        window.alert(`${error}`);
      }
    };
    useEffect(() => {
        getUsername();
    }, []);

    const getHistory = async () => {
        try {
        const token = await loadToken();
        if (token)
        {
            const response = await fetch(`${BASEURL}/groups/${receiver}/messages`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Auth: token, 
            },
            });
            
            if (response.ok) {
            const successMessage = await response.json();
            setHistory(successMessage);
            } else {
            setHistory([]);
            }
            
        }
        } catch (error) {
        console.error("Error getting message history:", error);
        Alert.alert("Error", "Something went wrong. Please try again.");
        }
    };

    const goHome = async () => {
        router.replace("/(tabs)/groups")
    }


    const goDetails = async (groupID: string | null) => {
      router.push({
        pathname: "/groupdetails",
        params: {receiver: groupID},
      });
    }
    
    useEffect(() => {
        if (receiver) {
        getHistory();
        } else {
        Alert.alert("Error", "Receiver not specified!");
        }
    }, [history]); // Dependency array ensures this runs when 'history' changes

    
    return (

        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

        <View style={styles.row}> 

            <TouchableOpacity style={styles.homeButton} onPress={goHome}>
              <AntDesign name="left" color="dark" size={24} />
            </TouchableOpacity>
            
            <View style={styles.textBackground}>
              <Text style={{fontFamily: 'Consolas'}}>Talking with: {receiver}</Text>
            </View>

            <TouchableOpacity style={styles.homeButton} onPress={() => goDetails(receiver)}>
              <AntDesign name="infocirlceo" color="dark" size={24} />
            </TouchableOpacity>

        </View>
        

        {/* Component 1 */}
        <View style={styles.flatListContainer}>
            {history.length > 0 ? (
            <FlatList<Message>
                data={history}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                <View
                    style={[
                    styles.messageContainer,
                    item.sender === username ? styles.rightMessage : styles.leftMessage,
                    ]}
                >
                    <Text style={styles.content}>{item.message}</Text>
                    <Text style={item.sender === receiver ? styles.receiver : styles.sender}>
                    {item.sender} 
                    {' '}{convertToDateTime(item.time).time}
                    </Text>
                </View>
                )}
            />
            ) : (
            <Text style={styles.content}>There is no message record.</Text>
            )}
        </View>

        {/* Component 2 */}
        <View style={styles.bottomRow}>

            <TextInput
            style={styles.input}
            placeholder="Text"
            placeholderTextColor="#aaa"
            value={message}
            onChangeText={setMessage}
            />
            <TouchableOpacity style={styles.button} onPress={sendMessage}>
            <Text style={styles.content}>Send</Text>
            </TouchableOpacity>

        </View>

        </KeyboardAvoidingView>
    )
    }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  row: {
    marginTop: '15%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  bottomRow: {
    marginTop: '4%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%'
  },
  textBackground: {
    backgroundColor: 'powderblue',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  flatListContainer: {
    flex: 1, // Allows FlatList to grow and take available space
    width: '95%', // Ensures it spans the full width
  },
  homeButton: {

  },
  button: {
    backgroundColor: "#ff5F50", // Fixed the color typo
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: '5%',
    marginRight: '2%'
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: "70%",
  },
  leftMessage: {
    alignSelf: "flex-start",  // Align to the left
    backgroundColor: "#e6f7ff",
  },
  rightMessage: {
    alignSelf: "flex-end",    // Align to the right
    backgroundColor: "#f1e7dd",
  },
  sender: {
    alignSelf: 'flex-end',
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 5,
  },
  receiver: {
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 5,
  },
  content: { // Text content
    fontSize: 14,
  },
  input: {
    width: "75%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: '5%',
    marginLeft: "2%",
  },
});
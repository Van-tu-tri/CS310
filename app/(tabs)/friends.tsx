import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Platform } from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { loadToken, BASEURL } from "../../utils/functions";


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


// Main 
export default function Home() {
  const [friends, setFriends] = useState([]); // Friends list.
  const router = useRouter();                 // Expo Router for navigation.
  const [username, setUsername] = useState("");

  // Function to get friend list from the ENDPOINT
  const requestFriendList = async () => 
  {
    try {
      const token = await loadToken();
      if (token) 
      {
        const response = await fetch(`${BASEURL}/friends`, {
          method: "GET",
          headers: 
          {
            "Content-Type": "application/json",
            Auth: token,
          },
        });

        if (!response.ok) 
        {
          const errorData = await response.text();
          console.error("Error:", errorData);
          Alert.alert("Error", errorData || "Failed to load friends.");
          setFriends([]);
          return;
        }

        const successMessage = await response.json();
        setFriends(successMessage);
      } 
      else 
      {
        router.replace("/"); // Redirect to login if no token
      }
    } catch (error) {
      console.error("Error requesting friend list:", error);
      Alert.alert("Error", "Something went wrong while fetching friends.");
    }
  };


  // Move handleFriendClick outside requestFriendList
  const handleFriendClick = (friend: string) => {
    router.push({
      pathname: "/message",
      params: { receiver: friend },
    });
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

  useEffect(() => {
    if (friends) {
      requestFriendList();
    } else {
      Alert.alert("Error", "Receiver not specified!");
    }
  }, [friends]); // Dependency array ensures this runs when 'friends' changes

  return (
    <View style={styles.container}>

      

      <View style={styles.infoInside}>
        <Text style={{fontFamily: 'Consolas'}}>USER {username} </Text>
      </View>
        

      {friends.length > 0 ? (
        // IF friends length is bigger than zero
        <FlatList
          data={[...friends].sort((a, b) => String(a).localeCompare(String(b)))}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.friendContainer} onPress={() => handleFriendClick(item)}>
              <Text style={styles.friendText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        // ELSE
        <Text style={styles.noFriends}>No friends found.</Text>
      )}


    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  containerView: {
    flexDirection: "row", // Align children horizontally
  },
  infoInside: {
    alignSelf: 'flex-start',
    backgroundColor: 'powderblue',
    paddingHorizontal: 20,
    borderRadius: 8,
    paddingVertical: 6,
    marginBottom: '1%',
    marginTop: '10%'
  },
  button: {
    backgroundColor: "#ff4d00", // Fixed the color typo
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
    marginLeft: '88%',
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  friendContainer: {
    backgroundColor: "#f9f9f9", // Light gray background
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000", // Drop shadow for elevation
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2, // For Android elevation
    borderWidth: 1,
    borderColor: "#ddd",
  },
  friendText: {
    fontSize: 18,
    fontWeight: "500", // Slightly bold text
    color: "#333", // Darker text color
    textAlign: "center",
  },
  noFriends: {
    fontSize: 16,
    color: "#666",
    marginTop: 20,
    textAlign: "center",
  },
});
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useNavigation } from '@react-navigation/native';
import { loadToken, BASEURL } from "../../utils/functions";
import AntDesign from '@expo/vector-icons/AntDesign';

export default function Home() {
  const [groups, setGroups] = useState([]); 
  const router = useRouter();                
  const [username, setUsername] = useState("");

  // Function to get friend list from the ENDPOINT
    const requestGroupList = async () => 
    {
    try {
      const token = await loadToken();
      if (token) 
      {
        const response = await fetch(`${BASEURL}/groups`, {
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
          Alert.alert("Error", errorData || "Failed to load groups.");
          setGroups([]);
          return;
        }

        const successMessage = await response.json();
        setGroups(successMessage);
      } 
      else 
      {
        router.replace("/"); // Redirect to login if no token
      }
    } catch (error) {
      console.error("Error requesting friend group:", error);
      Alert.alert("Error", "Something went wrong while fetching groups.");
      setGroups([]);
    }
    }


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

    const handleGroupClick = (group: string) => {
        router.push({
        pathname: "/groupmessage",
        params: { receiver: group },
        });
    };
  
    useEffect(() => {
        getUsername();
    }, []);

    
    useEffect(() => {
        if (groups) {
        requestGroupList();
        } else {
        Alert.alert("Error", "Receiver not specified!");
        }
    }, [groups]);

    
    const goCreate = async () => {
        router.push("../createGroups")
    }
 
    return (
      <View style={styles.container}>
  
        
        <View style={{flexDirection: 'row',
                    justifyContent: 'space-between',}}>

            <View style={styles.infoInside}>
                <Text style={{fontFamily: 'Consolas'}}>USER {username} </Text>
            </View>

            <View style={[styles.infoInside, {backgroundColor: '#a0f0aa',}]}>
                <TouchableOpacity onPress={goCreate}>
                    <AntDesign name="plus" color="dark" size={24} />
                </TouchableOpacity>
            </View>
                
        </View>
    
          
  
        {groups.length > 0 ? (
          // IF friends length is bigger than zero
          <FlatList
            data={[...groups].sort((a, b) => String(a).localeCompare(String(b)))}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.friendContainer} onPress={() => handleGroupClick(item)}>
                <Text style={styles.friendText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        ) : (
          // ELSE
          <Text style={styles.noFriends}>No group found.</Text>
        )}
  
  
      </View>
    );

};


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
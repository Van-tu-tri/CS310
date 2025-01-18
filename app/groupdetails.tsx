import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Platform } from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { loadToken, BASEURL } from "../utils/functions";
import { useSearchParams } from "expo-router/build/hooks";
import AntDesign from '@expo/vector-icons/AntDesign';


// Main 
export default function Home() {
  const [members, setMembers] = useState([]); // Friends list.
  const router = useRouter();                 // Expo Router for navigation.
  const [creationTime, setCreationTime] = useState("");
  const [username, setUsername] = useState("");

    const searchParams = useSearchParams();
    const groupID = searchParams.get("receiver");

  // Function to get friend list from the ENDPOINT
  const requestMemberList = async (groupID: string | null) => 
  {
    try {
      const token = await loadToken();
      if (token) 
      {
        const response = await fetch(`${BASEURL}/groups/${groupID}/members`, {
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
          Alert.alert("Error", errorData || "Failed to load members.");
          setMembers([]);
          return;
        }

        const { members, creationTime } = await response.json();
        setMembers(members); // Store members in state
        setCreationTime(creationTime);
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



  const gomessage = async (groupID: string | null) => {
    router.push({
      pathname: "/groupmessage",
      params: {receiver: groupID},
    });
  }

  const goaddmember = async (groupID: string | null) => {
    router.push({
      pathname: "/addmember",
      params: {receiver: groupID},
    });
  }
  


  useEffect(() => {
    if (members) {
      requestMemberList(groupID);
    } else {
      Alert.alert("Error", "Receiver not specified!");
    }
  }, [members]); // Dependency array ensures this runs when 'friends' changes

  return (
    <View style={styles.container}>

    
      <View style={{marginTop: '10%', flexDirection: 'row', justifyContent: 'space-between',}}> 

          
        <TouchableOpacity onPress={() => gomessage(groupID)} style={{marginLeft: '5%'}}>
            <AntDesign name="left" color="dark" size={24} />
        </TouchableOpacity>
        

        <View style={{backgroundColor: '#a0f0aa', paddingHorizontal: 10, borderRadius: 10, paddingVertical: 5}}> 
            <TouchableOpacity onPress={() => goaddmember(groupID)} style={{marginRight: '5%', alignSelf: 'center'}}>
                <AntDesign name="plus" color="dark" size={24} />
            </TouchableOpacity>
        </View>


      </View>
      
      <Text style={styles.groupID}>{groupID}</Text>

      <View style={{alignSelf: 'center'}}>
        {creationTime && (
          <Text >
            Created At: {new Date(creationTime).toLocaleString()}
          </Text>
        )}
        <Text>Group Members</Text>
        {members.length > 0 ? (
          <FlatList
            data={members}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <Text>{item}</Text>}
          />
        ) : (
          <Text>No members found.</Text>
        )}
      </View>


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
  groupID: {
    marginTop: "5%",
    marginBottom: "2%",
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  }
});
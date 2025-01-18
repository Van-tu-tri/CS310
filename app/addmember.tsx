import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Platform, Button, ScrollView, TextInput } from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { loadToken, BASEURL } from "../utils/functions";
import { useSearchParams } from "expo-router/build/hooks";
import AntDesign from '@expo/vector-icons/AntDesign';


export default function Home() {
    const [friends, setFriends] = useState([]); // Friends list.
    const [response, setResponse] = useState("");
    const router = useRouter();     
    
    const searchParams = useSearchParams();
    const groupID = searchParams.get("receiver"); 



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

    useEffect(() => {
        if (friends) {
        requestFriendList();
        } else {
        Alert.alert("Error", "Receiver not specified!");
        }
    }, [friends]);



    const addMember = async (groupID: string | null, email: string) =>
        {
        try {
            const token = await loadToken();
            if (token) 
            {
            const response = await fetch(`${BASEURL}/groups/${groupID}/add-member`, {
                method: "POST",
                headers: 
                {
                "Content-Type": "application/json",
                Auth: token,
                },
                body: JSON.stringify({email}),
            });
    
            if (!response.ok) 
            {
                const errorData = await response.text();
                console.error("Error:", errorData);
                Alert.alert("Error", errorData);
                setResponse(`Error: ${errorData}`);
                return;
            }
    
            const successMessage = await response.text();
            setResponse(successMessage)
            } 
            else 
            {
            router.replace("/"); // Redirect to login if no token
            }
        } catch (error) {
            console.error("Error creating group:", error);
            Alert.alert("Error", "Something went wrong while creating group.");
        }
        };

    const godetails = async (groupID: string | null) => {
        router.push({
            pathname: "/groupdetails",
            params: {receiver: groupID},
        });
        }


    return (
        <View style={styles.container}>

            <View style={{marginTop: '10%'}}> 

                        
                <TouchableOpacity onPress={() => godetails(groupID)} style={{marginLeft: '5%', marginBottom: '2%'}}>
                    <AntDesign name="left" color="dark" size={24} />
                </TouchableOpacity>


            </View>

            <View style={styles.listContainer}>
                {friends.length > 0 ? (
                    // If friends length is greater than zero
                    <FlatList
                        data={[...friends].sort((a, b) => String(a).localeCompare(String(b)))}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.friendItem}>
                                <Text style={styles.friendName}>{item}</Text>
                                <TouchableOpacity
                                    onPress={() => addMember(groupID, item)}
                                    style={[
                                        styles.actionButton,
                                        { backgroundColor: "#E74C3C"},
                                    ]}
                                >
                                    <Text style={styles.buttonText}>ADD</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                ) : (
                    // Else
                    <Text style={styles.noFriendsText}>No friends found.</Text>
                )}
            </View>

            <View style={{backgroundColor: '#f0a050', borderRadius: 20, justifyContent: 'center', marginTop: '5%', marginBottom: '5%', width: '50%', alignSelf: 'center'}}> 
                <Text style={{alignSelf: 'center'}}>{response}</Text>
            </View>
        </View>
    );
};
   
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FA",
        padding: 20,
    },
    header: {
        padding: 15,
        backgroundColor: "#5DADE2",
        borderRadius: 10,
        marginBottom: 20,
    },
    headerText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFFFFF",
        textAlign: "center",
    },
    listContainer: {
        flex: 1,
        marginBottom: 20,
        width: '90%',
        alignSelf: 'center'
    },
    friendItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        padding: 15,
        marginVertical: 5,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    friendName: {
        flex: 1,
        fontSize: 16,
        color: "#2C3E50",
    },
    actionButton: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "bold",
    },
    noFriendsText: {
        fontSize: 16,
        color: "#7F8C8D",
        textAlign: "center",
        marginTop: 20,
    },
    selectedContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: "#D5F5E3",
        borderRadius: 10,
    },
    selectedTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#1E8449",
        marginBottom: 10,
    },
    selectedMember: {
        fontSize: 14,
        color: "#117A65",
        marginVertical: 5,
    },
    noMembersText: {
        fontSize: 14,
        color: "#7DCEA0",
        textAlign: "center",
    },
    createGroupButton: {
        marginTop: 20,
        backgroundColor: "#2980B9",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    createGroupButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    scrollContainer: {
        maxHeight: 150, // Set a fixed height for the scrollable area
        marginBottom: 10,
    },
});

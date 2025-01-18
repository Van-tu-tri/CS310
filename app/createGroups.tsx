import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Platform, Button, ScrollView, TextInput } from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { loadToken, BASEURL } from "../utils/functions";
import AntDesign from '@expo/vector-icons/AntDesign';

export default function Home() {
    const [friends, setFriends] = useState([]); // Friends list.
    const router = useRouter(); 
    const [members, setMembers] = useState<string[]>([]); 
    const [groupname, setGroupname] = useState("");               

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

    const createGroup = async (groupName: string, groupMembers: string[]) =>
        {
        try {
            const token = await loadToken();
            if (token) 
            {
            const response = await fetch(`${BASEURL}/groups/create`, {
                method: "POST",
                headers: 
                {
                "Content-Type": "application/json",
                Auth: token,
                },
                body: JSON.stringify({ groupName, groupMembers }),
            });
    
            if (!response.ok) 
            {
                const errorData = await response.text();
                console.error("Error:", errorData);
                Alert.alert("Error", errorData);
                return;
            }
    
            const successMessage = await response.text();
            Alert.alert(successMessage);
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

    const toggleMember = (member: string) => {
        if (members.includes(member)) {
            setMembers(members.filter((m) => m !== member)); // Remove member if already added
        } else {
            setMembers([...members, member]); // Add member if not already added
        }
    };

    const goHome = async () => {
        router.replace("/(tabs)/groups")
    }
      

    return (
        <View style={styles.container}>

            <View style={{marginTop: '10%', marginBottom: '5%'}}> 

                <TouchableOpacity onPress={goHome}>
                    <AntDesign name="left" color="dark" size={24} />
                </TouchableOpacity>

            </View>

            <View style={styles.header}>
                <TextInput
                    style={styles.input}
                    placeholder="Group Name"
                    placeholderTextColor="#aaa"
                    value={groupname}
                    onChangeText={setGroupname}
                />
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
                                    onPress={() => toggleMember(item)}
                                    style={[
                                        styles.actionButton,
                                        { backgroundColor: members.includes(item) ? "#E74C3C" : "#2ECC71" },
                                    ]}
                                >
                                    <Text style={styles.buttonText}>
                                        {members.includes(item) ? "Remove" : "Add"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                ) : (
                    // Else
                    <Text style={styles.noFriendsText}>No friends found.</Text>
                )}
            </View>
            

            <View style={styles.selectedContainer}>
                <Text style={styles.selectedTitle}>Group Name: {groupname}</Text>
                <Text style={styles.selectedTitle}>Selected Members:</Text>
                {members.length > 0 ? (
                    <View style={styles.scrollContainer}>
                        <ScrollView>
                            {members.map((member, index) => (
                                <Text key={index} style={styles.selectedMember}>
                                    {member}
                                </Text>
                            ))}
                        </ScrollView>
                    </View>
                ) : (
                    <Text style={styles.noMembersText}>No members selected.</Text>
                )}
                <TouchableOpacity style={styles.createGroupButton} onPress={() => createGroup(groupname, members)}>
                    <Text style={styles.createGroupButtonText}>Create Group</Text>
                </TouchableOpacity>
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
        padding: 0,
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
    input: {
        width: '90%',
        height: 50,
        alignSelf: "center",
        marginVertical: 10,
        padding: 15,
        borderWidth: 1.3,
        borderColor: '#ccc',
        borderRadius: 20,
        fontSize: 16,
        fontFamily: 'Consolas'
      },
});

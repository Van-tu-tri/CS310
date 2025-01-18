import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  View,
  FlatList,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { BASEURL, convertToDateTime } from "../../utils/functions";

const loadToken = async () => {
  try {
    let token;
    if (Platform.OS === 'web') {
      token = localStorage.getItem('userToken');
    } else {
      token = await SecureStore.getItemAsync('userToken');
    }
    return token;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

export default function Pending() {
  const [pending, setPending] = useState([]);
  const router = useRouter();

  const requestPendingList = async () => {
    try {
      const token = await loadToken();
      if (token) {
        const response = await fetch(
          `${BASEURL}/friends/pending`,
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
          Alert.alert('Error', errorData || 'Failed to load pending list.');
          setPending([])
          return;
        }

        const successMessage = await response.json();
        setPending(successMessage); // successMessage should be an array of emails
      } else {
        router.replace('/'); // Redirect to login if no token
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  useEffect(() => {
    if (pending) {
      requestPendingList();
    } else {
      Alert.alert("Error", "Receiver not specified!");
    }
  }, [pending]); // Dependency array ensures this runs when 'friends' changes


  const handleDecision = async (email: string, action: string) => {
    try {
      const token = await loadToken();
      if (token) {
        const response = await fetch(
          `${BASEURL}/friends/accept`, // Same endpoint for both actions
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Auth: token,
            },
            body: JSON.stringify({
              email,
              accept_or_reject: action,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.text();
          Alert.alert('Error', errorData || 'Failed to update friend status.');
          return;
        }

        Alert.alert('Success', `Friend ${action}ed successfully.`);
        // Reload the pending list after the action
        requestPendingList();
      } else {
        router.replace('/'); // Redirect to login if no token
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while updating friend status.');
    }
  };


  return (
    <View style={styles.container}>
      {pending.length > 0 ? (
        <FlatList
          data={pending}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.friendContainer}>
              <Text style={styles.friendText}>{item}</Text>
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.acceptButton]}
                  onPress={() => handleDecision(item, 'accept')}
                >
                  <Text style={styles.actionButtonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.rejectButton]}
                  onPress={() => handleDecision(item, 'reject')}
                >
                  <Text style={styles.actionButtonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noFriends}>
          No requests found.
        </Text>
      )}

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
    marginTop: '10%'
  },
  button: {
    alignSelf: 'flex-end',
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  friendContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  friendText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  noFriends: {
    fontSize: 16,
    color: '#666',
    marginTop: 20,
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#FF5733',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    padding: 10,
  },
  acceptAllButton: {
    backgroundColor: '#4CAF50',
  },
  rejectAllButton: {
    backgroundColor: '#FF5733',
  },
});
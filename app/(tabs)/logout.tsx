import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

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




export default function logout() {
    const router = useRouter();   
    const logout = () =>
        {
          saveToken("");
          router.replace("/");
        }
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={logout}>
                <Text style={{fontFamily: 'Consolas'}}>LOGOUT</Text>
            </TouchableOpacity>
        </View>
    )
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
      borderRadius: 25,
    }
  });
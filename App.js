import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import * as Location from 'expo-location';

const API_KEY = "ae0050c3ef5865c95d6982924c7de685"
const URL = "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist="
const PARAMS = `&api_key=${API_KEY}&format=json&limit=10`

export default function App() {
    const [location, setLocation] = useState(null);
    const [artistInput, setArtistInput] = useState('');
    const [artistData, setArtistData] = useState([]);

    const fetchArtist = async () => {
        const response = await fetch(URL + artistInput + PARAMS)
        const data = await response.json()
        setArtistData(data.toptracks.track)
    }

    useEffect(() => {
        async function getCurrentLocation() {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        }

        getCurrentLocation();
    }, []);

    console.log(location)

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>Longitude {location?.coords.longitude}</Text>
            <Text style={styles.text}>Latitude {location?.coords.latitude}</Text>
            <Text style={styles.search}>Procurar artista</Text>
            <TextInput
                value={artistInput}
                onChangeText={setArtistInput}
                placeholder='Digite o nome de um artista'
                style={styles.searchInput}
            />
            <TouchableOpacity style={styles.button} onPress={fetchArtist}>
                <Text style={{ color: "#fff", fontWeight: 600 }}>
                    Procurar
                </Text>
            </TouchableOpacity>

            <View style={{ flex: 1 }}>
                <FlatList
                    data={artistData}
                    renderItem={({ item, index }) =>
                        <View style={{ borderRadius: 10, padding: 8, backgroundColor: `${index % 2 == 0 ? "#cbd5e1" : ""}` }}>
                            <Text>Nome da música <Text style={{ fontWeight: 600 }}>{item.name}</Text></Text>
                            <Text>Ouvintes <Text style={{ fontWeight: 600 }}>{item.listeners}</Text></Text>
                        </View>
                    }
                    ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                />
            </View>

            <StatusBar style="auto" />
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        marginVertical: 24,
        gap: 8,
    },
    search: {
        fontSize: 24,
        lineHeight: 32,
        fontFamily: "Roboto",
        fontWeight: 800
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
        fontFamily: "Roboto",
    },
    searchInput: {
        borderWidth: 1,
        borderColor: "#e2e8f0",
        borderRadius: 15,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    button: {
        padding: 16,
        backgroundColor: "#2563eb",
        borderRadius: 15,
        alignItems: "center"
    }

});

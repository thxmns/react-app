// /////////////////////////////////////////// //
// ------------* BREGLER Thomas *------------ //
// /////////////////////////////////////////// //


import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import Ionicons from 'react-native-vector-icons/Ionicons';

const getDepartmentInfo = async (latitude: number, longitude: number) => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`);
        const data = await response.json();
        const department = data.address && data.address.county;
        const departmentCode = data.address && data.address.postcode;
        return { department, departmentCode };
    } catch (error) {
        console.error('Error retrieving department info:', error);
        return { department: 'Unknown', departmentCode: 'Unknown' };
    }
};

export default function CreateScreen() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [instructions, setInstructions] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [departmentInfo, setDepartmentInfo] = useState({ department: 'Unknown', departmentCode: 'Unknown' });
    const router = useRouter();

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Error', 'Location permission not granted.');
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            if (location) {
                const lat = location.coords.latitude.toFixed(6);
                const lon = location.coords.longitude.toFixed(6);
                setLatitude(lat);
                setLongitude(lon);
                const { department, departmentCode } = await getDepartmentInfo(location.coords.latitude, location.coords.longitude);
                setDepartmentInfo({ department, departmentCode });
            }
        })();
    }, []);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Access to photos', 'Access to photos denied');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            const { uri } = result.assets[0];
            compressImage(uri);
        }
    };

    const compressImage = async (uri: string) => {
        try {
            const manipResult = await manipulateAsync(uri, [], {
                compress: 0.5,
                format: SaveFormat.JPEG,
            });
            setSelectedImage(manipResult.uri);
        } catch (error) {
            Alert.alert('Error', 'Failed to compress the picture.');
        }
    };

    const handleLatitudeChange = (text: string) => {
        const cleanedText = text.replace(/[^0-9.]/g, '');
        setLatitude(cleanedText);
    };

    const handleLongitudeChange = (text: string) => {
        const cleanedText = text.replace(/[^0-9.]/g, '');
        setLongitude(cleanedText);
    };

    const handleSubmit = async () => {
        if (!title.trim() || !instructions.trim()) {
            Alert.alert('Error', 'Please fill out all required fields.');
            return;
        }

        const finalLatitude = latitude.trim() ? latitude : "00.00";
        const finalLongitude = longitude.trim() ? longitude : "00.00";

        try {
            const existingData = await AsyncStorage.getItem('obstacles');
            const obstacles = existingData ? JSON.parse(existingData) : [];
            const newObstacle = {
                id: String(Date.now()),
                title,
                instructions,
                latitude: finalLatitude,
                longitude: finalLongitude,
                image: selectedImage,
                department: departmentInfo.department,
                departmentCode: departmentInfo.departmentCode,
            };
            obstacles.push(newObstacle);
            await AsyncStorage.setItem('obstacles', JSON.stringify(obstacles));

            // Reset form after submission
            setTitle('');
            setInstructions('');
            setLatitude('');
            setLongitude('');
            setSelectedImage(null);
            setDepartmentInfo({ department: 'Unknown', departmentCode: 'Unknown' });
            router.push('/explore');
        } catch (error) {
            Alert.alert('Error', 'Failed to save the obstacle.');
        }
    };

    const handleBack = () => {
        setTitle('');
        setInstructions('');
        setLatitude('');
        setLongitude('');
        setSelectedImage(null);
        setDepartmentInfo({ department: 'Unknown', departmentCode: 'Unknown' });
        router.push('/explore');
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Create Obstacle</Text>
            </View>
            <ScrollView contentContainerStyle={styles.formContainer}>
                {/* Image Upload Section */}
                <View style={styles.imageContainer}>
                    <Text style={styles.label}>Image</Text>
                    <TouchableOpacity onPress={pickImage}>
                        <View style={styles.imageFrame}>
                            {selectedImage ? (
                                <Image source={{ uri: selectedImage }} style={styles.image} />
                            ) : (
                                <Ionicons name="camera-outline" size={50} color="#888" style={styles.cameraIcon} />
                            )}
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Title Section */}
                <View style={styles.formField}>
                    <Ionicons name="text-outline" size={24} color="#1D3D47" style={styles.formIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Title (required)"
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                {/* Instructions Section */}
                <View style={styles.formField}>
                    <Ionicons name="clipboard-outline" size={24} color="#1D3D47" style={styles.formIcon} />
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Instructions (required)"
                        multiline
                        value={instructions}
                        onChangeText={setInstructions}
                    />
                </View>

                {/* Coordinates Section */}
                <Text style={styles.infoText}>Enable geolocation to generate coordinates automatically.</Text>

                <View style={styles.formField}>
                    <Ionicons name="location-outline" size={24} color="#1D3D47" style={styles.formIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Latitude (optional)"
                        value={latitude}
                        onChangeText={handleLatitudeChange}
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.formField}>
                    <Ionicons name="location-outline" size={24} color="#1D3D47" style={styles.formIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Longitude (optional)"
                        value={longitude}
                        onChangeText={handleLongitudeChange}
                        keyboardType="numeric"
                    />
                </View>

                {latitude && longitude && (
                    <View style={styles.departmentInfoContainer}>
                        <Text style={styles.departmentInfo}>{`Department: ${departmentInfo.department}`}</Text>
                        <Text style={styles.departmentInfo}>{`Code: ${departmentInfo.departmentCode}`}</Text>
                    </View>
                )}

                {/* Buttons Section */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={[styles.button, styles.backButton]}
                        onPress={handleBack}
                    >
                        <Ionicons name="arrow-back-outline" size={20} color="#fff" />
                        <Text style={styles.buttonText}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.addButton]}
                        onPress={handleSubmit}
                    >
                        <Ionicons name="add-outline" size={20} color="#fff" />
                        <Text style={styles.buttonText}>Add</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    headerContainer: {
        padding: 20,
        backgroundColor: '#1D3D47',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 26,
        color: '#FFF',
        fontWeight: 'bold',
    },
    formContainer: {
        padding: 20,
    },
    imageContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        color: '#1D3D47',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    imageFrame: {
        borderWidth: 1,
        borderColor: '#1D3D47',
        borderRadius: 10,
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E8E8E8',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    cameraIcon: {
        color: '#888',
    },
    formField: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#CCC',
        marginBottom: 20,
        paddingBottom: 8,
    },
    formIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    infoText: {
        fontSize: 14,
        color: '#888',
        fontStyle: 'italic',
        textAlign: 'center',
        marginBottom: 16,
    },
    departmentInfoContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    departmentInfo: {
        fontSize: 14,
        color: '#000',
        textAlign: 'center',
        marginBottom: 4,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        marginHorizontal: 5,
    },
    backButton: {
        backgroundColor: '#f44336',
    },
    addButton: {
        backgroundColor: '#4CAF50',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
});

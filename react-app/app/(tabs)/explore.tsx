// /////////////////////////////////////////// //
// ------------* BREGLER Thomas *------------ //
// /////////////////////////////////////////// //

import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Button, Text, Pressable, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Obstacle {
  id: string;
  title: string;
  instructions: string;
  latitude: string;
  longitude: string;
  image: any;
  department: string;
  departmentCode: string;
}

// Sample obstacle for initial load
const sampleObstacle: Obstacle = {
  id: '1',
  title: 'Obstacle on the road',
  instructions:
    'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium...',
  latitude: '0.0000',
  longitude: '0.00000',
  image: require('../../assets/images/rock.jpg'),
  department: 'Metz',
  departmentCode: '000000',
};

const renderObstacleItem = ({ item, onDelete }: { item: Obstacle; onDelete: (id: string) => void }) => (
  <View style={styles.obstacleCard}>
    <Image source={item.image} style={styles.obstacleImage} />
    <View style={styles.infoContainer}>
      <Text style={styles.obstacleTitle}>{item.title}</Text>
      <Text style={styles.instructionsText}>{item.instructions}</Text>
      <View style={styles.coordinates}>
        <Text style={styles.coordText}>Lat: {item.latitude}</Text>
        <Text style={styles.coordText}>Long: {item.longitude}</Text>
        <Text style={styles.coordText}>
          {item.departmentCode}, {item.department}
        </Text>
      </View>
      <Pressable style={styles.deleteButton} onPress={() => onDelete(item.id)}>
        <Text style={styles.buttonText}>Delete</Text>
      </Pressable>
    </View>
  </View>
);

const ExploreScreen = () => {
  const [obstacleList, setObstacleList] = useState<Obstacle[]>([]);

  useEffect(() => {
    const loadObstacles = async () => {
      try {
        const savedObstacles = await AsyncStorage.getItem('obstacles');
        let obstacleArray: Obstacle[] = savedObstacles ? JSON.parse(savedObstacles) : [];
        const includesSample = obstacleArray.some((obs) => obs.id === sampleObstacle.id);
        if (!includesSample) {
          obstacleArray = [sampleObstacle, ...obstacleArray];
          await AsyncStorage.setItem('obstacles', JSON.stringify(obstacleArray));
        }
        setObstacleList(obstacleArray);
      } catch (error) {
        console.error('Error loading obstacles:', error);
      }
    };
    loadObstacles();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const updatedList = obstacleList.filter((obs) => obs.id !== id);
      await AsyncStorage.setItem('obstacles', JSON.stringify(updatedList));
      setObstacleList(updatedList);
    } catch (error) {
      console.error('Error deleting obstacle:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Obstacles List</Text>
      </View>

      <Link href="/create" asChild>
        <Pressable style={styles.addButton}>
          <Ionicons name="add" size={24} color="#fff" />
        </Pressable>
      </Link>

      <FlatList
        data={obstacleList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderObstacleItem({ item, onDelete: handleDelete })}
        contentContainerStyle={styles.listContainer}
      />

     
    </View>
  );
};

// Style definitions consistent with HomeScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 25,
    backgroundColor: '#3D5A80',
    alignItems: 'start',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 26,
    color: '#FFF',
    fontWeight: 'bold',
  },
  obstacleCard: {
    marginVertical: 10,
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderColor: '#61DAFB',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  obstacleImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginBottom: 10,
  },
  infoContainer: {
    padding: 16,
  },
  obstacleTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#333',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  coordinates: {
    marginBottom: 10,
  },
  coordText: {
    fontSize: 12,
    color: '#888',
  },
  deleteButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#FF5C5C',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '700',
  },
  listContainer: {
    paddingBottom: 60,
  },
  addButton: {
    position: 'absolute',
    
    top: 15,
    right: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
});

export default ExploreScreen;

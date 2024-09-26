// /////////////////////////////////////////// //
// ------------* BREGLER Thomas *------------ //
// /////////////////////////////////////////// //

import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Pressable, Text, SafeAreaView, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Init contact
interface Contact {
  id: string;
  name: string;
  phone: string;
  role: string;
}

// Mock contact data
const contactList: Contact[] = [
  { id: '1', name: 'Thomas Bregler', phone: '+33 7 50 48 92 59', role: 'Manager' },
  { id: '2', name: 'Nom prénom', phone: '+33 6 00 00 00 00', role: 'Member' },
  { id: '3', name: 'Nom2 prénom2', phone: '+33 6 00 00 00 00', role: 'Member' },
];

const HomeScreen = () => {
  const [visitedContacts, setVisitedContacts] = useState<string[]>([]);
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const [currentContact, setCurrentContact] = useState<string | null>(null);
  const [buttonHover, setButtonHover] = useState<{ [key: string]: boolean }>({});

  const onContactPress = (contactId: string, contactName: string) => {
    setVisitedContacts((prev) => [...prev, contactId]);
    setCurrentContact(contactName);
    setIsBannerVisible(true);
    setTimeout(() => {
      setIsBannerVisible(false);
      setCurrentContact(null);
    }, 3000);
  };

  const handleHover = (contactId: string, hover: boolean) => {
    setButtonHover((prev) => ({ ...prev, [contactId]: hover }));
  };

  const renderContactItem = ({ item }: { item: Contact }) => {
    const alreadyVisited = visitedContacts.includes(item.id);
    const isHovered = buttonHover[item.id] || false;

    return (
      <View style={styles.contactContainer}>
        <View style={styles.infoContainer}>
          <View style={styles.infoColumn}>
            <View style={styles.nameRow}>
              <Ionicons name="person" size={20} color="#333" style={styles.icon} />
              <Text style={styles.contactName}>{item.name}</Text>
            </View>
            <View style={styles.phoneRow}>
              <Ionicons name="call" size={20} color="#888" style={styles.icon} />
              <Text style={styles.contactPhone}>{item.phone}</Text>
            </View>
            <View style={styles.roleRow}>
              <Ionicons name="briefcase" size={20} color="#555" style={styles.icon} />
              <Text style={styles.contactRole}>{item.role}</Text>
            </View>
          </View>
        </View>
        <Pressable
          style={[
            styles.callButton,
            alreadyVisited ? styles.calledButton : styles.notCalledButton,
            isHovered && styles.hoveredButton, // Apply hover effect if hovered
          ]}
          onPress={() => onContactPress(item.id, item.name)}
          onPressIn={() => handleHover(item.id, true)} // Simulate hover on press in
          onPressOut={() => handleHover(item.id, false)} // Remove hover on press out
        >
          <Ionicons name="call" size={20} color="#FFF" />
          <Text style={styles.buttonLabel}>{alreadyVisited ? 'Recalled' : 'Call'}</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header with gradient background */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Contact Directory</Text>
          <Ionicons name="people" size={32} color="#FFF" style={styles.headerIcon} />
        </View>

        {/* Notification banner */}
        {isBannerVisible && currentContact && (
          <View style={styles.notificationBanner}>
            <Text style={styles.bannerText}>Now calling {currentContact}...</Text>
          </View>
        )}

        {/* Contact list */}
        <FlatList
          data={contactList}
          keyExtractor={(item) => item.id}
          renderItem={renderContactItem}
          contentContainerStyle={styles.listContainer}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

// Enhanced styles with hover effect and improved layout
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContainer: {
    paddingBottom: 50,
  },
  header: {
    padding: 25,
    backgroundColor: 'linear-gradient(90deg, rgba(61,90,128,1) 0%, rgba(93,156,236,1) 100%)', // Gradient background
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerTitle: {
    fontSize: 28,
    color: '#FFF',
    fontWeight: 'bold',
    marginRight: 10,
  },
  headerIcon: {
    marginLeft: 10,
  },
  contactContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 2,
  },
  infoContainer: {
    flex: 2,
    justifyContent: 'space-between',
    paddingRight: 10,
  },
  infoColumn: {
    flexDirection: 'column',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  contactName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  contactPhone: {
    fontSize: 16,
    color: '#888',
  },
  contactRole: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#555',
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    transition: 'all 0.3s ease',
  },
  notCalledButton: {
    backgroundColor: '#FF6B6B',
  },
  calledButton: {
    backgroundColor: '#4CAF50',
  },
  hoveredButton: {
    transform: [{ scale: 1.05 }], // Simulate hover by scaling the button slightly
    backgroundColor: '#FF5A5A', // Slightly darker color on hover
  },
  buttonLabel: {
    marginLeft: 10,
    color: '#FFF',
    fontWeight: '700',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  notificationBanner: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: '#E63946',
    alignItems: 'center',
    zIndex: 100,
  },
  bannerText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 18,
  },
});

export default HomeScreen;

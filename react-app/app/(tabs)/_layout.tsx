import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons
import { View, StyleSheet } from 'react-native'; // Import View and StyleSheet
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          borderTopLeftRadius: 15,   // Rounded corners
          borderTopRightRadius: 15,  // Rounded corners
          height: 70,                // Taller navbar for better spacing
          paddingBottom: 15,         // Added padding for a cleaner look
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,          // Subtle shadow for navbar
          elevation: 10,            // Elevation for Android shadow effect
        },
        tabBarLabelStyle: {
          fontSize: 14,              // Slightly smaller font for a cleaner look
          fontWeight: '600',         // Medium weight for better readability
          textTransform: 'none',     // Normal case, no uppercase
          marginBottom: 5,           // Adjusted margin
        },
        tabBarIconStyle: {
          marginBottom: 5,           // Spacing between icon and text
        },
        headerShown: false,           // Hide the header
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.iconContainer : null}>
              <Ionicons
                name={focused ? 'call' : 'call-outline'} // Use Ionicons for phone icon
                size={focused ? 32 : 28} // Larger icon when focused
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.iconContainer : null}>
              <Ionicons
                name={focused ? 'warning' : 'warning-outline'} 
                size={focused ? 32 : 28}
                color={color}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: '#F0F0F0',      
    borderRadius: 25,                
    padding: 8,                      
    shadowColor: '#000',             
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,   
    marginTop: 10,             
  },
});

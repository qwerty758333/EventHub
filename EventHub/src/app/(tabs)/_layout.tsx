import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#5B5FEF',
        tabBarInactiveTintColor: '#9CA3AF',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ticket-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="organizer"
        options={{
          title: 'Organizer',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="briefcase-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />   
      <Tabs.Screen
  name="create-event"
  options={{
    title: 'Create Event',
    tabBarIcon: ({ color, size }) => (
      <Ionicons
        name="add-circle-outline"
        size={size}
        color={color}
      />
    ),
  }}
/>
      <Tabs.Screen
        name="edit-event"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="event-bookings"
        options={{
          href: null,
        }}
      />
      </Tabs>


  );
}
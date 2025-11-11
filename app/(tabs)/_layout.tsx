import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'gold',
        headerStyle: {
          backgroundColor: '#134761',
        },
        headerShadowVisible: false,
        headerTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#134761',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'key-outline' : 'key'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="toDoList"
        options={{
          title: 'Lista',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'create-outline' : 'create'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'Opel Manta',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'car-sport-outline' : 'car-sport'} color={color} size={24}/>
          ),
        }}
      />
      <Tabs.Screen
        name="buscaCep"
        options={{
          title: 'CEP',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'train-outline' : 'train'} color={color} size={24}/>
          ),
        }}
      />
      {/* NOVA TAB - CLIMA */}
      <Tabs.Screen
        name="weather"
        options={{
          title: 'Clima',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'partly-sunny-outline' : 'partly-sunny'} 
              color={color} 
              size={24} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
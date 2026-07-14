import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PetProvider } from './context/PetContext';
import RegistrationScreen from './components/RegistrationScreen';
import PetProfile from './components/PetProfile';
import CalendarScreen from './components/CalendarScreen';
import WalkArchiveScreen from './components/WalkArchiveScreen';
import HistoryArchiveScreen from './components/HistoryArchiveScreen';
import NotificationService from './components/NotificationService';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    NotificationService.setupNotifications();
  }, []);

  return (
    <PetProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Registration">
          <Stack.Screen 
            name="Registration" 
            component={RegistrationScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="PetProfile" 
            component={PetProfile} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="CalendarScreen" 
            component={CalendarScreen} 
            options={{ 
              headerShown: true,
              title: 'Календарь',
              headerStyle: {
                backgroundColor: '#f5f5f5',
              }
            }}
          />
          <Stack.Screen 
            name="WalkArchive" 
            component={WalkArchiveScreen} 
            options={{ 
              headerShown: true,
              title: 'Архив прогулок',
              headerStyle: {
                backgroundColor: '#f5f5f5',
              }
            }}
          />
          <Stack.Screen 
            name="HistoryArchive" 
            component={HistoryArchiveScreen} 
            options={{ 
              headerShown: true,
              title: 'Архив записей',
              headerStyle: {
                backgroundColor: '#f5f5f5',
              }
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PetProvider>
  );
}
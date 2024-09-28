import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingPage from '@/app/(main)/landingPage';
import LoginPage from '@/app/(auth)/LoginPage';

const Stack = createNativeStackNavigator();

export default function Index() {

  return (

      <Stack.Navigator initialRouteName="LandingPage">
        <Stack.Screen name="landing" component={LandingPage} />
        <Stack.Screen name="login" component={LoginPage} />
      </Stack.Navigator>

  );
}

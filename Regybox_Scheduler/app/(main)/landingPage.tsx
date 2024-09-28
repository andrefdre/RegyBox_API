import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface LandingPageProps {
    navigation: any; // Adjust type if using strict types
  }

const LandingPage: React.FC = () => {
  const handleGetStarted = () => {
    // Handle navigation or action here
    navigation.navigate('LoginPage');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to RegyBox Scheduler</Text>
      <Text style={styles.description}>
        Your ultimate solution for managing schedules effortlessly.
      </Text>
      <Button title="Get Started" onPress={handleGetStarted} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default LandingPage;

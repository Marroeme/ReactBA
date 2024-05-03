import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {DrawerNavigationProp} from '@react-navigation/drawer';

type NavigationType = DrawerNavigationProp<
  Record<string, object | undefined>,
  'Willkommen'
>;

interface HomeScreenProps {
  navigation: NavigationType;
}

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <Text style={styles.bodyText}>
          Wähle eine Anforderung aus dem Drawer.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  container: {
    alignItems: 'center',
    padding: 20,
  },
  bodyText: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default HomeScreen;

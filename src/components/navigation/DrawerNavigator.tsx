import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from '../screens/HomeScreen';
import BiometrieScreen from '../screens/BiometrieScreen';
import LoginScreen from '../screens/LoginScreen';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: DrawerContentComponentProps) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="Willkommen"
        onPress={() => props.navigation.navigate('Willkommen')}
        icon={({color, size}) => <Icon name="face" color={color} size={size} />}
      />
      <DrawerItem
        label="Biometrie"
        onPress={() => props.navigation.navigate('Biometrie')}
        icon={({color, size}) => (
          <Icon name="fingerprint" color={color} size={size} />
        )}
      />
      <DrawerItem
        label="Standortabfrage"
        onPress={() => props.navigation.navigate('Biometrie')}
        icon={({color, size}) => (
          <Icon name="location-on" color={color} size={size} />
        )}
      />
      <DrawerItem
        label="Benachrichtigungen"
        onPress={() => props.navigation.navigate('Biometrie')}
        icon={({color, size}) => (
          <Icon name="notifications" color={color} size={size} />
        )}
      />
      <DrawerItem
        label="Fotos"
        onPress={() => props.navigation.navigate('Biometrie')}
        icon={({color, size}) => (
          <Icon name="camera" color={color} size={size} />
        )}
      />
      <DrawerItem
        label="PDF Generator"
        onPress={() => props.navigation.navigate('Biometrie')}
        icon={({color, size}) => (
          <Icon name="picture-as-pdf" color={color} size={size} />
        )}
      />
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Willkommen"
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Willkommen" component={HomeScreen} />
      <Drawer.Screen name="Biometrie" component={LoginScreen} />
      {/* Weitere Screens hinzufügen */}
    </Drawer.Navigator>
  );
}

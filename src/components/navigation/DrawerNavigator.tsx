import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import LocationScreen from '../screens/LocationScreen';
import TimerScreen from '../screens/TimerScreen';
import PhotoScreen from '../screens/PhotoScreen';
import FormScreen from '../screens/FormScreen';

const Drawer = createDrawerNavigator();

const drawerItems = [
  {
    label: 'Willkommen',
    screenName: 'Willkommen',
    iconName: 'face',
    accessibilityLabel: 'Navigiere zu Willkommen',
  },
  {
    label: 'Biometrie',
    screenName: 'Biometrie',
    iconName: 'fingerprint',
    accessibilityLabel: 'Navigiere zu Biometrie',
  },
  {
    label: 'Standortabfrage',
    screenName: 'Standortabfrage',
    iconName: 'location-on',
    accessibilityLabel: 'Navigiere zur Standortabfrage',
  },
  {
    label: 'Benachrichtigungen',
    screenName: 'Benachrichtigungen',
    iconName: 'notifications',
    accessibilityLabel: 'Navigiere zu Benachrichtigungen',
  },
  {
    label: 'Fotos',
    screenName: 'Fotos',
    iconName: 'camera',
    accessibilityLabel: 'Navigiere zu Fotos',
  },
  {
    label: 'PDF Generator',
    screenName: 'PDF',
    iconName: 'picture-as-pdf',
    accessibilityLabel: 'Navigiere zum PDF Generator',
  },
];

const CustomDrawerContent = React.memo((props: DrawerContentComponentProps) => {
  return (
    <DrawerContentScrollView {...props}>
      {drawerItems.map(item => (
        <DrawerItem
          key={item.screenName}
          label={item.label}
          onPress={() => props.navigation.navigate(item.screenName)}
          icon={({color, size}) => (
            <Icon name={item.iconName} color={color} size={size} />
          )}
          accessibilityLabel={item.accessibilityLabel}
        />
      ))}
    </DrawerContentScrollView>
  );
});

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Willkommen"
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Willkommen" component={HomeScreen} />
      <Drawer.Screen name="Biometrie" component={LoginScreen} />
      <Drawer.Screen name="Standortabfrage" component={LocationScreen} />
      <Drawer.Screen name="Benachrichtigungen" component={TimerScreen} />
      <Drawer.Screen name="Fotos" component={PhotoScreen} />
      <Drawer.Screen name="PDF" component={FormScreen} />
    </Drawer.Navigator>
  );
}

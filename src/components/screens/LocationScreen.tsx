import React, {useEffect, useState, useCallback} from 'react';
import {View, StyleSheet, PermissionsAndroid, Platform} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const useLocation = () => {
  const [region, setRegion] = useState({
    latitude: 51.9606649,
    longitude: 7.6261347,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = useCallback(async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Standortzugriffsberechtigung',
            message: 'Diese App benötigt Zugriff auf Ihren Standort.',
            buttonNeutral: 'Später fragen',
            buttonNegative: 'Abbrechen',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Sie können auf den Standort zugreifen');
          locateCurrentPosition();
        } else {
          console.log('Standortzugriff verweigert');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      locateCurrentPosition(); // Direkter Zugriff für iOS
    }
  }, []);

  const locateCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      },
      error => {
        console.error('Fehler beim Ermitteln der Position:', error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  return region;
};

const LocationScreen = () => {
  const region = useLocation();

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        accessibilityLabel="Karte mit aktuellem Standort">
        <Marker coordinate={region} accessibilityLabel="Aktueller Standort" />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default LocationScreen;

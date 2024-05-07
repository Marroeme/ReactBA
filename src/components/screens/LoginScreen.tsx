import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';

type LoginStackParamList = {
  Home: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<
  LoginStackParamList,
  'Home'
>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

const biometrics = new ReactNativeBiometrics();
const PROMPT_MESSAGE = 'Authentifizieren';

const checkBiometrics = async (navigation: LoginScreenNavigationProp) => {
  try {
    const {available, biometryType} = await biometrics.isSensorAvailable();

    if (available && biometryType === BiometryTypes.Biometrics) {
      try {
        const {success} = await biometrics.simplePrompt({
          promptMessage: PROMPT_MESSAGE,
        });

        if (success) {
          console.log('Authentifizierung erfolgreich');
          navigation.navigate('Home');
        } else {
          console.log('Authentifizierung abgebrochen');
        }
      } catch {
        console.log('Fehler bei biometrischer Authentifizierung');
      }
    } else {
      console.log('Biometrie nicht verfügbar');
    }
  } catch {
    console.log('isSensorAvailable Fehler');
  }
};

const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => checkBiometrics(navigation)}
        accessibilityLabel="Biometrische Authentifizierung starten">
        <Icon name="face" size={30} color="#000" />
        <Text style={styles.buttonText}>Biometrische Authentifizierung</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#E8E8E8',
  },
  buttonText: {
    fontSize: 18,
    marginLeft: 10,
  },
  icon: {
    width: 30,
    height: 30,
  },
});

export default LoginScreen;

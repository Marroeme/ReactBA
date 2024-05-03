import React from 'react';
import {View, Button} from 'react-native';
import {DrawerNavigationProp} from '@react-navigation/drawer';

type NavigationType = DrawerNavigationProp<
  Record<string, object | undefined>,
  'Biometrie'
>;

interface BiometrieScreenProps {
  navigation: NavigationType;
}

const BiometrieScreen: React.FC<BiometrieScreenProps> = ({navigation}) => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
};

export default BiometrieScreen;

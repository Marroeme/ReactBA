import React, {memo} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {DrawerNavigationProp} from '@react-navigation/drawer';

type NavigationType = DrawerNavigationProp<
  Record<string, object | undefined>,
  'Willkommen'
>;

interface HomeScreenProps {
  navigation: NavigationType;
}

const STATUS_BAR_STYLE = 'dark-content';
const STATUS_BAR_BACKGROUND = '#FFFFFF';

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={STATUS_BAR_STYLE}
        backgroundColor={STATUS_BAR_BACKGROUND}
      />
      <View style={styles.container}>
        <Text
          style={styles.bodyText}
          accessible
          accessibilityLabel="Auswahlhinweis">
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
    backgroundColor: STATUS_BAR_BACKGROUND,
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

export default memo(HomeScreen);

import React, {useState, useEffect, useRef} from 'react';
import {View, Text, Button, StyleSheet, Alert} from 'react-native';
import notifee from '@notifee/react-native';

const INITIAL_TIME = 5; // Konstante für die initiale Zeit

const TimerScreen = () => {
  const [secondsRemaining, setSecondsRemaining] = useState(INITIAL_TIME);
  const [timerActive, setTimerActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerActive && secondsRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsRemaining(prev => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && timerActive) {
      onDisplayNotification();
      setTimerActive(false);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [secondsRemaining, timerActive]);

  const onDisplayNotification = async () => {
    try {
      await notifee.requestPermission();

      await notifee.displayNotification({
        title: 'Timer',
        body: 'Timer abgelaufen',
        android: {
          channelId: 'default',
        },
      });
    } catch (error) {
      Alert.alert(
        'Benachrichtigungsfehler',
        'Benachrichtigung konnte nicht angezeigt werden.',
      );
    }
  };

  const startTimer = () => {
    setSecondsRemaining(INITIAL_TIME);
    setTimerActive(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>
        {secondsRemaining} Sekunden verbleibend
      </Text>
      <Button
        title="Starte Timer"
        onPress={startTimer}
        accessibilityLabel="Starte Timer Button"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  timerText: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default TimerScreen;

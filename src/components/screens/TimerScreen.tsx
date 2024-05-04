import React, {useState, useEffect} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import notifee from '@notifee/react-native';

const TimerScreen = () => {
  const [secondsRemaining, setSecondsRemaining] = useState(5);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(secondsRemaining - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && timerActive) {
      onDisplayNotification();
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [secondsRemaining, timerActive]);

  const onDisplayNotification = async () => {
    await notifee.requestPermission();

    notifee.displayNotification({
      title: 'Timer',
      body: 'Timer abgelaufen',
      android: {
        channelId: 'default',
      },
    });
  };

  const startTimer = () => {
    setSecondsRemaining(5);
    setTimerActive(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>
        {secondsRemaining} Sekunden verbleibend
      </Text>
      <Button title="Starte Timer" onPress={startTimer} />
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

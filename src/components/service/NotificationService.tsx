import notifee from '@notifee/react-native';
import {Alert} from 'react-native';

class NotificationService {
  async requestPermission() {
    try {
      await notifee.requestPermission();
    } catch (error) {
      Alert.alert(
        'Berechtigungsfehler',
        'Benachrichtigungsberechtigung konnte nicht angefordert werden.',
      );
    }
  }

  async showNotification(title: string, body: string) {
    try {
      await notifee.displayNotification({
        title,
        body,
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
  }
}

export default new NotificationService();

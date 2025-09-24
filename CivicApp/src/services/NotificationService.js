import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';

class NotificationService {
  constructor() {
    this.configure();
  }

  configure = () => {
    PushNotification.configure({
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },

      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        
        // Handle notification tap
        if (notification.userInteraction) {
          // User tapped on notification
          // Navigate to specific screen based on notification data
        }
      },

      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);
      },

      onRegistrationError: function(err) {
        console.error(err.message, err);
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });

    // Create notification channel for Android
    PushNotification.createChannel(
      {
        channelId: 'civic-reports',
        channelName: 'Civic Reports',
        channelDescription: 'Notifications for civic report updates',
        playSound: true,
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`Channel created: ${created}`)
    );
  };

  showLocalNotification = (title, message, data = {}) => {
    PushNotification.localNotification({
      channelId: 'civic-reports',
      title: title,
      message: message,
      playSound: true,
      soundName: 'default',
      userInfo: data,
      actions: ['View Report'],
    });
  };

  scheduleNotification = (title, message, date, data = {}) => {
    PushNotification.localNotificationSchedule({
      channelId: 'civic-reports',
      title: title,
      message: message,
      date: date,
      playSound: true,
      soundName: 'default',
      userInfo: data,
    });
  };

  cancelAllNotifications = () => {
    PushNotification.cancelAllLocalNotifications();
  };

  checkPermissions = (callback) => {
    PushNotification.checkPermissions(callback);
  };

  requestPermissions = () => {
    PushNotification.requestPermissions();
  };
}

export default new NotificationService();

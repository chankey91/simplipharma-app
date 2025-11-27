import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Request notification permissions
export async function registerForPushNotifications() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }

  token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log('Push token:', token);

  return token;
}

// Schedule a local notification
export async function scheduleNotification(title: string, body: string, seconds: number = 0) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: { data: 'goes here' },
    },
    trigger: seconds > 0 ? { seconds } : null,
  });
}

// Send order status notification
export function sendOrderNotification(orderStatus: string, orderId: string) {
  const messages = {
    Pending: {
      title: 'Order Placed! 🎉',
      body: `Your order #${orderId.substring(0, 8)} has been placed successfully.`,
    },
    Dispatched: {
      title: 'Order Dispatched! 🚚',
      body: `Your order #${orderId.substring(0, 8)} is on its way!`,
    },
    Delivered: {
      title: 'Order Delivered! ✅',
      body: `Your order #${orderId.substring(0, 8)} has been delivered.`,
    },
  };

  const notification = messages[orderStatus as keyof typeof messages];
  if (notification) {
    scheduleNotification(notification.title, notification.body);
  }
}


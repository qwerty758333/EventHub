import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  try {
    const currentPermissions =
      await Notifications.getPermissionsAsync();

    if (
      currentPermissions.granted ||
      currentPermissions.ios?.status ===
        Notifications.IosAuthorizationStatus.PROVISIONAL
    ) {
      return true;
    }

    const requestedPermissions =
      await Notifications.requestPermissionsAsync();

    return (
      requestedPermissions.granted ||
      requestedPermissions.ios?.status ===
        Notifications.IosAuthorizationStatus.PROVISIONAL
    );
  } catch (error) {
    console.error(
      'Unable to request notification permission:',
      error
    );

    return false;
  }
}

export async function sendLocalNotification(
  title: string,
  body: string
): Promise<string | null> {
  try {
    const permissionGranted =
      await requestNotificationPermission();

    if (!permissionGranted) {
      return null;
    }

    return await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger: null,
    });
  } catch (error) {
    console.error(
      'Unable to send local notification:',
      error
    );

    return null;
  }
}

export async function scheduleEventReminder(
  title: string,
  body: string,
  date: Date
): Promise<string | null> {
  if (Platform.OS === 'web') {
    console.log('Event reminder skipped on web');
    return null;
  }

  try {
    const permissionGranted =
      await requestNotificationPermission();

    if (!permissionGranted) {
      return null;
    }

    return await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date,
      },
    });
  } catch (error) {
    console.error(
      'Unable to schedule event reminder:',
      error
    );

    return null;
  }
}

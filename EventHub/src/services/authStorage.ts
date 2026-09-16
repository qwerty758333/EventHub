import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'eventhub_token';
const USER_KEY = 'eventhub_user';

export async function saveAuthSession(
  token: string,
  user: object
) {
  await AsyncStorage.setItem(TOKEN_KEY, token);
  await AsyncStorage.setItem(
    USER_KEY,
    JSON.stringify(user)
  );
}

export async function getAuthSession() {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  const userString = await AsyncStorage.getItem(USER_KEY);

  if (!token || !userString) {
    return null;
  }

  return {
    token,
    user: JSON.parse(userString),
  };
}

export async function clearAuthSession() {
  await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem(USER_KEY);
}
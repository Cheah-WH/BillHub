import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeUserData = async (token, user) => {
  try {
    console.log("authToken to be stored in AsyncStorage: ", token);
    console.log("User to be stored in AsyncStorage: ", user);
    await AsyncStorage.setItem("authToken", token);
    await AsyncStorage.setItem("user", JSON.stringify(user));
  } catch (error) {
    console.error("Failed to save login data", error);
  }
};

export const getUserData = async () => {
  try {
    console.log("Retrieving user data from AsyncStorage")
    const token = await AsyncStorage.getItem("authToken");
    const user = await AsyncStorage.getItem("user");
    return { token, user: JSON.parse(user) };
  } catch (error) {
    console.error("Failed to load data", error);
    return { token: null, user: null };
  }
};

export const removeUserData = async () => {
  try {
    console.log("Error below this");

    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("user");

    console.log("Error above this");
    console.log("User data removed from AsyncStorage");

  } catch (error) {
    console.error("Failed to remove user data from AsyncStorage", error);
  }
};

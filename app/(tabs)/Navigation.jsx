import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet } from "react-native";
import CustomDrawerContent from "../components/CustomDrawerContent";

//Screens Import
import Login from "../screens/Login.jsx";
import Home from "../screens/Home.jsx";
import Notification from "../screens/Notification";
import MyBills from "../screens/MyBills";
import BillPaymentHistory from "../screens/BillPaymentHistory";
import AutoBilling from "../screens/AutoBilling";
import BillAnalysis from "../screens/BillAnalysis";
import BillReminder from "../screens/BillReminder";
import Setting from "../screens/Setting";
import MyProfile from "../screens/MyProfile";
import RegisterBill from "../screens/RegisterBill";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function DrawerNavigation() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        headerTitleAlign: "center",
        drawerStyle: [styles.drawer, { justifyContent: "flex-start" }],
        drawerLabelStyle: styles.drawerLabel,
        drawerActiveTintColor: "#cca300",
        drawerInactiveTintColor: "#000",
        drawerActiveBackgroundColor: "#ffffff",
        drawerInactiveBackgroundColor: "#c6cbef",
      }}
    >
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="My Bills"
        component={MyBills}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="My Payment History"
        component={BillPaymentHistory}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="Auto-Billing"
        component={AutoBilling}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="Bill Analysis"
        component={BillAnalysis}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="Bill Reminder"
        component={BillReminder}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="Setting"
        component={Setting}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="Log Out"
        component={Login}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
}

export default function Navigation() {
  return (
    <Stack.Navigator initialRouteName="Drawer" >
      <Stack.Screen name="Drawer" component={DrawerNavigation} options={{ headerShown: false }}/>
      <Stack.Screen name="Notification" component={Notification} options={{ headerShown: false }}/>
      <Stack.Screen name="MyProfile" component={MyProfile} options={{ headerShown: false }}/>
      <Stack.Screen name="RegisterBill" component={RegisterBill} options={{ headerShown: false }}/>
      <Stack.Screen name="BillAnalysis" component={BillAnalysis} options={{ headerShown: false }}/>
      <Stack.Screen name="AutoBilling" component={AutoBilling} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerStyle: {
    height: 50,
    backgroundColor: "#cca300", // Header background color
  },
  headerTitleStyle: {
    color: "black", // Header title color
  },
  drawer: {
    backgroundColor: "#c6cbef", // Background color of the drawer
    width: 300, // Width of the drawer
  },
  drawerLabel: {
    fontSize: 17, // Font size of the drawer labels
    fontWeight: "bold", // Bold font weight for labels
  },
});

import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StyleSheet } from 'react-native';
import Login from '../screens/Login.jsx';
import Home from '../screens/Home.jsx';

const Drawer = createDrawerNavigator();

export default function Navigation() {
  return (
      <Drawer.Navigator
        screenOptions={{
          headerStyle: styles.headerStyle,
          headerTitleStyle: styles.headerTitleStyle,
          headerTitleAlign: 'center',
          drawerStyle: [styles.drawer, { justifyContent: 'flex-start' }],
          drawerLabelStyle: styles.drawerLabel,
          drawerActiveTintColor: '#cca300',
          drawerInactiveTintColor: '#000',
          drawerActiveBackgroundColor: '#ffffff',
          drawerInactiveBackgroundColor: '#c6cbef',
        }}
      >
        <Drawer.Screen name="Home" component={Home} options={{headerShown: false}}/>
        <Drawer.Screen name="Login" component={Login} options={{headerShown: false}}/>
      </Drawer.Navigator>

  );
}

const styles = StyleSheet.create({
  headerStyle: {
    height:50,
    backgroundColor: '#cca300', // Header background color
  },
  headerTitleStyle: {
    color:'black',// Header title color
  },
  drawer: {
    backgroundColor: '#c6cbef', // Background color of the drawer
    width: 300, // Width of the drawer
  },
  drawerLabel: {
    fontSize: 18, // Font size of the drawer labels
    fontWeight: 'bold', // Bold font weight for labels
  },
  
  
});
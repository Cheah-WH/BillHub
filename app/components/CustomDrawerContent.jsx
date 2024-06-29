import React from "react";
import { View, TouchableOpacity, Image, StyleSheet, Text } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import MyProfile from "../screens/MyProfile";

function CustomDrawerContent(props) {
  const navigation = useNavigation();
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.contentView}>
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={()=>{navigation.navigate("MyProfile")}}>
            <Image
              source={require("../images/profilePic.jpeg")}
              style={styles.image}
            />
          </TouchableOpacity>
          <Text style={styles.username}>Cheah_WH</Text>
        </View>
        <View style={styles.listContainer}>
          <DrawerItemList {...props} />
        </View>
        <View style={styles.imageContainer}>
          <TouchableOpacity>
            <Image source={require("../images/logo.png")} style={styles.logo} />
          </TouchableOpacity>
        </View>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  contentView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  listContainer: {
    flex: 1,
  },
  username: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: "bold",
    color: "#cca300",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderColor: "#cca300",
    borderWidth: 3,
    borderRadius: 50,
  },
  logo: {
    width: 50,
    height: 50,
  },
});

export default CustomDrawerContent;

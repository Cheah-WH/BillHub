import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Button,
  StatusBar,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import { useAuth } from "../../backend/AuthContext";
import { COLORS, FONTS, serverIPV4 } from "../constant";

const Notification = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [noNotificationsModalVisible, setNoNotificationsModalVisible] =
    useState(false);
  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] =
    useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);

  useEffect(() => {
    console.log("Selected Notification: ", selectedNotification);
  }, [selectedNotification]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://${serverIPV4}:3000/notifications/${user._id}`
      );
      setNotifications(response.data);
      if (response.data.length === 0) {
        setNoNotificationsModalVisible(true);
      }
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchNotifications();
    }, [])
  );

  const markNotificationAsSeen = async (notificationId) => {
    console.log("Notification ID: ", notificationId);
    try {
      await axios.patch(
        `http://${serverIPV4}:3000/notifications/${notificationId}/seen`
      );
    } catch (err) {
      console.error("Failed to mark notification as seen:", err);
    }
  };

  const handlePress = (item) => {
    setSelectedNotification(item);
    setModalVisible(true);
    if (!item.seen) {
      markNotificationAsSeen(item._id);
      item.seen = true;
    }
  };

  const handleDeletePress = (notificationId) => {
    setNotificationToDelete(notificationId);
    setConfirmDeleteModalVisible(true);
  };

  const renderNotificationItem = ({ item }) => {
    const truncatedMessage =
      item.message.length > 100
        ? item.message.substring(0, 69) + "..."
        : item.message;

    const dateObj = new Date(item.createdAt);
    const notificationDate = `${dateObj.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })} ${dateObj.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;

    return (
      <TouchableOpacity onPress={() => handlePress(item)}>
        <View style={styles.notificationItem}>
          <View style={styles.leftView}>
            {item.sender != "BillHub" ? (
              <Image
                source={{ uri: item.billingCompanyId.ImageURL }}
                style={styles.Image}
              />
            ) : (
              <>
                <Image
                  source={require("../images/logo.png")}
                  style={styles.Image}
                />
                {item.billingCompanyId && (
                  <Image
                    source={{ uri: item.billingCompanyId.ImageURL }}
                    style={styles.MiniImage}
                  />
                )}
              </>
            )}
          </View>
          <View style={styles.midView}>
            <Text style={styles.message}>{truncatedMessage}</Text>
            <Text style={styles.date}>{notificationDate}</Text>
          </View>
          <View style={styles.rightView}>
            <FontAwesomeIcon
              name="circle"
              size={24}
              color={item.seen ? COLORS.greyBackground : COLORS.primary}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const deleteNotification = async () => {
    if (notificationToDelete) {
      try {
        await axios.delete(
          `http://${serverIPV4}:3000/notifications/${notificationToDelete}`
        );
        setNotifications(
          notifications.filter(
            (notification) => notification._id !== notificationToDelete
          )
        );
        setConfirmDeleteModalVisible(false);
        setNotificationToDelete(null);
        setModalVisible(false);
      } catch (err) {
        console.error("Failed to delete notification:", err);
      }
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const closeNoNotificationsModal = () => {
    setNoNotificationsModalVisible(false);
    navigation.goBack();
  };

  return (
    <View style={styles.screenView}>
      <View style={styles.header}>
        <View style={styles.headerLeftView}>
          <AntDesignIcon
            style={styles.backIcon}
            name="back"
            size={28}
            color="#000"
            onPress={() => navigation.goBack()}
          />
        </View>
        <View style={styles.headerMidView}>
          <Text style={styles.title}>Notification</Text>
        </View>
        <View style={styles.headerRightView}></View>
      </View>
      <View style={styles.body}>
        {loading ? (
          <Text>Loading...</Text>
        ) : error ? (
          <Text>Error: {error}</Text>
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderNotificationItem}
            keyExtractor={(item) => item._id.toString()}
          />
        )}
      </View>
      {selectedNotification && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <StatusBar
            backgroundColor="rgba(0, 0, 0, 0.5)"
            barStyle="light-content"
          />
          <View style={styles.modalView}>
            <View style={styles.modalContent}>
              <View>
                <View style={styles.modalTitleContainer}>
                  {selectedNotification.sender != "BillHub" &&
                  selectedNotification.billingCompanyId &&
                  selectedNotification.billingCompanyId.ImageURL ? (
                    <Image
                      source={{
                        uri: selectedNotification.billingCompanyId.ImageURL,
                      }}
                      style={styles.modalImage}
                    />
                  ) : (
                    <Image
                      source={require("../images/logo.png")}
                      style={styles.modalImage}
                    />
                  )}
                  <Text style={styles.modalTitle}>
                    {selectedNotification.sender != "BillHub" &&
                    selectedNotification.billingCompanyId
                      ? selectedNotification.billingCompanyId.Name
                      : "BillHub"}
                  </Text>
                </View>
                <Text style={styles.modalMessage}>
                  {selectedNotification.message}
                </Text>
              </View>
              <View
                style={{
                  width: "100%",
                  alignItems: "center",
                  borderTopWidth: 1,
                  paddingTop: 3,
                }}
              >
                {selectedNotification.billingCompanyId && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 15,
                    }}
                  >
                    <Text style={{ fontWeight: "bold" }}>
                      Related Company:{" "}
                      {selectedNotification.billingCompanyId.Name}
                    </Text>
                  </View>
                )}
                <View style={styles.buttonsView}>
                  <TouchableOpacity
                    onPress={closeModal}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeButtonText}>CLOSE</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      handleDeletePress(selectedNotification._id);
                    }}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteButtonText}>DELETE</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={noNotificationsModalVisible}
        onRequestClose={closeNoNotificationsModal}
      >
        <StatusBar
          backgroundColor="rgba(0, 0, 0, 0.5)"
          barStyle="light-content"
        />
        <View style={styles.modalView}>
          <View style={styles.noNotificationsModalContent}>
            <Text style={styles.noNotificationsText}>
              No notification available right now !
            </Text>
            <TouchableOpacity
              onPress={closeNoNotificationsModal}
              style={{
                backgroundColor: COLORS.primary,
                padding: 15,
                borderRadius: 25,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={confirmDeleteModalVisible}
        onRequestClose={() => setConfirmDeleteModalVisible(false)}
      >
        <View style={styles.modalView}>
          <View style={styles.confirmDeleteModalContent}>
            <Text style={styles.confirmDeleteText}>
              Are you sure you want to delete this notification?
            </Text>
            <View style={styles.buttonsView}>
              <TouchableOpacity
                onPress={() => setConfirmDeleteModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={deleteNotification}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>DELETE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screenView: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  header: {
    paddingVertical: 0,
    paddingHorizontal: 10,
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    flex: 1,
    alignItems: "center",
  },
  headerLeftView: {
    justifyContent: "center",
    flex: 1,
  },
  headerMidView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 8,
  },
  headerRightView: {
    justifyContent: "center",
    flex: 1,
  },
  body: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    flex: 15,
  },
  backIcon: {
    textShadowColor: "#000",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  title: {
    fontWeight: FONTS.header.fontWeight,
    fontSize: FONTS.header.fontSize,
  },
  notificationItem: {
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
    borderWidth: 1,
    borderRadius: 25,
    paddingRight: 15,
    backgroundColor: COLORS.greyBackground,
    height:90,
  },
  leftView: {
    alignItems: "center",
    justifyContent: "center",
    width: "20%",
    marginBottom: 5,
  },
  midView: {
    width: "70%",
  },
  rightView: {
    alignItems: "center",
    justifyContent: "center",
    width: "15%",
  },
  message: {
    fontSize: 16,
  },
  date: {
    fontSize: 12,
    color: COLORS.grey, // Adjust color to match your design
    marginTop: 2,
  },
  Image: {
    width: 45,
    height: 45,
    borderRadius: 5,
    marginTop: 7,
    resizeMode: "contain",
  },
  MiniImage: {
    width: 20,
    height: 20,
    borderRadius: 5,
    marginTop: 2,
    resizeMode: "contain",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 330,
    height: 500,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalTitleContainer: {
    flexDirection: "row",
    marginBottom: 10,
    paddingBottom: 5,
    alignItems: "center",
    justifyContent: "center",
    width: 280,
    borderBottomWidth: 1,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalImage: {
    width: 45,
    height: 45,
    borderRadius: 5,
    marginRight: 5,
    resizeMode: "contain",
  },
  noNotificationsText: {
    fontSize: 18,
    color: COLORS.grey,
    textAlign: "center",
    marginBottom: 20,
  },
  noNotificationsModalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonsView: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 180,
  },
  closeButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: "center",
    borderRadius: 5,
  },
  closeButtonText: {
    fontWeight: "bold",
    color: "white",
  },
  deleteButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: "center",
    borderRadius: 5,
  },
  deleteButtonText: {
    fontWeight: "bold",
    color: "white",
  },
  confirmDeleteModalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmDeleteText: {
    fontSize: 18,
    color: COLORS.grey,
    textAlign: "center",
    marginBottom: 20,
  },
});

export default Notification;

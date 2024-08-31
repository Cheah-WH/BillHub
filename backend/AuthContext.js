import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { storeUserData, getUserData, removeUserData } from "./storage";
import axios from "axios";
import { serverIPV4 } from "../app/constant";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const loadUser = async () => {
      console.log("LoadUser is running from AuthContext");
      const { token, user } = await getUserData();
      if (token && user) {
        await fetchUserData(user._id); //Fetch Latest state of user data from MongoDB
        fetchBills(user._id);
      }
      setAuthLoading(false);
    };
    loadUser();
  }, []);

  const login = async (userData) => {
    const defaultToken = "BillPayer";
    setUser(userData.user);
    await storeUserData(defaultToken, userData.user);
    fetchBills(userData.user._id);
    Alert.alert("Welcome Back", userData.name);
  };

  const logout = async () => {
    setUser(null);
    await removeUserData();
    console.log("Removing user data from AuthContext...");
  };
  
  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(`http://${serverIPV4}:3000/users/${userId}`);
      if (response.status === 200) {
        const userData = response.data;
        setUser(userData);
        await storeUserData("BillPayer", userData);
      } else {
        Alert.alert("Error", "Failed to retrieve user data");
      }
    } catch (error) {
      console.error("Failed to retrieve user data", error);
      Alert.alert("Error", "An error occurred while retrieving user data");
    }
  };

  const fetchBills = useCallback(async (userId) => {
    console.log("Fetching bills in AuthContext");
    try {
      const response = await axios.get(`http://${serverIPV4}:3000/bills/${userId}`);
      if (response.status === 200) {
        const billsData = response.data;
        const billsWithCompanyData = await Promise.all(
          billsData.map(async (bill) => {
            const companyResponse = await axios.get(`http://${serverIPV4}:3000/billing-companies/${bill.billingCompanyId}`);
            return {
              ...bill,
              company: companyResponse.data,
            };
          })
        );
        setBills(billsWithCompanyData);
      } else {
        Alert.alert("Error", "Failed to retrieve bills");
      }
    } catch (error) {
      console.error("Failed to retrieve bills", error);
      Alert.alert("Error", "An error occurred while retrieving bills");
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, authLoading, bills, setBills, fetchBills, fetchUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthContext, AuthProvider, useAuth };

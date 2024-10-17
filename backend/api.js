import axios from "axios";
import { serverIPV4 } from "../app/constant";

const api = axios.create({
  baseURL: `http://${serverIPV4}:3000`,
});

export const getBillingCompanies = async () => {
  try {
    const response = await api.get("/billing-companies");
    console.log("API.js Run /billingcompanies");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const registerBillPayer = async (name, phoneNumber, email, password) => {
  try {
    const response = await api.post("/register", {
      name,
      phoneNumber,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const loginBillPayer = async (phoneNumber, password) => {
  try {
    const response = await api.post("/login", { phoneNumber, password });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

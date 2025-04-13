// Modified auth.ts

import axios from 'axios';
import { ShelterData, DonatorData } from '../types';

const API_URL = 'http://localhost:8080'; // Replace with your FastAPI URL

// For cookie-based auth, we need to include credentials in requests
axios.defaults.withCredentials = true;

export const registerShelter = async (shelterData: ShelterData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, shelterData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerDonator = async (donatorData: DonatorData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, donatorData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (email: string, password: string, userType: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password, userType });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkAuthStatus = async () => {
  try {
    const response = await axios.get(`${API_URL}/me`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await axios.post(`${API_URL}/logout`);
    // Clear local storage on successful logout
    localStorage.removeItem('user_id');
    localStorage.removeItem('userType');
    return response.data;
  } catch (error) {
    throw error;
  }
};
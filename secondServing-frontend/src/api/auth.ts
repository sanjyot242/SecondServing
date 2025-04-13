// src/api/auth.ts

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

export const login = async (email: string, password: string) => {
  try {
    // Using FormData as required by OAuth2PasswordRequestForm in FastAPI
    const formData = new FormData();
    formData.append('username', email); // OAuth2 expects 'username' field
    formData.append('password', password);
    
    // This endpoint will set the access_token cookie automatically
    const response = await axios.post(`${API_URL}/token`, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    // This endpoint relies on the access_token cookie being sent
    const response = await axios.get(`${API_URL}/auth/me`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await axios.post(`${API_URL}/logout`);
    return { success: true };
  } catch (error) {
    throw error;
  }
};
import axios from 'axios';
import { ShelterData, DonatorData } from '../types';

const API_URL = 'http://localhost:8000'; // Replace with your FastAPI URL

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
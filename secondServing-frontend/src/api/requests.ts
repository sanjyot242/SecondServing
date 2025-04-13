// src/api/requests.ts
import axios from 'axios';

const API_URL = 'http://localhost:8080';

// For cookie-based auth, we need to include credentials in requests
axios.defaults.withCredentials = true;

// Fetch all open requests for donors to fulfill
export const fetchOpenRequests = async () => {
  try {
    // Direct endpoint to get all open requests
    const response = await axios.get(`${API_URL}/all-requests`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch requests for a specific receiver (shelter)
export const fetchReceiverRequests = async () => {
  try {
    const response = await axios.get(`${API_URL}/receiver/requests`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Mark a food item as fulfilled
export const fulfillFoodRequest = async (foodId: number) => {
  try {
    const response = await axios.patch(
      `${API_URL}/food/${foodId}/fulfill`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fulfill a request directly (new method)
export const fulfillRequestDirectly = async (requestId: number) => {
  try {
    const response = await axios.post(
      `${API_URL}/request/${requestId}/fulfill`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Run the matching algorithm to match food items with requests
export const runMatching = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/match`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

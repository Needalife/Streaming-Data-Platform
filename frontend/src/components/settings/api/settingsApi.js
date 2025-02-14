// settings/api/settingsApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/settings';

// Function to fetch settings from the server
export const fetchSettings = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data; // Assuming the API returns the settings data directly
  } catch (error) {
    console.error("Error fetching settings:", error);
    throw error;
  }
};

// Function to update settings on the server
export const updateSettings = async (settings) => {
  try {
    const response = await axios.put(BASE_URL, settings);
    return response.data; // Assuming the API returns the updated settings
  } catch (error) {
    console.error("Error updating settings:", error);
    throw error;
  }
};

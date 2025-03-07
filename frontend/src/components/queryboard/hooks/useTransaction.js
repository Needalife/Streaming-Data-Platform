import axios from 'axios';
import { API_BASE_URL } from '../api/transaction';

export const getTransactions = async ({ all = true, status, minAmount, maxAmount, limit = 10, skip = 0 }) => {
    try {
      const params = { all, status, minAmount, maxAmount, limit, skip };
      const response = await axios.get(`${API_BASE_URL}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return null;
    }
  };

export const getTransactionById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching transaction ${id}:`, error);
        return null;
    }
};

export const getAvailableDates = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dates`);
        return response.data;
    } catch (error) {
        console.error('Error fetching available dates:', error);
        return null;
    }
};

export const searchTransactions = async (keyword) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/search`, { params: { keyword } });
        return response.data;
    } catch (error) {
        console.error(`Error searching transactions with keyword ${keyword}:`, error);
        return null;
    }
};

import axios from 'axios';

const API_BASE_URL = '/gateway/v1/static/transactions';

const exchangeRatesToUSD = {
    USD: 1,        // US Dollar
    JPY: 0.0071,   // Japanese Yen: 1 JPY = 0.0071 USD
    EUR: 1.10,     // Euro: 1 EUR = 1.10 USD
    GBP: 1.27,     // British Pound: 1 GBP = 1.27 USD
    AUD: 0.70,     // Australian Dollar: 1 AUD = 0.70 USD
    CAD: 0.75,     // Canadian Dollar: 1 CAD = 0.75 USD
    CHF: 1.08,     // Swiss Franc: 1 CHF = 1.08 USD
    CNY: 0.15,     // Chinese Yuan: 1 CNY = 0.15 USD
    INR: 0.012,    // Indian Rupee: 1 INR = 0.012 USD
    NZD: 0.66,      // New Zealand Dollar: 1 NZD = 0.66 USD
    VND: 0.000043,  // Vietnamese Dong: 1 VND = 0.000043 USD
  };

export const getTransactions = async ({ all = true, status, minAmount, maxAmount, limit = 10, skip = 0 }) => {
    try {
      const params = { all, status, minAmount, maxAmount, limit, skip };
      const response = await axios.get(`${API_BASE_URL}`, { params });
      return response.data;
    //   const transactions = response.data;
    //   // Convert each transaction's amount to USD
    //   const convertedTransactions = transactions.map(item => {
    //     // If already in USD, no conversion is needed.
    //     if (item.currency === 'USD') {
    //       return item;
    //     }
    //     const rate = exchangeRatesToUSD[item.currency];
    //     if (rate) {
    //       const convertedAmount = item.amount * rate;
    //       return {
    //         ...item,
    //         amount: convertedAmount,
    //         currency: 'USD'
    //       };
    //     }
    //     // If there’s no conversion rate defined, you might choose to leave it unchanged,
    //     // throw an error, or handle it as you see fit.
    //     return item;
    //   });
    //   return convertedTransactions;
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

export const getFilters = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/filters`);
        return response.data;
    } catch (error) {
        console.error('Error fetching filters:', error);
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

export const healthCheck = async () => {
    try {
        const response = await axios.get('http://localhost:8001/gateway/health');
        return response.data;
    } catch (error) {
        console.error('Health check failed:', error);
        return null;
    }
};

import axios from 'axios';
import { TOTAL_TRANSACTION } from "../api/totalcount";

// Function to fetch the total transaction count using axios
export async function fetchTransactionCount() {
  try {
    const response = await axios.get(TOTAL_TRANSACTION);
    console.log('Total transactions:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction count:', error);
  }
}

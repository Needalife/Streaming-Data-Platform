// import axios from "axios"; // Uncomment if using axios for real API calls

export const fetchDashboardData = async () => {
    // Replace this with a real API call if needed:
    // const response = await axios.get('/api/dashboard');
    // return response.data;
  
    // Simulated/fake data:
    const fakeData = [
      { timestamp: "2024-11-02T13:00:00Z", total: 2, success: 1, ongoing: 1, error: 0 },
      { timestamp: "2024-11-02T13:10:00Z", total: 3, success: 2, ongoing: 1, error: 0 },
      { timestamp: "2024-11-02T13:20:00Z", total: 1, success: 1, ongoing: 0, error: 0 },
      { timestamp: "2024-11-02T13:30:00Z", total: 4, success: 3, ongoing: 1, error: 0 },
      { timestamp: "2024-11-02T13:40:00Z", total: 2, success: 1, ongoing: 0, error: 1 },
      { timestamp: "2024-11-02T13:50:00Z", total: 3, success: 2, ongoing: 0, error: 1 },
      { timestamp: "2024-11-02T14:00:00Z", total: 1, success: 1, ongoing: 0, error: 0 },
      { timestamp: "2024-11-02T14:10:00Z", total: 2, success: 1, ongoing: 1, error: 0 },
      { timestamp: "2024-11-02T14:20:00Z", total: 3, success: 1, ongoing: 2, error: 0 },
      { timestamp: "2024-11-02T14:30:00Z", total: 2, success: 2, ongoing: 0, error: 0 },
    ];
  
    return fakeData;
  };
  
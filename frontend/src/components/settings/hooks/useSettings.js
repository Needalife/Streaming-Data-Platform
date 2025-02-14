// // settings/hooks/useSettings.js
// import { useState, useEffect } from "react";
// import { fetchSettings, updateSettings } from "../api/settingsApi";

// export const useSettings = () => {
//   const [settings, setSettings] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch settings from the API when the hook is mounted
//   useEffect(() => {
//     const loadSettings = async () => {
//       try {
//         const data = await fetchSettings();
//         setSettings(data);
//       } catch (err) {
//         setError("Error fetching settings");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadSettings();
//   }, []);

//   // Save settings via the API
//   const saveSettings = async () => {
//     try {
//       setLoading(true);
//       const updated = await updateSettings(settings);
//       setSettings(updated);
//       return true;
//     } catch (err) {
//       setError("Error saving settings");
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { settings, setSettings, saveSettings, loading, error };
// };



// settings/hooks/useSettings.js
import { useState, useEffect } from "react";

export const useSettings = () => {
  const [settings, setSettings] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    dob: "",
    address: "",
    city: "",
    country: "",
    currency: "",
    timeZone: "",
    notification: false,
    twoFactorAuth: false,
    currentPassword: "",
    newPassword: "",
  });

  // Simulate fetching settings from an API
  useEffect(() => {
    const fetchSettings = async () => {
      // Simulated delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSettings({
        name: "John Doe",
        username: "johndoe",
        email: "john@example.com",
        password: "",
        dob: "1990-01-01",
        address: "123 Main St",
        city: "Anytown",
        country: "USA",
        currency: "US Dollar",
        timeZone: "(GMT+00:00) UTC",
        notification: true,
        twoFactorAuth: false,
        currentPassword: "",
        newPassword: "",
      });
    };

    fetchSettings();
  }, []);

  // Simulated save function
  const saveSettings = async () => {
    // Here you could validate and save to an API
    await new Promise((resolve) => setTimeout(resolve, 500));
    return true;
  };

  return { settings, setSettings, saveSettings };
};

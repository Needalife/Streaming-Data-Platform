export const validateSettings = (settings) => {
    // validation logic here.
    if (!settings.email) {
      return false;
    }
    return true;
  };
  
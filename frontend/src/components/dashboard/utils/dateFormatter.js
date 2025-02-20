export const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };
  
  export const formatUnixTimestamp = (unixTimestamp) => {
    return new Date(unixTimestamp * 1000).toLocaleTimeString();
  };
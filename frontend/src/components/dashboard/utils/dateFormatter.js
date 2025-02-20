export const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };
  
  export const formatUnixTimestamp = (unixTimestamp) => {
    return new Date(unixTimestamp * 1000).toLocaleTimeString();
  };

  export function formatDate(date) {
    const day = date.getDate();
    const ordinal = getOrdinalSuffix(day);
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${day}${ordinal} ${month}, ${year}`;
  }
  
  function getOrdinalSuffix(day) {
    // For 11th, 12th, 13th we always return 'th'
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }
  
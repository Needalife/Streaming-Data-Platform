export const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString();
};

export const formatUnixTimestamp = (unixTimestamp) => {
  return new Date(unixTimestamp * 1000).toLocaleTimeString();
};

export const formatDate = (dateStr) => {
  const dateObj = new Date(dateStr);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString('default', { month: 'long' });
  const year = dateObj.getFullYear();

  // Determine ordinal suffix for day
  let ordinal = 'th';
  if (day % 10 === 1 && day !== 11) {
    ordinal = 'st';
  } else if (day % 10 === 2 && day !== 12) {
    ordinal = 'nd';
  } else if (day % 10 === 3 && day !== 13) {
    ordinal = 'rd';
  }

  return `${day}${ordinal}, ${month} ${year}`;
};

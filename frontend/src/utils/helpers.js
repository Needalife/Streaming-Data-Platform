export const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${hours}:${minutes} ${month} ${day}, ${year}`;
};

export const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
};

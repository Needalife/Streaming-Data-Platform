export const roundToMinute = (timestamp) => {
    const date = new Date(timestamp);
    date.setSeconds(0, 0);
    return date.toISOString();
  };
  
  export const filterData = (allData, hours) => {
    const now = new Date();
    const cutoff = new Date(now.getTime() - hours * 60 * 60 * 1000);
    return allData.filter((entry) => new Date(entry.timestamp) >= cutoff);
  };
  
  export const aggregateData = (transactions) => {
    const groupedData = transactions.reduce((acc, transaction) => {
      const roundedTimestamp = roundToMinute(transaction.timestamp);
      const existing = acc.find((entry) => entry.timestamp === roundedTimestamp);
  
      if (existing) {
        existing.total += 1;
        existing[transaction.status.toLowerCase()] += 1;
      } else {
        acc.push({
          timestamp: roundedTimestamp,
          total: 1,
          success: transaction.status === "success" ? 1 : 0,
          ongoing: transaction.status === "ongoing" ? 1 : 0,
          error: transaction.status === "error" ? 1 : 0,
        });
      }
      return acc;
    }, []);
  
    return groupedData;
  };
  
export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

export const days = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat"
];

export const getDay = (timestamp: Date | string) => {
  const date = new Date(timestamp);
  return `${date.getDate()} ${months[date.getMonth()]}`;
};

export const getFullDay = (timestamp: Date | string) => {
  const date = new Date(timestamp);
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

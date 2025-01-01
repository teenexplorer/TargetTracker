export const startOfDay = (date: Date, daysAgo = 0): Date => {
  const d = new Date(date);
  d.setDate(d.getDate() - daysAgo);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const endOfDay = (date: Date, daysAgo = 0): Date => {
  const d = new Date(date);
  d.setDate(d.getDate() - daysAgo);
  d.setHours(23, 59, 59, 999);
  return d;
};

export const startOfWeek = (date: Date, weeksAgo = 0): Date => {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay() - (weeksAgo * 7));
  d.setHours(0, 0, 0, 0);
  return d;
};

export const endOfWeek = (date: Date, weeksAgo = 0): Date => {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay() + 6 - (weeksAgo * 7));
  d.setHours(23, 59, 59, 999);
  return d;
};

export const startOfMonth = (date: Date): Date => {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const endOfMonth = (date: Date): Date => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1);
  d.setDate(0);
  d.setHours(23, 59, 59, 999);
  return d;
};

export const formatDate = (date: Date, daysAgo = 0): string => {
  const d = new Date(date);
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
};
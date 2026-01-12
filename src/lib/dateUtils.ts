import { differenceInHours, differenceInDays, format, isToday, isYesterday } from 'date-fns';

export function formatRelativeTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();

  const hoursDiff = differenceInHours(now, date);
  const daysDiff = differenceInDays(now, date);

  // Within last 24 hours
  if (hoursDiff < 24 && isToday(date)) {
    if (hoursDiff === 0) {
      return 'Just now';
    }
    return `${hoursDiff} hour${hoursDiff === 1 ? '' : 's'} ago`;
  }

  // Yesterday
  if (isYesterday(date)) {
    return 'Yesterday';
  }

  // Older than yesterday: "Month Day"
  return format(date, 'MMMM d');
}

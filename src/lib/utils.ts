import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(dateObj);
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
}

export function getInitials(name: string): string {
  if (!name) return '';
  
  const nameParts = name.split(' ');
  if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
  
  return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
}

export function getRelativeTimeString(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }
  
  return formatDate(date);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'good':
      return 'bg-green-500';
    case 'scheduled':
    case 'pending':
      return 'bg-blue-500';
    case 'cancelled':
      return 'bg-red-500';
    case 'warning':
      return 'bg-amber-500';
    case 'urgent':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
}

export function getStatusTextColor(status: string) {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'good':
      return 'text-green-500';
    case 'scheduled':
    case 'pending':
      return 'text-blue-500';
    case 'cancelled':
      return 'text-red-500';
    case 'warning':
      return 'text-amber-500';
    case 'urgent':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
}

export function generateTimeSlots(startHour = 8, endHour = 17, intervalMinutes = 30) {
  const slots = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      const hourFormatted = hour % 12 === 0 ? 12 : hour % 12;
      const minuteFormatted = minute.toString().padStart(2, '0');
      const ampm = hour < 12 ? 'AM' : 'PM';
      slots.push(`${hourFormatted}:${minuteFormatted} ${ampm}`);
    }
  }
  return slots;
}

// This function helps to sort data by date (newest first)
export function sortByDate<T>(array: T[], dateField: keyof T): T[] {
  return [...array].sort((a, b) => {
    const dateA = new Date(a[dateField] as unknown as string | number | Date);
    const dateB = new Date(b[dateField] as unknown as string | number | Date);
    return dateB.getTime() - dateA.getTime();
  });
}

// This function helps to filter items by a text search
export function filterBySearchText<T>(
  items: T[],
  searchText: string,
  searchFields: (keyof T)[]
): T[] {
  if (!searchText.trim()) return items;
  
  const lowerSearchText = searchText.toLowerCase();
  return items.filter(item => {
    return searchFields.some(field => {
      const value = item[field];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowerSearchText);
      }
      return false;
    });
  });
}

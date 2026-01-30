import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPositionBadgeClass(position: number | null): string {
  if (!position) return "position-badge-not-found";
  if (position <= 5) return "position-badge-top5";
  if (position <= 20) return "position-badge-top20";
  return "position-badge-beyond20";
}

export function getOpportunityClass(opportunity: string): string {
  switch (opportunity) {
    case "low": return "opportunity-low";
    case "medium": return "opportunity-medium";
    case "high": return "opportunity-high";
    case "critical": return "opportunity-critical";
    default: return "opportunity-low";
  }
}

export function formatSearchVolume(volume: number): string {
  if (volume >= 1000) {
    return (volume / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return volume.toString();
}

export function getPositionChange(current: number | null, previous: number | null): {
  change: number;
  direction: 'up' | 'down' | 'same';
  display: string;
} {
  if (!current || !previous) {
    return { change: 0, direction: 'same', display: '--' };
  }
  
  const change = previous - current; // Positive means improvement (lower position number)
  
  if (change > 0) {
    return { change, direction: 'up', display: `+${change}` };
  } else if (change < 0) {
    return { change: Math.abs(change), direction: 'down', display: `${change}` };
  } else {
    return { change: 0, direction: 'same', display: '0' };
  }
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
}

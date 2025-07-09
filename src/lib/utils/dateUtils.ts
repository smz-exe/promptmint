/**
 * Format a date as a relative time string (e.g., "2 hours ago", "3 days ago")
 * Unified implementation to replace temporary functions across the codebase
 */
export function formatRelativeTime(date: Date | string | number): string {
  const dateObj = new Date(date);

  // Handle invalid dates
  if (isNaN(dateObj.getTime())) {
    return "Invalid date";
  }

  const now = new Date();
  const diff = now.getTime() - dateObj.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years}y ago`;
  if (months > 0) return `${months}mo ago`;
  if (weeks > 0) return `${weeks}w ago`;
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}

/**
 * Format a date as an absolute date string
 * Provides different formats based on how recent the date is
 */
export function formatAbsoluteDate(
  date: Date | string | number,
  options: {
    includeTime?: boolean;
    shortFormat?: boolean;
  } = {},
): string {
  const dateObj = new Date(date);
  const { includeTime = false, shortFormat = false } = options;

  // Handle invalid dates
  if (isNaN(dateObj.getTime())) {
    return "Invalid date";
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const dateOnly = new Date(
    dateObj.getFullYear(),
    dateObj.getMonth(),
    dateObj.getDate(),
  );

  // Today: show time only (if includeTime) or "Today"
  if (dateOnly.getTime() === today.getTime()) {
    if (includeTime) {
      return dateObj.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return "Today";
  }

  // Yesterday: show "Yesterday" or "Yesterday at HH:mm"
  if (dateOnly.getTime() === yesterday.getTime()) {
    if (includeTime) {
      return `Yesterday at ${dateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
    }
    return "Yesterday";
  }

  // This year: show month and day
  if (dateObj.getFullYear() === now.getFullYear()) {
    if (shortFormat) {
      return dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
    if (includeTime) {
      return `${dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" })} at ${dateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
    }
    return dateObj.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
  }

  // Other years: include year
  if (shortFormat) {
    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  if (includeTime) {
    return `${dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} at ${dateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
  }
  return dateObj.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format a date for display in different contexts
 * Automatically chooses between relative and absolute formatting
 */
export function formatDateSmart(
  date: Date | string | number,
  context: "comment" | "card" | "profile" | "detailed" = "card",
): string {
  const dateObj = new Date(date);

  // Handle invalid dates
  if (isNaN(dateObj.getTime())) {
    return "Invalid date";
  }

  const now = new Date();
  const diffInHours = (now.getTime() - dateObj.getTime()) / (1000 * 60 * 60);

  switch (context) {
    case "comment":
      // For comments, use relative time for recent dates, absolute for older
      if (diffInHours < 24) {
        return formatRelativeTime(dateObj);
      }
      return formatAbsoluteDate(dateObj, { shortFormat: true });

    case "card":
      // For cards, use relative time for very recent, absolute for others
      if (diffInHours < 168) {
        // 7 days
        return formatRelativeTime(dateObj);
      }
      return formatAbsoluteDate(dateObj, { shortFormat: true });

    case "profile":
      // For profiles, prefer absolute dates
      return formatAbsoluteDate(dateObj, { shortFormat: false });

    case "detailed":
      // For detailed views, show full date with time
      return formatAbsoluteDate(dateObj, {
        includeTime: true,
        shortFormat: false,
      });

    default:
      return formatRelativeTime(dateObj);
  }
}

/**
 * Format a join date specifically for user profiles
 */
export function formatJoinDate(date: Date | string | number): string {
  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) {
    return "Invalid date";
  }

  return dateObj.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

/**
 * Format a date for form inputs (YYYY-MM-DD)
 */
export function formatDateForInput(date: Date | string | number): string {
  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) {
    return "";
  }

  return dateObj.toISOString().split("T")[0] ?? "";
}

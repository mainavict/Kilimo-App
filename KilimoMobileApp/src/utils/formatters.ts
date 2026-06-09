/**
 * Format phone number to standard format
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");

  // Convert to Kenyan format
  if (cleaned.startsWith("254")) {
    return `+${cleaned}`;
  } else if (cleaned.startsWith("0")) {
    return `+254${cleaned.substring(1)}`;
  } else if (cleaned.startsWith("7") || cleaned.startsWith("1")) {
    return `+254${cleaned}`;
  }

  return phone;
};

/**
 * Format date to readable string
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return d.toLocaleDateString("en-US", options);
};

/**
 * Format time to readable string
 */
export const formatTime = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;

  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };

  return d.toLocaleTimeString("en-US", options);
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
};

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (text: string): string => {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Mask email for privacy
 */
export const maskEmail = (email: string): string => {
  const [username, domain] = email.split("@");
  if (!username || !domain) return email;

  const maskedUsername = username.substring(0, 3) + "***";
  return `${maskedUsername}@${domain}`;
};

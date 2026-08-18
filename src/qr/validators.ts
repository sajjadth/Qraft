// ===== QR Input Validators =====
// Returns an error message string if invalid, or empty string if valid.

import type { QRType, QRFormData } from './types';

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateInput(type: QRType, data: QRFormData): ValidationResult {
  const errors: Record<string, string> = {};

  switch (type) {
    case 'url':
      validateURL(data, errors);
      break;
    case 'text':
      validateText(data, errors);
      break;
    case 'email':
      validateEmail(data, errors);
      break;
    case 'phone':
      validatePhone(data, errors);
      break;
    case 'sms':
      validateSMS(data, errors);
      break;
    case 'contact':
      validateContact(data, errors);
      break;
    case 'wifi':
      validateWiFi(data, errors);
      break;
    case 'event':
      validateEvent(data, errors);
      break;
    case 'location':
      validateLocation(data, errors);
      break;
    case 'custom':
      validateCustom(data, errors);
      break;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

function validateURL(data: QRFormData, errors: Record<string, string>): void {
  const url = (data.url || '').trim();
  if (!url) {
    errors.url = 'A URL is required.';
    return;
  }
  // Allow bare domains or full URLs
  const withProtocol = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(url) ? url : 'https://' + url;
  try {
    new URL(withProtocol);
  } catch {
    errors.url = 'Enter a valid URL. It should look like example.com or https://example.com.';
  }
}

function validateText(data: QRFormData, errors: Record<string, string>): void {
  if (!(data.text || '').trim()) {
    errors.text = 'Some text is required.';
  }
}

function validateEmail(data: QRFormData, errors: Record<string, string>): void {
  if (!(data.to || '').trim()) {
    errors.to = 'A recipient email address is required.';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.to)) {
    errors.to = 'Enter a valid email address, like hello@example.com.';
  }
}

function validatePhone(data: QRFormData, errors: Record<string, string>): void {
  if (!(data.phone || '').trim()) {
    errors.phone = 'A phone number is required.';
    return;
  }
  // Allow most phone number formats
  const cleaned = data.phone.replace(/[\s\-().+]/g, '');
  if (!/^\d{5,15}$/.test(cleaned)) {
    errors.phone = 'Enter a valid phone number with 5 to 15 digits.';
  }
}

function validateSMS(data: QRFormData, errors: Record<string, string>): void {
  if (!(data.phone || '').trim()) {
    errors.phone = 'A phone number is required.';
    return;
  }
  const cleaned = data.phone.replace(/[\s\-().+]/g, '');
  if (!/^\d{5,15}$/.test(cleaned)) {
    errors.phone = 'Enter a valid phone number with 5 to 15 digits.';
  }
}

function validateContact(data: QRFormData, errors: Record<string, string>): void {
  if (!(data.firstName || '').trim()) {
    errors.firstName = 'A first name is required.';
  }
  if (!(data.lastName || '').trim()) {
    errors.lastName = 'A last name is required.';
  }
}

function validateWiFi(data: QRFormData, errors: Record<string, string>): void {
  if (!(data.ssid || '').trim()) {
    errors.ssid = 'A network name is required.';
  }
}

function validateEvent(data: QRFormData, errors: Record<string, string>): void {
  if (!(data.title || '').trim()) {
    errors.title = 'An event name is required.';
  }
  if (!(data.startDate || '').trim()) {
    errors.startDate = 'A start date is required.';
  }
  if (!(data.startTime || '').trim()) {
    errors.startTime = 'A start time is required.';
  }
}

function validateLocation(data: QRFormData, errors: Record<string, string>): void {
  const lat = (data.lat || '').trim();
  const lng = (data.lng || '').trim();
  if (!lat) {
    errors.lat = 'Latitude is required.';
  } else if (isNaN(Number(lat)) || Number(lat) < -90 || Number(lat) > 90) {
    errors.lat = 'Latitude must be a number between -90 and 90.';
  }
  if (!lng) {
    errors.lng = 'Longitude is required.';
  } else if (isNaN(Number(lng)) || Number(lng) < -180 || Number(lng) > 180) {
    errors.lng = 'Longitude must be a number between -180 and 180.';
  }
}

function validateCustom(data: QRFormData, errors: Record<string, string>): void {
  if (!(data.payload || '').trim()) {
    errors.payload = 'A payload is required.';
  }
}

/**
 * Check if a payload is getting too dense for comfortable scanning.
 * Returns a warning message or empty string.
 */
export function checkDensity(payload: string): string {
  if (!payload) return '';
  const len = payload.length;
  if (len > 2000) {
    return 'This payload is very large. Consider shortening the content or increasing the QR size and error correction level for reliable scanning.';
  }
  if (len > 1000) {
    return 'This payload is becoming dense. Consider shortening the content or increasing the QR size.';
  }
  return '';
}

/**
 * Check if foreground and background colors have sufficient contrast for scanning.
 */
export function checkContrast(fg: string, bg: string): string {
  const fgLum = relativeLuminance(fg);
  const bgLum = relativeLuminance(bg);
  const ratio = (Math.max(fgLum, bgLum) + 0.05) / (Math.min(fgLum, bgLum) + 0.05);
  if (ratio < 2.5) {
    return 'The foreground and background colors are too similar. This QR code may be difficult to scan. Increase the contrast between them.';
  }
  return '';
}

function relativeLuminance(hex: string): number {
  const rgb = hexToRGB(hex);
  if (!rgb) return 0;
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function hexToRGB(hex: string): [number, number, number] | null {
  const cleaned = hex.replace('#', '');
  if (cleaned.length !== 6) return null;
  const num = parseInt(cleaned, 16);
  if (isNaN(num)) return null;
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

// ===== QR Payload Encoders =====
// Each encoder takes form data and returns the encoded QR payload string.

import type { QRType, QRFormData } from './types';

export function encodePayload(type: QRType, data: QRFormData): string {
  switch (type) {
    case 'url':
      return encodeURL(data);
    case 'text':
      return data.text || '';
    case 'email':
      return encodeEmail(data);
    case 'phone':
      return encodePhone(data);
    case 'sms':
      return encodeSMS(data);
    case 'contact':
      return encodeVCard(data);
    case 'wifi':
      return encodeWiFi(data);
    case 'event':
      return encodeEvent(data);
    case 'location':
      return encodeLocation(data);
    case 'custom':
      return data.payload || '';
    default:
      return '';
  }
}

function encodeURL(data: QRFormData): string {
  let url = (data.url || '').trim();
  if (!url) return '';
  // If no protocol, prepend https://
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(url)) {
    url = 'https://' + url;
  }
  return url;
}

function encodeEmail(data: QRFormData): string {
  const to = (data.to || '').trim();
  if (!to) return '';
  let mailto = `mailto:${to}`;
  const params: string[] = [];
  if (data.subject?.trim()) params.push(`subject=${encodeURIComponent(data.subject.trim())}`);
  if (data.body?.trim()) params.push(`body=${encodeURIComponent(data.body.trim())}`);
  if (params.length > 0) mailto += '?' + params.join('&');
  return mailto;
}

function encodePhone(data: QRFormData): string {
  const phone = (data.phone || '').trim();
  if (!phone) return '';
  return `tel:${phone}`;
}

function encodeSMS(data: QRFormData): string {
  const phone = (data.phone || '').trim();
  if (!phone) return '';
  let sms = `sms:${phone}`;
  if (data.message?.trim()) {
    sms += `?body=${encodeURIComponent(data.message.trim())}`;
  }
  return sms;
}

function escapeVCardField(value: string): string {
  // Escape special vCard characters
  return value
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\n/g, '\\n');
}

function encodeVCard(data: QRFormData): string {
  const lines: string[] = ['BEGIN:VCARD', 'VERSION:3.0'];

  const firstName = (data.firstName || '').trim();
  const lastName = (data.lastName || '').trim();
  if (firstName || lastName) {
    const formatted = [lastName, firstName].filter(Boolean).join(', ');
    lines.push(`FN:${escapeVCardField(formatted)}`);
    lines.push(`N:${escapeVCardField(lastName)};${escapeVCardField(firstName)};;;`);
  }

  if (data.org?.trim()) {
    lines.push(`ORG:${escapeVCardField(data.org.trim())}`);
  }

  if (data.phone?.trim()) {
    lines.push(`TEL;TYPE=CELL:${escapeVCardField(data.phone.trim())}`);
  }

  if (data.email?.trim()) {
    lines.push(`EMAIL:${escapeVCardField(data.email.trim())}`);
  }

  if (data.website?.trim()) {
    lines.push(`URL:${escapeVCardField(data.website.trim())}`);
  }

  if (data.address?.trim()) {
    lines.push(`ADR:;;${escapeVCardField(data.address.trim())};;;;`);
  }

  lines.push('END:VCARD');
  return lines.join('\n');
}

function encodeWiFi(data: QRFormData): string {
  const ssid = (data.ssid || '').trim();
  if (!ssid) return '';

  const security = data.security || 'WPA';
  const password = data.password || '';
  const hidden = data.hidden === 'true' || data.hidden === '1';

  let wifi = 'WIFI:';
  wifi += `T:${security};`;
  wifi += `S:${ssid};`;
  if (security !== 'nopass' && password) {
    wifi += `P:${password};`;
  }
  if (hidden) {
    wifi += 'H:true;';
  }
  wifi += ';';
  return wifi;
}

function padZero(n: number): string {
  return n.toString().padStart(2, '0');
}

function formatDateTime(dateStr: string, timeStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr + (timeStr ? 'T' + timeStr : 'T00:00'));
  if (isNaN(d.getTime())) return '';
  return d.toISOString().replace(/[-:]/g, '').replace(/\.[0-9]{3}/, '');
}

function encodeEvent(data: QRFormData): string {
  const title = (data.title || '').trim();
  if (!title) return '';

  const start = formatDateTime(data.startDate || '', data.startTime || '');
  if (!start) return '';

  const end = formatDateTime(data.endDate || '', data.endTime || '');

  const lines: string[] = [
    'BEGIN:VEVENT',
    `SUMMARY:${escapeVCardField(title)}`,
    `DTSTART:${start}`,
  ];

  if (end) {
    lines.push(`DTEND:${end}`);
  }

  if (data.location?.trim()) {
    lines.push(`LOCATION:${escapeVCardField(data.location.trim())}`);
  }

  if (data.description?.trim()) {
    lines.push(`DESCRIPTION:${escapeVCardField(data.description.trim())}`);
  }

  lines.push('END:VEVENT');
  return lines.join('\n');
}

function encodeLocation(data: QRFormData): string {
  const lat = (data.lat || '').trim();
  const lng = (data.lng || '').trim();
  if (!lat || !lng) return '';

  const label = (data.label || '').trim();
  if (label) {
    return `geo:${lat},${lng}?q=${encodeURIComponent(label)}`;
  }
  return `geo:${lat},${lng}`;
}

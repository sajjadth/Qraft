// ===== QR Type Definitions =====

export type QRType =
  | 'url'
  | 'text'
  | 'email'
  | 'phone'
  | 'sms'
  | 'wifi'
  | 'contact'
  | 'event'
  | 'location'
  | 'custom';

export type QRCategory =
  | 'content'
  | 'contact'
  | 'connect'
  | 'events'
  | 'places'
  | 'advanced';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'url' | 'email' | 'tel' | 'textarea' | 'date' | 'time' | 'select' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  hint?: string;
  defaultValue?: string;
}

export interface QRTypeDefinition {
  id: QRType;
  name: string;
  description: string;
  category: QRCategory;
  icon: string;
  fields: FormField[];
}

export type QRFormData = Record<string, string>;

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type ModuleStyle = 'square' | 'rounded' | 'dot';

export type QRSizePreset = 'small' | 'medium' | 'large' | 'custom';

export interface QRAppearance {
  foreground: string;
  background: string;
  size: QRSizePreset;
  customSize: number;
  errorCorrection: ErrorCorrectionLevel;
  moduleStyle: ModuleStyle;
}

export const SIZE_MAP: Record<Exclude<QRSizePreset, 'custom'>, number> = {
  small: 160,
  medium: 240,
  large: 320,
};

export const DEFAULT_APPEARANCE: QRAppearance = {
  foreground: '#000000',
  background: '#FFFFFF',
  size: 'medium',
  customSize: 300,
  errorCorrection: 'M',
  moduleStyle: 'square',
};

export const ERROR_CORRECTION_INFO: Record<ErrorCorrectionLevel, { label: string; description: string }> = {
  L: {
    label: 'Low (7%)',
    description: 'Smallest QR code. Use when the code won\'t be damaged or obscured.',
  },
  M: {
    label: 'Medium (15%)',
    description: 'Good balance of size and resilience. Recommended for most uses.',
  },
  Q: {
    label: 'Quartile (25%)',
    description: 'Can recover if up to a quarter is damaged. Good for printed materials.',
  },
  H: {
    label: 'High (30%)',
    description: 'Maximum resilience. Use when the QR might be partially covered or damaged.',
  },
};

// QR type definitions with their form fields
export const QR_TYPES: QRTypeDefinition[] = [
  // === Content ===
  {
    id: 'url',
    name: 'URL',
    description: 'Link to any website or webpage.',
    category: 'content',
    icon: 'Link',
    fields: [
      {
        name: 'url',
        label: 'URL',
        type: 'url',
        placeholder: 'https://example.com',
        required: true,
      },
    ],
  },
  {
    id: 'text',
    name: 'Text',
    description: 'Any plain text message.',
    category: 'content',
    icon: 'Type',
    fields: [
      {
        name: 'text',
        label: 'Text',
        type: 'textarea',
        placeholder: 'Enter your text here...',
        required: true,
      },
    ],
  },

  // === Contact ===
  {
    id: 'email',
    name: 'Email',
    description: 'Compose an email with recipient, subject, and body.',
    category: 'contact',
    icon: 'Mail',
    fields: [
      { name: 'to', label: 'Recipient', type: 'email', placeholder: 'hello@example.com', required: true },
      { name: 'subject', label: 'Subject', type: 'text', placeholder: 'Your subject line' },
      { name: 'body', label: 'Message', type: 'textarea', placeholder: 'Your message...' },
    ],
  },
  {
    id: 'phone',
    name: 'Phone',
    description: 'A phone number to call.',
    category: 'contact',
    icon: 'Phone',
    fields: [
      { name: 'phone', label: 'Phone number', type: 'tel', placeholder: '+1 555 123 4567', required: true },
    ],
  },
  {
    id: 'sms',
    name: 'SMS',
    description: 'Send a text message to a phone number.',
    category: 'contact',
    icon: 'MessageSquare',
    fields: [
      { name: 'phone', label: 'Phone number', type: 'tel', placeholder: '+1 555 123 4567', required: true },
      { name: 'message', label: 'Message', type: 'textarea', placeholder: 'Your text message...' },
    ],
  },
  {
    id: 'contact',
    name: 'Contact',
    description: 'Share contact details as a vCard.',
    category: 'contact',
    icon: 'User',
    fields: [
      { name: 'firstName', label: 'First name', type: 'text', placeholder: 'Jane', required: true },
      { name: 'lastName', label: 'Last name', type: 'text', placeholder: 'Doe', required: true },
      { name: 'org', label: 'Organization', type: 'text', placeholder: 'Acme Inc.' },
      { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+1 555 123 4567' },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'jane@example.com' },
      { name: 'website', label: 'Website', type: 'url', placeholder: 'https://example.com' },
      { name: 'address', label: 'Address', type: 'text', placeholder: '123 Main St, City, Country' },
    ],
  },

  // === Connect ===
  {
    id: 'wifi',
    name: 'Wi-Fi',
    description: 'Let someone join your network by scanning.',
    category: 'connect',
    icon: 'Wifi',
    fields: [
      { name: 'ssid', label: 'Network name', type: 'text', placeholder: 'My Network', required: true },
      { name: 'password', label: 'Password', type: 'text', placeholder: 'Network password' },
      {
        name: 'security',
        label: 'Security type',
        type: 'select',
        options: [
          { label: 'WPA/WPA2/WPA3', value: 'WPA' },
          { label: 'WEP', value: 'WEP' },
          { label: 'None (open)', value: 'nopass' },
        ],
        defaultValue: 'WPA',
      },
      { name: 'hidden', label: 'Hidden network', type: 'checkbox' },
    ],
  },

  // === Events ===
  {
    id: 'event',
    name: 'Event',
    description: 'Share a calendar event.',
    category: 'events',
    icon: 'Calendar',
    fields: [
      { name: 'title', label: 'Event name', type: 'text', placeholder: 'Team standup', required: true },
      { name: 'startDate', label: 'Start date', type: 'date', required: true },
      { name: 'startTime', label: 'Start time', type: 'time', required: true },
      { name: 'endDate', label: 'End date', type: 'date' },
      { name: 'endTime', label: 'End time', type: 'time' },
      { name: 'location', label: 'Location', type: 'text', placeholder: 'Conference room B' },
      { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Event details...' },
    ],
  },

  // === Places ===
  {
    id: 'location',
    name: 'Location',
    description: 'Share a geographic location or coordinates.',
    category: 'places',
    icon: 'MapPin',
    fields: [
      { name: 'lat', label: 'Latitude', type: 'text', placeholder: '37.7749', required: true },
      { name: 'lng', label: 'Longitude', type: 'text', placeholder: '-122.4194', required: true },
      { name: 'label', label: 'Place name (optional)', type: 'text', placeholder: 'San Francisco, CA' },
    ],
  },

  // === Advanced ===
  {
    id: 'custom',
    name: 'Custom payload',
    description: 'Enter a raw QR payload. Advanced use.',
    category: 'advanced',
    icon: 'Code',
    fields: [
      {
        name: 'payload',
        label: 'Raw QR payload',
        type: 'textarea',
        placeholder: 'Enter any raw content to encode...',
        required: true,
        hint: 'This content will be encoded directly into the QR code without modification.',
      },
    ],
  },
];

export const QR_CATEGORIES: { id: QRCategory; label: string }[] = [
  { id: 'content', label: 'Content' },
  { id: 'contact', label: 'Contact' },
  { id: 'connect', label: 'Connect' },
  { id: 'events', label: 'Events' },
  { id: 'places', label: 'Places' },
  { id: 'advanced', label: 'Advanced' },
];

export function getTypesByCategory(category: QRCategory): QRTypeDefinition[] {
  return QR_TYPES.filter((t) => t.category === category);
}

export function getTypeDefinition(id: QRType): QRTypeDefinition | undefined {
  return QR_TYPES.find((t) => t.id === id);
}

export function getDefaultFormData(type: QRType): QRFormData {
  const def = getTypeDefinition(type);
  if (!def) return {};
  const data: QRFormData = {};
  for (const field of def.fields) {
    if (field.defaultValue) data[field.name] = field.defaultValue;
    else data[field.name] = '';
  }
  return data;
}

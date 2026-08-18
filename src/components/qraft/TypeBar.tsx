'use client';

import React from 'react';
import { Link, Type, Mail, Phone, MessageSquare, User, Wifi, Calendar, MapPin, Code } from 'lucide-react';
import type { QRType } from '@/qr/types';
import { QR_TYPES } from '@/qr/types';

const ICONS: Record<string, React.ReactNode> = {
  Link: <Link size={15} />, Type: <Type size={15} />, Mail: <Mail size={15} />,
  Phone: <Phone size={15} />, MessageSquare: <MessageSquare size={15} />,
  User: <User size={15} />, Wifi: <Wifi size={15} />, Calendar: <Calendar size={15} />,
  MapPin: <MapPin size={15} />, Code: <Code size={15} />,
};

interface Props { selected: QRType; onSelect: (t: QRType) => void; }

export function TypeBar({ selected, onSelect }: Props) {
  return (
    <div role="radiogroup" aria-label="QR type" className="type-bar-grid">
      {QR_TYPES.map(t => {
        const active = selected === t.id;
        return (
          <button key={t.id} role="radio" aria-checked={active}
            onClick={() => onSelect(t.id)}
            className={`type-bar-item ${active ? 'type-bar-item--active' : ''}`}
          >
            <span className="type-bar-icon">
              {ICONS[t.icon] || <Code size={15} />}
            </span>
            <span className="type-bar-label">{t.name}</span>
          </button>
        );
      })}
    </div>
  );
}

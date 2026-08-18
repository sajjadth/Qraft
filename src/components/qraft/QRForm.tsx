'use client';

import React from 'react';
import type { QRType, QRFormData, FormField } from '@/qr/types';
import { getTypeDefinition } from '@/qr/types';

interface QRFormProps {
  type: QRType;
  formData: QRFormData;
  errors: Record<string, string>;
  onFieldChange: (field: string, value: string) => void;
}

export function QRForm({ type, formData, errors, onFieldChange }: QRFormProps) {
  const typeDef = getTypeDefinition(type);
  if (!typeDef) return null;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      noValidate
      aria-label={`${typeDef.name} QR code form`}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {typeDef.fields.map((field) => (
          <FormFieldComponent
            key={field.name}
            field={field}
            value={formData[field.name] || ''}
            error={errors[field.name]}
            onChange={(val) => onFieldChange(field.name, val)}
          />
        ))}
      </div>
    </form>
  );
}

function FormFieldComponent({
  field,
  value,
  error,
  onChange,
}: {
  field: FormField;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  const id = `qr-field-${field.name}`;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  // Checkbox
  if (field.type === 'checkbox') {
    const checked = value === 'true' || value === '1';
    return (
      <div className="q-checkbox-row" style={{ marginTop: 'var(--space-4)' }}>
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked ? 'true' : '')}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={!!error}
        />
        <label htmlFor={id}>{field.label}</label>
        {error && (
          <span id={errorId} className="q-error" role="alert" style={{ marginTop: 0 }}>
            {error}
          </span>
        )}
      </div>
    );
  }

  // Select
  if (field.type === 'select' && field.options) {
    return (
      <div className="q-field" key={field.name}>
        <label htmlFor={id} className="q-label">
          {field.label}
          {field.required && (
            <span style={{ color: 'var(--color-error)', marginLeft: '2px' }}>*</span>
          )}
        </label>
        <select
          id={id}
          className="q-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-required={field.required}
          aria-describedby={[field.hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined}
          aria-invalid={!!error}
        >
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {field.hint && (
          <span id={hintId} className="q-hint">
            {field.hint}
          </span>
        )}
        {error && (
          <span id={errorId} className="q-error" role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }

  // Textarea
  if (field.type === 'textarea') {
    return (
      <div className="q-field" key={field.name}>
        <label htmlFor={id} className="q-label">
          {field.label}
          {field.required && (
            <span style={{ color: 'var(--color-error)', marginLeft: '2px' }}>*</span>
          )}
        </label>
        <textarea
          id={id}
          className="q-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          aria-describedby={[field.hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined}
          aria-invalid={!!error}
          rows={field.type === 'textarea' && field.name === 'payload' ? 5 : 3}
        />
        {field.hint && (
          <span id={hintId} className="q-hint">
            {field.hint}
          </span>
        )}
        {error && (
          <span id={errorId} className="q-error" role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }

  // Input (text, url, email, tel, date, time)
  return (
    <div className="q-field" key={field.name}>
      <label htmlFor={id} className="q-label">
        {field.label}
        {field.required && (
          <span style={{ color: 'var(--color-error)', marginLeft: '2px' }}>*</span>
        )}
      </label>
      <input
        id={id}
        type={field.type}
        className="q-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        required={field.required}
        aria-describedby={[field.hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined}
        aria-invalid={!!error}
      />
      {field.hint && (
        <span id={hintId} className="q-hint">
          {field.hint}
        </span>
      )}
      {error && (
        <span id={errorId} className="q-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

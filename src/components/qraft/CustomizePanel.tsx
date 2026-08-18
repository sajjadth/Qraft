'use client';

import React, { useCallback } from 'react';
import type { QRAppearance, ErrorCorrectionLevel, ModuleStyle, QRSizePreset } from '@/qr/types';
import { ERROR_CORRECTION_INFO } from '@/qr/types';

interface Props { appearance: QRAppearance; onChange: (p: Partial<QRAppearance>) => void; }

const FG = ['#000000','#1A1A2E','#2D3436','#6C5CE7','#D63031','#E17055','#00B894','#0984E3'];
const BG = ['#FFFFFF','#F8F9FA','#FDF6E3','#F0FFF4','#EBF5FB','#F5F0FF','#FFF5F5','#1A1A2E'];
const SIZES: { v: QRSizePreset; l: string }[] = [
  { v: 'small', l: 'S' }, { v: 'medium', l: 'M' }, { v: 'large', l: 'L' }, { v: 'custom', l: '...' },
];
const MODULES: { v: ModuleStyle; l: string }[] = [
  { v: 'square', l: 'Square' }, { v: 'rounded', l: 'Rounded' }, { v: 'dot', l: 'Dot' },
];
const EC: ErrorCorrectionLevel[] = ['L','M','Q','H'];

function Swatch({ color, active, onClick, label }: { color: string; active: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} title={label} aria-label={label} style={{
      width: 22, height: 22, borderRadius: '50%', border: active ? '2px solid var(--accent)' : '2px solid var(--border)',
      background: color, cursor: 'pointer', padding: 0, transition: 'border-color var(--transition-fast)',
      boxShadow: active ? '0 0 0 2px var(--ring)' : 'none',
    }} />
  );
}

export function CustomizePanel({ appearance, onChange }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', padding: 'var(--space-4) 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)' }}>
        <div>
          <label className="q-label">Foreground</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <input type="color" value={appearance.foreground}
                onChange={e => onChange({ foreground: e.target.value })} aria-label="Custom foreground color"
                style={{ position: 'absolute', opacity: 0, width: 22, height: 22, cursor: 'pointer' }} />
              <div style={{
                width: 22, height: 22, borderRadius: '50%', border: '1px dashed var(--text-tertiary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, color: 'var(--text-tertiary)', cursor: 'pointer',
              }}>+</div>
            </div>
            {FG.map(c => <Swatch key={c} color={c} active={appearance.foreground === c} onClick={() => onChange({ foreground: c })} label={c} />)}
          </div>
        </div>
        <div>
          <label className="q-label">Background</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <input type="color" value={appearance.background}
                onChange={e => onChange({ background: e.target.value })} aria-label="Custom background color"
                style={{ position: 'absolute', opacity: 0, width: 22, height: 22, cursor: 'pointer' }} />
              <div style={{
                width: 22, height: 22, borderRadius: '50%', border: '1px dashed var(--text-tertiary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, color: 'var(--text-tertiary)', cursor: 'pointer',
              }}>+</div>
            </div>
            {BG.map(c => <Swatch key={c} color={c} active={appearance.background === c} onClick={() => onChange({ background: c })} label={c} />)}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)' }}>
        <div>
          <label className="q-label">Size</label>
          <div style={{ display: 'flex', gap: 4 }} role="radiogroup" aria-label="Size">
            {SIZES.map(s => (
              <button key={s.v} role="radio" aria-checked={appearance.size === s.v} onClick={() => onChange({ size: s.v })}
                className="q-btn q-btn-secondary" style={{
                  flex: 1, padding: '6px 0', fontSize: 'var(--text-sm)', fontWeight: appearance.size === s.v ? 600 : 400,
                  borderColor: appearance.size === s.v ? 'var(--accent)' : undefined,
                  background: appearance.size === s.v ? 'var(--accent-muted)' : undefined,
                }}>
                {s.l}
              </button>
            ))}
          </div>
          {appearance.size === 'custom' && (
            <div style={{ marginTop: 8 }}>
              <input type="range" min={100} max={600} step={10} value={appearance.customSize}
                onChange={e => onChange({ customSize: +e.target.value })} aria-label="Custom size"
                style={{ width: '100%', accentColor: 'var(--accent)' }} />
              <span className="q-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{appearance.customSize}px</span>
            </div>
          )}
        </div>
        <div>
          <label className="q-label">Error correction</label>
          <div style={{ display: 'flex', gap: 4 }} role="radiogroup" aria-label="Error correction">
            {EC.map(ec => (
              <button key={ec} role="radio" aria-checked={appearance.errorCorrection === ec}
                onClick={() => onChange({ errorCorrection: ec })}
                className="q-btn q-btn-secondary" style={{
                  flex: 1, padding: '6px 0', fontSize: 'var(--text-sm)', fontWeight: appearance.errorCorrection === ec ? 600 : 400,
                  borderColor: appearance.errorCorrection === ec ? 'var(--accent)' : undefined,
                  background: appearance.errorCorrection === ec ? 'var(--accent-muted)' : undefined,
                }}>{ec}</button>
            ))}
          </div>
          <p className="q-hint" style={{ marginTop: 4 }}>{ERROR_CORRECTION_INFO[appearance.errorCorrection].description}</p>
        </div>
        <div>
          <label className="q-label">Style</label>
          <div style={{ display: 'flex', gap: 4 }} role="radiogroup" aria-label="Module style">
            {MODULES.map(m => (
              <button key={m.v} role="radio" aria-checked={appearance.moduleStyle === m.v}
                onClick={() => onChange({ moduleStyle: m.v })}
                className="q-btn q-btn-secondary" style={{
                  flex: 1, padding: '6px 0', fontSize: 'var(--text-sm)', fontWeight: appearance.moduleStyle === m.v ? 600 : 400,
                  borderColor: appearance.moduleStyle === m.v ? 'var(--accent)' : undefined,
                  background: appearance.moduleStyle === m.v ? 'var(--accent-muted)' : undefined,
                }}>{m.l}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
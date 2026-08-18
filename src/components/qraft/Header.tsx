'use client';

import React, { useEffect, useState } from 'react';
import { Logo } from './Logo';
import { Sun, Moon, Monitor, Github } from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';

const THEMES: { v: Theme; icon: React.ReactNode; label: string }[] = [
  { v: 'light', icon: <Sun size={14} />, label: 'Light' },
  { v: 'dark', icon: <Moon size={14} />, label: 'Dark' },
  { v: 'system', icon: <Monitor size={14} />, label: 'System' },
];

export function Header() {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const s = localStorage.getItem('qraft-theme') as Theme | null;
    if (s && THEMES.some(t => t.v === s)) setTheme(s);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('qraft-theme', theme);
  }, [theme]);

  const cycle = () => {
    const i = THEMES.findIndex(t => t.v === theme);
    setTheme(THEMES[(i + 1) % THEMES.length].v);
  };

  const cur = THEMES.find(t => t.v === theme)!;

  return (
    <header style={{
      height: 'var(--header-h)', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 var(--space-5)',
      position: 'sticky', top: 0, zIndex: 100,
      background: 'color-mix(in srgb, var(--bg) 80%, transparent)',
      backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <Logo size={22} />
        <span style={{
          fontSize: 'var(--text-lg)', fontWeight: 700,
          letterSpacing: '-0.02em', color: 'var(--text-primary)',
        }}>Qraft</span>
      </div>
      <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }} aria-label="Site controls">
        <button className="q-btn q-btn-icon q-btn-ghost" onClick={cycle}
          aria-label={`Theme: ${cur.label}`} title={cur.label}>
          {cur.icon}
        </button>
        <a href="https://github.com/sajjadth" target="_blank" rel="noopener noreferrer"
          className="q-btn q-btn-icon q-btn-ghost" aria-label="GitHub" title="GitHub"
          style={{ textDecoration: 'none' }}>
          <Github size={15} />
        </a>
      </nav>
    </header>
  );
}

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTypeDefinition } from '@/qr/types';
import type { QRType, QRAppearance } from '@/qr/types';

interface Props {
  type: QRType; svgString: string; appearance: QRAppearance;
  isEmpty: boolean; warnings: string[];
}

export function QRPreview({ type, svgString, appearance, isEmpty, warnings }: Props) {
  const typeDef = getTypeDefinition(type);
  const [key, setKey] = useState(0);
  const prevSvg = useRef(svgString);

  useEffect(() => {
    if (svgString !== prevSvg.current && svgString) {
      prevSvg.current = svgString;
      setKey(k => k + 1);
    }
  }, [svgString]);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: 'var(--space-4) 0 var(--space-8)',
    }}>
      <AnimatePresence mode="wait">
        {isEmpty ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ textAlign: 'center', padding: 'var(--space-10) 0' }}
          >
            <div style={{
              width: 120, height: 120, borderRadius: 'var(--radius-lg)',
              border: '1.5px dashed var(--border)', margin: '0 auto var(--space-5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--bg-raised)',
            }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
                stroke="var(--text-tertiary)" strokeWidth="1" strokeLinecap="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>
            <p style={{
              fontSize: 'var(--text-lg)', fontWeight: 600,
              color: 'var(--text-primary)', marginBottom: 'var(--space-2)',
            }}>
              Make anything scannable.
            </p>
            <p style={{
              fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)',
              maxWidth: 320, margin: '0 auto', lineHeight: 'var(--leading-relaxed)',
            }}>
              {typeDef?.description || 'Select a type and enter content to generate.'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={key}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <div style={{
              padding: 24, borderRadius: 'var(--radius-lg)',
              background: appearance.background,
              boxShadow: '0 0 0 1px var(--border), 0 8px 40px -12px rgba(0,0,0,0.35)',
              transition: 'background-color var(--transition-base)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div
                className="qr-svg-wrap"
                style={{ width: 260, height: 260 }}
                dangerouslySetInnerHTML={{ __html: svgString }}
                role="img" aria-label={`Generated ${typeDef?.name || 'QR'} code`}
              />
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              marginTop: 'var(--space-3)',
            }}>
              <span style={{
                width: 5, height: 5, borderRadius: '50%',
                background: 'var(--accent)',
              }} />
              <span style={{
                fontSize: 'var(--text-xs)', fontWeight: 500,
                color: 'var(--text-tertiary)', letterSpacing: 'var(--tracking-wide)',
                textTransform: 'uppercase',
              }}>
                Live {typeDef && <span style={{ fontWeight: 400 }}> — {typeDef.name}</span>}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {warnings.length > 0 && (
        <div role="alert" style={{
          width: '100%', maxWidth: 400, marginTop: 'var(--space-4)',
          padding: '10px 14px', background: 'var(--danger-muted)',
          border: '1px solid var(--danger)', borderRadius: 'var(--radius-md)',
          fontSize: 'var(--text-sm)', color: 'var(--danger)', lineHeight: 'var(--leading-normal)',
        }}>
          {warnings.map((w, i) => <p key={i} style={{ margin: i > 0 ? 4 : 0 }}>{w}</p>)}
        </div>
      )}
    </div>
  );
}

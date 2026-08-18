'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from '@/components/qraft/Header';
import { TypeBar } from '@/components/qraft/TypeBar';
import { QRForm } from '@/components/qraft/QRForm';
import { QRPreview } from '@/components/qraft/QRPreview';
import { ExportRow } from '@/components/qraft/ExportRow';
import { CustomizePanel } from '@/components/qraft/CustomizePanel';
import { useQR } from '@/hooks/useQR';
import { getTypeDefinition } from '@/qr/types';

const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

export default function QraftPage() {
  const qr = useQR();
  const typeDef = getTypeDefinition(qr.type);
  const [showCustomize, setShowCustomize] = useState(false);

  return (
    <>
      <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <Header />

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Subtle top glow */}
          <div
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, height: 500,
              background: 'var(--glow)', pointerEvents: 'none', zIndex: 0,
            }}
          />

          <div style={{ width: '100%', maxWidth: 'var(--max-w)', padding: '0 var(--space-5)', position: 'relative', zIndex: 1 }}>
            {/* Type selector */}
            <div style={{ paddingTop: 'var(--space-6)', paddingBottom: 'var(--space-5)' }}>
              <TypeBar selected={qr.type} onSelect={qr.updateType} />
            </div>

            {/* Hero QR preview */}
            <QRPreview
              type={qr.type}
              svgString={qr.svgString}
              appearance={qr.appearance}
              isEmpty={qr.isEmpty}
              warnings={qr.warnings}
            />

            {/* Form + Export */}
            <div style={{ paddingBottom: 'var(--space-4)' }}>
              <AnimatePresence mode="wait">
                <motion.div key={qr.type} {...fadeUp}>
                  <QRForm
                    type={qr.type}
                    formData={qr.formData}
                    errors={qr.errors}
                    onFieldChange={qr.updateFormData}
                  />
                </motion.div>
              </AnimatePresence>

              {!qr.isEmpty && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.2 }}
                  style={{ marginTop: 'var(--space-3)' }}
                >
                  <ExportRow
                    type={qr.type}
                    formData={qr.formData}
                    appearance={qr.appearance}
                    svgString={qr.svgString}
                    isEmpty={qr.isEmpty}
                  />
                </motion.div>
              )}
            </div>

            {/* Customize toggle + panel */}
            <div style={{ paddingBottom: 'var(--space-12)' }}>
              <button
                className="q-btn q-btn-ghost"
                onClick={() => setShowCustomize(!showCustomize)}
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-tertiary)',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-2) 0',
                  width: '100%',
                  justifyContent: 'flex-start',
                }}
                aria-expanded={showCustomize}
                aria-controls="customize-panel"
              >
                <motion.span
                  animate={{ rotate: showCustomize ? 90 : 0 }}
                  transition={{ duration: 0.15 }}
                  style={{ display: 'flex', fontSize: 'var(--text-sm)' }}
                >
                  &#9654;
                </motion.span>
                Customize appearance
              </button>

              <AnimatePresence>
                {showCustomize && (
                  <motion.div
                    id="customize-panel"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ paddingTop: 'var(--space-4)' }}>
                      <CustomizePanel appearance={qr.appearance} onChange={qr.updateAppearance} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Privacy line */}
            <div
              style={{
                paddingBottom: 'var(--space-8)',
                display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)',
              }}
            >
              <span style={{
                width: 5, height: 5, borderRadius: '50%',
                background: 'var(--accent)', flexShrink: 0,
              }} />
              Private by default — generated locally in your browser
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
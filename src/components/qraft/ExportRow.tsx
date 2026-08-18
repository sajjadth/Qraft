'use client';

import React, { useState, useCallback } from 'react';
import { Download, Copy, Share2, Check, Image, FileCode } from 'lucide-react';
import QRCode from 'qrcode';
import { encodePayload } from '@/qr/encoders';
import type { QRType, QRFormData, QRAppearance, ErrorCorrectionLevel } from '@/qr/types';

interface Props {
  type: QRType; formData: QRFormData; appearance: QRAppearance;
  svgString: string; isEmpty: boolean;
}

const EC: Record<ErrorCorrectionLevel, string> = { L:'L', M:'M', Q:'Q', H:'H' };

export function ExportRow({ type, formData, appearance, svgString, isEmpty }: Props) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const payload = useCallback(() => encodePayload(type, formData), [type, formData]);
  const pxSize = useCallback(() => {
    if (appearance.size === 'custom') return appearance.customSize;
    return { small: 160, medium: 240, large: 320 }[appearance.size] || 240;
  }, [appearance.size, appearance.customSize]);

  const dlPNG = useCallback(async () => {
    const p = payload(); if (!p) return;
    const c = document.createElement('canvas');
    await QRCode.toCanvas(c, p, {
      width: Math.max(pxSize()*2, 512), margin: 2,
      errorCorrectionLevel: EC[appearance.errorCorrection],
      color: { dark: appearance.foreground, light: appearance.background },
    });
    const a = document.createElement('a');
    a.download = `qraft-${type}.png`; a.href = c.toDataURL('image/png'); a.click();
  }, [payload, pxSize, appearance, type]);

  const dlSVG = useCallback(() => {
    if (!svgString) return;
    const b = new Blob([svgString], { type: 'image/svg+xml' });
    const u = URL.createObjectURL(b);
    const a = document.createElement('a');
    a.download = `qraft-${type}.svg`; a.href = u; a.click();
    URL.revokeObjectURL(u);
  }, [svgString, type]);

  const copy = useCallback(async () => {
    const p = payload(); if (!p) return;
    const c = document.createElement('canvas');
    await QRCode.toCanvas(c, p, {
      width: Math.max(pxSize()*2, 512), margin: 2,
      errorCorrectionLevel: EC[appearance.errorCorrection],
      color: { dark: appearance.foreground, light: appearance.background },
    });
    c.toBlob(async blob => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopied(true); setTimeout(() => setCopied(false), 1800);
      } catch {
        try { await navigator.clipboard.writeText(svgString); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {}
      }
    }, 'image/png');
  }, [payload, pxSize, appearance, svgString]);

  const share = useCallback(async () => {
    if (!navigator.share) return;
    const p = payload(); if (!p) return;
    const c = document.createElement('canvas');
    await QRCode.toCanvas(c, p, {
      width: Math.max(pxSize()*2, 512), margin: 2,
      errorCorrectionLevel: EC[appearance.errorCorrection],
      color: { dark: appearance.foreground, light: appearance.background },
    });
    c.toBlob(async blob => {
      if (!blob) return;
      try {
        await navigator.share({ title: 'Qraft QR Code', files: [new File([blob], 'qraft-qr.png', { type: 'image/png' })] });
        setShared(true); setTimeout(() => setShared(false), 1800);
      } catch {}
    }, 'image/png');
  }, [payload, pxSize, appearance]);

  const canShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <button className="q-btn q-btn-primary" onClick={dlPNG} disabled={isEmpty} style={{ flex: 1 }}>
        <Image size={14} /> PNG
      </button>
      <button className="q-btn q-btn-secondary" onClick={dlSVG} disabled={isEmpty} style={{ flex: 1 }}>
        <FileCode size={14} /> SVG
      </button>
      <button className="q-btn q-btn-secondary" onClick={copy} disabled={isEmpty}
        aria-label={copied ? 'Copied' : 'Copy QR'}>
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
      {canShare && (
        <button className="q-btn q-btn-secondary" onClick={share} disabled={isEmpty}
          aria-label={shared ? 'Shared' : 'Share'}>
          {shared ? <Check size={14} /> : <Share2 size={14} />}
        </button>
      )}
    </div>
  );
}
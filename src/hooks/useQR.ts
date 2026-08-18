'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import type { QRType, QRFormData, QRAppearance, ErrorCorrectionLevel } from '@/qr/types';
import { QR_TYPES } from '@/qr/types';
import { encodePayload } from '@/qr/encoders';
import { validateInput, checkDensity, checkContrast } from '@/qr/validators';

export interface QRState {
  type: QRType;
  formData: QRFormData;
  appearance: QRAppearance;
  payload: string;
  svgString: string;
  errors: Record<string, string>;
  warnings: string[];
  isValid: boolean;
  isEmpty: boolean;
}

const EC_MAP: Record<ErrorCorrectionLevel, string> = {
  L: 'L',
  M: 'M',
  Q: 'Q',
  H: 'H',
};

export function useQR() {
  const [type, setType] = useState<QRType>('url');
  const [formData, setFormData] = useState<QRFormData>({ url: '' });
  const [appearance, setAppearance] = useState<QRAppearance>({
    foreground: '#000000',
    background: '#FFFFFF',
    size: 'medium',
    customSize: 300,
    errorCorrection: 'M',
    moduleStyle: 'square',
  });
  const [svgString, setSvgString] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [warnings, setWarnings] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const generateQR = useCallback(
    (payload: string, app: QRAppearance) => {
      if (!payload.trim()) {
        setSvgString('');
        setIsEmpty(true);
        setIsValid(false);
        setWarnings([]);
        return;
      }

      const size = app.size === 'custom' ? app.customSize : { small: 160, medium: 240, large: 320 }[app.size] || 240;
      const margin = 2;

      QRCode.toString(payload, {
        type: 'svg',
        width: size,
        margin,
        errorCorrectionLevel: EC_MAP[app.errorCorrection],
        color: {
          dark: app.foreground,
          light: app.background,
        },
      })
        .then((svg: string) => {
          const styledSvg = applyModuleStyle(svg, app.moduleStyle);
          setSvgString(styledSvg);
          setIsEmpty(false);

          const newWarnings: string[] = [];
          const densityWarn = checkDensity(payload);
          if (densityWarn) newWarnings.push(densityWarn);
          const contrastWarn = checkContrast(app.foreground, app.background);
          if (contrastWarn) newWarnings.push(contrastWarn);
          setWarnings(newWarnings);
        })
        .catch(() => {
          setSvgString('');
          setIsEmpty(true);
        });
    },
    []
  );

  const update = useCallback(
    (newType: QRType, newData: QRFormData, newApp: QRAppearance) => {
      const validation = validateInput(newType, newData);
      setErrors(validation.errors);
      setIsValid(validation.valid);

      const payload = encodePayload(newType, newData);

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        generateQR(payload, newApp);
      }, 150);
    },
    [generateQR]
  );

  const updateFormData = useCallback(
    (field: string, value: string) => {
      setFormData((prev) => {
        const next = { ...prev, [field]: value };
        update(type, next, appearance);
        return next;
      });
    },
    [type, appearance, update]
  );

  const updateType = useCallback(
    (newType: QRType) => {
      const typeDef = QR_TYPES.find((t: { id: QRType }) => t.id === newType);
      const defaultData: QRFormData = {};
      if (typeDef) {
        for (const field of typeDef.fields) {
          defaultData[field.name] = field.defaultValue || '';
        }
      }
      setType(newType);
      setFormData(defaultData);
      setErrors({});
      setWarnings([]);
      update(newType, defaultData, appearance);
    },
    [appearance, update]
  );

  const updateAppearance = useCallback(
    (patch: Partial<QRAppearance>) => {
      setAppearance((prev) => {
        const next = { ...prev, ...patch };
        update(type, formData, next);
        return next;
      });
    },
    [type, formData, update]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return {
    type,
    formData,
    appearance,
    svgString,
    errors,
    warnings,
    isValid,
    isEmpty,
    updateFormData,
    updateType,
    updateAppearance,
  };
}

function applyModuleStyle(svg: string, style: string): string {
  if (style === 'square') return svg;

  if (style === 'dot') {
    return svg.replace(
      /<rect x="(\d+(?:\.\d+)?)" y="(\d+(?:\.\d+)?)" width="(\d+(?:\.\d+)?)" height="(\d+(?:\.\d+)?)" fill="([^"]+)"\/>/g,
      (_match, x, y, w, h, fill) => {
        const cx = Number(x) + Number(w) / 2;
        const cy = Number(y) + Number(h) / 2;
        const r = (Math.min(Number(w), Number(h)) / 2) * 0.9;
        return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`;
      }
    );
  }

  if (style === 'rounded') {
    // Add rx to all filled rects (data modules) but not the background
    return svg.replace(
      /<rect x="(\d+(?:\.\d+)?)" y="(\d+(?:\.\d+)?)" width="(\d+(?:\.\d+)?)" height="(\d+(?:\.\d+)?)" fill="([^"]+)"\/>/g,
      (_match, x, y, w, h, fill) => {
        const numW = Number(w);
        const numH = Number(h);
        // Skip large background rects
        if (numW > 10 || numH > 10) return _match;
        const r = Math.min(numW, numH) * 0.3;
        return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="${fill}"/>`;
      }
    );
  }

  return svg;
}

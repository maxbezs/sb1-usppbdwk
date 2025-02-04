import React, { useEffect, useState, useRef } from 'react';
import { SaveIndicator } from './SaveIndicator';
import { useProfileStore } from '../store/profileStore';

interface AutosaveInputProps {
  type?: 'text' | 'textarea';
  value: string;
  field: string;
  placeholder?: string;
  maxLength?: number;
  className?: string;
  rows?: number;
  onChange?: (value: string) => void;
  onPlaceholderClick?: () => void;
}

export function AutosaveInput({
  type = 'text',
  value,
  field,
  placeholder,
  maxLength,
  className = '',
  rows = 3,
  onChange,
  onPlaceholderClick
}: AutosaveInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const { updateField, saveStates } = useProfileStore();
  const saveTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    if (onChange) {
      onChange(newValue);
    } else {
      saveTimeout.current = setTimeout(() => {
        updateField(field, newValue);
      }, 500);
    }
  };

  const handlePlaceholderClick = (e: React.MouseEvent) => {
    if (onPlaceholderClick && !localValue) {
      onPlaceholderClick();
    }
  };

  const saveState = saveStates[field];

  const inputProps = {
    value: localValue,
    onChange: handleChange,
    placeholder,
    maxLength,
    onClick: handlePlaceholderClick,
    className: `
      relative w-full px-4 py-3 bg-white/10 rounded-xl 
      border border-white/20 text-white placeholder-white/50 
      focus:outline-none focus:border-white/30
      ${!localValue ? 'cursor-pointer' : ''}
      ${className}
    `
  };

  return (
    <div className="relative">
      {type === 'textarea' ? (
        <textarea {...inputProps} rows={rows} />
      ) : (
        <input {...inputProps} type={type} />
      )}
      
      {maxLength && (
        <div className="text-right text-sm text-white/50 mt-1">
          {localValue.length}/{maxLength}
        </div>
      )}

      {saveState && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <SaveIndicator status={saveState.status} message={saveState.message} />
        </div>
      )}
    </div>
  );
}
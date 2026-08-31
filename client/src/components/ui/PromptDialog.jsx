import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button.jsx';
import { Input, Label, FieldError } from './Input.jsx';
import { cn } from '../../lib/utils.js';

export function PromptDialog({ open, onClose, onSubmit, title, label, initialValue = '', submitLabel = 'Save', isLoading }) {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setValue(initialValue);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open, initialValue]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) onSubmit(value.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-6 shadow-lg" role="dialog" aria-modal="true">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>{label}</Label>
            <Input ref={inputRef} value={value} onChange={(e) => setValue(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
            <Button type="submit" isLoading={isLoading} disabled={!value.trim()}>{submitLabel}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

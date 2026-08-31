import { useEffect, useState } from 'react';
import { Dialog } from './Dialog.jsx';
import { Input, Label } from './Input.jsx';
import { Button } from './Button.jsx';

export function PromptDialog({
  open,
  onClose,
  onSubmit,
  title,
  label = 'Name',
  initialValue = '',
  isLoading,
  submitLabel = 'Save',
}) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (open) setValue(initialValue);
  }, [open, initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit(value.trim());
  };

  return (
    <Dialog open={open} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="prompt-dialog-input">{label}</Label>
          <Input
            id="prompt-dialog-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

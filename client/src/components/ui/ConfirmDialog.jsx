import { Dialog } from './Dialog.jsx';
import { Button } from './Button.jsx';

export function ConfirmDialog({ open, onClose, onConfirm, title, description, isLoading, confirmLabel = 'Confirm' }) {
  return (
    <Dialog open={open} onClose={onClose} title={title}>
      <div className="text-sm text-muted-foreground mb-5">{description}</div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onConfirm} isLoading={isLoading}>
          {confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
}

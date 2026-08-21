import { useEffect, useState } from 'react';
import { Dialog } from '../ui/Dialog.jsx';
import { Input, Label, FieldError } from '../ui/Input.jsx';
import { Textarea, Select } from '../ui/Select.jsx';
import { Button } from '../ui/Button.jsx';

const CAPABILITY_OPTIONS = [
  { value: 'text-to-video', label: 'Text to Video' },
  { value: 'image-to-video', label: 'Image to Video' },
  { value: 'text-image-to-video', label: 'Text + Image' },
];

const EMPTY_FORM = {
  name: '',
  modelId: '',
  provider: '',
  description: '',
  capabilities: [],
  supportedResolutions: '',
  supportedDurationsSeconds: '',
  vramRequirementGB: '0',
  license: '',
  commercialUseAllowed: false,
  adapterKey: '',
};

/**
 * Shared by both "create model" and "edit model" — array fields
 * (resolutions, durations) are edited as comma-separated text rather than
 * a custom multi-value input widget; parsed into real arrays on submit.
 * Server-side Zod validation (admin.validator.js) is the actual authority
 * on shape correctness — this form's job is just collecting the input.
 */
export function ModelFormDialog({ open, onClose, onSubmit, model, availableAdapters, isLoading, error }) {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (!open) return;
    if (model) {
      setForm({
        name: model.name,
        modelId: model.modelId,
        provider: model.provider ?? '',
        description: model.description ?? '',
        capabilities: model.capabilities ?? [],
        supportedResolutions: (model.supportedResolutions ?? []).join(', '),
        supportedDurationsSeconds: (model.supportedDurationsSeconds ?? []).join(', '),
        vramRequirementGB: String(model.vramRequirementGB ?? 0),
        license: model.license ?? '',
        commercialUseAllowed: !!model.commercialUseAllowed,
        adapterKey: model.adapterKey ?? '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [open, model]);

  const toggleCapability = (value) => {
    setForm((f) => ({
      ...f,
      capabilities: f.capabilities.includes(value)
        ? f.capabilities.filter((c) => c !== value)
        : [...f.capabilities, value],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      provider: form.provider.trim(),
      description: form.description.trim(),
      capabilities: form.capabilities,
      supportedResolutions: form.supportedResolutions
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      supportedDurationsSeconds: form.supportedDurationsSeconds
        .split(',')
        .map((s) => Number(s.trim()))
        .filter((n) => !Number.isNaN(n) && n > 0),
      vramRequirementGB: Number(form.vramRequirementGB) || 0,
      license: form.license.trim(),
      commercialUseAllowed: form.commercialUseAllowed,
      adapterKey: form.adapterKey.trim(),
    };
    if (!model) payload.modelId = form.modelId.trim();
    onSubmit(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} title={model ? 'Edit model' : 'New model'} className="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="modelId">Model ID (slug)</Label>
            <Input
              id="modelId"
              value={form.modelId}
              onChange={(e) => setForm({ ...form, modelId: e.target.value })}
              disabled={!!model}
              placeholder="my-model-v1"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="provider">Provider</Label>
          <Input id="provider" value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <Label>Capabilities</Label>
          <div className="flex flex-wrap gap-3">
            {CAPABILITY_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-1.5 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={form.capabilities.includes(opt.value)}
                  onChange={() => toggleCapability(opt.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="supportedResolutions">Resolutions (comma-separated)</Label>
            <Input
              id="supportedResolutions"
              value={form.supportedResolutions}
              onChange={(e) => setForm({ ...form, supportedResolutions: e.target.value })}
              placeholder="1280x720, 854x480"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="supportedDurationsSeconds">Durations in seconds (comma-separated)</Label>
            <Input
              id="supportedDurationsSeconds"
              value={form.supportedDurationsSeconds}
              onChange={(e) => setForm({ ...form, supportedDurationsSeconds: e.target.value })}
              placeholder="2, 3, 5"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="vramRequirementGB">VRAM required (GB)</Label>
            <Input
              id="vramRequirementGB"
              type="number"
              min="0"
              value={form.vramRequirementGB}
              onChange={(e) => setForm({ ...form, vramRequirementGB: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="adapterKey">Adapter key</Label>
            <Select
              id="adapterKey"
              value={form.adapterKey}
              onChange={(e) => setForm({ ...form, adapterKey: e.target.value })}
            >
              <option value="">Select…</option>
              {availableAdapters?.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
              {form.adapterKey && !availableAdapters?.includes(form.adapterKey) && (
                <option value={form.adapterKey}>{form.adapterKey} (not currently registered)</option>
              )}
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="license">License</Label>
          <Input id="license" value={form.license} onChange={(e) => setForm({ ...form, license: e.target.value })} />
        </div>

        <label className="flex items-center gap-1.5 text-sm text-foreground">
          <input
            type="checkbox"
            checked={form.commercialUseAllowed}
            onChange={(e) => setForm({ ...form, commercialUseAllowed: e.target.checked })}
          />
          Commercial use allowed (verify the license before enabling this)
        </label>

        <FieldError message={error} />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {model ? 'Save changes' : 'Create model'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

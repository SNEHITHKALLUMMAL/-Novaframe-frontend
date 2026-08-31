import { useState } from 'react';
import { Type, ImageIcon, Wand2 } from 'lucide-react';
import { cn } from '../lib/utils.js';
import { TextToVideoForm } from '../components/generation/TextToVideoForm.jsx';
import { ImageToVideoForm } from '../components/generation/ImageToVideoForm.jsx';
import { TextImageToVideoForm } from '../components/generation/TextImageToVideoForm.jsx';
import { JobStatusPanel } from '../components/generation/JobStatusPanel.jsx';

const MODES = [
  { id: 'text-to-video', label: 'Text to Video', icon: Type },
  { id: 'image-to-video', label: 'Image to Video', icon: ImageIcon },
  { id: 'text-image-to-video', label: 'Text + Image', icon: Wand2 },
];

export default function GeneratePage() {
  const [mode, setMode] = useState('text-to-video');
  const [activeJobId, setActiveJobId] = useState(null);

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setActiveJobId(null);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Generate</h1>
        <p className="text-muted-foreground">Describe what you want to see, and pick a model.</p>
      </div>

      <div className="inline-flex rounded-md border border-border bg-secondary p-1">
        {MODES.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => switchMode(id)}
            className={cn(
              'flex items-center gap-2 rounded-sm px-3 py-1.5 text-sm font-medium transition-colors',
              mode === id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {mode === 'text-to-video' && <TextToVideoForm onJobCreated={setActiveJobId} />}
      {mode === 'image-to-video' && <ImageToVideoForm onJobCreated={setActiveJobId} />}
      {mode === 'text-image-to-video' && <TextImageToVideoForm onJobCreated={setActiveJobId} />}

      <JobStatusPanel jobId={activeJobId} onReset={() => setActiveJobId(null)} />
    </div>
  );
}

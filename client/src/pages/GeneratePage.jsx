import { useState } from 'react';
import { Type, ImageIcon, Wand2, Sparkles, Info } from 'lucide-react';
import { cn } from '../lib/utils.js';
import { TextToVideoForm } from '../components/generation/TextToVideoForm.jsx';
import { ImageToVideoForm } from '../components/generation/ImageToVideoForm.jsx';
import { TextImageToVideoForm } from '../components/generation/TextImageToVideoForm.jsx';
import { JobStatusPanel } from '../components/generation/JobStatusPanel.jsx';

const MODES = [
  {
    id: 'text-to-video',
    label: 'Text to Video',
    icon: Type,
    description: 'Describe your scene in words',
    color: 'text-primary',
    activeBg: 'bg-primary/10',
    activeBorder: 'border-primary/30',
  },
  {
    id: 'image-to-video',
    label: 'Image to Video',
    icon: ImageIcon,
    description: 'Animate a static image',
    color: 'text-accent',
    activeBg: 'bg-accent/10',
    activeBorder: 'border-accent/30',
  },
  {
    id: 'text-image-to-video',
    label: 'Text + Image',
    icon: Wand2,
    description: 'Combine prompt with image',
    color: 'text-highlight',
    activeBg: 'bg-highlight/10',
    activeBorder: 'border-highlight/30',
  },
];

export default function GeneratePage() {
  const [mode, setMode] = useState('text-to-video');
  const [activeJobId, setActiveJobId] = useState(null);

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setActiveJobId(null);
  };

  const activeMode = MODES.find((m) => m.id === mode);

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          Create Video
        </h1>
        <p className="text-muted-foreground mt-1">
          Choose a generation mode and describe what you want to create.
        </p>
      </div>

      {/* Mode selector — card-style buttons */}
      <div className="grid grid-cols-3 gap-2">
        {MODES.map(({ id, label, icon: Icon, description, color, activeBg, activeBorder }) => (
          <button
            key={id}
            type="button"
            onClick={() => switchMode(id)}
            className={cn(
              'flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all duration-150',
              mode === id
                ? `${activeBg} ${activeBorder} border shadow-sm`
                : 'border-border bg-card hover:bg-secondary/50 hover:border-border'
            )}
          >
            <Icon className={cn('h-5 w-5', mode === id ? color : 'text-muted-foreground')} />
            <span className={cn('text-xs font-medium', mode === id ? 'text-foreground' : 'text-muted-foreground')}>
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* Mode description */}
      {activeMode && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/30 rounded-lg px-3 py-2">
          <Info className="h-3.5 w-3.5 shrink-0" />
          <span>{activeMode.description}</span>
        </div>
      )}

      {/* Generation form */}
      <div className="rounded-xl border border-border bg-card p-5">
        {mode === 'text-to-video' && <TextToVideoForm onJobCreated={setActiveJobId} />}
        {mode === 'image-to-video' && <ImageToVideoForm onJobCreated={setActiveJobId} />}
        {mode === 'text-image-to-video' && <TextImageToVideoForm onJobCreated={setActiveJobId} />}
      </div>

      <JobStatusPanel jobId={activeJobId} onReset={() => setActiveJobId(null)} />
    </div>
  );
}

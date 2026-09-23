import React from 'react';

interface SkeletonLoaderProps {
  type?: 'table' | 'cards' | 'submission' | 'upload' | 'thread';
  rows?: number;
  label?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = 'table',
  rows = 4,
  label = 'Processing request...',
}) => {
  if (type === 'submission') {
    return (
      <div className="border border-neutral-200 bg-white p-6 space-y-5 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
          <div className="h-4 w-48 bg-black rounded" />
        </div>
        <div className="space-y-3">
          <div className="h-3 w-full bg-neutral-200 rounded" />
          <div className="h-3 w-5/6 bg-neutral-100 rounded" />
          <div className="h-3 w-3/4 bg-neutral-200 rounded" />
        </div>
        {/* Accent Red progress bar */}
        <div className="pt-2">
          <div className="flex justify-between text-xs text-neutral-600 mb-1">
            <span>{label}</span>
            <span className="font-mono text-red-600">Syncing with Support Desk...</span>
          </div>
          <div className="w-full h-2 bg-neutral-100 rounded overflow-hidden relative">
            <div className="h-full bg-red-600 w-2/3 animate-[pulse_1.2s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'upload') {
    return (
      <div className="border border-neutral-200 bg-neutral-50 p-4 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            <span className="font-medium text-black">Uploading verification proof...</span>
          </div>
          <span className="font-mono text-neutral-500">78%</span>
        </div>
        <div className="w-full h-1.5 bg-neutral-200 rounded overflow-hidden">
          <div className="h-full bg-red-600 w-3/4 transition-all duration-300" />
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
          <span>misprinted_tour_hoodie.jpg</span>
          <span>·</span>
          <span>2.4 MB</span>
        </div>
      </div>
    );
  }

  if (type === 'thread') {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="flex gap-3 items-start">
          <div className="w-9 h-9 rounded bg-neutral-200 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-4 w-28 bg-black rounded" />
              <div className="h-3 w-16 bg-neutral-200 rounded" />
            </div>
            <div className="h-16 bg-neutral-100 rounded border border-neutral-200 w-full" />
          </div>
        </div>
        <div className="flex gap-3 items-start justify-end">
          <div className="w-3/4 space-y-2">
            <div className="h-3 w-20 bg-neutral-200 rounded ml-auto" />
            <div className="h-14 bg-red-50/50 border border-red-100 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Default 'table'
  return (
    <div className="border border-neutral-200 bg-white divide-y divide-neutral-100 overflow-hidden">
      <div className="bg-neutral-50 px-4 py-3 flex items-center justify-between border-b border-neutral-200">
        <div className="h-4 w-32 bg-black rounded" />
        <div className="h-3 w-20 bg-red-600/30 rounded" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-600/60" />
            <div className="h-4 w-20 bg-black/80 rounded font-mono" />
          </div>
          <div className="flex-1 max-w-md space-y-1.5">
            <div className="h-4 w-3/4 bg-neutral-300 rounded" />
            <div className="h-3 w-1/2 bg-neutral-200 rounded" />
          </div>
          <div className="hidden sm:block h-4 w-28 bg-neutral-200 rounded" />
          <div className="h-6 w-24 bg-neutral-100 border border-neutral-200 rounded" />
        </div>
      ))}
    </div>
  );
};

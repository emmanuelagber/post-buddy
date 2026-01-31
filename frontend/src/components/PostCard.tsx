import React, { useState } from 'react';
import { Copy, Check, Sparkles } from 'lucide-react';

interface PostCardProps {
  platform: 'x' | 'linkedin' | 'facebook';
  content: string | null;
  isLoading: boolean;
}

const platformConfig = {
  x: {
    name: 'X (Twitter)',
    icon: '𝕏',
    color: 'from-slate-900 to-slate-700',
    accentColor: 'bg-slate-800',
    textColor: 'text-slate-100',
  },
  linkedin: {
    name: 'LinkedIn',
    icon: 'in',
    color: 'from-blue-600 to-blue-800',
    accentColor: 'bg-blue-700',
    textColor: 'text-white',
  },
  facebook: {
    name: 'Facebook',
    icon: 'f',
    color: 'from-blue-500 to-blue-700',
    accentColor: 'bg-blue-600',
    textColor: 'text-white',
  },
};

export const PostCard: React.FC<PostCardProps> = ({ platform, content, isLoading }) => {
  const [copied, setCopied] = useState(false);
  const config = platformConfig[platform];

  const handleCopy = async () => {
    if (!content) return;

    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 shadow-xl border border-zinc-200 dark:border-zinc-800 transition-all duration-300 hover:shadow-2xl">
      {/* Platform header */}
      <div className={`bg-gradient-to-r ${config.color} px-6 py-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg ${config.accentColor} flex items-center justify-center font-bold text-lg ${config.textColor}`}>
            {config.icon}
          </div>
          <h3 className={`font-display font-semibold text-lg ${config.textColor}`}>
            {config.name}
          </h3>
        </div>
        {content && (
          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded-lg ${config.accentColor} ${config.textColor} hover:opacity-90 transition-all duration-200 flex items-center gap-2 font-medium text-sm`}
            title="Copy to clipboard"
          >
            {copied ? (
              <>
                <Check size={16} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={16} />
                Copy
              </>
            )}
          </button>
        )}
      </div>

      {/* Content area */}
      <div className="p-6 min-h-[200px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <Sparkles className="w-8 h-8 text-primary-500 animate-pulse" />
            <div className="w-full space-y-3">
              <div className="h-4 bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800 rounded animate-shimmer bg-[length:1000px_100%]"></div>
              <div className="h-4 bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800 rounded animate-shimmer bg-[length:1000px_100%]"></div>
              <div className="h-4 bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800 rounded w-3/4 animate-shimmer bg-[length:1000px_100%]"></div>
            </div>
          </div>
        ) : content ? (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p className="text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed font-body">
              {content}
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-400 dark:text-zinc-600">
            <p className="text-center font-body">
              Not available for this topic
            </p>
          </div>
        )}
      </div>

      {/* Character count for X */}
      {platform === 'x' && content && !isLoading && (
        <div className="px-6 pb-4">
          <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            {content.length} / 280 characters
          </div>
        </div>
      )}
    </div>
  );
};

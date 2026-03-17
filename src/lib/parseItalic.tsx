import React from 'react';

/**
 * Parse text with *asterisk* markers into italic spans.
 * E.g. "Science & *Soul*" → ["Science & ", <span class="italic">Soul</span>]
 */
export function parseItalic(text: string): React.ReactNode {
  if (!text || !text.includes('*')) return text;
  return text.split('*').map((part, i) =>
    i % 2 === 1 ? <span key={i} className="italic">{part}</span> : part
  );
}

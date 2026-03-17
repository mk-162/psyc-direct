'use client';

import { useEffect, useState } from 'react';

interface EditButtonProps {
  collection: string;
  filename: string;
}

export const EditButton = ({ collection, filename }: EditButtonProps) => {
  const [visible, setVisible] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    const host = window.location.hostname;
    const isDev = host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.');
    const inIframe = window.self !== window.top;
    setVisible(isDev);
    setIsInIframe(inIframe);
  }, []);

  if (!visible) return null;

  // Inside Tina iframe: show "Open Live ↗" button to open page in new tab
  if (isInIframe) {
    return (
      <a
        href={window.location.href}
        target="_blank"
        rel="noopener noreferrer"
        className="edit-button edit-button--open-live"
      >
        Open Live ↗
      </a>
    );
  }

  // On live site: show "Edit" button linking to CMS
  const adminUrl = `/admin/index.html#/~/${collection}/${filename}`;

  return (
    <a href={adminUrl} className="edit-button edit-button--edit">
      Edit
    </a>
  );
};

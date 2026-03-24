'use client';

import { useSyncExternalStore } from 'react';

interface EditButtonProps {
  collection: string;
  filename: string;
}

const subscribeToLocation = () => () => {};

const getHrefSnapshot = () => window.location.href;

const getServerHrefSnapshot = () => '';

const getIsDevSnapshot = () => {
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.');
};

const getServerIsDevSnapshot = () => false;

const getIsInIframeSnapshot = () => window.self !== window.top;

const getServerIsInIframeSnapshot = () => false;

export const EditButton = ({ collection, filename }: EditButtonProps) => {
  const href = useSyncExternalStore(
    subscribeToLocation,
    getHrefSnapshot,
    getServerHrefSnapshot
  );
  const isDev = useSyncExternalStore(
    subscribeToLocation,
    getIsDevSnapshot,
    getServerIsDevSnapshot
  );
  const isInIframe = useSyncExternalStore(
    subscribeToLocation,
    getIsInIframeSnapshot,
    getServerIsInIframeSnapshot
  );

  if (!isDev) return null;

  // Inside Tina iframe: show "Open Live ↗" button to open page in new tab
  if (isInIframe) {
    return (
      <a
        href={href}
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

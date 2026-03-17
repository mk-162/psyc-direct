import fs from 'fs';
import path from 'path';
import type { NavigationData, GlobalSettings } from './types';

export type { NavItem, FooterColumn, NavigationData, GlobalSettings } from './types';

const settingsDir = path.join(process.cwd(), 'content', 'settings');

// Get navigation settings (read directly from JSON — used by layout.tsx server component)
export function getNavigation(): NavigationData {
  const navPath = path.join(settingsDir, 'navigation.json');

  if (fs.existsSync(navPath)) {
    const fileContents = fs.readFileSync(navPath, 'utf8');
    return JSON.parse(fileContents) as NavigationData;
  }

  return {
    mainNav: [],
    footerNav: [],
  };
}

// Get global settings (read directly from JSON — used by layout.tsx server component)
export function getGlobalSettings(): GlobalSettings {
  const settingsPath = path.join(settingsDir, 'global.json');

  if (fs.existsSync(settingsPath)) {
    const fileContents = fs.readFileSync(settingsPath, 'utf8');
    return JSON.parse(fileContents) as GlobalSettings;
  }

  return {
    site: {
      name: 'Cocoon Wellness',
      tagline: 'Healthcare designed for life',
    },
    social: {},
  };
}

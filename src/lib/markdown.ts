import fs from 'fs';
import path from 'path';
import type { NavigationData, GlobalSettings } from './types';

export type { NavItem, FooterColumn, NavigationData, GlobalSettings } from './types';

const settingsDir = path.join(process.cwd(), 'content', 'settings');

export function getNavigation(): NavigationData {
  const navPath = path.join(settingsDir, 'navigation.json');
  if (fs.existsSync(navPath)) {
    return JSON.parse(fs.readFileSync(navPath, 'utf8')) as NavigationData;
  }
  return { mainNav: [], footerNav: [] };
}

export function getGlobalSettings(): GlobalSettings {
  const settingsPath = path.join(settingsDir, 'global.json');
  if (fs.existsSync(settingsPath)) {
    return JSON.parse(fs.readFileSync(settingsPath, 'utf8')) as GlobalSettings;
  }
  return {
    site: {
      name: 'Psychology Direct',
      tagline: 'Expert Witness & Educational Psychologists',
      phone: '01306 879 975',
      email: 'enquiries@psychologydirect.co.uk',
      canonicalDomain: 'https://www.psychologydirect.co.uk',
    },
    social: {
      linkedin: 'https://www.linkedin.com/company/psychology-direct/',
    },
  };
}

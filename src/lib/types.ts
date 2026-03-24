export interface NavItem {
  label: string;
  url: string;
  children?: NavItem[];
}

export interface FooterColumn {
  title: string;
  links: { label: string; url: string }[];
}

export interface NavigationData {
  mainNav: NavItem[];
  footerNav: FooterColumn[];
  footerLegal?: { label: string; url: string }[];
}

export interface GlobalSettings {
  site?: {
    name?: string;
    tagline?: string;
    logo?: string;
    phone?: string;
    email?: string;
    canonicalDomain?: string;
  };
  social?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

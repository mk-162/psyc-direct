import { Metadata } from 'next';
import { ToolsIndex } from '@/components/ToolsIndex';
import { SITE_URL } from '@/lib/tina-page-helpers';

export const metadata: Metadata = {
  title: 'Free Tools for Legal & Clinical Professionals | Psychology Direct',
  description: 'Free tools to help solicitors, HR teams, and schools navigate expert psychological assessment. Case assessment, fee calculator, expert type selector, and more.',
  alternates: { canonical: `${SITE_URL}/tools/` },
};

export default function ToolsPage() {
  return <ToolsIndex />;
}

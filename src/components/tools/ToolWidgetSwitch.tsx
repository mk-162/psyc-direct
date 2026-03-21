'use client';

import { FeeCalculator } from './FeeCalculator';
import { PsychOrPsychiatrist } from './PsychOrPsychiatrist';
import { SuitabilityChecker } from './SuitabilityChecker';
import { ContactForm } from './ContactForm';

/**
 * Maps the CMS page slug to the corresponding interactive tool widget.
 * Rendered below the TinaCMS editorial blocks on each /tools/[slug]/ page.
 */

const TOOL_MAP: Record<string, React.ComponentType> = {
  'fee-calculator': FeeCalculator,
  'fee-estimator': FeeCalculator,
  'psychologist-or-psychiatrist': PsychOrPsychiatrist,
  'psych-or-psychiatrist': PsychOrPsychiatrist,
  'suitability-checker': SuitabilityChecker,
  'do-you-need-an-expert': SuitabilityChecker,
  'contact': ContactForm,
  'contact-form': ContactForm,
  'contact-us': ContactForm,
};

export function ToolWidgetSwitch({ slug }: { slug: string }) {
  const Widget = TOOL_MAP[slug];
  if (!Widget) return null;
  return <Widget />;
}

import React from 'react';
import { Hero } from './Hero';
import { TrustBar } from './TrustBar';
import { StatsBar } from './StatsBar';
import { ServiceCards } from './ServiceCards';
import { PracticeAreaCards } from './PracticeAreaCards';
import { ProcessSteps } from './ProcessSteps';
import { TestimonialCarousel } from './TestimonialCarousel';
import { TabbedContent } from './TabbedContent';
import { FaqAccordion } from './FaqAccordion';
import { CtaBanner } from './CtaBanner';
import { CtaInline } from './CtaInline';
import { FeatureComparison } from './FeatureComparison';
import { CaseStudyCards } from './CaseStudyCards';
import { TeamGrid } from './TeamGrid';
import { VideoSection } from './VideoSection';
import { AlertBanner } from './AlertBanner';
import { RichText } from './RichText';

const blockLabels: Record<string, string> = {
  Hero: 'Hero Section',
  TrustBar: 'Trust Bar',
  StatsBar: 'Stats Bar',
  ServiceCards: 'Service Cards',
  PracticeAreaCards: 'Practice Area Cards',
  ProcessSteps: 'Process Steps',
  TestimonialCarousel: 'Testimonial Carousel',
  TabbedContent: 'Tabbed Content',
  FaqAccordion: 'FAQ Accordion',
  CtaBanner: 'CTA Banner',
  CtaInline: 'CTA Inline',
  FeatureComparison: 'Feature Comparison',
  CaseStudyCards: 'Case Study Cards',
  TeamGrid: 'Team Grid',
  VideoSection: 'Video Section',
  AlertBanner: 'Alert Banner',
  RichText: 'Rich Text',
};

interface BlockProps {
  __typename: string;
  [key: string]: any;
}

const BlockWrapper = ({
  label,
  index,
  cmsPath,
  isEditing,
  children,
}: {
  label: string;
  index: number;
  cmsPath?: string;
  isEditing?: boolean;
  children: React.ReactNode;
}) => {
  const editUrl = cmsPath ? `/admin/index.html#/~/${cmsPath}` : null;
  return (
    <div className="block-wrapper" data-block-index={index} data-block-type={label}>
      {isEditing && (editUrl ? (
        <a href={editUrl} className="block-label block-label-link" title={`Edit ${label} in CMS`}>
          {label}
        </a>
      ) : (
        <div className="block-label">{label}</div>
      ))}
      {children}
    </div>
  );
};

export const PremiumPageRenderer = ({
  blocks,
  cmsPath,
  isEditing,
}: {
  blocks: BlockProps[] | null | undefined;
  cmsPath?: string;
  isEditing?: boolean;
}) => {
  if (!blocks || blocks.length === 0) return null;

  return (
    <>
      {blocks.map((block, index) => {
        // TinaCMS generates __typename like "PagesBlocksHero" → extract "Hero"
        const templateName = block.__typename?.split('Blocks')[1];
        const label = blockLabels[templateName || ''] || templateName || 'Unknown';

        let component: React.ReactNode = null;

        switch (templateName) {
          case 'Hero':             component = <Hero data={block as any} />; break;
          case 'TrustBar':         component = <TrustBar data={block as any} />; break;
          case 'StatsBar':         component = <StatsBar data={block as any} />; break;
          case 'ServiceCards':     component = <ServiceCards data={block as any} />; break;
          case 'PracticeAreaCards': component = <PracticeAreaCards data={block as any} />; break;
          case 'ProcessSteps':     component = <ProcessSteps data={block as any} />; break;
          case 'TestimonialCarousel': component = <TestimonialCarousel data={block as any} />; break;
          case 'TabbedContent':    component = <TabbedContent data={block as any} />; break;
          case 'FaqAccordion':     component = <FaqAccordion data={block as any} />; break;
          case 'CtaBanner':        component = <CtaBanner data={block as any} />; break;
          case 'CtaInline':        component = <CtaInline data={block as any} />; break;
          case 'FeatureComparison': component = <FeatureComparison data={block as any} />; break;
          case 'CaseStudyCards':   component = <CaseStudyCards data={block as any} />; break;
          case 'TeamGrid':         component = <TeamGrid data={block as any} />; break;
          case 'VideoSection':     component = <VideoSection data={block as any} />; break;
          case 'AlertBanner':      component = <AlertBanner data={block as any} />; break;
          case 'RichText':         component = <RichText data={block as any} />; break;
          default:
            console.warn(`Block not mapped in PremiumPageRenderer: ${block.__typename}`);
            return null;
        }

        return (
          <BlockWrapper key={index} label={label} index={index} cmsPath={cmsPath} isEditing={isEditing}>
            {component}
          </BlockWrapper>
        );
      })}
    </>
  );
};

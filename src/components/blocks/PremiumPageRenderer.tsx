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
import { ImageFeature } from './ImageFeature';

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
  ImageFeature: 'Image Feature',
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

  function getTemplateName(block: BlockProps) {
    return block.__typename?.split('Blocks')[1];
  }

  function renderBlock(block: BlockProps) {
    const templateName = getTemplateName(block);
    switch (templateName) {
      case 'Hero':             return <Hero data={block as any} />;
      case 'TrustBar':         return <TrustBar data={block as any} />;
      case 'StatsBar':         return <StatsBar data={block as any} />;
      case 'ServiceCards':     return <ServiceCards data={block as any} />;
      case 'PracticeAreaCards': return <PracticeAreaCards data={block as any} />;
      case 'ProcessSteps':     return <ProcessSteps data={block as any} />;
      case 'TestimonialCarousel': return <TestimonialCarousel data={block as any} />;
      case 'TabbedContent':    return <TabbedContent data={block as any} />;
      case 'FaqAccordion':     return <FaqAccordion data={block as any} />;
      case 'CtaBanner':        return <CtaBanner data={block as any} />;
      case 'CtaInline':        return <CtaInline data={block as any} />;
      case 'FeatureComparison': return <FeatureComparison data={block as any} />;
      case 'CaseStudyCards':   return <CaseStudyCards data={block as any} />;
      case 'TeamGrid':         return <TeamGrid data={block as any} />;
      case 'VideoSection':     return <VideoSection data={block as any} />;
      case 'AlertBanner':      return <AlertBanner data={block as any} />;
      case 'RichText':         return <RichText data={block as any} />;
      case 'ImageFeature':     return <ImageFeature data={block as any} />;
      default:
        console.warn(`Block not mapped in PremiumPageRenderer: ${block.__typename}`);
        return null;
    }
  }

  // Group consecutive CtaInline blocks so they render side-by-side
  const elements: React.ReactNode[] = [];
  let i = 0;
  while (i < blocks.length) {
    const block = blocks[i];
    const templateName = getTemplateName(block);

    // Detect a run of consecutive CtaInline blocks
    if (templateName === 'CtaInline') {
      const group: { block: BlockProps; index: number }[] = [];
      while (i < blocks.length && getTemplateName(blocks[i]) === 'CtaInline') {
        group.push({ block: blocks[i], index: i });
        i++;
      }
      if (group.length > 1) {
        elements.push(
          <section key={`cta-group-${group[0].index}`} className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-background">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              {group.map(({ block: b, index: idx }) => {
                const label = blockLabels['CtaInline'] || 'CTA Inline';
                return (
                  <BlockWrapper key={idx} label={label} index={idx} cmsPath={cmsPath} isEditing={isEditing}>
                    <CtaInline data={b as any} compact />
                  </BlockWrapper>
                );
              })}
            </div>
          </section>
        );
      } else {
        const { block: b, index: idx } = group[0];
        const label = blockLabels['CtaInline'] || 'CTA Inline';
        elements.push(
          <BlockWrapper key={idx} label={label} index={idx} cmsPath={cmsPath} isEditing={isEditing}>
            {renderBlock(b)}
          </BlockWrapper>
        );
      }
      continue;
    }

    const label = blockLabels[templateName || ''] || templateName || 'Unknown';
    elements.push(
      <BlockWrapper key={i} label={label} index={i} cmsPath={cmsPath} isEditing={isEditing}>
        {renderBlock(block)}
      </BlockWrapper>
    );
    i++;
  }

  return <>{elements}</>;
};

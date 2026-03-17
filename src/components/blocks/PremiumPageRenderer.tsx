import React from 'react';
import { Hero } from './Hero';
import { HeroImmersive } from './HeroImmersive';
import { FeatureGrid } from './FeatureGrid';
import { ContentWithMedia } from './ContentWithMedia';
import { EditorialGrid } from './EditorialGrid';
import { EditorialMosaic } from './EditorialMosaic';
import { SectionIntro } from './SectionIntro';
import { ProductStats } from './ProductStats';
import { CardsPortrait } from './CardsPortrait';
import { FullWidthImage } from './FullWidthImage';
import { AsymmetricSplit } from './AsymmetricSplit';
import { Testimonial } from './Testimonial';
import { PersonaCards } from './PersonaCards';
import { Timeline } from './Timeline';
import { FaqAccordion } from './FaqAccordion';
import { IncludedGrid } from './IncludedGrid';
import { DarkCta } from './DarkCta';
import { SignatureFooter } from './SignatureFooter';
import { RichText } from './RichText';
import { HubHero } from './HubHero';
import { CategoryShowcase } from './CategoryShowcase';
import { LinkDirectory } from './LinkDirectory';
import { FeaturedLinks } from './FeaturedLinks';
import { ContactForm } from './ContactForm';
import { ProcessSteps } from './ProcessSteps';
import { ProductBuyButton } from './ProductBuyButton';
import { BookingForm } from './BookingForm';
import { IntroGallery } from './IntroGallery';
import { ProductGrid } from './ProductCard';
import { ServiceSelectBar } from './ServiceSelectBar';
import { DataTable } from './DataTable';

// Human-friendly labels for block types
const blockLabels: Record<string, string> = {
  Hero: 'Hero',
  HeroImmersive: 'Hero (Immersive)',
  FeatureGrid: 'Feature Grid',
  ContentWithMedia: 'Content + Media',
  EditorialGrid: 'Editorial Grid',
  EditorialMosaic: 'Editorial Mosaic',
  SectionIntro: 'Section Intro',
  ProductStats: 'Stats',
  CardsPortrait: 'Portrait Cards',
  FullWidthImage: 'Full Width Image',
  AsymmetricSplit: 'Asymmetric Split',
  Testimonial: 'Testimonial',
  PersonaCards: 'Persona Cards',
  Timeline: 'Timeline',
  FaqAccordion: 'FAQ',
  IncludedGrid: 'Included Grid',
  DarkCta: 'CTA (Dark)',
  SignatureFooter: 'Signature Footer',
  RichText: 'Rich Text',
  HubHero: 'Hub Hero',
  CategoryShowcase: 'Category Showcase',
  LinkDirectory: 'Link Directory',
  FeaturedLinks: 'Featured Links',
  ContactForm: 'Contact Form',
  ProcessSteps: 'Process Steps',
  ProductBuyButton: 'Buy Button',
  BookingForm: 'Booking Form',
  IntroGallery: 'Intro Gallery',
  ProductGrid: 'Product Grid',
  ServiceSelectBar: 'Service Select Bar',
  DataTable: 'Data Table',
};

interface BlockProps {
  __typename: string;
  [key: string]: any;
}

const BlockWrapper = ({ label, index, cmsPath, isEditing, children }: { label: string; index: number; cmsPath?: string; isEditing?: boolean; children: React.ReactNode }) => {
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

export const PremiumPageRenderer = ({ blocks, cmsPath, isEditing }: { blocks: BlockProps[] | null | undefined; cmsPath?: string; isEditing?: boolean }) => {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <>
      {blocks.map((block, index) => {
        const templateName = block.__typename?.split('Blocks')[1];
        const label = blockLabels[templateName || ''] || templateName || 'Unknown';

        let component: React.ReactNode = null;

        switch (templateName) {
          case 'Hero':
            component = <Hero data={block as any} />; break;
          case 'HeroImmersive':
            component = <HeroImmersive data={block as any} />; break;
          case 'FeatureGrid':
            component = <FeatureGrid data={block as any} />; break;
          case 'ContentWithMedia':
            component = <ContentWithMedia data={block as any} />; break;
          case 'EditorialGrid':
            component = <EditorialGrid data={block as any} />; break;
          case 'EditorialMosaic':
            component = <EditorialMosaic data={block as any} />; break;
          case 'SectionIntro':
            component = <SectionIntro data={block as any} />; break;
          case 'ProductStats':
            component = <ProductStats data={block as any} />; break;
          case 'CardsPortrait':
            component = <CardsPortrait data={block as any} />; break;
          case 'FullWidthImage':
            component = <FullWidthImage data={block as any} />; break;
          case 'AsymmetricSplit':
            component = <AsymmetricSplit data={block as any} />; break;
          case 'Testimonial':
            component = <Testimonial data={block as any} />; break;
          case 'PersonaCards':
            component = <PersonaCards data={block as any} />; break;
          case 'Timeline':
            component = <Timeline data={block as any} />; break;
          case 'FaqAccordion':
            component = <FaqAccordion data={block as any} />; break;
          case 'IncludedGrid':
            component = <IncludedGrid data={block as any} />; break;
          case 'DarkCta':
            component = <DarkCta data={block as any} />; break;
          case 'SignatureFooter':
            component = <SignatureFooter data={block as any} />; break;
          case 'RichText':
            component = <RichText data={block as any} />; break;
          case 'HubHero':
            component = <HubHero data={block as any} />; break;
          case 'CategoryShowcase':
            component = <CategoryShowcase data={block as any} />; break;
          case 'LinkDirectory':
            component = <LinkDirectory data={block as any} />; break;
          case 'FeaturedLinks':
            component = <FeaturedLinks data={block as any} />; break;
          case 'ContactForm':
            component = <ContactForm data={block as any} />; break;
          case 'ProcessSteps':
            component = <ProcessSteps data={block as any} />; break;
          case 'ProductBuyButton':
            component = <ProductBuyButton data={block as any} />; break;
          case 'BookingForm':
            component = <BookingForm data={block as any} />; break;
          case 'IntroGallery':
            component = <IntroGallery data={block as any} />; break;
          case 'ProductGrid':
            component = <ProductGrid data={block as any} />; break;
          case 'ServiceSelectBar':
            component = <ServiceSelectBar slug={(block as any).slug || ''} />; break;
          case 'DataTable':
            component = <DataTable data={block as any} />; break;
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
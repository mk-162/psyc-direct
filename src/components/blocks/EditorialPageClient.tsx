'use client';

import { useState, useEffect, useRef } from 'react';
import { useTina } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { PremiumPageRenderer } from './PremiumPageRenderer';
import { EditButton } from '../EditButton';

interface EditorialPageClientProps {
  query: string;
  variables: {
    relativePath: string;
  };
  data: any;
  collection?: string;
}

/** Inner component that uses useTina — only mounted inside the CMS iframe */
const TinaLiveEditor = (props: EditorialPageClientProps & { render: (data: any, isEditing: boolean) => React.ReactNode }) => {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });
  return <>{props.render(data, true)}</>;
};

export const EditorialPageClient = (props: EditorialPageClientProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const checkedRef = useRef(false);

  useEffect(() => {
    checkedRef.current = true;
    setIsEditing(window.self !== window.top);
  }, []);

  // Build the render function used by both paths
  const renderPage = (data: any, editing: boolean) => {
    return <EditorialPageInner data={data} collection={props.collection} variables={props.variables} isEditing={editing} />;
  };

  // Inside CMS iframe: use Tina's live editing with useTina hook
  if (isEditing) {
    return <TinaLiveEditor {...props} render={renderPage} />;
  }

  // Outside iframe: render with static data (no Tina subscription, no re-renders)
  return renderPage(props.data, false);
};

const EditorialPageInner = ({ data, collection, variables, isEditing }: {
  data: any;
  collection?: string;
  variables: { relativePath: string };
  isEditing: boolean;
}) => {

  // Extract the page data from whichever collection this is
  const rootKey = Object.keys(data).find(
    (key) => data[key] && typeof data[key] === 'object' && ('blocks' in data[key] || 'body' in data[key] || 'title' in data[key])
  );
  const rootNode = rootKey ? (data as any)[rootKey] : null;

  if (!rootNode) return null;

  // Use title directly (content titles are clean display names)
  const displayTitle = rootNode.title || '';

  // Derive collection and filename for the edit button
  const collectionName = collection || rootKey || '';
  const filename = variables.relativePath.replace(/\.(md|json|mdx)$/, '');

  // If page has blocks (JSON block-based), use PremiumPageRenderer
  if (rootNode.blocks && rootNode.blocks.length > 0) {
    return (
      <div className="tina-live-preview-wrapper">
        <PremiumPageRenderer blocks={rootNode.blocks} cmsPath={`${collectionName}/${filename}`} isEditing={isEditing} />
        <EditButton collection={collectionName} filename={filename} />
      </div>
    );
  }

  // If page has body (markdown rich-text), render it
  if (rootNode.body) {
    return (
      <div className="tina-live-preview-wrapper">
        {/* Page header */}
        <section className="ds-section section-bleed section-mineral-white theme-light editorial-page-header">
          <div className="container-narrow">
            {rootNode.featured_image && rootNode.show_hero_image && (
              <div className="editorial-page-hero-image">
                <img
                  src={rootNode.featured_image}
                  alt={rootNode.title || ''}
                />
              </div>
            )}
            <h1 className="heading-display-lg">{displayTitle}</h1>
          </div>
        </section>

        {/* Markdown body */}
        <section className="ds-section editorial-page-body">
          <div className="container-narrow editorial-content">
            <TinaMarkdown content={rootNode.body} />
          </div>
        </section>
        <EditButton collection={collectionName} filename={filename} />
      </div>
    );
  }

  // Fallback — just show the title
  return (
    <div className="tina-live-preview-wrapper">
      <section className="ds-section section-bleed section-mineral-white theme-light editorial-page-fallback">
        <div className="container-narrow">
          <h1 className="heading-display-lg">{displayTitle}</h1>
        </div>
      </section>
      <EditButton collection={collectionName} filename={filename} />
    </div>
  );
};

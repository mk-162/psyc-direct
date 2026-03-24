'use client';

import { useSyncExternalStore } from 'react';
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

const subscribeToIframe = () => () => {};

const getIframeSnapshot = () => window.self !== window.top;

const getServerIframeSnapshot = () => false;

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
  const isEditing = useSyncExternalStore(
    subscribeToIframe,
    getIframeSnapshot,
    getServerIframeSnapshot
  );

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
        <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-[var(--brand-bg-tint)] border-b border-border">
          <div className="max-w-3xl mx-auto">
            {rootNode.featured_image && rootNode.show_hero_image && (
              <div className="mb-6 rounded-lg overflow-hidden">
                <img
                  src={rootNode.featured_image}
                  alt={rootNode.title || ''}
                  className="w-full object-cover"
                />
              </div>
            )}
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--brand-navy)]">{displayTitle}</h1>
          </div>
        </section>

        {/* Markdown body */}
        <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="max-w-3xl mx-auto prose prose-sm sm:prose prose-headings:text-[var(--brand-navy)] prose-a:text-[var(--brand-azure-vivid)] prose-a:no-underline hover:prose-a:underline">
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
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-[var(--brand-bg-tint)] border-b border-border">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--brand-navy)]">{displayTitle}</h1>
        </div>
      </section>
      <EditButton collection={collectionName} filename={filename} />
    </div>
  );
};

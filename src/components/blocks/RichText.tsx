import { TinaMarkdown } from 'tinacms/dist/rich-text';

interface RichTextData {
  body?: any;
}

export const RichText = ({ data }: { data: RichTextData }) => {
  if (!data.body) return null;

  return (
    <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-3xl mx-auto prose prose-sm sm:prose">
        <TinaMarkdown content={data.body} />
      </div>
    </section>
  );
};

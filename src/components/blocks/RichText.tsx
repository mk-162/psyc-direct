import { TinaMarkdown } from 'tinacms/dist/rich-text';
export const RichText = ({ data }: { data: any }) => (
  <div data-block="rich-text" className="prose max-w-none">
    {data.body && <TinaMarkdown content={data.body} />}
  </div>
);

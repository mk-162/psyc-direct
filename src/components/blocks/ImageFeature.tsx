import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ImageFeatureData {
  layout?: 'image-left' | 'image-right';
  image?: string;
  imageAlt?: string;
  heading?: string;
  body?: string;
  ctaText?: string;
  ctaLink?: string;
}

export const ImageFeature = ({ data }: { data: ImageFeatureData }) => {
  const isLeft = data.layout !== 'image-right';

  return (
    <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${isLeft ? '' : 'lg:[direction:rtl]'}`}>
          {/* Image */}
          <div className={`relative aspect-[4/3] rounded-lg overflow-hidden ${isLeft ? '' : 'lg:[direction:ltr]'}`}>
            {data.image ? (
              <Image
                src={data.image}
                alt={data.imageAlt || data.heading || ''}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full bg-[var(--brand-bg-tint)]" />
            )}
          </div>

          {/* Content */}
          <div className={`flex flex-col justify-center ${isLeft ? '' : 'lg:[direction:ltr]'}`}>
            {data.heading && (
              <h2 className="font-sans text-2xl sm:text-3xl font-bold mb-4" style={{ color: 'var(--brand-navy)' }}>
                {data.heading}
              </h2>
            )}
            {data.body && (
              <p className="text-muted-foreground text-base leading-relaxed mb-6">
                {data.body}
              </p>
            )}
            {data.ctaText && data.ctaLink && (
              <div>
                <Button asChild size="lg" style={{ background: 'var(--brand-azure-vivid)' }}>
                  <Link href={data.ctaLink}>{data.ctaText}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

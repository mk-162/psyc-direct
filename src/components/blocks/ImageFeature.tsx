'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselImage {
  image: string;
  alt?: string;
  caption?: string;
}

interface ImageFeatureData {
  layout?: 'image-left' | 'image-right';
  image?: string;
  imageAlt?: string;
  images?: CarouselImage[];
  heading?: string;
  bodyText?: string;
  ctaText?: string;
  ctaLink?: string;
}

export const ImageFeature = ({ data }: { data: ImageFeatureData }) => {
  const isLeft = data.layout !== 'image-right';
  const hasCarousel = data.images && data.images.length > 0;
  
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = useCallback(() => {
    if (!data.images) return;
    setCurrentIndex((prev) => (prev + 1) % data.images!.length);
  }, [data.images]);

  const prevImage = useCallback(() => {
    if (!data.images) return;
    setCurrentIndex((prev) => (prev === 0 ? data.images!.length - 1 : prev - 1));
  }, [data.images]);

  // Auto-scroll every 3 seconds
  useEffect(() => {
    if (hasCarousel && data.images && data.images.length > 1) {
      const timer = setInterval(() => {
        nextImage();
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [hasCarousel, data.images, nextImage]);

  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12 items-center ${isLeft ? '' : 'sm:[direction:rtl]'}`}>
          {/* Image / Carousel */}
          <div className={`flex flex-col ${isLeft ? '' : 'sm:[direction:ltr]'}`}>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden group bg-[var(--brand-bg-tint)] shadow-sm">
              {hasCarousel ? (
                <Image
                  src={data.images![currentIndex].image}
                  alt={data.images![currentIndex].alt || data.images![currentIndex].caption || data.heading || ''}
                  fill
                  className="object-cover transition-opacity duration-300"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : data.image ? (
                <Image
                  src={data.image}
                  alt={data.imageAlt || data.heading || ''}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full" />
              )}
            </div>
            
            {/* Caption and Controls underneath */}
            {hasCarousel && (
              <div className="mt-4 flex flex-col items-center">
                {data.images![currentIndex].caption && (
                  <div className="text-center mb-4">
                    {data.images![currentIndex].caption!.includes(' - ') ? (
                      <>
                        <div className="font-sans text-sm font-bold text-foreground">
                          {data.images![currentIndex].caption!.split(' - ')[0]}
                        </div>
                        <div className="text-muted-foreground text-sm">
                          {data.images![currentIndex].caption!.split(' - ')[1]}
                        </div>
                      </>
                    ) : (
                      <div className="font-sans text-sm font-bold text-foreground">
                        {data.images![currentIndex].caption}
                      </div>
                    )}
                  </div>
                )}
                {data.images!.length > 1 && (
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={prevImage}
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <div className="flex gap-2">
                      {data.images!.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentIndex(i)}
                          className="p-2"
                          aria-label={`Go to image ${i + 1}`}
                        >
                          <span
                            className="block w-2.5 h-2.5 rounded-full transition-colors"
                            style={{ background: i === currentIndex ? 'var(--brand-azure-vivid)' : 'var(--brand-azure-light)' }}
                          />
                        </button>
                      ))}
                    </div>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={nextImage}
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Content */}
          <div className={`flex flex-col justify-center ${isLeft ? '' : 'sm:[direction:ltr]'}`}>
            {data.heading && (
              <h2 className="font-sans text-2xl sm:text-3xl font-bold mb-4" style={{ color: 'var(--brand-navy)' }}>
                {data.heading}
              </h2>
            )}
            {data.bodyText && (
              <p className="text-muted-foreground text-base leading-relaxed mb-6 whitespace-pre-line">
                {data.bodyText}
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

'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';

interface VideoSectionData {
  heading?: string;
  videoUrl?: string;
  caption?: string;
  thumbnail?: string;
}

export const VideoSection = ({ data }: { data: VideoSectionData }) => {
  const [playing, setPlaying] = useState(false);

  if (!data.videoUrl && !data.heading) return null;

  const embedUrl = data.videoUrl?.includes('youtu')
    ? data.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/')
    : data.videoUrl;

  return (
    <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-[var(--brand-bg-tint)]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
            {data.heading && (
              <h2 className="font-sans text-2xl sm:text-3xl font-bold mb-4" style={{ color: 'var(--brand-navy)' }}>
                {data.heading}
              </h2>
            )}
            {data.caption && (
              <p className="text-muted-foreground text-base leading-relaxed">{data.caption}</p>
            )}
          </div>
          <div className="relative rounded-xl overflow-hidden group aspect-video bg-[var(--brand-navy)]">
            {playing && embedUrl ? (
              <iframe
                src={`${embedUrl}?autoplay=1`}
                allow="autoplay; fullscreen"
                allowFullScreen
                className="w-full h-full"
              />
            ) : (
              <>
                {data.thumbnail && (
                  <img
                    src={data.thumbnail}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                    onClick={() => setPlaying(true)}
                  />
                )}
                <div
                  className="absolute inset-0 flex items-center justify-center cursor-pointer bg-[var(--brand-navy)]/40 hover:bg-[var(--brand-navy)]/50 transition-colors"
                  onClick={() => setPlaying(true)}
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 ml-1" style={{ color: 'var(--brand-navy)' }} />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

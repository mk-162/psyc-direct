import React from 'react';

interface FullWidthImageData {
  image: string;
  alt?: string;
  height?: string;
  focalPoint?: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'face';
}

const focalPointToPosition: Record<string, string> = {
  center: 'center',
  top: 'top center',
  bottom: 'bottom center',
  left: 'center left',
  right: 'center right',
  face: 'top center', // Faces are usually in top half of photos
};

export const FullWidthImage = ({ data }: { data: FullWidthImageData }) => {
  const position = focalPointToPosition[data.focalPoint || 'center'];

  return (
    <section className="full-width-image">
      <img
        src={data.image}
        alt={data.alt || ''}
        className="image-band-img"
        style={{
          height: data.height || '50vh',
          objectFit: 'cover',
          objectPosition: position,
          width: '100%',
        }}
      />
    </section>
  );
};

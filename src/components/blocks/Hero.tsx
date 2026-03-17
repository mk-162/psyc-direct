export const Hero = ({ data }: { data: any }) => (
  <div data-block="hero">
    <h1>{data.headline}</h1>
    <p>{data.subtitle}</p>
  </div>
);

export const TrustBar = ({ data }: { data: any }) => (
  <div data-block="trust-bar">{data.items?.map((i: any) => i.text).join(' · ')}</div>
);

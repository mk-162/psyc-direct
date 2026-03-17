export const StatsBar = ({ data }: { data: any }) => (
  <div data-block="stats-bar">{data.stats?.map((s: any) => `${s.value} ${s.label}`).join(' | ')}</div>
);

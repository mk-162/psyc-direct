import Image from 'next/image';
import { Card } from '@/components/ui/card';

interface TeamGridData {
  heading?: string;
  team?: {
    name: string;
    role: string;
    bio?: string;
    photo?: string;
  }[];
}

export const TeamGrid = ({ data }: { data: TeamGridData }) => {
  const members = data.team ?? [];
  if (!members.length) return null;

  return (
    <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {data.heading && (
          <h2 className="font-sans text-2xl sm:text-3xl font-bold text-center mb-10" style={{ color: 'var(--brand-navy)' }}>
            {data.heading}
          </h2>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {members.map((member, i) => (
            <Card key={i} className="overflow-hidden bg-background group">
              <div className="relative aspect-square overflow-hidden bg-[var(--brand-bg-tint)]">
                {member.photo ? (
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-2xl sm:text-3xl font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, var(--brand-navy), var(--brand-azure-dark))' }}
                  >
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="p-3 sm:p-4 lg:p-5">
                <h3 className="font-sans text-sm sm:text-base font-bold text-foreground">{member.name}</h3>
                <p className="text-xs sm:text-sm font-medium mb-1 sm:mb-2" style={{ color: 'var(--brand-azure-vivid)' }}>{member.role}</p>
                {member.bio && (
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed hidden sm:block">{member.bio}</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

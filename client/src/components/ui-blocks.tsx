import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle2,
  Star,
  Quote,
  Mail,
  ChevronLeft,
  ChevronRight,
  Play,
  AlertCircle,
  X,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio?: string;
  specialisms?: string[];
}

export function TeamGrid({ members }: { members: TeamMember[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="team-grid">
      {members.map((member, i) => (
        <Card key={i} className="overflow-hidden bg-background group" data-testid={`card-team-${i}`}>
          <div className="aspect-[3/4] overflow-hidden">
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="p-5">
            <h3 className="font-sans text-base font-bold text-foreground">{member.name}</h3>
            <p className="text-[var(--brand-azure-vivid)] text-sm font-medium mb-2">{member.role}</p>
            {member.bio && (
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">{member.bio}</p>
            )}
            {member.specialisms && member.specialisms.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {member.specialisms.map((s, j) => (
                  <Badge key={j} variant="secondary" className="text-[10px] font-medium">{s}</Badge>
                ))}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

interface LogoCloudProps {
  heading?: string;
  logos: { name: string; src?: string }[];
}

export function LogoCloud({ heading = "Trusted by leading law firms", logos }: LogoCloudProps) {
  return (
    <div className="text-center" data-testid="logo-cloud">
      <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider mb-8" data-testid="text-logo-cloud-heading">
        {heading}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16">
        {logos.map((logo, i) => (
          <div
            key={i}
            className="flex items-center justify-center h-10 sm:h-12 opacity-40 hover:opacity-70 transition-opacity grayscale hover:grayscale-0"
            data-testid={`logo-${i}`}
          >
            {logo.src ? (
              <img src={logo.src} alt={logo.name} className="h-full w-auto object-contain" />
            ) : (
              <span className="font-serif text-lg sm:text-xl font-bold text-foreground whitespace-nowrap">{logo.name}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta?: string;
}

export function PricingTable({ tiers }: { tiers: PricingTier[] }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${Math.min(tiers.length, 3)} gap-6`} data-testid="pricing-table">
      {tiers.map((tier, i) => (
        <Card
          key={i}
          className={`p-6 sm:p-8 relative overflow-hidden flex flex-col ${
            tier.highlighted
              ? "border-[var(--brand-azure)] border-2 shadow-lg"
              : "bg-background"
          }`}
          data-testid={`card-pricing-${i}`}
        >
          {tier.highlighted && (
            <div className="absolute top-0 left-0 right-0 bg-[var(--brand-azure)] text-white text-xs font-bold text-center py-1.5 uppercase tracking-wider">
              Most Popular
            </div>
          )}
          <div className={tier.highlighted ? "mt-6" : ""}>
            <h3 className="font-sans text-lg font-bold text-foreground mb-1">{tier.name}</h3>
            <p className="text-muted-foreground text-sm mb-4">{tier.description}</p>
            <div className="mb-6">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-foreground">{tier.price}</span>
            </div>
            <ul className="space-y-2.5 mb-8 flex-1">
              {tier.features.map((f, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-[var(--brand-azure)] flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              className="w-full"
              variant={tier.highlighted ? "default" : "outline"}
              data-testid={`button-pricing-${i}`}
            >
              {tier.cta || "Get Started"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

export function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="relative" data-testid="timeline">
      <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-[var(--brand-azure-light)] dark:bg-[var(--brand-navy)] sm:-translate-x-px" />
      <div className="space-y-10 sm:space-y-12">
        {events.map((event, i) => (
          <div
            key={i}
            className={`relative flex flex-col sm:flex-row items-start gap-4 sm:gap-8 ${
              i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
            }`}
            data-testid={`timeline-event-${i}`}
          >
            <div className={`hidden sm:block w-[calc(50%-24px)] ${i % 2 === 0 ? "text-right" : "text-left"}`}>
              <div className="font-serif text-2xl font-bold text-[var(--brand-azure-vivid)] mb-1">{event.year}</div>
              <h4 className="font-sans text-base font-bold text-foreground mb-1.5">{event.title}</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">{event.description}</p>
            </div>
            <div className="absolute left-4 sm:left-1/2 w-3 h-3 bg-[var(--brand-azure)] rounded-full border-2 border-background -translate-x-1.5 sm:-translate-x-1.5 mt-1.5 z-10" />
            <div className="sm:hidden pl-10">
              <div className="font-serif text-xl font-bold text-[var(--brand-azure-vivid)] mb-1">{event.year}</div>
              <h4 className="font-sans text-base font-bold text-foreground mb-1.5">{event.title}</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">{event.description}</p>
            </div>
            <div className="hidden sm:block w-[calc(50%-24px)]" />
          </div>
        ))}
      </div>
    </div>
  );
}

interface ComparisonRow {
  feature: string;
  us: string | boolean;
  them: string | boolean;
}

export function FeatureComparison({
  rows,
  usLabel = "Psychology Direct",
  themLabel = "Other Providers",
}: {
  rows: ComparisonRow[];
  usLabel?: string;
  themLabel?: string;
}) {
  return (
    <div className="overflow-x-auto" data-testid="feature-comparison">
      <table className="w-full min-w-[500px]">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-sans text-sm font-bold text-foreground w-1/2">Feature</th>
            <th className="text-center py-3 px-4 font-sans text-sm font-bold text-[var(--brand-azure-vivid)] w-1/4">{usLabel}</th>
            <th className="text-center py-3 px-4 font-sans text-sm font-bold text-muted-foreground w-1/4">{themLabel}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b last:border-0" data-testid={`comparison-row-${i}`}>
              <td className="py-3 px-4 text-sm text-foreground">{row.feature}</td>
              <td className="py-3 px-4 text-center">
                {typeof row.us === "boolean" ? (
                  row.us ? (
                    <CheckCircle2 className="w-5 h-5 text-[var(--brand-azure)] mx-auto" />
                  ) : (
                    <X className="w-5 h-5 text-muted-foreground/40 mx-auto" />
                  )
                ) : (
                  <span className="text-sm font-semibold text-[var(--brand-azure-vivid)]">{row.us}</span>
                )}
              </td>
              <td className="py-3 px-4 text-center">
                {typeof row.them === "boolean" ? (
                  row.them ? (
                    <CheckCircle2 className="w-5 h-5 text-muted-foreground/40 mx-auto" />
                  ) : (
                    <X className="w-5 h-5 text-muted-foreground/40 mx-auto" />
                  )
                ) : (
                  <span className="text-sm text-muted-foreground">{row.them}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface VideoSectionProps {
  heading: string;
  description: string;
  thumbnailSrc: string;
  videoUrl?: string;
}

export function VideoSection({ heading, description, thumbnailSrc }: VideoSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center" data-testid="video-section">
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-4" data-testid="text-video-heading">
          {heading}
        </h2>
        <p className="text-muted-foreground text-base leading-relaxed" data-testid="text-video-desc">
          {description}
        </p>
      </div>
      <div className="relative rounded-xl overflow-hidden group cursor-pointer aspect-video" data-testid="video-thumbnail">
        <img src={thumbnailSrc} alt="Video thumbnail" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[var(--brand-navy)]/40 group-hover:bg-[var(--brand-navy)]/50 transition-colors flex items-center justify-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play className="w-7 h-7 sm:w-8 sm:h-8 text-[var(--brand-navy)] ml-1" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface NewsletterStripProps {
  heading?: string;
  description?: string;
  onSubmit?: (email: string) => void;
}

export function NewsletterStrip({
  heading = "Stay informed",
  description = "Get the latest insights on psychological evidence in legal cases delivered to your inbox.",
  onSubmit,
}: NewsletterStripProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      onSubmit?.(email);
    }
  };

  return (
    <div className="bg-[var(--brand-navy)] dark:bg-[var(--brand-navy-deep)] rounded-lg px-6 sm:px-10 py-8 sm:py-10" data-testid="newsletter-strip">
      <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
        <div className="flex-1 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
            <Mail className="w-4 h-4 text-[var(--brand-azure)]" />
            <span className="text-[var(--brand-azure)] font-sans text-xs font-bold uppercase tracking-widest">Newsletter</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-1" data-testid="text-newsletter-heading">
            {heading}
          </h3>
          <p className="text-white/70 text-sm" data-testid="text-newsletter-desc">{description}</p>
        </div>
        <div className="w-full lg:w-auto lg:flex-shrink-0">
          {submitted ? (
            <div className="flex items-center gap-2 text-[var(--brand-azure)] font-semibold text-sm justify-center" data-testid="text-newsletter-success">
              <CheckCircle2 className="w-5 h-5" />
              You're subscribed! Check your inbox.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto" data-testid="form-newsletter">
              <Input
                type="email"
                placeholder="Your work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 sm:w-64"
                required
                data-testid="input-newsletter-email"
              />
              <Button className="bg-[var(--brand-azure)] text-[var(--brand-navy)] font-semibold flex-shrink-0" data-testid="button-newsletter-subscribe">
                Subscribe
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

interface AlertBannerProps {
  message: string;
  type?: "info" | "success" | "warning";
  link?: { label: string; href: string };
  dismissible?: boolean;
}

export function AlertBanner({ message, type = "info", link, dismissible = true }: AlertBannerProps) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  const colors = {
    info: "bg-[var(--brand-navy)] text-white",
    success: "bg-emerald-600 text-white",
    warning: "bg-amber-500 text-amber-950",
  };

  return (
    <div className={`${colors[type]} px-4 py-2.5 text-center text-sm relative`} data-testid="alert-banner">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span data-testid="text-alert-message">{message}</span>
        {link && (
          <a
            href={link.href}
            className="font-semibold underline underline-offset-2 hover:no-underline inline-flex items-center gap-1"
            data-testid="link-alert"
          >
            {link.label}
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
      {dismissible && (
        <button
          onClick={() => setVisible(false)}
          className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100"
          data-testid="button-alert-dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

interface TestimonialCarouselProps {
  testimonials: {
    quote: string;
    name: string;
    role: string;
    company?: string;
    rating?: number;
  }[];
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [current, setCurrent] = useState(0);
  const t = testimonials[current];

  return (
    <div className="max-w-3xl mx-auto text-center" data-testid="testimonial-carousel">
      <Quote className="w-10 h-10 text-[var(--brand-azure)]/30 mx-auto mb-6" />
      <blockquote className="font-serif text-lg sm:text-xl lg:text-2xl text-foreground leading-relaxed mb-6" data-testid="text-testimonial-quote">
        "{t.quote}"
      </blockquote>
      {t.rating && (
        <div className="flex items-center justify-center gap-1 mb-3" data-testid="testimonial-rating">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < t.rating! ? "text-amber-400 fill-amber-400" : "text-muted-foreground/20"}`}
            />
          ))}
        </div>
      )}
      <div className="font-sans text-sm font-bold text-foreground" data-testid="text-testimonial-name">{t.name}</div>
      <div className="text-muted-foreground text-sm">
        {t.role}{t.company ? `, ${t.company}` : ""}
      </div>

      {testimonials.length > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            size="icon"
            variant="outline"
            onClick={() => setCurrent((p) => (p === 0 ? testimonials.length - 1 : p - 1))}
            data-testid="button-testimonial-prev"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i === current ? "bg-[var(--brand-azure)]" : "bg-muted"
                }`}
                data-testid={`button-testimonial-dot-${i}`}
              />
            ))}
          </div>
          <Button
            size="icon"
            variant="outline"
            onClick={() => setCurrent((p) => (p === testimonials.length - 1 ? 0 : p + 1))}
            data-testid="button-testimonial-next"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

interface MetricCardProps {
  metrics: {
    icon: LucideIcon;
    value: string;
    label: string;
    description?: string;
  }[];
}

export function MetricCards({ metrics }: MetricCardProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${Math.min(metrics.length, 4)} gap-6`} data-testid="metric-cards">
      {metrics.map((m, i) => (
        <Card key={i} className="p-6 bg-background text-center" data-testid={`card-metric-${i}`}>
          <div className="w-12 h-12 rounded-full bg-[var(--brand-bg-tint)] dark:bg-[var(--brand-dark-bg)] flex items-center justify-center mx-auto mb-4">
            <m.icon className="w-6 h-6 text-[var(--brand-azure-vivid)]" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[var(--brand-navy)] dark:text-[var(--brand-azure)] mb-1">{m.value}</div>
          <div className="font-sans text-sm font-bold text-foreground mb-1">{m.label}</div>
          {m.description && (
            <p className="text-muted-foreground text-xs leading-relaxed">{m.description}</p>
          )}
        </Card>
      ))}
    </div>
  );
}

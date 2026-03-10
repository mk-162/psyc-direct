import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowRight, Download, BookOpen, CheckCircle2 } from "lucide-react";
import { useDesignTheme } from "@/lib/theme-context";

interface CTAProps {
  onSubmit?: (email: string) => void;
}

export function CTABanner({ onSubmit }: CTAProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { designTheme } = useDesignTheme();
  const isB = designTheme === "b";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      onSubmit?.(email);
    }
  };

  return (
    <div
      className={`relative py-10 px-6 sm:px-10 lg:px-14 ${
        isB
          ? "bg-gradient-to-br from-[var(--brand-navy)] to-[var(--brand-azure-dark)] rounded-2xl"
          : "bg-[var(--brand-navy)] dark:bg-[var(--brand-navy-deep)] rounded-md"
      }`}
      data-testid="cta-banner"
    >
      {!isB && (
        <div className="absolute inset-0 rounded-md overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[var(--brand-azure-vivid)]/20 to-transparent" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--brand-azure)]/5 rounded-full -translate-x-1/2 translate-y-1/2" />
        </div>
      )}
      <div className="relative flex flex-col lg:flex-row items-center gap-8">
        <div className="hidden sm:block flex-shrink-0">
          <div className={`overflow-hidden shadow-lg ${isB ? "w-36 h-44 lg:w-40 lg:h-48 rounded-xl" : "w-32 h-40 lg:w-36 lg:h-44 rounded-md"}`}>
            <img
              src="/images/cta-guide.png"
              alt="Free guide for lawyers"
              className="w-full h-full object-cover"
              data-testid="img-cta-guide-banner"
            />
          </div>
        </div>
        <div className="flex-1 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
            <Download className={`w-4 h-4 ${isB ? "text-[var(--brand-azure)]" : "text-[var(--brand-azure)]"}`} />
            <span className="text-[var(--brand-azure)] font-sans text-xs font-bold uppercase tracking-widest">Free Guide</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-2" data-testid="text-cta-banner-title">
            The Solicitor's Guide to Instructing Psychological Experts
          </h3>
          <p className="text-white/70 text-sm leading-relaxed mb-4 max-w-lg" data-testid="text-cta-banner-desc">
            Everything lawyers need to know about finding, instructing, and working with
            psychologists and psychiatrists in medico-legal cases. Download your free copy.
          </p>
          {submitted ? (
            <div className="flex items-center justify-center lg:justify-start gap-2 text-[var(--brand-azure)] font-semibold text-sm" data-testid="text-cta-success-banner">
              <CheckCircle2 className="w-5 h-5" />
              Thank you! Check your inbox for the guide.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto lg:mx-0">
              <Input
                type="email"
                placeholder="Enter your work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                required
                data-testid="input-cta-email-banner"
              />
              <Button
                size="default"
                className={`font-semibold flex-shrink-0 ${
                  isB
                    ? "bg-[var(--brand-azure-vivid)] text-white"
                    : "bg-[var(--brand-azure)] text-[var(--brand-navy)]"
                }`}
                data-testid="button-cta-download-banner"
              >
                Download Free
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export function CTAInlineCard({ onSubmit }: CTAProps) {
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
    <Card
      className="p-6 sm:p-8 bg-[var(--brand-bg-tint)] dark:bg-[var(--brand-dark-bg)] border-none"
      data-testid="cta-inline-card"
    >
      <div className="flex flex-col sm:flex-row items-start gap-5">
        <div className="flex-shrink-0 w-12 h-12 rounded-md bg-[var(--brand-navy)] flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-[var(--brand-azure)]" />
        </div>
        <div className="flex-1">
          <h4 className="font-sans text-base font-bold text-foreground mb-1" data-testid="text-cta-inline-title">
            Free Guide: How to Instruct Psychological Experts
          </h4>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4" data-testid="text-cta-inline-desc">
            Download our comprehensive guide covering everything from choosing the right expert
            to understanding your report. Written specifically for legal professionals.
          </p>
          <ul className="space-y-1.5 mb-4">
            {["Choosing between psychologist & psychiatrist", "Part 35 compliance checklist", "Fee transparency explained"].map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--brand-azure-vivid)] flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          {submitted ? (
            <div className="flex items-center gap-2 text-[var(--brand-azure-vivid)] font-semibold text-sm" data-testid="text-cta-success-inline">
              <CheckCircle2 className="w-5 h-5" />
              Thank you! Check your inbox for the guide.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="Your work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="input-cta-email-inline"
              />
              <Button size="default" className="flex-shrink-0" data-testid="button-cta-download-inline">
                Get Free Guide
              </Button>
            </form>
          )}
        </div>
      </div>
    </Card>
  );
}

export function CTASidebar({ onSubmit }: CTAProps) {
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
    <div
      className="rounded-md overflow-hidden border border-[var(--brand-azure)]/20"
      data-testid="cta-sidebar"
    >
      <div className="bg-[var(--brand-navy)] dark:bg-[var(--brand-navy-deep)] px-5 py-4">
        <div className="flex items-center gap-2 mb-1">
          <Download className="w-4 h-4 text-[var(--brand-azure)]" />
          <span className="text-[var(--brand-azure)] font-sans text-[10px] font-bold uppercase tracking-widest">Free Download</span>
        </div>
        <h4 className="font-serif text-lg font-bold text-white leading-snug" data-testid="text-cta-sidebar-title">
          The Solicitor's Guide to Psychological Experts
        </h4>
      </div>
      <div className="w-full h-36 overflow-hidden">
        <img
          src="/images/cta-guide.png"
          alt="Free guide"
          className="w-full h-full object-cover"
          data-testid="img-cta-guide-sidebar"
        />
      </div>
      <div className="bg-background px-5 py-4">
        <p className="text-muted-foreground text-xs leading-relaxed mb-3" data-testid="text-cta-sidebar-desc">
          Your essential guide to instructing, working with, and understanding
          psychological expert witnesses.
        </p>
        <ul className="space-y-1 mb-4">
          {["Expert selection criteria", "Fixed fee breakdown", "Court-ready checklist"].map((item, i) => (
            <li key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle2 className="w-3 h-3 text-[var(--brand-azure-vivid)] flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        {submitted ? (
          <div className="flex items-center gap-2 text-[var(--brand-azure-vivid)] font-semibold text-xs" data-testid="text-cta-success-sidebar">
            <CheckCircle2 className="w-4 h-4" />
            Check your inbox!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2">
            <Input
              type="email"
              placeholder="Your work email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              data-testid="input-cta-email-sidebar"
            />
            <Button size="default" className="w-full" data-testid="button-cta-download-sidebar">
              Download Free Guide
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

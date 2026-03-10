import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Search,
  FileText,
  Users,
  ClipboardCheck,
  CheckCircle2,
  ArrowRight,
  Brain,
  Scale,
  Shield,
  HeartHandshake,
  BookOpen,
  Clock,
  Zap,
  Award,
  Heart,
  PoundSterling,
  Play,
  Building2,
  Gavel,
  TrendingUp,
  UserCheck,
  Target,
  Globe,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { CTABanner, CTAInlineCard, CTASidebar } from "@/components/cta-widgets";
import {
  TeamGrid,
  LogoCloud,
  PricingTable,
  Timeline,
  FeatureComparison,
  VideoSection,
  NewsletterStrip,
  AlertBanner,
  TestimonialCarousel,
  MetricCards,
} from "@/components/ui-blocks";

function SectionWrapper({
  id,
  title,
  description,
  bg = "default",
  children,
}: {
  id: string;
  title: string;
  description: string;
  bg?: "default" | "light" | "dark";
  children: React.ReactNode;
}) {
  const bgClass =
    bg === "light"
      ? "bg-[#f0f5ff] dark:bg-[#0d1929]"
      : bg === "dark"
        ? "bg-[#032552] dark:bg-[#021b3d]"
        : "bg-background";

  return (
    <section id={id} className={`py-16 sm:py-20 ${bgClass}`} data-testid={`section-lib-${id}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <Badge variant="outline" className="mb-3 text-xs font-mono">{id}</Badge>
          <h2 className={`font-serif text-2xl sm:text-3xl font-bold mb-2 ${bg === "dark" ? "text-white" : "text-foreground"}`}>
            {title}
          </h2>
          <p className={`text-sm sm:text-base max-w-2xl ${bg === "dark" ? "text-[#cee4f7]/80" : "text-muted-foreground"}`}>
            {description}
          </p>
        </div>
        {children}
      </div>
    </section>
  );
}

const DEMO_SERVICES = [
  { icon: Brain, title: "Psychological Assessment", description: "Comprehensive psychological assessments for personal injury, clinical negligence, and family law cases." },
  { icon: Scale, title: "Expert Witness Reports", description: "Detailed, court-ready reports prepared by experienced psychologists and psychiatrists." },
  { icon: Shield, title: "Medico-Legal Services", description: "Full range of medico-legal services including capacity assessments and fitness to plead evaluations." },
  { icon: HeartHandshake, title: "Family & Child Cases", description: "Specialist assessments for care proceedings, contact disputes, and parenting capacity." },
  { icon: BookOpen, title: "Training & CPD", description: "Professional development workshops and training for legal professionals on psychological evidence." },
  { icon: Clock, title: "Fast Turnaround", description: "Expedited report services available when you need expert psychological opinion under tight deadlines." },
];

const DEMO_PROCESS = [
  { step: "01", title: "Tell us what you need", description: "Share your case details and requirements. We'll listen carefully to understand exactly what's needed.", icon: Search },
  { step: "02", title: "We match & set up", description: "We match you with the perfect specialist from our vetted panel and handle all the arrangements.", icon: Users },
  { step: "03", title: "Report & support", description: "Receive a thorough, court-ready report. We remain available for follow-up questions and testimony.", icon: ClipboardCheck },
];

const DEMO_FAQS = [
  { question: "What are your Legal Aid rates?", answer: "We accept Legal Aid rates for eligible cases. Our pricing is fully compliant with Legal Aid Agency guidelines, and we can provide detailed cost breakdowns upfront." },
  { question: "How quickly can you provide a psychologist?", answer: "For urgent cases, we can typically provide a CV within 24 hours and arrange the first assessment within 48–72 hours, depending on location and complexity." },
  { question: "What qualifications do your psychologists have?", answer: "All psychologists in our network are HCPC registered, BPS chartered members, and hold relevant postgraduate qualifications with enhanced DBS certificates." },
];

const DEMO_TABS = [
  { id: "fast", icon: Zap, label: "Fast & Responsive", heading: "Immediate Attention When You Need It", description: "We understand that legal cases often require immediate action.", items: ["1-hour email response during business hours", "24-hour CV delivery with detailed experience", "Urgent case priority — reports in as little as 48 hours", "Out-of-hours availability for critical cases"] },
  { id: "quality", icon: Award, label: "Outstanding Quality", heading: "Highly Experienced Psychologists", description: "Quality is never compromised. Every psychologist meets the highest standards.", items: ["1,000+ vetted psychologists across all specialisations", "100% HCPC registered with current practising certificates", "BPS chartered members with extensive court experience", "Enhanced DBS certification for all associates"] },
];

const DEMO_TEAM: { name: string; role: string; image: string; bio: string; specialisms: string[] }[] = [
  { name: "Dr Sarah Mitchell", role: "Clinical Psychologist", image: "/images/staff-1.png", bio: "Over 15 years of experience in clinical and forensic psychology.", specialisms: ["PTSD", "Family Law"] },
  { name: "Dr James Harrington", role: "Consultant Psychiatrist", image: "/images/staff-2.png", bio: "Specialist in medico-legal psychiatry and expert testimony.", specialisms: ["Criminal", "Capacity"] },
  { name: "Dr Emily Chen", role: "Neuropsychologist", image: "/images/staff-3.png", bio: "Expert in cognitive assessment and brain injury evaluation.", specialisms: ["TBI", "Personal Injury"] },
  { name: "Prof Richard Townsend", role: "Forensic Psychologist", image: "/images/staff-4.png", bio: "Leading forensic psychologist with extensive courtroom experience.", specialisms: ["Risk Assessment", "Violence"] },
];

const DEMO_LOGOS = [
  { name: "Chambers UK" },
  { name: "Law Society" },
  { name: "SRA Regulated" },
  { name: "HCPC Registered" },
  { name: "BPS Chartered" },
];

const DEMO_PRICING: { name: string; price: string; description: string; features: string[]; highlighted?: boolean; cta: string }[] = [
  { name: "Standard Report", price: "£1,200", description: "For straightforward psychological assessments", features: ["Single assessment session", "Written report within 15 working days", "One round of amendments", "Email support"], cta: "Request Quote" },
  { name: "Comprehensive Report", price: "£2,400", description: "For complex cases requiring detailed evaluation", features: ["Multiple assessment sessions", "Written report within 10 working days", "Unlimited amendments", "Phone & email support", "Court attendance included"], highlighted: true, cta: "Request Quote" },
  { name: "Urgent Report", price: "£3,600", description: "For time-critical cases and tight deadlines", features: ["Priority scheduling", "Written report within 5 working days", "Unlimited amendments", "Dedicated case manager", "Court attendance included", "Out-of-hours availability"], cta: "Request Quote" },
];

const DEMO_TIMELINE = [
  { year: "2008", title: "Founded in Surrey", description: "Psychology Direct was established to bridge the gap between legal professionals and psychological experts." },
  { year: "2012", title: "500+ Associates", description: "Our panel grew to over 500 vetted psychologists and psychiatrists across the UK." },
  { year: "2016", title: "National Coverage", description: "Expanded operations to provide nationwide coverage with local psychologists in every region." },
  { year: "2020", title: "Remote Assessments", description: "Launched secure video assessment capabilities, maintaining quality during unprecedented times." },
  { year: "2024", title: "1,000+ Experts", description: "Reached a milestone of over 1,000 qualified psychologists in our trusted network." },
];

const DEMO_COMPARISON = [
  { feature: "Response time", us: "1 hour", them: "24–48 hours" },
  { feature: "CV delivery", us: "24 hours", them: "3–5 days" },
  { feature: "HCPC registered", us: true, them: true },
  { feature: "Dedicated case manager", us: true, them: false },
  { feature: "Legal Aid rates", us: true, them: false },
  { feature: "Quality-checked reports", us: true, them: false },
  { feature: "Nationwide coverage", us: true, them: true },
  { feature: "Out-of-hours support", us: true, them: false },
];

const DEMO_TESTIMONIALS = [
  { quote: "Psychology Direct have been an invaluable resource for our firm. Their response times are exceptional and the quality of reports consistently exceeds our expectations.", name: "Sarah Thompson", role: "Partner", company: "Thompson & Associates", rating: 5 },
  { quote: "The dedicated case manager approach makes all the difference. We always know exactly where we stand with each case, and the communication is outstanding.", name: "James Wilson", role: "Senior Solicitor", company: "Wilson Legal", rating: 5 },
  { quote: "We've used several expert witness providers over the years, but Psychology Direct stands head and shoulders above the rest for reliability and professionalism.", name: "Emma Richardson", role: "Head of Litigation", company: "Richardson Chambers", rating: 5 },
];

const DEMO_METRICS: { icon: typeof Brain; value: string; label: string; description: string }[] = [
  { icon: Users, value: "1,000+", label: "Vetted Experts", description: "Qualified psychologists and psychiatrists across the UK" },
  { icon: Clock, value: "1 Hour", label: "Response Time", description: "Average email response during business hours" },
  { icon: Target, value: "100%", label: "On-Time Delivery", description: "Reports delivered on schedule, every time" },
  { icon: TrendingUp, value: "15+ Years", label: "Experience", description: "Serving legal professionals since 2008" },
];

const DEMO_CASE_STUDIES = [
  { category: "Family Law", title: "Urgent Care Proceedings", description: "Complete parenting capacity assessment and child welfare report delivered within 5 days.", stat: "5 days", statLabel: "Turnaround" },
  { category: "Criminal Law", title: "Complex Sentencing Report", description: "Comprehensive psychological assessment for sentencing, including risk evaluation.", stat: "Clinical Psychologist", statLabel: "Expert" },
  { category: "Employment Law", title: "Workplace Stress Claim", description: "Detailed assessment of psychological injury following workplace bullying.", stat: "Successful settlement", statLabel: "Outcome" },
];

const DEMO_PRACTICE_AREAS = [
  { icon: Scale, title: "Family Law", description: "Care proceedings, contact disputes, parenting capacity assessments" },
  { icon: Gavel, title: "Criminal Law", description: "Sentencing reports, capacity assessments, vulnerability evaluations" },
  { icon: Building2, title: "Employment Law", description: "Disability discrimination, workplace stress, PTSD claims" },
];

const NAV_SECTIONS = [
  { id: "hero-gradient", label: "Hero (Gradient)" },
  { id: "hero-image", label: "Hero (Image)" },
  { id: "trust-bar", label: "Trust Bar" },
  { id: "service-cards", label: "Service Cards" },
  { id: "differentiator-tabs", label: "Tabs" },
  { id: "process-steps", label: "Process Steps" },
  { id: "practice-area-cards", label: "Practice Area Cards" },
  { id: "case-study-cards", label: "Case Study Cards" },
  { id: "stat-bar", label: "Stat Bar" },
  { id: "faq-accordion", label: "FAQ Accordion" },
  { id: "contact-form", label: "Contact Form" },
  { id: "cta-banner", label: "CTA Banner" },
  { id: "cta-inline", label: "CTA Inline Card" },
  { id: "cta-sidebar", label: "CTA Sidebar" },
  { id: "team-grid", label: "Team Grid" },
  { id: "logo-cloud", label: "Logo Cloud" },
  { id: "pricing-table", label: "Pricing Table" },
  { id: "timeline", label: "Timeline" },
  { id: "feature-comparison", label: "Feature Comparison" },
  { id: "video-section", label: "Video Section" },
  { id: "newsletter-strip", label: "Newsletter Strip" },
  { id: "alert-banner", label: "Alert Banner" },
  { id: "testimonial-carousel", label: "Testimonial Carousel" },
  { id: "metric-cards", label: "Metric Cards" },
  { id: "footer", label: "Footer" },
];

export default function ComponentLibrary() {
  const [activeTab, setActiveTab] = useState("fast");

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="bg-[#032552] dark:bg-[#021b3d] py-12 sm:py-16" data-testid="section-lib-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge className="bg-[#2eabe0]/20 text-[#2eabe0] border-[#2eabe0]/30 mb-4">Component Library</Badge>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4" data-testid="text-lib-heading">
              Design System & Components
            </h1>
            <p className="text-[#cee4f7] text-base sm:text-lg leading-relaxed">
              Every reusable component used across the Psychology Direct website. Use these building blocks like a Lego set to assemble new pages quickly and consistently.
            </p>
          </div>
        </div>
      </section>

      <div className="sticky top-16 sm:top-20 z-40 bg-background/95 backdrop-blur-sm border-b" data-testid="nav-component-index">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
            {NAV_SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="text-xs font-medium text-muted-foreground whitespace-nowrap px-3 py-1.5 rounded-full border hover:bg-muted hover:text-foreground transition-colors flex-shrink-0"
                data-testid={`link-lib-nav-${s.id}`}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <SectionWrapper id="hero-gradient" title="Hero Section (Gradient)" description="Full-width hero with gradient background, heading, subtext, and CTA buttons. Used on the home page.">
        <div className="relative bg-[#032552] dark:bg-[#021b3d] rounded-xl overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#2eabe0]/30 to-transparent" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#066aab]/20 rounded-full -translate-x-1/2 translate-y-1/2" />
          </div>
          <div className="relative px-8 sm:px-12 py-16 sm:py-20">
            <div className="max-w-2xl">
              <p className="text-[#2eabe0] font-sans text-xs font-bold uppercase tracking-widest mb-3">Expert Witness Services</p>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5" data-testid="text-lib-hero-gradient-heading">
                Finding the Right Psychologist for Your Case
              </h1>
              <p className="text-[#cee4f7] text-base sm:text-lg leading-relaxed mb-8">
                Access our network of 1,000+ qualified psychologists for comprehensive expert witness services.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="bg-white text-[#032552] font-semibold">
                  Get Started <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white bg-transparent">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper id="hero-image" title="Hero Section (Image)" description="Full-width hero with background image, gradient overlay, heading, and dual CTAs. Used on the Expert Witness page.">
        <div className="relative rounded-xl overflow-hidden h-[400px] sm:h-[450px] flex items-center">
          <div className="absolute inset-0">
            <img src="/images/hero-expert-witness.png" alt="Hero" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#032552]/90 via-[#032552]/75 to-[#032552]/40" />
          </div>
          <div className="relative px-8 sm:px-12 w-full">
            <div className="max-w-xl">
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-4" data-testid="text-lib-hero-image-heading">
                Expert Witness Psychologists for Legal Professionals
              </h1>
              <p className="text-blue-100 text-base sm:text-lg leading-relaxed mb-6">
                Fast response, exceptional quality, competitive costs.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="bg-white text-[#032552] font-semibold">
                  Request an Expert <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white bg-transparent">
                  View Practice Areas
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper id="trust-bar" title="Trust Bar" description="Slim coloured bar with key trust statements and icons. Used below the home page hero." bg="dark">
        <div className="bg-[#00588e] rounded-lg py-4 px-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-white text-sm">
            {["Over 500 vetted experts", "1-hour response time", "Court-ready reports", "Nationwide coverage"].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2eabe0]" />
                <span className="font-medium whitespace-nowrap">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper id="service-cards" title="Service / Feature Cards" description="Grid of cards with icon, title, description, and 'Learn more' link. Used for services, features, or capabilities." bg="light">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEMO_SERVICES.map((service, i) => (
            <Card key={i} className="p-6 sm:p-8 bg-background border-none hover-elevate cursor-pointer transition-all duration-200" data-testid={`card-lib-service-${i}`}>
              <div className="w-12 h-12 rounded-md bg-[#032552] flex items-center justify-center mb-5">
                <service.icon className="w-6 h-6 text-[#2eabe0]" />
              </div>
              <h3 className="font-sans text-lg font-bold text-foreground mb-2">{service.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
              <div className="mt-4 flex items-center gap-1 text-[#066aab] text-sm font-semibold">
                Learn more <ChevronRight className="w-4 h-4" />
              </div>
            </Card>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper id="differentiator-tabs" title="Tabbed Content (Differentiators)" description="Horizontal tab bar with animated underline and switchable content panels. Each tab shows a heading, description, and checklist.">
        <div className="flex flex-wrap border-b border-border mb-8">
          {DEMO_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 sm:px-6 py-3 sm:py-4 font-semibold text-sm sm:text-base transition-colors duration-200 ${isActive ? "text-[#2eabe0]" : "text-muted-foreground hover:text-[#2eabe0]"}`}
                data-testid={`tab-lib-${tab.id}`}
              >
                {tab.label}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#2eabe0] transition-transform duration-200 origin-left ${isActive ? "scale-x-100" : "scale-x-0"}`} />
              </button>
            );
          })}
        </div>
        {DEMO_TABS.map((tab) => {
          if (tab.id !== activeTab) return null;
          const TabIcon = tab.icon;
          return (
            <motion.div key={tab.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="grid md:grid-cols-2 gap-8 items-center" data-testid={`tab-lib-content-${tab.id}`}>
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-4">{tab.heading}</h3>
                <p className="text-muted-foreground text-base leading-relaxed mb-6">{tab.description}</p>
                <ul className="space-y-3">
                  {tab.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-[#2eabe0] flex-shrink-0 mt-0.5" />
                      <span className="text-foreground text-base leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="hidden md:block">
                <div className="w-full aspect-[4/3] rounded-xl bg-gradient-to-br from-[#032552] to-[#066aab] flex items-center justify-center">
                  <TabIcon className="w-24 h-24 text-[#2eabe0]/30" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </SectionWrapper>

      <SectionWrapper id="process-steps" title="Process Steps" description="Numbered step cards with icons, titles, and descriptions. Shown horizontally on desktop with dashed connectors." bg="dark">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {DEMO_PROCESS.map((step, i) => (
            <div key={i} className="relative text-center" data-testid={`lib-process-step-${i}`}>
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-5">
                <step.icon className="w-7 h-7 text-[#2eabe0]" />
              </div>
              {i < DEMO_PROCESS.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[calc(50%+40px)] w-[calc(100%-80px)] border-t-2 border-dashed border-[#cee4f7]/20" />
              )}
              <div className="text-[#2eabe0] font-bold text-sm mb-2">Step {step.step}</div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-[#cee4f7]/70 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper id="practice-area-cards" title="Practice Area Cards" description="Smaller variant of service cards, typically used for listing areas of law or specialisation." bg="light">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEMO_PRACTICE_AREAS.map((area, i) => (
            <Card key={i} className="p-6 sm:p-8 bg-background border-none hover-elevate cursor-pointer transition-all duration-200" data-testid={`card-lib-area-${i}`}>
              <div className="w-12 h-12 rounded-md bg-[#032552] flex items-center justify-center mb-5">
                <area.icon className="w-6 h-6 text-[#2eabe0]" />
              </div>
              <h3 className="font-sans text-lg font-bold text-foreground mb-2">{area.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{area.description}</p>
            </Card>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper id="case-study-cards" title="Case Study Cards" description="Cards with category badge, title, description, and a highlighted stat at the bottom.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DEMO_CASE_STUDIES.map((cs, i) => (
            <Card key={i} className="p-6 sm:p-8 bg-background overflow-hidden" data-testid={`card-lib-case-${i}`}>
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#066aab] bg-[#cee4f7]/40 dark:bg-[#066aab]/20 px-3 py-1 rounded-full mb-4">{cs.category}</span>
              <h3 className="font-serif text-lg font-bold text-foreground mb-3">{cs.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">{cs.description}</p>
              <div className="border-t pt-4">
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">{cs.statLabel}</div>
                <div className="text-[#066aab] font-bold text-sm">{cs.stat}</div>
              </div>
            </Card>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper id="stat-bar" title="Stats Bar" description="Bold numbers with labels on a dark background. Great for key performance indicators." bg="dark">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[{ value: "1 Hour", label: "Average Email Response Time" }, { value: "24 Hours", label: "CV Delivery Guarantee" }, { value: "100%", label: "On-Time Report Delivery" }].map((stat, i) => (
            <div key={i} data-testid={`stat-lib-${i}`}>
              <div className="font-serif text-3xl sm:text-4xl font-bold text-[#2eabe0] mb-2">{stat.value}</div>
              <div className="text-[#cee4f7]/80 text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper id="faq-accordion" title="FAQ Accordion" description="Expandable accordion items for frequently asked questions. Clean, accessible, and keyboard-navigable.">
        <div className="max-w-3xl">
          <Accordion type="single" collapsible className="space-y-3" data-testid="accordion-lib-faq">
            {DEMO_FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-[#f0f5ff] dark:bg-[#0d1929] rounded-lg px-6 border-none" data-testid={`faq-lib-${i}`}>
                <AccordionTrigger className="text-left font-semibold text-foreground text-sm sm:text-base py-4">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </SectionWrapper>

      <SectionWrapper id="contact-form" title="Contact Form" description="Standard enquiry form with name, email, phone, company, and message fields. Can be used standalone or in a two-column layout." bg="light">
        <div className="max-w-2xl">
          <form className="space-y-4 bg-background rounded-xl border p-6 sm:p-8" data-testid="form-lib-contact">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                <Input placeholder="Your full name" data-testid="input-lib-name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
                <Input type="email" placeholder="you@example.com" data-testid="input-lib-email" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Phone Number</label>
                <Input type="tel" placeholder="01234 567890" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Company / Firm</label>
                <Input placeholder="Your firm name" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
              <Textarea placeholder="Tell us about your case..." className="min-h-[120px] resize-none" />
            </div>
            <Button size="lg" className="w-full sm:w-auto">
              Send Message <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </div>
      </SectionWrapper>

      <SectionWrapper id="cta-banner" title="CTA Banner (Full-Width)" description="Dark, full-width call-to-action banner with guide image, description, and email capture form. Used for white paper / lead gen.">
        <CTABanner />
      </SectionWrapper>

      <SectionWrapper id="cta-inline" title="CTA Inline Card" description="Compact card with icon, checklist, and inline email form. Designed to sit within article content or between page sections." bg="light">
        <div className="max-w-3xl">
          <CTAInlineCard />
        </div>
      </SectionWrapper>

      <SectionWrapper id="cta-sidebar" title="CTA Sidebar Widget" description="Vertical widget designed for page sidebars. Includes header, image, summary, and form.">
        <div className="max-w-xs">
          <CTASidebar />
        </div>
      </SectionWrapper>

      <SectionWrapper id="team-grid" title="Team Grid" description="Profile cards for team members with photo, name, role, bio, and specialism badges. Responsive 1–4 column grid.">
        <TeamGrid members={DEMO_TEAM} />
      </SectionWrapper>

      <SectionWrapper id="logo-cloud" title="Logo Cloud" description="Partner/accreditation logos displayed in a horizontal row. Greyscale by default, full colour on hover." bg="light">
        <LogoCloud logos={DEMO_LOGOS} />
      </SectionWrapper>

      <SectionWrapper id="pricing-table" title="Pricing Table" description="Three-tier pricing cards with features, highlighted 'most popular' option, and CTA buttons.">
        <PricingTable tiers={DEMO_PRICING} />
      </SectionWrapper>

      <SectionWrapper id="timeline" title="Timeline" description="Alternating left/right timeline for company history or milestones. Collapses to single column on mobile." bg="light">
        <Timeline events={DEMO_TIMELINE} />
      </SectionWrapper>

      <SectionWrapper id="feature-comparison" title="Feature Comparison Table" description="Side-by-side comparison with checkmarks and text values. Scrollable on mobile.">
        <div className="max-w-3xl">
          <Card className="p-4 sm:p-6 bg-background">
            <FeatureComparison rows={DEMO_COMPARISON} />
          </Card>
        </div>
      </SectionWrapper>

      <SectionWrapper id="video-section" title="Video Section" description="Two-column layout with heading/description on the left and a video thumbnail with play button on the right." bg="light">
        <VideoSection
          heading="See How We Work"
          description="Watch a short overview of how Psychology Direct connects legal professionals with qualified psychologists. From initial enquiry to report delivery, we make the process simple, transparent, and stress-free."
          thumbnailSrc="/images/hero-expert-witness.png"
        />
      </SectionWrapper>

      <SectionWrapper id="newsletter-strip" title="Newsletter Strip" description="Compact dark banner with heading, description, and email subscription form. Includes success state.">
        <NewsletterStrip />
      </SectionWrapper>

      <SectionWrapper id="alert-banner" title="Alert Banner" description="Dismissible notification banner for announcements, warnings, or promotions. Three colour variants: info, success, warning." bg="light">
        <div className="space-y-4 rounded-lg overflow-hidden">
          <AlertBanner message="We now offer remote video assessments for all case types." link={{ label: "Learn more", href: "#" }} type="info" />
          <AlertBanner message="New: Legal Aid rates now accepted for all eligible cases." type="success" />
          <AlertBanner message="Bank holiday hours: Limited availability on 25–26 December." type="warning" />
        </div>
      </SectionWrapper>

      <SectionWrapper id="testimonial-carousel" title="Testimonial Carousel" description="Rotating testimonials with quote, attribution, star rating, and navigation dots/arrows.">
        <TestimonialCarousel testimonials={DEMO_TESTIMONIALS} />
      </SectionWrapper>

      <SectionWrapper id="metric-cards" title="Metric Cards" description="Icon-topped stat cards for key metrics. Responsive grid layout with optional descriptions." bg="light">
        <MetricCards metrics={DEMO_METRICS} />
      </SectionWrapper>

      <SectionWrapper id="footer" title="Footer" description="Site-wide footer with logo, column links, contact details, and copyright.">
        <div className="bg-[#021b3d] dark:bg-[#010f22] rounded-xl p-8 sm:p-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div>
              <img src="/images/logo.png" alt="Psychology Direct" className="h-10 w-auto brightness-0 invert mb-4" />
              <p className="text-[#cee4f7]/70 text-sm leading-relaxed">
                Leading provider of expert witness psychologists and psychiatrists across the UK.
              </p>
            </div>
            <div>
              <h4 className="text-white font-sans text-sm font-bold uppercase tracking-wide mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {["Home", "Expert Witness", "Knowledge Hub", "Contact"].map((item) => (
                  <li key={item}><span className="text-[#cee4f7]/70 text-sm hover:text-white transition-colors cursor-pointer">{item}</span></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-sans text-sm font-bold uppercase tracking-wide mb-4">Services</h4>
              <ul className="space-y-2">
                {["Family Law", "Criminal Law", "Employment Law", "Personal Injury"].map((item) => (
                  <li key={item}><span className="text-[#cee4f7]/70 text-sm hover:text-white transition-colors cursor-pointer">{item}</span></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-sans text-sm font-bold uppercase tracking-wide mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-[#cee4f7]/70 text-sm"><Phone className="w-4 h-4 flex-shrink-0" />01306 879 075</li>
                <li className="flex items-center gap-2 text-[#cee4f7]/70 text-sm"><Mail className="w-4 h-4 flex-shrink-0" />info@psychologydirect.co.uk</li>
                <li className="flex items-center gap-2 text-[#cee4f7]/70 text-sm"><MapPin className="w-4 h-4 flex-shrink-0" />United Kingdom</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-10 pt-8 text-center">
            <p className="text-[#cee4f7]/50 text-xs">© {new Date().getFullYear()} Psychology Direct. All rights reserved.</p>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}

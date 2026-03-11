import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CheckCircle2,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  Zap,
  Award,
  Heart,
  PoundSterling,
  Users,
  Scale,
  Shield,
  Brain,
  Briefcase,
  Building2,
  Gavel,
  HeartPulse,
  Plane,
  Stethoscope,
  Quote,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { CTABanner } from "@/components/cta-widgets";

const DIFFERENTIATORS = [
  {
    id: "fast",
    icon: Zap,
    label: "Fast & Responsive",
    heading: "Immediate Attention When You Need It",
    description: "We understand that legal cases often require immediate action. Our commitment to rapid response ensures you're never left waiting.",
    items: [
      "1-hour email response during business hours (9am–5pm, Monday–Friday)",
      "24-hour CV delivery with detailed experience and qualifications",
      "Urgent case priority — we've delivered reports in as little as 48 hours",
      "Out-of-hours availability for critical cases",
    ],
  },
  {
    id: "quality",
    icon: Award,
    label: "Outstanding Quality",
    heading: "Highly Experienced Psychologists",
    description: "Quality is never compromised. Every psychologist in our network meets the highest professional standards.",
    items: [
      "1,000+ vetted psychologists across all specialisations",
      "100% HCPC registered with current practising certificates",
      "BPS chartered members with extensive court experience",
      "Enhanced DBS certification for all associates",
    ],
  },
  {
    id: "personal",
    icon: Heart,
    label: "Personal Service",
    heading: "Dedicated Support Throughout",
    description: "You'll have a dedicated case manager who knows your case inside out and provides personalised support.",
    items: [
      "Single point of contact — your dedicated case manager",
      "Culturally diverse network matching your client's needs",
      "Nationwide coverage with local psychologists",
      "Proactive communication keeping you informed at every stage",
    ],
  },
  {
    id: "costs",
    icon: PoundSterling,
    label: "Competitive Costs",
    heading: "Transparent and Fair Pricing",
    description: "No hidden fees, no surprises. We provide clear, upfront pricing that works with Legal Aid and private funding.",
    items: [
      "Upfront cost estimates provided within 24 hours",
      "Legal Aid compliant rates accepted for eligible cases",
      "Standardised deliverables ensuring consistency",
      "No hidden charges — what we quote is what you pay",
    ],
  },
];

const PROCESS_STEPS = [
  {
    step: "01",
    icon: Users,
    title: "Match Associates to Requirements",
    description: "Share your case details with us. We carefully match you with psychologists who have the specific expertise, location, and availability your case demands.",
  },
  {
    step: "02",
    icon: Briefcase,
    title: "Instruct & Manage Administration",
    description: "Once you approve the match, we handle all administrative tasks — scheduling assessments, coordinating with all parties, and managing documentation.",
  },
  {
    step: "03",
    icon: Shield,
    title: "Quality Checked Reports Submitted",
    description: "Every report undergoes rigorous quality control checks before delivery. Reports are comprehensive, legally sound, and submitted on time, every time.",
  },
];

const PRACTICE_AREAS = [
  {
    icon: Scale,
    title: "Family Law",
    description: "Care proceedings, contact disputes, parenting capacity assessments, child welfare reports",
  },
  {
    icon: Gavel,
    title: "Criminal Law",
    description: "Sentencing reports, capacity assessments, vulnerability evaluations, offender rehabilitation",
  },
  {
    icon: Building2,
    title: "Employment Law",
    description: "Disability discrimination, workplace stress, capacity to work assessments, PTSD claims",
  },
  {
    icon: HeartPulse,
    title: "Personal Injury",
    description: "Psychological injury assessments, prognosis and treatment recommendations, loss of earnings",
  },
  {
    icon: Plane,
    title: "Immigration",
    description: "Asylum seeker assessments, PTSD evaluations, country-specific psychological evidence",
  },
  {
    icon: Stethoscope,
    title: "Clinical Negligence",
    description: "Psychiatric injury claims, misdiagnosis impact, treatment failures, duty of care breaches",
  },
];

const CASE_STUDIES = [
  {
    category: "Family Law",
    title: "Urgent Care Proceedings",
    description: "Complete parenting capacity assessment and child welfare report delivered within 5 days for urgent court proceedings.",
    stat: "5 days",
    statLabel: "Turnaround",
  },
  {
    category: "Criminal Law",
    title: "Complex Sentencing Report",
    description: "Comprehensive psychological assessment for sentencing, including risk evaluation and treatment recommendations.",
    stat: "Clinical Psychologist",
    statLabel: "Expert",
  },
  {
    category: "Employment Law",
    title: "Workplace Stress Claim",
    description: "Detailed assessment of psychological injury following workplace bullying, including prognosis and treatment costs.",
    stat: "Successful settlement",
    statLabel: "Outcome",
  },
];

const FAQS = [
  {
    question: "What are your Legal Aid rates?",
    answer: "We accept Legal Aid rates for eligible cases. Our pricing is fully compliant with Legal Aid Agency guidelines, and we can provide detailed cost breakdowns upfront. Contact us to discuss your specific case requirements.",
  },
  {
    question: "How quickly can you provide a psychologist for an urgent case?",
    answer: "For urgent cases, we can typically provide a CV within 24 hours and arrange the first assessment within 48–72 hours, depending on location and complexity. We've successfully handled cases requiring reports in as little as one week from initial instruction.",
  },
  {
    question: "What qualifications do your psychologists have?",
    answer: "All psychologists in our network are HCPC registered, BPS chartered members, and hold relevant postgraduate qualifications. They have enhanced DBS certificates and extensive experience providing expert witness testimony in their areas of specialisation.",
  },
  {
    question: "Which areas of law do you cover?",
    answer: "We provide expert witness services across all major practice areas including: Family Law (care proceedings, contact disputes), Criminal Law (sentencing, capacity assessments), Employment Law (disability discrimination, stress claims), Personal Injury, Clinical Negligence, Immigration, and Prison Law.",
  },
  {
    question: "How do you ensure report quality?",
    answer: "Every report undergoes a multi-stage quality control process including peer review, compliance checking against legal requirements, and verification of all factual information. Reports are written to comply with CPR Part 35 and Family Procedure Rules as applicable.",
  },
  {
    question: "Can you provide psychologists for video/remote assessments?",
    answer: "Yes, many of our psychologists are experienced in conducting remote assessments via secure video platforms when appropriate. This can be particularly useful for urgent cases or when travel is impractical. We can discuss whether remote assessment is suitable for your specific case.",
  },
];

const STATS = [
  { value: "1 Hour", label: "Average Email Response Time" },
  { value: "24 Hours", label: "CV Delivery Guarantee" },
  { value: "100%", label: "On-Time Report Delivery" },
];

export default function ExpertWitness() {
  const [activeTab, setActiveTab] = useState("fast");

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative h-[60vh] min-h-[420px] max-h-[600px] flex items-center" data-testid="section-ew-hero">
        <div className="absolute inset-0">
          <img
            src="/images/hero-expert-witness.png"
            alt="Expert Witness Services"
            className="w-full h-full object-cover"
            data-testid="img-ew-hero"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#032552]/90 via-[#032552]/75 to-[#032552]/40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-6" data-testid="text-ew-heading">
              Expert Witness Psychologists for Legal Professionals
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 leading-relaxed mb-8" data-testid="text-ew-subheading">
              Access our network of 1,000+ qualified psychologists for comprehensive expert witness services. Fast response, exceptional quality, competitive costs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-[#032552] font-semibold" asChild data-testid="button-request-expert">
                <a href="#ew-contact">
                  Request an Expert
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white bg-transparent" asChild data-testid="button-view-areas">
                <a href="#practice-areas">View Practice Areas</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20" data-testid="section-ew-intro">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg sm:text-xl text-foreground leading-relaxed mb-5" data-testid="text-ew-intro-1">
            Solicitors need <strong>immediate attention</strong> for their cases, access to <strong>highly experienced psychologists</strong>, and a <strong>reliable service</strong> with standardised deliverables at competitive costs.
          </p>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed" data-testid="text-ew-intro-2">
            Psychology Direct has been providing these essentials to legal professionals across the UK for over 15 years.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-[#f0f5ff] dark:bg-[#0d1929]" data-testid="section-ew-differentiators">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground" data-testid="text-ew-diff-heading">
              What Sets Us Apart
            </h2>
          </div>

          <div className="flex flex-wrap border-b border-border mb-8 sm:mb-10" data-testid="tabs-ew-differentiators">
            {DIFFERENTIATORS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 sm:px-6 py-3 sm:py-4 font-semibold text-sm sm:text-base transition-colors duration-200 ${
                    isActive
                      ? "text-[#2eabe0]"
                      : "text-muted-foreground hover:text-[#2eabe0]"
                  }`}
                  data-testid={`tab-ew-${tab.id}`}
                >
                  {tab.label}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#2eabe0] transition-transform duration-200 origin-left ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {DIFFERENTIATORS.map((tab) => {
            if (tab.id !== activeTab) return null;
            const TabIcon = tab.icon;
            return (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="grid md:grid-cols-2 gap-8 items-center"
                data-testid={`tab-ew-content-${tab.id}`}
              >
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-4" data-testid={`text-ew-tab-heading-${tab.id}`}>
                    {tab.heading}
                  </h3>
                  <p className="text-muted-foreground text-base leading-relaxed mb-6">
                    {tab.description}
                  </p>
                  <ul className="space-y-3">
                    {tab.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5" data-testid={`item-ew-${tab.id}-${i}`}>
                        <CheckCircle2 className="w-5 h-5 text-[#2eabe0] flex-shrink-0 mt-0.5" />
                        <span className="text-foreground text-base leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="hidden md:block">
                  <div
                    className="w-full aspect-[4/3] rounded-xl overflow-hidden"
                    style={{ backgroundImage: "url('/images/bg-understanding.png')", backgroundSize: "cover", backgroundPosition: "center" }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24" data-testid="section-ew-process">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#066aab] font-semibold text-sm uppercase tracking-wide mb-3" data-testid="text-ew-process-label">
              How It Works
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3" data-testid="text-ew-process-heading">
              Our Three-Step Process
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              From instruction to delivery, we make expert witness services simple and stress-free
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PROCESS_STEPS.map((step, index) => (
              <div key={index} className="relative text-center" data-testid={`ew-process-step-${index}`}>
                <div className="w-16 h-16 rounded-full bg-[#032552] flex items-center justify-center mx-auto mb-5">
                  <step.icon className="w-7 h-7 text-[#2eabe0]" />
                </div>
                {index < PROCESS_STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+40px)] w-[calc(100%-80px)] border-t-2 border-dashed border-[#cee4f7] dark:border-[#1a3a5c]" />
                )}
                <div className="text-[#2eabe0] font-bold text-sm mb-2">Step {step.step}</div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="practice-areas" className="py-16 sm:py-20 bg-[#f0f5ff] dark:bg-[#0d1929]" data-testid="section-ew-practice-areas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#066aab] font-semibold text-sm uppercase tracking-wide mb-3">
              Areas of Expertise
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3" data-testid="text-ew-areas-heading">
              Practice Areas
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Comprehensive expert witness services across all major areas of law
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRACTICE_AREAS.map((area, index) => (
              <Card
                key={index}
                className="p-6 sm:p-8 bg-background border-none hover-elevate cursor-pointer transition-all duration-200"
                data-testid={`card-practice-area-${index}`}
              >
                <div className="w-12 h-12 rounded-md bg-[#032552] flex items-center justify-center mb-5">
                  <area.icon className="w-6 h-6 text-[#2eabe0]" />
                </div>
                <h3 className="font-sans text-lg font-bold text-foreground mb-2">{area.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{area.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24" data-testid="section-ew-case-studies">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#066aab] font-semibold text-sm uppercase tracking-wide mb-3">
              Our Track Record
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3" data-testid="text-ew-cases-heading">
              Recent Case Studies
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Real examples of how we've helped legal professionals achieve successful outcomes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CASE_STUDIES.map((cs, index) => (
              <Card key={index} className="p-6 sm:p-8 bg-background overflow-hidden" data-testid={`card-case-study-${index}`}>
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#066aab] bg-[#cee4f7]/40 dark:bg-[#066aab]/20 px-3 py-1 rounded-full mb-4">
                  {cs.category}
                </span>
                <h3 className="font-serif text-lg font-bold text-foreground mb-3">{cs.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">{cs.description}</p>
                <div className="border-t pt-4">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">{cs.statLabel}</div>
                  <div className="text-[#066aab] font-bold text-sm">{cs.stat}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-[#f0f5ff] dark:bg-[#0d1929]" data-testid="section-ew-cta-guide">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CTABanner />
        </div>
      </section>

      <section className="py-14 sm:py-20 bg-[#032552] dark:bg-[#021b3d]" data-testid="section-ew-stats">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {STATS.map((stat, index) => (
              <div key={index} data-testid={`stat-ew-${index}`}>
                <div className="font-serif text-3xl sm:text-4xl font-bold text-[#2eabe0] mb-2">{stat.value}</div>
                <div className="text-[#cee4f7]/80 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24 bg-[#f0f5ff] dark:bg-[#0d1929]" data-testid="section-ew-faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3" data-testid="text-ew-faq-heading">
              Frequently Asked Questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-3" data-testid="accordion-ew-faq">
            {FAQS.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="bg-background rounded-lg px-6 border"
                data-testid={`faq-ew-${index}`}
              >
                <AccordionTrigger className="text-left font-semibold text-foreground text-sm sm:text-base py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section id="ew-contact" className="py-16 sm:py-20 lg:py-24" data-testid="section-ew-contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <p className="text-[#066aab] font-semibold text-sm uppercase tracking-wide mb-3">
                Get Started
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4" data-testid="text-ew-contact-heading">
                Request an Expert Witness Psychologist
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed mb-8">
                Fill out the form and we'll get back to you within 1 hour during business hours.
              </p>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-md bg-[#032552] flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[#2eabe0]" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm mb-0.5">Phone</div>
                    <a href="tel:01306879075" className="text-muted-foreground text-sm hover:text-foreground transition-colors" data-testid="link-ew-phone">
                      01306 879 075
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-md bg-[#032552] flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#2eabe0]" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm mb-0.5">Email</div>
                    <a href="mailto:info@psychologydirect.co.uk" className="text-muted-foreground text-sm hover:text-foreground transition-colors" data-testid="link-ew-email">
                      info@psychologydirect.co.uk
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-md bg-[#032552] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#2eabe0]" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm mb-0.5">Location</div>
                    <span className="text-muted-foreground text-sm">United Kingdom — Nationwide Coverage</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <form className="space-y-4 bg-background rounded-xl border p-6 sm:p-8" data-testid="form-ew-contact">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="ew-first-name" className="block text-sm font-medium text-foreground mb-1.5">First Name *</label>
                    <Input id="ew-first-name" placeholder="First name" required data-testid="input-ew-first-name" />
                  </div>
                  <div>
                    <label htmlFor="ew-last-name" className="block text-sm font-medium text-foreground mb-1.5">Last Name *</label>
                    <Input id="ew-last-name" placeholder="Last name" required data-testid="input-ew-last-name" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="ew-email" className="block text-sm font-medium text-foreground mb-1.5">Email *</label>
                    <Input id="ew-email" type="email" placeholder="you@example.com" required data-testid="input-ew-email" />
                  </div>
                  <div>
                    <label htmlFor="ew-phone" className="block text-sm font-medium text-foreground mb-1.5">Phone Number</label>
                    <Input id="ew-phone" type="tel" placeholder="01234 567890" data-testid="input-ew-phone" />
                  </div>
                </div>
                <div>
                  <label htmlFor="ew-company" className="block text-sm font-medium text-foreground mb-1.5">Company / Organisation *</label>
                  <Input id="ew-company" placeholder="Your firm or organisation" required data-testid="input-ew-company" />
                </div>
                <div>
                  <label htmlFor="ew-message" className="block text-sm font-medium text-foreground mb-1.5">Message *</label>
                  <Textarea
                    id="ew-message"
                    placeholder="Tell us about your case requirements, area of law, and any urgency..."
                    className="min-h-[120px] resize-none"
                    required
                    data-testid="input-ew-message"
                  />
                </div>
                <div className="flex items-start gap-2">
                  <input type="checkbox" id="ew-consent" className="mt-1 rounded border-border" required data-testid="checkbox-ew-consent" />
                  <label htmlFor="ew-consent" className="text-xs text-muted-foreground leading-relaxed">
                    I consent to Psychology Direct storing my data and contacting me regarding my enquiry. View our Privacy Policy for more information.
                  </label>
                </div>
                <Button size="lg" className="w-full" data-testid="button-ew-submit">
                  Send Message
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#021b3d] dark:bg-[#010f22] py-12 sm:py-16" data-testid="footer-ew">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div>
              <img
                src="https://www.psychologydirect.co.uk/wp-content/themes/psychologydirect-2018/images/svg/footer-logo.svg"
                alt="Psychology Direct"
                className="h-10 w-auto mb-4"
              />
              <p className="text-[#cee4f7]/70 text-sm leading-relaxed">
                A network of over 1,000 qualified psychologists providing expert witness services and educational psychology support across the UK.
              </p>
            </div>

            <div>
              <h4 className="text-white font-sans text-sm font-bold uppercase tracking-wide mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {[
                  { label: "Home", href: "/" },
                  { label: "Expert Witness", href: "/expert-witness" },
                  { label: "Knowledge Hub", href: "/knowledge-hub" },
                  { label: "Contact", href: "#ew-contact" },
                ].map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-[#cee4f7]/70 text-sm transition-colors hover:text-white">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-sans text-sm font-bold uppercase tracking-wide mb-4">Services</h4>
              <ul className="space-y-2">
                {["Family Law", "Criminal Law", "Employment Law", "Personal Injury", "Immigration", "Clinical Negligence"].map((item) => (
                  <li key={item}>
                    <a href="#practice-areas" className="text-[#cee4f7]/70 text-sm transition-colors hover:text-white">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-sans text-sm font-bold uppercase tracking-wide mb-4">Contact</h4>
              <ul className="space-y-3">
                <li>
                  <a href="tel:01306879075" className="flex items-center gap-2 text-[#cee4f7]/70 text-sm transition-colors hover:text-white">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    01306 879 075
                  </a>
                </li>
                <li>
                  <a href="mailto:info@psychologydirect.co.uk" className="flex items-center gap-2 text-[#cee4f7]/70 text-sm transition-colors hover:text-white">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    info@psychologydirect.co.uk
                  </a>
                </li>
                <li className="flex items-center gap-2 text-[#cee4f7]/70 text-sm">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  United Kingdom
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-10 pt-8 text-center">
            <p className="text-[#cee4f7]/50 text-xs">
              © {new Date().getFullYear()} Psychology Direct. All rights reserved. Company Reg. 07008023
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

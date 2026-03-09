import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";

const STAFF_MEMBERS = [
  { name: "Dr Sarah Mitchell", role: "Clinical Psychologist", image: "/images/staff-1.png" },
  { name: "Dr James Harrington", role: "Consultant Psychiatrist", image: "/images/staff-2.png" },
  { name: "Dr Emily Chen", role: "Neuropsychologist", image: "/images/staff-3.png" },
  { name: "Prof Richard Townsend", role: "Forensic Psychologist", image: "/images/staff-4.png" },
  { name: "Dr Laura Bennett", role: "Child Psychologist", image: "/images/staff-5.png" },
];


const SERVICES = [
  {
    icon: Brain,
    title: "Psychological Assessment",
    description:
      "Comprehensive psychological assessments for personal injury, clinical negligence, and family law cases.",
  },
  {
    icon: Scale,
    title: "Expert Witness Reports",
    description:
      "Detailed, evidence-based expert reports that stand up to rigorous cross-examination in court.",
  },
  {
    icon: Shield,
    title: "Medico-Legal Services",
    description:
      "Specialist medico-legal evaluations covering trauma, PTSD, chronic pain, and neuropsychological conditions.",
  },
  {
    icon: HeartHandshake,
    title: "Family & Child Cases",
    description:
      "Sensitive, child-focused psychological assessments for family courts and child welfare proceedings.",
  },
  {
    icon: BookOpen,
    title: "Training & CPD",
    description:
      "Professional development workshops and training for legal professionals on psychological evidence.",
  },
  {
    icon: Clock,
    title: "Fast Turnaround",
    description:
      "Expedited report services available when you need expert psychological opinion under tight deadlines.",
  },
];

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
    title: "Tell us what you need",
    description:
      "Share your case details and requirements. We'll listen carefully to understand exactly what's needed.",
    icon: Search,
  },
  {
    step: "02",
    title: "We match & set up",
    description:
      "We match you with the perfect specialist from our vetted panel and handle all the arrangements.",
    icon: Users,
  },
  {
    step: "03",
    title: "Report & support",
    description:
      "Receive a thorough, court-ready report. We remain available for follow-up questions and testimony.",
    icon: ClipboardCheck,
  },
];

const CASE_STUDIES = [
  {
    title: "Workplace Injury Assessment",
    category: "Personal Injury",
    summary:
      "Comprehensive psychological assessment following a traumatic workplace incident, supporting a successful claim.",
  },
  {
    title: "Family Court Evaluation",
    category: "Family Law",
    summary:
      "Detailed parental capacity assessment that helped the court reach a fair decision for the child's welfare.",
  },
  {
    title: "Clinical Negligence Report",
    category: "Medical",
    summary:
      "Expert neuropsychological evaluation in a clinical negligence case, providing clarity on long-term impact.",
  },
];

const FAQ_ITEMS = [
  {
    question: "What is the difference between a psychologist and psychiatrist?",
    answer:
      "A psychologist holds a doctoral-level qualification in psychology and specialises in understanding behaviour and mental processes through assessment and therapy. A psychiatrist is a medical doctor who specialises in mental health and can prescribe medication. Both can act as expert witnesses, but the type of expertise required depends on the specific case.",
  },
  {
    question: "How long does an expert witness report typically take?",
    answer:
      "Standard turnaround is 4-6 weeks from the date of assessment. We also offer expedited services for urgent cases, with reports delivered within 2-3 weeks. Complex cases involving extensive record review may require additional time, which we'll communicate upfront.",
  },
  {
    question: "What areas of law do your experts cover?",
    answer:
      "Our panel covers personal injury, clinical negligence, family law, employment disputes, criminal cases, and immigration tribunals. Each expert is carefully matched to the specific psychological or psychiatric requirements of your case.",
  },
  {
    question: "How are your experts vetted?",
    answer:
      "All our experts undergo a rigorous vetting process including verification of qualifications, professional registrations (HCPC, BPS, GMC), insurance, and DBS checks. We also review their track record of report quality and court experience before they join our panel.",
  },
  {
    question: "What are your fees and how are costs structured?",
    answer:
      "We believe in complete transparency on costs. Our fees are fixed and agreed upfront — no hidden charges. We provide a detailed breakdown before any work begins, covering assessment, report writing, and any court attendance. Contact us for a personalised quote.",
  },
  {
    question: "Do you cover the whole of the UK?",
    answer:
      "Yes, we have experts located throughout England, Wales, Scotland, and Northern Ireland. We can arrange assessments at convenient locations for claimants, or offer remote video assessments where appropriate and agreed by all parties.",
  },
];

export default function Home() {
  const [currentStaff, setCurrentStaff] = useState(0);
  const [activeTab, setActiveTab] = useState("fast");

  const [resetKey, setResetKey] = useState(0);

  const selectStaff = useCallback((index: number) => {
    setCurrentStaff(index);
    setResetKey((k) => k + 1);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStaff((prev) => (prev + 1) % STAFF_MEMBERS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [resetKey]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative bg-[#032552] dark:bg-[#021b3d] overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#2eabe0]/30 to-transparent" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#066aab]/20 rounded-full -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-1 max-w-2xl">
              <p className="text-[#2eabe0] font-sans text-sm sm:text-base font-semibold tracking-wide uppercase mb-4" data-testid="text-hero-subtitle">
                Leading Provider of Medico-Legal Services
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] font-bold text-white leading-tight mb-6" data-testid="text-hero-title">
                Expert Witness Psychologists for Solicitors & Insurers
              </h1>
              <p className="text-[#cee4f7] text-base sm:text-lg leading-relaxed mb-8 max-w-2xl" data-testid="text-hero-description">
                When it comes to providing expert witnesses to the legal profession, we're the experts.
                Connect with the right specialist for your case — quickly, simply, and with complete transparency.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="bg-[#2eabe0] text-[#032552] font-semibold"
                  data-testid="button-find-expert"
                >
                  Find an Expert
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white bg-white/5 backdrop-blur-sm"
                  data-testid="button-learn-more"
                >
                  Learn More
                </Button>
              </div>
            </div>

            <div className="hidden md:flex flex-col items-center flex-shrink-0" data-testid="staff-slideshow">
              <div className="relative w-64 h-80 lg:w-72 lg:h-96">
                <div className="absolute inset-0 rounded-2xl bg-[#066aab]/20 -rotate-3" />
                <div className="absolute inset-0 rounded-2xl bg-[#2eabe0]/10 rotate-2" />
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentStaff}
                      src={STAFF_MEMBERS[currentStaff].image}
                      alt={STAFF_MEMBERS[currentStaff].name}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0, x: 60 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -60 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      data-testid={`img-staff-${currentStaff}`}
                    />
                  </AnimatePresence>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStaff}
                  className="mt-5 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <p className="text-white font-sans text-base font-semibold" data-testid="text-staff-name">
                    {STAFF_MEMBERS[currentStaff].name}
                  </p>
                  <p className="text-[#2eabe0] font-sans text-sm" data-testid="text-staff-role">
                    {STAFF_MEMBERS[currentStaff].role}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center gap-2 mt-4">
                {STAFF_MEMBERS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => selectStaff(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentStaff
                        ? "bg-[#2eabe0] w-6"
                        : "bg-white/30"
                    }`}
                    aria-label={`View ${STAFF_MEMBERS[index].name}`}
                    data-testid={`button-staff-dot-${index}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 bg-[#00588e] dark:bg-[#003d63]" data-testid="section-trust-bar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-12 text-white/90 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2eabe0]" />
              <span>Over 500 vetted experts</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2eabe0]" />
              <span>HCPC registered professionals</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2eabe0]" />
              <span>UK-wide coverage</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2eabe0]" />
              <span>Fixed, transparent fees</span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden" data-testid="section-intro">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.15] dark:opacity-[0.08] blur-[2px] scale-110 pointer-events-none"
          style={{ backgroundImage: "url('/images/watermark-understanding.png')" }}
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-6">
            <p className="text-[#066aab] font-semibold text-sm uppercase tracking-wide mb-3" data-testid="text-intro-label">
              Our Understanding
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-6" data-testid="text-intro-heading">
              We match you with a psychologist or psychiatrist — so you can focus on your case
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed" data-testid="text-intro-body">
              Finding the right expert for a medico-legal case shouldn't be complicated.
              We've built a panel of over 500 fully vetted psychologists and psychiatrists,
              each matched to your specific requirements. No jargon, no hidden costs — just
              the right expert, delivered with care and professionalism.
            </p>
          </div>
        </div>
      </section>

      <section id="services" className="py-16 sm:py-20 bg-[#f0f5ff] dark:bg-[#0d1929]" data-testid="section-services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#066aab] font-semibold text-sm uppercase tracking-wide mb-3" data-testid="text-services-label">
              What We Do
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground" data-testid="text-services-heading">
              Our Services
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service, index) => (
              <Card
                key={index}
                className="p-6 sm:p-8 bg-background border-none hover-elevate cursor-pointer transition-all duration-200"
                data-testid={`card-service-${index}`}
              >
                <div className="w-12 h-12 rounded-md bg-[#032552] flex items-center justify-center mb-5">
                  <service.icon className="w-6 h-6 text-[#2eabe0]" />
                </div>
                <h3 className="font-sans text-lg font-bold text-foreground mb-2" data-testid={`text-service-title-${index}`}>
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed" data-testid={`text-service-desc-${index}`}>
                  {service.description}
                </p>
                <div className="mt-4 flex items-center gap-1 text-[#066aab] text-sm font-semibold">
                  Learn more <ChevronRight className="w-4 h-4" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24" data-testid="section-differentiators">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-[#066aab] font-semibold text-sm uppercase tracking-wide mb-3" data-testid="text-diff-label">
              Why Choose Us
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground" data-testid="text-diff-heading">
              What Sets Us Apart
            </h2>
          </div>

          <div className="flex flex-wrap border-b border-border mb-8 sm:mb-10" data-testid="tabs-differentiators">
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
                  data-testid={`tab-${tab.id}`}
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
                data-testid={`tab-content-${tab.id}`}
              >
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-4" data-testid={`text-tab-heading-${tab.id}`}>
                    {tab.heading}
                  </h3>
                  <p className="text-muted-foreground text-base leading-relaxed mb-6" data-testid={`text-tab-desc-${tab.id}`}>
                    {tab.description}
                  </p>
                  <ul className="space-y-3">
                    {tab.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5" data-testid={`item-${tab.id}-${i}`}>
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
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-[#066aab] dark:bg-[#004d7a]" data-testid="section-psychiatrist-cta">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/images/logo.png" alt="Psychology Direct" className="h-8 brightness-0 invert" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-3" data-testid="text-psych-heading">
            Need a Psychiatrist?
          </h2>
          <p className="text-[#cee4f7] text-base sm:text-lg mb-6 max-w-xl mx-auto" data-testid="text-psych-body">
            We can also connect you with qualified psychiatrists for your medico-legal cases.
          </p>
          <Button
            size="lg"
            className="bg-white text-[#066aab] font-semibold"
            data-testid="button-find-psychiatrist"
          >
            Find a Psychiatrist
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      <section id="contact" className="py-16 sm:py-20 lg:py-24" data-testid="section-contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-[#066aab] font-semibold text-sm uppercase tracking-wide mb-3" data-testid="text-contact-label">
              Get in Touch
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3" data-testid="text-contact-heading">
              Contact us using the form below, or call us on{" "}
              <a href="tel:01306879075" className="text-[#066aab] whitespace-nowrap">
                01306 879 075
              </a>{" "}
              to find out how we can help.
            </h2>
          </div>

          <div className="max-w-2xl mx-auto">
            <form className="space-y-4" data-testid="form-contact">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                  <Input id="contact-name" placeholder="Your full name" data-testid="input-name" />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
                  <Input id="contact-email" type="email" placeholder="you@example.com" data-testid="input-email" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-phone" className="block text-sm font-medium text-foreground mb-1.5">Phone Number</label>
                  <Input id="contact-phone" type="tel" placeholder="01234 567890" data-testid="input-phone" />
                </div>
                <div>
                  <label htmlFor="contact-company" className="block text-sm font-medium text-foreground mb-1.5">Company / Firm</label>
                  <Input id="contact-company" placeholder="Your firm name" data-testid="input-company" />
                </div>
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-foreground mb-1.5">How can we help?</label>
                <Textarea
                  id="contact-message"
                  placeholder="Tell us about your case and requirements..."
                  className="min-h-[120px] resize-none"
                  data-testid="input-message"
                />
              </div>
              <Button size="lg" className="w-full sm:w-auto" data-testid="button-send-message">
                Send Message
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </div>
        </div>
      </section>

      <section id="process" className="py-16 sm:py-20 lg:py-24 bg-[#032552] dark:bg-[#021b3d]" data-testid="section-process">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#2eabe0] font-semibold text-sm uppercase tracking-wide mb-3" data-testid="text-process-label">
              Our Process
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white" data-testid="text-process-heading">
              It's simple, we understand your need and...
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {PROCESS_STEPS.map((step, index) => (
              <div key={index} className="text-center" data-testid={`card-process-${index}`}>
                <div className="w-16 h-16 mx-auto rounded-full bg-[#066aab] flex items-center justify-center mb-5">
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-[#2eabe0] font-sans text-xs font-bold uppercase tracking-widest mb-2">
                  Step {step.step}
                </div>
                <h3 className="font-serif text-xl font-bold text-white mb-3" data-testid={`text-process-title-${index}`}>
                  {step.title}
                </h3>
                <p className="text-[#cee4f7] text-sm leading-relaxed max-w-xs mx-auto" data-testid={`text-process-desc-${index}`}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-[#f0f5ff] dark:bg-[#0d1929]" data-testid="section-testimonial">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="absolute -inset-2 rounded-full bg-[#2eabe0]/15" />
                <img
                  src="/images/testimonial.png"
                  alt="Senior Litigation Solicitor"
                  className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full object-cover shadow-lg"
                  data-testid="img-testimonial"
                />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="text-[#066aab] text-5xl font-serif leading-none mb-4">"</div>
              <blockquote className="font-serif text-lg sm:text-xl lg:text-2xl text-foreground leading-relaxed italic mb-6" data-testid="text-testimonial-quote">
                I started using PD about six years ago after finding the company on the internet. I found staff
                to be efficient, friendly and helpful with a very good turnaround time. They do take the hard work
                out of locating relevant experts available within a specified area.
              </blockquote>
              <p className="text-muted-foreground font-sans text-sm font-semibold" data-testid="text-testimonial-author">
                — Senior Litigation Solicitor, London
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="resources" className="py-16 sm:py-20 lg:py-24" data-testid="section-resources">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <p className="text-[#066aab] font-semibold text-sm uppercase tracking-wide mb-3" data-testid="text-resources-label">
              Find Answers and Expert Guidance
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3" data-testid="text-resources-heading">
              Why not look through our resource centre?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-4">
              Educational articles and guides to help legal professionals understand psychological evidence.
            </p>
            <a href="/knowledge-hub" className="inline-flex items-center gap-1 text-[#066aab] text-sm font-semibold" data-testid="link-knowledge-hub">
              Visit our Knowledge Hub <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
            {[
              {
                title: "Understanding Expert Witness Reports",
                tag: "Guide",
                desc: "Everything solicitors need to know about commissioning and using psychological expert witness reports.",
              },
              {
                title: "PTSD in Personal Injury Claims",
                tag: "Education",
                desc: "How post-traumatic stress disorder is assessed and evidenced in medico-legal settings.",
              },
              {
                title: "Choosing the Right Expert",
                tag: "Advice",
                desc: "A practical guide to matching the right psychologist or psychiatrist to your specific case needs.",
              },
            ].map((resource, index) => (
              <Card
                key={index}
                className="p-6 bg-background border-none hover-elevate cursor-pointer"
                data-testid={`card-resource-${index}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-[#066aab]" />
                  <span className="text-xs font-bold uppercase tracking-wide text-[#066aab]">{resource.tag}</span>
                </div>
                <h3 className="font-sans text-base font-bold text-foreground mb-2" data-testid={`text-resource-title-${index}`}>
                  {resource.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {resource.desc}
                </p>
                <span className="text-[#066aab] text-sm font-semibold inline-flex items-center gap-1">
                  Read article <ChevronRight className="w-4 h-4" />
                </span>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="case-studies" className="py-16 sm:py-20 bg-[#f0f5ff] dark:bg-[#0d1929]" data-testid="section-case-studies">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-[#066aab] font-semibold text-sm uppercase tracking-wide mb-3" data-testid="text-cases-label">
              Case Studies
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground" data-testid="text-cases-heading">
              Read about how we've helped others
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {CASE_STUDIES.map((cs, index) => (
              <Card
                key={index}
                className="p-6 bg-background border-none hover-elevate cursor-pointer"
                data-testid={`card-case-study-${index}`}
              >
                <span className="inline-block px-3 py-1 rounded-full bg-[#032552] text-[#2eabe0] text-xs font-bold uppercase tracking-wide mb-4">
                  {cs.category}
                </span>
                <h3 className="font-sans text-base font-bold text-foreground mb-2" data-testid={`text-case-title-${index}`}>
                  {cs.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {cs.summary}
                </p>
                <span className="text-[#066aab] text-sm font-semibold inline-flex items-center gap-1">
                  Read more <ChevronRight className="w-4 h-4" />
                </span>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-16 sm:py-20 lg:py-24" data-testid="section-faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-[#066aab] font-semibold text-sm uppercase tracking-wide mb-3" data-testid="text-faq-label">
              Common Questions
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground" data-testid="text-faq-heading">
              Your questions answered
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-3" data-testid="accordion-faq">
            {FAQ_ITEMS.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border rounded-md px-5 bg-background"
                data-testid={`accordion-item-${index}`}
              >
                <AccordionTrigger className="text-left font-sans text-sm sm:text-base font-semibold py-4" data-testid={`button-faq-${index}`}>
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4" data-testid={`text-faq-answer-${index}`}>
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-[#032552] dark:bg-[#021b3d]" data-testid="section-cta-bottom">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-4" data-testid="text-cta-heading">
            Ready to find the right expert for your case?
          </h2>
          <p className="text-[#cee4f7] text-base sm:text-lg mb-6 max-w-xl mx-auto">
            Get in touch today and we'll match you with the perfect specialist.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              className="bg-[#2eabe0] text-[#032552] font-semibold"
              data-testid="button-contact-cta"
            >
              Contact Us Today
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <a
              href="tel:01306879075"
              className="flex items-center gap-2 text-white font-semibold text-sm"
              data-testid="link-phone-cta"
            >
              <Phone className="w-4 h-4" />
              01306 879 075
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-[#021b3d] dark:bg-[#010f22] py-12 sm:py-16" data-testid="footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div>
              <img
                src="/images/logo.png"
                alt="Psychology Direct"
                className="h-10 w-auto brightness-0 invert mb-4"
                data-testid="img-footer-logo"
              />
              <p className="text-[#cee4f7]/70 text-sm leading-relaxed">
                Leading provider of expert witness psychologists and psychiatrists for
                solicitors and insurers across the UK.
              </p>
            </div>

            <div>
              <h4 className="text-white font-sans text-sm font-bold uppercase tracking-wide mb-4">Services</h4>
              <ul className="space-y-2">
                {["Psychological Assessment", "Expert Witness Reports", "Medico-Legal Services", "Family & Child Cases"].map(
                  (item) => (
                    <li key={item}>
                      <a href="#services" className="text-[#cee4f7]/70 text-sm transition-colors hover:text-white">
                        {item}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-sans text-sm font-bold uppercase tracking-wide mb-4">Resources</h4>
              <ul className="space-y-2">
                {["Resource Centre", "Case Studies", "FAQ", "Training & CPD"].map((item) => (
                  <li key={item}>
                    <a href="#resources" className="text-[#cee4f7]/70 text-sm transition-colors hover:text-white">
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
                  <a href="tel:01306879075" className="flex items-center gap-2 text-[#cee4f7]/70 text-sm transition-colors hover:text-white" data-testid="link-footer-phone">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    01306 879 075
                  </a>
                </li>
                <li>
                  <a href="mailto:info@psychologydirect.co.uk" className="flex items-center gap-2 text-[#cee4f7]/70 text-sm transition-colors hover:text-white" data-testid="link-footer-email">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    info@psychologydirect.co.uk
                  </a>
                </li>
                <li>
                  <span className="flex items-start gap-2 text-[#cee4f7]/70 text-sm" data-testid="text-footer-address">
                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    Surrey, United Kingdom
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[#cee4f7]/50 text-xs" data-testid="text-copyright">
              &copy; {new Date().getFullYear()} Psychology Direct. All rights reserved.
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <a href="#" className="text-[#cee4f7]/50 text-xs transition-colors hover:text-white" data-testid="link-privacy">
                Privacy Policy
              </a>
              <a href="#" className="text-[#cee4f7]/50 text-xs transition-colors hover:text-white" data-testid="link-terms">
                Terms of Service
              </a>
              <a href="#" className="text-[#cee4f7]/50 text-xs transition-colors hover:text-white" data-testid="link-cookies">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

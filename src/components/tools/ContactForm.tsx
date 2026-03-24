'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Send, CheckCircle2, Phone, Mail } from 'lucide-react';

/* ── Types ─────────────────────────────────────────────────────────────── */

type Sector = '' | 'expert-witness' | 'education' | 'other';
type Salutation = '' | 'Mr.' | 'Mrs.' | 'Ms.' | 'Miss' | 'Dr.' | 'Prof.';
type LeadSource = '' | 'repeat' | 'google' | 'recommendation' | 'web-form' | 'social-media' | 'bps' | 'professional-directory' | 'mailshot' | 'exhibition' | 'advertisement' | 'network-event' | 'referral';

interface FormState {
  sector: Sector;
  salutation: Salutation;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  leadSource: LeadSource;
  message: string;
  updatesExpertWitness: boolean;
  updatesEducation: boolean;
  privacyAccepted: boolean;
}

interface FormErrors {
  sector?: string;
  salutation?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  email?: string;
  phone?: string;
  leadSource?: string;
  privacyAccepted?: string;
}

const INITIAL_STATE: FormState = {
  sector: '',
  salutation: '',
  firstName: '',
  lastName: '',
  company: '',
  email: '',
  phone: '',
  leadSource: '',
  message: '',
  updatesExpertWitness: false,
  updatesEducation: false,
  privacyAccepted: false,
};

/* ── Validation ────────────────────────────────────────────────────────── */

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!form.sector) errors.sector = 'Please select a sector';
  if (!form.salutation) errors.salutation = 'Please select a salutation';
  if (!form.firstName.trim()) errors.firstName = 'First name is required';
  if (!form.lastName.trim()) errors.lastName = 'Last name is required';
  if (!form.company.trim()) errors.company = 'Company is required';

  if (!form.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!form.phone.trim()) errors.phone = 'Phone is required';
  if (!form.leadSource) errors.leadSource = 'Please tell us how you heard about us';
  if (!form.privacyAccepted) errors.privacyAccepted = 'You must accept the privacy policy';

  return errors;
}

/* ── Field wrapper ─────────────────────────────────────────────────────── */

function FormField({
  label,
  name,
  required,
  error,
  children,
}: {
  label: string;
  name?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  const fieldId = name ? `field-${name}` : undefined;
  const errorId = name ? `${name}-error` : undefined;
  return (
    <div className="space-y-1.5">
      <label htmlFor={fieldId} className="text-sm font-medium" style={{ color: 'var(--brand-navy)' }}>
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
      {error && <p id={errorId} role="alert" className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

const selectClasses = 'flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

/* ── Component ─────────────────────────────────────────────────────────── */

export function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [touched, setTouched] = useState(false);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (touched && errors[key as keyof FormErrors]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key as keyof FormErrors];
        return next;
      });
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    setSubmitError('');

    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Submission failed');
      }
      setSubmitted(true);

      // GA4 conversion event
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'generate_lead', {
          event_category: 'Contact',
          event_label: form.sector,
          value: 1,
        });
      }
    } catch (err) {
      console.error('[ContactForm] Submission failed:', err);
      const msg = err instanceof Error ? err.message : '';
      setSubmitError(msg.includes('required') || msg.includes('Invalid')
        ? msg
        : 'Something went wrong. Please try again or call us on 01306 879 975.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-border p-8 sm:p-12">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full" style={{ background: '#dcfce7' }}>
              <CheckCircle2 className="w-8 h-8" style={{ color: '#16a34a' }} />
            </div>
          </div>
          <h3 className="text-2xl font-bold font-serif" style={{ color: 'var(--brand-navy)' }}>
            Thank You
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            We&rsquo;ve received your enquiry and aim to provide you with up to 3 CVs, quotations &amp; timescales within 24 hours. For urgent queries, please call us directly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button asChild variant="outline">
              <a href="tel:01306879975">
                <Phone className="w-4 h-4 mr-1" />
                01306 879 975
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="mailto:enquiries@psychologydirect.co.uk">
                <Mail className="w-4 h-4 mr-1" />
                Email Us
              </a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl shadow-sm border border-border p-6 sm:p-8" style={{ background: '#f5f6f8' }}>
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Sector */}
        <FormField label="Sector" name="sector" required error={errors.sector}>
          <select
            id="field-sector"
            name="sector"
            required
            value={form.sector}
            onChange={(e) => updateField('sector', e.target.value as Sector)}
            aria-describedby={errors.sector ? 'sector-error' : undefined}
            className={cn(selectClasses, errors.sector && 'border-destructive')}
          >
            <option value="">Select sector...</option>
            <option value="expert-witness">Expert Witness</option>
            <option value="education">Education</option>
            <option value="other">Other</option>
          </select>
        </FormField>

        {/* Salutation & Names */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="Salutation" name="salutation" required error={errors.salutation}>
            <select
              id="field-salutation"
              name="salutation"
              required
              value={form.salutation}
              onChange={(e) => updateField('salutation', e.target.value as Salutation)}
              aria-describedby={errors.salutation ? 'salutation-error' : undefined}
              className={cn(selectClasses, errors.salutation && 'border-destructive')}
            >
              <option value="">Select...</option>
              <option value="Mr.">Mr.</option>
              <option value="Mrs.">Mrs.</option>
              <option value="Ms.">Ms.</option>
              <option value="Miss">Miss</option>
              <option value="Dr.">Dr.</option>
              <option value="Prof.">Prof.</option>
            </select>
          </FormField>

          <FormField label="First Name" name="firstName" required error={errors.firstName}>
            <Input
              id="field-firstName"
              name="firstName"
              required
              value={form.firstName}
              onChange={(e) => updateField('firstName', e.target.value)}
              aria-describedby={errors.firstName ? 'firstName-error' : undefined}
              className={cn(errors.firstName && 'border-destructive')}
            />
          </FormField>

          <FormField label="Last Name" name="lastName" required error={errors.lastName}>
            <Input
              id="field-lastName"
              name="lastName"
              required
              value={form.lastName}
              onChange={(e) => updateField('lastName', e.target.value)}
              aria-describedby={errors.lastName ? 'lastName-error' : undefined}
              className={cn(errors.lastName && 'border-destructive')}
            />
          </FormField>
        </div>

        {/* Company & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Company" name="company" required error={errors.company}>
            <Input
              id="field-company"
              name="company"
              required
              value={form.company}
              onChange={(e) => updateField('company', e.target.value)}
              aria-describedby={errors.company ? 'company-error' : undefined}
              className={cn(errors.company && 'border-destructive')}
            />
          </FormField>

          <FormField label="Email" name="email" required error={errors.email}>
            <Input
              id="field-email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={cn(errors.email && 'border-destructive')}
            />
          </FormField>
        </div>

        {/* Phone & Lead Source */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Phone" name="phone" required error={errors.phone}>
            <Input
              id="field-phone"
              name="phone"
              type="tel"
              required
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
              className={cn(errors.phone && 'border-destructive')}
            />
          </FormField>

          <FormField label="How did you hear about us?" name="leadSource" required error={errors.leadSource}>
            <select
              id="field-leadSource"
              name="leadSource"
              required
              value={form.leadSource}
              onChange={(e) => updateField('leadSource', e.target.value as LeadSource)}
              aria-describedby={errors.leadSource ? 'leadSource-error' : undefined}
              className={cn(selectClasses, errors.leadSource && 'border-destructive')}
            >
              <option value="">Select...</option>
              <option value="repeat">Repeat Client</option>
              <option value="google">Google</option>
              <option value="recommendation">Recommendation</option>
              <option value="web-form">Web Form</option>
              <option value="social-media">Social Media</option>
              <option value="bps">BPS</option>
              <option value="professional-directory">Professional Directory</option>
              <option value="mailshot">Mailshot</option>
              <option value="exhibition">Exhibition</option>
              <option value="advertisement">Advertisement</option>
              <option value="network-event">Network Event</option>
              <option value="referral">Referral</option>
            </select>
          </FormField>
        </div>

        {/* Message */}
        <FormField label="Message" name="message">
          <Textarea
            id="field-message"
            name="message"
            value={form.message}
            onChange={(e) => updateField('message', e.target.value)}
            placeholder={
              form.sector === 'expert-witness'
                ? 'Please include:\n- Case reference\n- Client\'s DoB or age\n- Location of client and if the assessment can be remote\n- Brief details of case and assessment required\n- Approximate bundle page count\n- Any deadline\n- How the case will be funded'
                : 'Provide details of what you require, including type of assessment, location, deadline etc.'
            }
            rows={form.sector === 'expert-witness' ? 8 : 5}
          />
        </FormField>

        {/* Updates preference */}
        <div className="space-y-2">
          <p className="text-sm font-medium" style={{ color: 'var(--brand-navy)' }}>
            Keep me updated on
          </p>
          <p className="text-xs text-muted-foreground">
            We won&rsquo;t bombard you with junk, just occasional news for your profession.
          </p>
          <div className="flex gap-6 pt-1">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.updatesExpertWitness}
                onChange={(e) => updateField('updatesExpertWitness', e.target.checked)}
                className="rounded border-input h-4 w-4 accent-[var(--brand-azure-vivid)]"
              />
              Expert Witness
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.updatesEducation}
                onChange={(e) => updateField('updatesEducation', e.target.checked)}
                className="rounded border-input h-4 w-4 accent-[var(--brand-azure-vivid)]"
              />
              Education
            </label>
          </div>
        </div>

        {/* Privacy policy */}
        <div className="space-y-1.5">
          <label className="flex items-start gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={form.privacyAccepted}
              onChange={(e) => updateField('privacyAccepted', e.target.checked)}
              className="rounded border-input h-4 w-4 mt-0.5 accent-[var(--brand-azure-vivid)]"
              required
            />
            <span>
              I agree to the{' '}
              <a href="/privacy-policy/" className="underline font-medium" style={{ color: 'var(--brand-azure-vivid)' }}>
                Privacy Policy
              </a>
              <span className="text-destructive ml-0.5">*</span>
            </span>
          </label>
          {errors.privacyAccepted && (
            <p role="alert" className="text-xs text-destructive">{errors.privacyAccepted}</p>
          )}
        </div>

        {/* Submit */}
        {submitError && (
          <p role="alert" className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-md">{submitError}</p>
        )}
        <div className="pt-2">
          <Button
            type="submit"
            size="lg"
            disabled={submitting}
            className="w-full sm:w-auto font-semibold text-white"
            style={{ background: 'var(--brand-navy)' }}
          >
            <Send className="w-4 h-4 mr-2" />
            {submitting ? 'Sending...' : 'Send Enquiry'}
          </Button>
        </div>
      </form>
    </div>
  );
}

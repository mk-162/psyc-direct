'use client';

import { useState, type FormEvent } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Send, CheckCircle2, Phone, Mail } from 'lucide-react';

/* ── Types ─────────────────────────────────────────────────────────────── */

type EnquiryType = '' | 'expert-witness' | 'education-assessment' | 'join-network' | 'general';

interface FormState {
  name: string;
  email: string;
  phone: string;
  organisation: string;
  enquiryType: EnquiryType;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  enquiryType?: string;
  message?: string;
}

const INITIAL_STATE: FormState = {
  name: '',
  email: '',
  phone: '',
  organisation: '',
  enquiryType: '',
  message: '',
};

/* ── Validation ────────────────────────────────────────────────────────── */

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!form.name.trim()) {
    errors.name = 'Name is required';
  }

  if (!form.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!form.enquiryType) {
    errors.enquiryType = 'Please select an enquiry type';
  }

  if (!form.message.trim()) {
    errors.message = 'Message is required';
  }

  return errors;
}

/* ── Field wrapper ─────────────────────────────────────────────────────── */

function FormField({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium" style={{ color: 'var(--brand-navy)' }}>
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

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
    // Clear error on change
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
      if (!res.ok) throw new Error('Submission failed');
      setSubmitted(true);
    } catch {
      setSubmitError('Something went wrong. Please try again or call us on 01306 879 975.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div
                className="flex items-center justify-center w-16 h-16 rounded-full"
                style={{ background: '#dcfce7' }}
              >
                <CheckCircle2 className="w-8 h-8" style={{ color: '#16a34a' }} />
              </div>
            </div>
            <h3
              className="text-2xl font-bold font-serif"
              style={{ color: 'var(--brand-navy)' }}
            >
              Thank You
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We&rsquo;ve received your enquiry and will respond within 24 hours.
              For urgent queries, please call us directly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                asChild
                variant="outline"
              >
                <a href="tel:01306879975">
                  <Phone className="w-4 h-4 mr-1" />
                  01306 879 975
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
              >
                <a href="mailto:enquiries@psychologydirect.co.uk">
                  <Mail className="w-4 h-4 mr-1" />
                  Email Us
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3 mb-1">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-md"
            style={{ background: 'var(--brand-azure-light)', color: 'var(--brand-azure-dark)' }}
          >
            <Mail className="w-5 h-5" />
          </div>
          <CardTitle className="font-serif" style={{ color: 'var(--brand-navy)' }}>
            Get in Touch
          </CardTitle>
        </div>
        <CardDescription>
          Tell us about your requirements and we&rsquo;ll get back to you within 24 hours.
          Alternatively, call us on{' '}
          <a
            href="tel:01306879975"
            className="font-medium"
            style={{ color: 'var(--brand-azure-dark)' }}
          >
            01306 879 975
          </a>.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Name" required error={errors.name}>
              <Input
                name="name"
                required
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Your full name"
                aria-describedby={errors.name ? 'name-error' : undefined}
                className={cn(errors.name && 'border-destructive')}
              />
            </FormField>

            <FormField label="Email" required error={errors.email}>
              <Input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="you@example.com"
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={cn(errors.email && 'border-destructive')}
              />
            </FormField>
          </div>

          {/* Phone & Organisation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Phone">
              <Input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="Optional"
              />
            </FormField>

            <FormField label="Organisation">
              <Input
                name="organisation"
                value={form.organisation}
                onChange={(e) => updateField('organisation', e.target.value)}
                placeholder="Optional"
              />
            </FormField>
          </div>

          {/* Enquiry type */}
          <FormField label="Enquiry Type" required error={errors.enquiryType}>
            <select
              name="enquiryType"
              required
              value={form.enquiryType}
              onChange={(e) => updateField('enquiryType', e.target.value as EnquiryType)}
              className={cn(
                'flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                errors.enquiryType && 'border-destructive'
              )}
            >
              <option value="">Select enquiry type...</option>
              <option value="expert-witness">Expert Witness</option>
              <option value="education-assessment">Education Assessment</option>
              <option value="join-network">Join Our Network</option>
              <option value="general">General Enquiry</option>
            </select>
          </FormField>

          {/* Message */}
          <FormField label="Message" required error={errors.message}>
            <Textarea
              name="message"
              required
              value={form.message}
              onChange={(e) => updateField('message', e.target.value)}
              placeholder="Please describe your requirements..."
              rows={5}
              className={cn(errors.message && 'border-destructive')}
            />
          </FormField>

          {/* Submit */}
          {submitError && (
            <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-md">{submitError}</p>
          )}
          <div className="pt-2">
            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              className="w-full sm:w-auto font-semibold"
              style={{ background: 'var(--brand-azure)', color: 'var(--brand-navy)' }}
            >
              <Send className="w-4 h-4 mr-2" />
              {submitting ? 'Sending...' : 'Send Enquiry'}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            By submitting this form you agree to our privacy policy. We will never share your details
            with third parties.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FaqAccordionData {
  heading?: string;
  faqs?: {
    question: string;
    answer: string;
  }[];
}

export const FaqAccordion = ({ data }: { data: FaqAccordionData }) => {
  const faqs = data.faqs ?? [];
  if (!faqs.length) return null;

  return (
    <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-3xl mx-auto">
        {data.heading && (
          <h2 className="font-sans text-2xl sm:text-3xl font-bold text-center mb-10" style={{ color: 'var(--brand-navy)' }}>
            {data.heading}
          </h2>
        )}
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left font-sans text-sm font-semibold hover:no-underline" style={{ color: 'var(--brand-navy)' }}>
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

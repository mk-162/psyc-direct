import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Team Page Template | Design System",
  description: "Template for Meet Your Care Team — portrait cards, featured clinician, stats, CTA.",
};

const team = [
  {
    image: "/images/penny_consultation.jpg",
    label: "General & Preventive Medicine",
    name: "Dr. Penny Ashworth",
    role: "Medical Director",
    desc: "20 years in preventive medicine. Dr. Ashworth trained at Oxford and spent a decade at Bupa Health Clinics before co-founding Cocoon. She believes deeply in care that starts before symptoms appear.",
  },
  {
    image: "/images/kate_consultation.jpg",
    label: "Women's Health & Hormones",
    name: "Dr. Kate Fellowes",
    role: "Lead Clinician — Women's Health",
    desc: "Specialist in women's health across all life stages. Dr. Fellowes is one of the UK's leading voices on menopause care and female hormone health, having trained at King's College London.",
  },
  {
    image: "/images/alice_ultrasound_scan.jpg",
    label: "Diagnostic Imaging",
    name: "Alice Brennan",
    role: "Specialist Sonographer",
    desc: "A senior sonographer with 15 years of experience in diagnostic imaging. Alice brings exceptional technical skill and a warm, reassuring manner to every scan she performs at Cocoon.",
  },
  {
    image: "/images/staff_photo_1.jpg",
    label: "Member Experience",
    name: "James Whitfield",
    role: "Head of Member Relations",
    desc: "James ensures that every touchpoint — from your first enquiry to ongoing care — feels thoughtful and seamless. He leads our member experience team with warmth and precision.",
  },
];

const stats = [
  { value: "47+", label: "Years combined clinical experience" },
  { value: "3,200", label: "Members in active care" },
  { value: "98%", label: "Member satisfaction score" },
  { value: "12", label: "Clinical and support specialists" },
];

export default function TeamPageTemplate() {
  return (
    <main>

      {/* ─── HERO: Immersive with team image ─── */}
      <section className="hero-immersive section-bleed theme-dark">
        <img
          src="/images/team_inside.jpg"
          alt="Cocoon care team"
          className="hero-immersive-image"
        />
        <div className="hero-immersive-overlay" />
        <div className="hero-immersive-content">
          <div className="eyebrow-hero">— Meet Your Care Team</div>
          <h1 className="heading-display-xl text-cream">
            The people behind<br />your care
          </h1>
          <p className="hero-immersive-body">
            A team of specialists who chose Cocoon because they believe the same thing you do —
            that exceptional care requires time, attention, and a genuine relationship.
          </p>
        </div>
      </section>

      {/* ─── INTRO: Philosophy ─── */}
      <section className="section-editorial-lg">
        <div className="container-narrow text-center">
          <div className="eyebrow eyebrow-center">— Our Approach</div>
          <p className="body-editorial">
            Every clinician at Cocoon was chosen for two things equally: clinical excellence,
            and the ability to build a real relationship with the people in their care.
            We believe the two are inseparable.
          </p>
        </div>
      </section>

      {/* ─── PORTRAIT CARDS: The full team ─── */}
      <section className="section-editorial">
        <div className="container-wide">
          <div className="section-header-center">
            <div className="eyebrow eyebrow-center">— Our Specialists</div>
            <h2 className="heading-display-lg">Your care, in expert hands</h2>
          </div>
          <div className="cards-portrait-grid mt-section">
            {team.map((member, i) => (
              <div key={i} className="card-portrait">
                <img
                  src={member.image}
                  alt={member.name}
                  className="card-portrait-image"
                />
                <div className="card-portrait-label">{member.label}</div>
                <h3 className="card-portrait-title">{member.name}</h3>
                <p className="card-portrait-label">{member.role}</p>
                <p className="card-portrait-desc">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED CLINICIAN: Editorial spotlight ─── */}
      <section className="section-editorial-stone">
        <div className="container-wide">
          <div className="content-media-grid">
            <div className="content-side">
              <img
                src="/images/penny_consultation.jpg"
                alt="Dr. Penny Ashworth"
                className="full-width-image"
              />
            </div>
            <div className="content-side">
              <div className="eyebrow">— Medical Director</div>
              <h2 className="heading-display-lg">Dr. Penny Ashworth</h2>
              <p className="body-editorial mt-content">
                Penny trained at Oxford before spending a decade shaping preventive medicine
                at some of the UK's leading health clinics. She co-founded Cocoon because
                she wanted to practise medicine the way she always believed it should be —
                with time, with depth, and without compromise.
              </p>
              <p className="body-editorial mt-content">
                As Medical Director, she sets the clinical standards for every consultation
                at Cocoon and remains an active clinician. Many of our founding members
                see her personally.
              </p>
              <blockquote className="clinician-quote">
                "I've never once left a consultation wishing I'd spent less time with a patient."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="section-editorial">
        <div className="container-wide">
          <div className="product-stats">
            <div className="product-stats-grid">
              {stats.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIAL ─── */}
      <section className="section-editorial-sage">
        <div className="container-narrow">
          <div className="testimonial-content text-center">
            <blockquote className="testimonial-blockquote">
              "The team at Cocoon are unlike any clinicians I've seen before. They remember
              everything. They ask the right questions. And I never feel like I'm taking up
              too much of anyone's time."
            </blockquote>
            <div className="testimonial-meta">
              <div className="testimonial-name">Caroline M.</div>
              <div className="testimonial-role">Complete Member since 2022</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DARK CTA ─── */}
      <section className="section-editorial-dark">
        <div className="container-narrow text-center">
          <div className="dark-cta-content">
            <div className="eyebrow-light eyebrow-center">— Join Cocoon</div>
            <h2 className="heading-display-lg text-cream">
              Meet your clinician<br />in person
            </h2>
            <p className="body-editorial-dark mt-content">
              Every new member begins with a Welcome Consultation — a chance to meet your
              clinician, discuss your health history, and understand what Cocoon can do for you.
            </p>
            <div className="dark-cta-buttons">
              <Link href="/utility/book-visit" className="btn-cream">Book a Welcome Visit</Link>
              <Link href="/membership/index" className="btn-ghost">View Membership</Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

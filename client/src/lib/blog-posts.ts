export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  authorRole: string;
  publishedDate: string;
  readTime: number;
  image: string;
  featured?: boolean;
}

export const BLOG_CATEGORY_DEFS = [
  { name: "Company News", slug: "company-news" },
  { name: "Industry Insights", slug: "industry-insights" },
  { name: "Expert Profiles", slug: "expert-profiles" },
  { name: "Case Law Updates", slug: "case-law-updates" },
  { name: "Wellbeing", slug: "wellbeing" },
];

export const BLOG_TAGS = [
  "Expert Witness", "Team News", "CPD", "Psychology",
  "Legal Updates", "Mental Health", "Recruitment", "Events",
  "Court Decisions", "Medico-Legal", "Research", "Wellbeing",
  "Practice Tips", "Regulation", "Training",
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "b1",
    slug: "psychology-direct-expands-northern-panel",
    title: "Psychology Direct Expands Expert Panel Across the North of England",
    excerpt: "We are pleased to announce the addition of twelve new psychologists and psychiatrists to our Northern panel, strengthening our coverage across Yorkshire, the North West, and the North East.",
    content: `
      <h2>Growing Our Northern Presence</h2>
      <p>At Psychology Direct, we are committed to providing nationwide coverage for solicitors and insurers who need access to qualified psychological experts. Today we are delighted to announce a significant expansion of our panel across the North of England.</p>
      <p>Twelve new experts have joined our network, bringing specialist skills in clinical psychology, forensic psychology, neuropsychology, and child and adolescent mental health. This expansion means we can now offer even faster turnaround times and more local assessment options for cases in Yorkshire, Greater Manchester, Merseyside, Lancashire, and the North East.</p>

      <h2>Why Local Coverage Matters</h2>
      <p>Access to local experts reduces travel time for claimants, lowers assessment costs, and allows for more timely report delivery. For solicitors managing cases with tight court deadlines, having experts nearby makes a tangible difference to the smooth running of a case.</p>
      <p>Our new panel members have been through our rigorous vetting process, which includes verification of professional registration, review of sample reports, reference checks, and an assessment of medico-legal experience.</p>

      <h2>Specialisms Added</h2>
      <p>The expansion brings particular strength in several high-demand areas:</p>
      <ul>
        <li><strong>Trauma and PTSD</strong> — three new clinical psychologists with extensive experience in personal injury trauma assessments</li>
        <li><strong>Child and family</strong> — two specialists in family court assessments and parental capacity evaluations</li>
        <li><strong>Neuropsychology</strong> — two neuropsychologists experienced in traumatic brain injury and cognitive assessment</li>
        <li><strong>Forensic psychiatry</strong> — three consultant forensic psychiatrists with court testimony experience</li>
        <li><strong>Learning disability</strong> — two experts in capacity assessments and learning disability evaluations</li>
      </ul>

      <h2>Get in Touch</h2>
      <p>If you have a case in the North of England and need a psychological expert, contact our team today. We will match you with the most appropriate expert from our expanded panel within 24 hours of receiving your instruction.</p>
    `,
    category: "Company News",
    tags: ["Team News", "Recruitment", "Expert Witness"],
    author: "Psychology Direct",
    authorRole: "Editorial Team",
    publishedDate: "2025-12-02",
    readTime: 4,
    image: "/images/article-expert-witness.png",
    featured: true,
  },
  {
    id: "b2",
    slug: "whiplash-reforms-psychological-claims",
    title: "How the Whiplash Reforms Are Affecting Psychological Injury Claims",
    excerpt: "An analysis of how recent whiplash reform legislation is reshaping the landscape for psychological injury claims in personal injury litigation, and what solicitors need to know.",
    content: `
      <h2>The Changing Landscape</h2>
      <p>The Civil Liability Act 2018 and the subsequent Whiplash Injury Regulations 2021 introduced a fixed tariff system for whiplash injuries and raised the small claims limit for road traffic accident (RTA) claims. While these reforms primarily target physical whiplash injuries, they have had significant knock-on effects for psychological injury claims arising from RTAs.</p>

      <h2>Impact on Psychological Claims</h2>
      <p>Since the reforms came into effect, we have observed several trends in the medico-legal psychology market:</p>
      <ul>
        <li><strong>Increased focus on standalone psychological claims</strong> — where physical injuries fall below the small claims threshold, solicitors are increasingly focusing on the psychological component of the claim</li>
        <li><strong>Greater scrutiny of psychological evidence</strong> — insurers are more robustly challenging psychological injury claims, making the quality of expert evidence more important than ever</li>
        <li><strong>Rising demand for early psychological assessment</strong> — to establish the severity and prognosis of psychological injury early in the claims process</li>
        <li><strong>More complex cases reaching litigation</strong> — simpler claims are resolved through the Official Injury Claim portal, meaning the cases that reach solicitors tend to be more complex</li>
      </ul>

      <h2>Practical Implications for Solicitors</h2>
      <p>For solicitors handling RTA-related psychological injury claims, we recommend:</p>
      <ul>
        <li>Instructing a qualified psychological expert early to establish the nature and severity of the psychological injury</li>
        <li>Ensuring the expert is appropriately qualified — HCPC-registered clinical or forensic psychologists, or GMC-registered psychiatrists</li>
        <li>Requesting psychometric testing as part of the assessment to provide objective evidence of symptom severity</li>
        <li>Considering the distinction between adjustment disorder, acute stress disorder, and PTSD, as these have different prognoses and treatment implications</li>
      </ul>

      <h2>Looking Ahead</h2>
      <p>As the personal injury landscape continues to evolve, the importance of high-quality psychological evidence will only increase. Psychology Direct is committed to helping solicitors navigate these changes by providing access to appropriately qualified experts who understand both the clinical and legal aspects of psychological injury claims.</p>
    `,
    category: "Industry Insights",
    tags: ["Legal Updates", "Medico-Legal", "Expert Witness"],
    author: "Dr Sarah Mitchell",
    authorRole: "Clinical Psychologist",
    publishedDate: "2025-11-18",
    readTime: 7,
    image: "/images/article-court.png",
  },
  {
    id: "b3",
    slug: "meet-the-expert-dr-james-harrington",
    title: "Meet the Expert: Dr James Harrington, Consultant Psychiatrist",
    excerpt: "In this profile we speak to Dr James Harrington about his career in forensic psychiatry, his approach to medico-legal work, and what makes a good expert witness report.",
    content: `
      <h2>Career Background</h2>
      <p>Dr James Harrington is a Consultant Forensic Psychiatrist with over 20 years of clinical experience. He trained at the Maudsley Hospital and the Institute of Psychiatry in London before taking up consultant posts in both NHS and independent practice. He has been providing medico-legal reports for over 15 years.</p>

      <h2>What Drew You to Medico-Legal Work?</h2>
      <p>"I was always interested in the intersection between psychiatry and the law. The medico-legal arena requires you to think differently about clinical problems — you need to be precise, evidence-based, and willing to have your opinions scrutinised. It keeps you sharp and ensures you never become complacent in your clinical reasoning."</p>

      <h2>What Makes a Good Expert Witness Report?</h2>
      <p>"Clarity. The best reports are those that a non-clinician can read and understand. You need to explain complex psychiatric concepts in plain language without oversimplifying. The report should follow a logical structure, with clear reasoning that connects the clinical findings to the legal questions being asked."</p>
      <p>"I also think thoroughness is essential. Every opinion needs to be supported by evidence — whether that's from the clinical assessment, psychometric testing, medical records, or the published literature. If you can't support an opinion, you shouldn't offer it."</p>

      <h2>Areas of Specialism</h2>
      <p>Dr Harrington's medico-legal work covers:</p>
      <ul>
        <li>Criminal cases — fitness to plead, diminished responsibility, and psychiatric defences</li>
        <li>Personal injury — PTSD, depression, and anxiety following accidents and assaults</li>
        <li>Employment law — workplace stress, bullying, and psychiatric harm in the workplace</li>
        <li>Immigration — psychiatric reports for asylum and human rights cases</li>
        <li>Capacity assessments — under the Mental Capacity Act 2005</li>
      </ul>

      <h2>Advice for Solicitors</h2>
      <p>"Give your expert a clear letter of instruction with specific questions. The more focused the questions, the more useful the report will be. And don't hesitate to call and discuss the case informally before formally instructing — a brief conversation can save both parties time and ensure the right expert is instructed."</p>
    `,
    category: "Expert Profiles",
    tags: ["Expert Witness", "Psychology", "Practice Tips"],
    author: "Psychology Direct",
    authorRole: "Editorial Team",
    publishedDate: "2025-10-30",
    readTime: 5,
    image: "/images/article-choosing-expert.png",
  },
  {
    id: "b4",
    slug: "supreme-court-psychological-evidence-ruling",
    title: "Supreme Court Ruling Reinforces Standards for Psychological Expert Evidence",
    excerpt: "A recent Supreme Court decision has clarified the standards expected of psychological expert evidence in civil proceedings. We examine the implications for practitioners and solicitors.",
    content: `
      <h2>The Decision</h2>
      <p>In a landmark ruling handed down earlier this year, the Supreme Court addressed the admissibility and weight of psychological expert evidence in personal injury proceedings. The judgment emphasised several principles that will shape how psychological expert evidence is prepared and presented going forward.</p>

      <h2>Key Points from the Judgment</h2>
      <ul>
        <li><strong>Methodology must be transparent</strong> — the court stressed that experts must clearly set out the assessment methods used, including which psychometric measures were administered and why they were selected</li>
        <li><strong>Symptom validity testing is expected</strong> — the judgment noted that in cases where the severity of psychological symptoms is in dispute, failure to administer symptom validity measures may undermine the weight given to the expert's evidence</li>
        <li><strong>Pre-existing conditions must be addressed</strong> — experts are expected to consider and comment on any pre-existing psychological conditions or vulnerabilities, and to distinguish between pre-existing and post-incident symptomatology</li>
        <li><strong>Prognosis must be evidence-based</strong> — prognostic opinions should reference the relevant clinical literature and treatment guidelines rather than relying solely on clinical impression</li>
      </ul>

      <h2>Implications for Experts</h2>
      <p>This ruling reinforces the importance of rigorous, evidence-based practice in medico-legal psychology. Experts who cut corners — by omitting validity testing, failing to review medical records comprehensively, or offering opinions without adequate reasoning — risk having their evidence given reduced weight or excluded entirely.</p>

      <h2>Implications for Solicitors</h2>
      <p>When instructing psychological experts, solicitors should ensure that:</p>
      <ul>
        <li>The expert is aware of the current standards and expectations of the court</li>
        <li>All relevant medical records and documentation are provided to the expert</li>
        <li>The letter of instruction specifically requests that validity testing be included in the assessment</li>
        <li>The expert addresses pre-existing conditions in their report</li>
      </ul>

      <h2>Our Response</h2>
      <p>At Psychology Direct, we welcome this ruling as it aligns with the standards we already expect from our panel of experts. All reports commissioned through Psychology Direct include comprehensive psychometric testing, validity measures, and thorough consideration of pre-existing factors.</p>
    `,
    category: "Case Law Updates",
    tags: ["Court Decisions", "Legal Updates", "Expert Witness"],
    author: "Prof Richard Townsend",
    authorRole: "Forensic Psychologist",
    publishedDate: "2025-10-15",
    readTime: 8,
    image: "/images/article-court.png",
  },
  {
    id: "b5",
    slug: "psychology-direct-annual-conference",
    title: "Psychology Direct Hosts Annual Expert Witness Conference",
    excerpt: "Our annual conference brought together over 150 psychologists, psychiatrists, and legal professionals for a day of CPD, networking, and discussion on the latest developments in medico-legal psychology.",
    content: `
      <h2>A Day of Learning and Connection</h2>
      <p>Psychology Direct's annual Expert Witness Conference took place last month at the Royal College of Physicians in London. The event brought together over 150 delegates from across the UK, including clinical and forensic psychologists, psychiatrists, solicitors, barristers, and insurers.</p>

      <h2>Programme Highlights</h2>
      <p>The conference featured a packed programme of presentations, panel discussions, and workshops:</p>
      <ul>
        <li><strong>Keynote address</strong> — Professor Dame Sue Black on the evolving role of expert evidence in the justice system</li>
        <li><strong>Panel discussion</strong> — "Getting it Right: What Judges Want from Psychological Experts" featuring two senior circuit judges and a family court judge</li>
        <li><strong>Workshop</strong> — Practical session on effective report writing, led by experienced medico-legal psychologists</li>
        <li><strong>Presentation</strong> — Latest research on symptom validity testing and its application in medico-legal assessments</li>
        <li><strong>Networking lunch</strong> — structured networking sessions connecting legal professionals with psychological experts</li>
      </ul>

      <h2>CPD Accreditation</h2>
      <p>The conference was accredited for 6 hours of CPD by the British Psychological Society and the Royal College of Psychiatrists, helping our panel members maintain their professional development requirements.</p>

      <h2>Looking Forward</h2>
      <p>We are already planning next year's conference, with a focus on digital assessments, remote working in medico-legal practice, and the evolving legal framework for expert evidence. Details will be announced in early 2026.</p>

      <h2>Join Our Panel</h2>
      <p>If you are a qualified psychologist or psychiatrist interested in medico-legal work, we are always looking for experienced professionals to join our expert panel. Contact us to find out more about the benefits of working with Psychology Direct.</p>
    `,
    category: "Company News",
    tags: ["Events", "CPD", "Team News"],
    author: "Psychology Direct",
    authorRole: "Editorial Team",
    publishedDate: "2025-09-28",
    readTime: 5,
    image: "/images/article-expert-witness.png",
  },
  {
    id: "b6",
    slug: "remote-psychological-assessments-best-practice",
    title: "Remote Psychological Assessments: Best Practice and Limitations",
    excerpt: "An evidence-based review of remote psychological assessments, examining when they are appropriate, their limitations, and best practice guidelines for medico-legal work.",
    content: `
      <h2>The Rise of Remote Assessment</h2>
      <p>The COVID-19 pandemic accelerated the adoption of remote psychological assessments across the profession. While face-to-face assessment remains the gold standard in medico-legal work, remote assessments have become an accepted and sometimes necessary alternative. Understanding when remote assessment is appropriate — and when it is not — is essential for both experts and instructing solicitors.</p>

      <h2>When Remote Assessment May Be Appropriate</h2>
      <ul>
        <li>The claimant has mobility difficulties or is geographically remote</li>
        <li>The assessment is primarily interview-based without complex psychometric testing</li>
        <li>A preliminary screening assessment is required before a full face-to-face evaluation</li>
        <li>The claimant's anxiety or agoraphobia makes attending a clinic difficult</li>
      </ul>

      <h2>Limitations and Risks</h2>
      <ul>
        <li><strong>Psychometric testing</strong> — many standardised tests are not validated for remote administration, and their use remotely may compromise the reliability and validity of results</li>
        <li><strong>Behavioural observation</strong> — remote assessment limits the clinician's ability to observe body language, affect, and interpersonal behaviour</li>
        <li><strong>Technology barriers</strong> — poor internet connectivity, unfamiliarity with technology, and environmental distractions can affect assessment quality</li>
        <li><strong>Confidentiality</strong> — ensuring a private, confidential space for the assessment is harder to guarantee remotely</li>
        <li><strong>Validity concerns</strong> — it is more difficult to ensure the claimant is not being coached or referring to notes during a remote assessment</li>
      </ul>

      <h2>Best Practice Guidelines</h2>
      <p>When conducting remote assessments, experts should:</p>
      <ul>
        <li>Document the reason for conducting the assessment remotely</li>
        <li>Use a secure, GDPR-compliant video conferencing platform</li>
        <li>Confirm the claimant's identity at the start of the session</li>
        <li>Ensure the claimant is alone and in a private space</li>
        <li>Note any limitations arising from the remote format in the report</li>
        <li>Consider whether a follow-up face-to-face assessment is necessary</li>
      </ul>
    `,
    category: "Industry Insights",
    tags: ["Practice Tips", "Psychology", "Medico-Legal"],
    author: "Dr Laura Bennett",
    authorRole: "Child Psychologist",
    publishedDate: "2025-09-10",
    readTime: 6,
    image: "/images/article-neuropsych.png",
  },
  {
    id: "b7",
    slug: "meet-the-expert-dr-emily-chen",
    title: "Meet the Expert: Dr Emily Chen, Neuropsychologist",
    excerpt: "We sit down with Dr Emily Chen to discuss her specialisation in neuropsychology, the challenges of brain injury assessment, and her advice for solicitors instructing neuropsychological experts.",
    content: `
      <h2>Career Background</h2>
      <p>Dr Emily Chen is a Consultant Neuropsychologist with over 15 years of experience in both NHS and independent practice. She completed her doctorate at University College London and holds specialist qualifications in neuropsychological assessment from the British Psychological Society's Division of Neuropsychology.</p>

      <h2>What is Neuropsychology?</h2>
      <p>"Neuropsychology sits at the intersection of psychology and neuroscience. We use standardised tests to understand how brain injuries or neurological conditions affect cognitive functioning — things like memory, attention, language, problem-solving, and processing speed. In a medico-legal context, we help the court understand the cognitive impact of an injury and how it affects someone's daily life."</p>

      <h2>The Challenges of Brain Injury Assessment</h2>
      <p>"Every brain injury is unique, which makes our work both fascinating and challenging. Two people with apparently similar injuries on brain scans can present very differently in terms of their cognitive and behavioural difficulties. That's why comprehensive testing is so important — you can't rely on imaging alone."</p>
      <p>"Another challenge is distinguishing between genuine cognitive difficulties and the effects of pain, fatigue, mood disorders, or medication. A good neuropsychological assessment considers all of these factors."</p>

      <h2>Most Rewarding Cases</h2>
      <p>"I find paediatric brain injury cases particularly rewarding, despite being emotionally difficult. Children's brains are still developing, which means the effects of an injury may not become apparent for months or even years. We often need to provide prognoses that account for the child's developmental trajectory, which requires a deep understanding of developmental neuropsychology."</p>

      <h2>Advice for Solicitors</h2>
      <p>"When you're dealing with a potential brain injury case, timing is important. Neuropsychological assessment should ideally take place at least six months post-injury, once the acute recovery period has passed. This gives a clearer picture of any lasting cognitive difficulties."</p>
      <p>"Also, please send us all available neuroimaging — CT scans, MRI reports, and any neurology or rehabilitation notes. The more information we have, the more comprehensive our assessment can be."</p>
    `,
    category: "Expert Profiles",
    tags: ["Expert Witness", "Psychology", "Research"],
    author: "Psychology Direct",
    authorRole: "Editorial Team",
    publishedDate: "2025-08-22",
    readTime: 5,
    image: "/images/article-neuropsych.png",
  },
  {
    id: "b8",
    slug: "duty-of-candour-psychological-experts",
    title: "The Duty of Candour and What It Means for Psychological Experts",
    excerpt: "An examination of the professional duty of candour for psychologists and psychiatrists acting as expert witnesses, including recent regulatory guidance and practical implications.",
    content: `
      <h2>What is the Duty of Candour?</h2>
      <p>The duty of candour is a professional obligation to be open and honest with patients and, in a medico-legal context, with the court. For psychological experts, this means providing truthful, balanced evidence — even when that evidence does not support the instructing party's case.</p>

      <h2>Regulatory Framework</h2>
      <p>The duty of candour is embedded in the professional standards of both the HCPC (for psychologists) and the GMC (for psychiatrists). Key principles include:</p>
      <ul>
        <li>Being honest about the limitations of your expertise</li>
        <li>Acknowledging uncertainty in your opinions</li>
        <li>Disclosing any factors that might affect the reliability of your assessment</li>
        <li>Correcting errors in your reports promptly when they come to your attention</li>
        <li>Not omitting relevant findings that might undermine the instructing party's case</li>
      </ul>

      <h2>Recent Guidance</h2>
      <p>The HCPC and BPS have recently issued updated guidance on the duty of candour in medico-legal practice. Key points include:</p>
      <ul>
        <li>Experts should not accept instructions where they feel pressured to reach a particular conclusion</li>
        <li>Where there is a range of reasonable professional opinion, the expert should acknowledge this and explain their own position within that range</li>
        <li>Experts should proactively disclose any previous findings or professional concerns that are relevant to the case</li>
      </ul>

      <h2>Practical Implications</h2>
      <p>For experts, the duty of candour means that your primary obligation is to the court, not to the party that instructed you. This can sometimes create tension, particularly when your findings do not support the instructing party's case. However, this independence is what gives expert evidence its credibility and weight.</p>
      <p>For solicitors, understanding the duty of candour is important because it means that a good expert may sometimes deliver unwelcome findings. This should be seen as a strength, not a weakness — courts value experts who demonstrate independence and integrity.</p>
    `,
    category: "Industry Insights",
    tags: ["Regulation", "Expert Witness", "Practice Tips"],
    author: "Dr Sarah Mitchell",
    authorRole: "Clinical Psychologist",
    publishedDate: "2025-08-05",
    readTime: 6,
    image: "/images/article-clinical-negligence.png",
  },
  {
    id: "b9",
    slug: "family-court-transparency-pilot",
    title: "Family Court Transparency Pilot: Implications for Psychological Experts",
    excerpt: "The ongoing family court transparency pilot is changing how proceedings are reported. We explore what this means for psychologists and psychiatrists providing expert evidence in family cases.",
    content: `
      <h2>Background to the Pilot</h2>
      <p>The family court transparency pilot, introduced by the President of the Family Division, permits accredited journalists and legal bloggers to attend and report on family court hearings. While the pilot aims to increase public confidence in the family justice system, it has raised important questions about confidentiality, anonymity, and the implications for expert witnesses.</p>

      <h2>What Has Changed</h2>
      <ul>
        <li>Accredited media can now attend most family court hearings, including those involving expert evidence</li>
        <li>Reporters can publish accounts of proceedings, though with strict anonymisation requirements</li>
        <li>Expert evidence and reports may be referenced in published accounts</li>
        <li>The court retains discretion to exclude media in sensitive cases</li>
      </ul>

      <h2>Implications for Experts</h2>
      <p>For psychologists and psychiatrists providing evidence in family proceedings, the transparency pilot means:</p>
      <ul>
        <li>Your oral evidence may be observed by journalists and subsequently reported</li>
        <li>Your clinical opinions and methodology may come under public scrutiny</li>
        <li>There is an increased need for clarity and precision in both written reports and oral evidence</li>
        <li>The anonymity of the parties and children remains protected, but the expert's professional identity may be referenced</li>
      </ul>

      <h2>Best Practice</h2>
      <p>Experts working in family court cases should:</p>
      <ul>
        <li>Ensure reports are written to the highest standard, as they may be subject to wider scrutiny</li>
        <li>Be prepared for oral evidence to be observed by media representatives</li>
        <li>Focus on clear, evidence-based reasoning that withstands public examination</li>
        <li>Discuss any concerns about the transparency pilot with the instructing solicitor and the court</li>
      </ul>
    `,
    category: "Case Law Updates",
    tags: ["Court Decisions", "Legal Updates", "Regulation"],
    author: "Dr Laura Bennett",
    authorRole: "Child Psychologist",
    publishedDate: "2025-07-20",
    readTime: 7,
    image: "/images/article-family-law.png",
  },
  {
    id: "b10",
    slug: "managing-expert-witness-burnout",
    title: "Managing Burnout as an Expert Witness: Strategies for Psychological Professionals",
    excerpt: "Expert witness work can be demanding and emotionally taxing. We explore the signs of burnout in medico-legal professionals and practical strategies for maintaining wellbeing.",
    content: `
      <h2>The Hidden Cost of Expert Witness Work</h2>
      <p>Medico-legal work is intellectually stimulating and professionally rewarding, but it also carries unique stressors that can contribute to burnout. Expert witnesses routinely engage with traumatic material, work under tight deadlines, and face the pressure of cross-examination. Over time, these demands can take a toll on mental health and professional satisfaction.</p>

      <h2>Recognising the Signs</h2>
      <p>Burnout in expert witness professionals may manifest as:</p>
      <ul>
        <li><strong>Emotional exhaustion</strong> — feeling drained, overwhelmed, or unable to engage with case material</li>
        <li><strong>Depersonalisation</strong> — developing a detached or cynical attitude towards claimants or the legal process</li>
        <li><strong>Reduced professional efficacy</strong> — declining quality of reports, missed deadlines, or avoidance of new instructions</li>
        <li><strong>Vicarious trauma</strong> — being affected by repeated exposure to others' traumatic experiences</li>
        <li><strong>Work-life imbalance</strong> — difficulty switching off from cases, working excessive hours, or neglecting personal relationships</li>
      </ul>

      <h2>Practical Strategies</h2>
      <ul>
        <li><strong>Set boundaries</strong> — limit the number of active cases and avoid taking on more than you can manage</li>
        <li><strong>Peer support</strong> — regular peer supervision or consultation groups provide a space to process difficult cases</li>
        <li><strong>Clinical supervision</strong> — even experienced practitioners benefit from regular supervision, particularly for complex cases</li>
        <li><strong>Take breaks</strong> — schedule regular breaks between assessments and build time for non-clinical activities into your week</li>
        <li><strong>Physical wellbeing</strong> — exercise, sleep, and nutrition have a direct impact on psychological resilience</li>
        <li><strong>CPD and variety</strong> — maintaining a mix of clinical, academic, and medico-legal work helps prevent monotony</li>
      </ul>

      <h2>Our Commitment</h2>
      <p>At Psychology Direct, we care about the wellbeing of our panel members. We work to ensure caseloads are manageable, deadlines are realistic, and experts are supported throughout the instruction process. If you are experiencing burnout, please reach out — we are here to help.</p>
    `,
    category: "Wellbeing",
    tags: ["Wellbeing", "Mental Health", "Practice Tips"],
    author: "Dr Sarah Mitchell",
    authorRole: "Clinical Psychologist",
    publishedDate: "2025-07-01",
    readTime: 6,
    image: "/images/article-ptsd.png",
  },
];

export const BLOG_CATEGORIES = BLOG_CATEGORY_DEFS.map((def) => ({
  ...def,
  count: BLOG_POSTS.filter((p) => p.category === def.name).length,
}));

export function searchBlogPosts(query: string): BlogPost[] {
  const q = query.toLowerCase().trim();
  if (!q) return BLOG_POSTS;
  return BLOG_POSTS.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.author.toLowerCase().includes(q)
  );
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getRelatedBlogPosts(post: BlogPost, limit = 3): BlogPost[] {
  return BLOG_POSTS.filter(
    (p) =>
      p.id !== post.id &&
      (p.category === post.category || p.tags.some((t) => post.tags.includes(t)))
  ).slice(0, limit);
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.category === category);
}

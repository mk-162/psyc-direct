export interface Article {
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

export const CATEGORIES = [
  { name: "Expert Witness", slug: "expert-witness", count: 3 },
  { name: "Mental Health", slug: "mental-health", count: 2 },
  { name: "Legal Process", slug: "legal-process", count: 2 },
  { name: "Family Law", slug: "family-law", count: 1 },
  { name: "Clinical Negligence", slug: "clinical-negligence", count: 1 },
  { name: "Neuropsychology", slug: "neuropsychology", count: 1 },
];

export const ALL_TAGS = [
  "PTSD", "Personal Injury", "Court Reports", "Expert Witness",
  "Family Courts", "Child Psychology", "Medico-Legal", "Trauma",
  "Neuropsychology", "Clinical Negligence", "Anxiety", "Depression",
  "Capacity Assessment", "Employment Law", "Brain Injury",
  "Psychometric Testing", "Rehabilitation", "Insurance Claims",
];

export const ARTICLES: Article[] = [
  {
    id: "1",
    slug: "understanding-expert-witness-reports",
    title: "Understanding Expert Witness Reports: A Complete Guide for Solicitors",
    excerpt: "Everything you need to know about commissioning, interpreting, and using psychological expert witness reports in legal proceedings. A practical guide covering Part 35 compliance, what to expect, and how to get the most from your expert.",
    content: `
      <h2>What is an Expert Witness Report?</h2>
      <p>An expert witness report is a formal, evidence-based document prepared by a qualified professional to assist the court in understanding technical or specialist matters. In the context of medico-legal psychology, these reports provide clinical opinions on the psychological impact of events, diagnoses, prognosis, and recommendations for treatment.</p>
      <p>The role of the expert witness is to provide an objective, independent opinion to assist the court — not to advocate for either party. This independence is fundamental to the credibility and admissibility of the report.</p>

      <h2>When Do You Need a Psychological Expert Witness?</h2>
      <p>Psychological expert witnesses are commonly instructed in cases involving:</p>
      <ul>
        <li><strong>Personal injury claims</strong> — where psychological harm such as PTSD, anxiety, or depression is alleged</li>
        <li><strong>Clinical negligence</strong> — where psychological assessment of harm resulting from clinical errors is required</li>
        <li><strong>Family law proceedings</strong> — including parental capacity assessments and risk evaluations</li>
        <li><strong>Employment disputes</strong> — involving workplace stress, bullying, or discrimination</li>
        <li><strong>Criminal proceedings</strong> — fitness to plead, diminished responsibility, or risk assessments</li>
      </ul>

      <h2>Part 35 Compliance</h2>
      <p>Expert witness reports in England and Wales must comply with Part 35 of the Civil Procedure Rules (CPR). Key requirements include:</p>
      <ul>
        <li>The expert's duty is to the court, overriding any obligation to the instructing party</li>
        <li>Reports must contain a statement of truth</li>
        <li>The expert must set out their qualifications and the literature or materials relied upon</li>
        <li>Where there is a range of opinion on a matter, the expert should summarise the range and give reasons for their own view</li>
      </ul>

      <h2>What Should a Good Report Contain?</h2>
      <p>A well-constructed psychological expert witness report will typically include:</p>
      <ul>
        <li>Details of the expert's qualifications, experience, and registration</li>
        <li>Instructions received and documents reviewed</li>
        <li>Background history of the claimant</li>
        <li>Clinical assessment findings, including psychometric test results where appropriate</li>
        <li>Diagnosis using recognised diagnostic criteria (ICD-11 or DSM-5)</li>
        <li>Opinion on causation — the link between the index event and psychological harm</li>
        <li>Prognosis and recommendations for treatment</li>
        <li>Statement of truth and declaration of conflicts of interest</li>
      </ul>

      <h2>Common Pitfalls to Avoid</h2>
      <p>When commissioning expert reports, solicitors should be aware of common issues:</p>
      <ul>
        <li><strong>Instructing the wrong type of expert</strong> — ensure the expert's specialism matches the clinical issues in the case</li>
        <li><strong>Incomplete instructions</strong> — provide all relevant medical records, witness statements, and a clear letter of instruction</li>
        <li><strong>Late instruction</strong> — early instruction allows adequate time for assessment and report writing</li>
        <li><strong>Ignoring the expert's recommendations</strong> — treatment recommendations can affect quantum and should be considered carefully</li>
      </ul>

      <h2>How Psychology Direct Can Help</h2>
      <p>At Psychology Direct, we take the complexity out of finding the right expert. Our team matches your case requirements with the most suitable psychologist or psychiatrist from our panel of over 500 vetted professionals. We handle the logistics, provide fixed transparent fees, and ensure reports are delivered on time and to the highest standard.</p>
    `,
    category: "Expert Witness",
    tags: ["Expert Witness", "Court Reports", "Medico-Legal", "Personal Injury"],
    author: "Dr Sarah Mitchell",
    authorRole: "Clinical Psychologist",
    publishedDate: "2025-11-15",
    readTime: 8,
    image: "/images/article-expert-witness.png",
    featured: true,
  },
  {
    id: "2",
    slug: "ptsd-personal-injury-claims",
    title: "PTSD in Personal Injury Claims: Assessment, Evidence and Legal Considerations",
    excerpt: "A detailed examination of how post-traumatic stress disorder is assessed and evidenced in medico-legal settings, including diagnostic criteria, common misconceptions, and the role of psychometric testing.",
    content: `
      <h2>Understanding PTSD in a Legal Context</h2>
      <p>Post-Traumatic Stress Disorder (PTSD) is one of the most commonly claimed psychological injuries in personal injury litigation. However, it is also one of the most misunderstood. A robust medico-legal assessment of PTSD requires careful clinical evaluation, appropriate use of psychometric tools, and a clear understanding of the diagnostic criteria.</p>

      <h2>Diagnostic Criteria</h2>
      <p>PTSD is defined in both the ICD-11 (World Health Organisation) and DSM-5 (American Psychiatric Association). The core features include:</p>
      <ul>
        <li><strong>Re-experiencing</strong> — intrusive memories, flashbacks, or nightmares related to the traumatic event</li>
        <li><strong>Avoidance</strong> — deliberate avoidance of reminders of the trauma, including thoughts, feelings, people, or places</li>
        <li><strong>Hyperarousal</strong> — heightened startle response, irritability, sleep disturbance, and hypervigilance</li>
        <li><strong>Negative alterations in cognition and mood</strong> (DSM-5) — including persistent negative beliefs, emotional numbing, and feelings of detachment</li>
      </ul>

      <h2>Assessment Methods</h2>
      <p>A thorough PTSD assessment in a medico-legal context will typically involve:</p>
      <ul>
        <li>A detailed clinical interview covering the traumatic event, symptom onset, course, and current presentation</li>
        <li>Review of medical records, GP notes, and any prior psychological treatment records</li>
        <li>Administration of validated psychometric measures such as the PCL-5, IES-R, or CAPS-5</li>
        <li>Assessment of pre-existing vulnerability and alternative explanations for symptoms</li>
        <li>Consideration of symptom validity and effort testing where appropriate</li>
      </ul>

      <h2>Common Misconceptions</h2>
      <p>Several misconceptions about PTSD frequently arise in legal proceedings:</p>
      <ul>
        <li><strong>"PTSD develops immediately after trauma"</strong> — in fact, delayed-onset PTSD is well-documented, sometimes appearing months or years after the event</li>
        <li><strong>"All trauma leads to PTSD"</strong> — many people experience traumatic events without developing PTSD. Resilience is the norm, not the exception</li>
        <li><strong>"PTSD is permanent"</strong> — with appropriate treatment (such as trauma-focused CBT or EMDR), many individuals make a full recovery</li>
      </ul>

      <h2>The Role of Treatment Evidence</h2>
      <p>Evidence of engagement with recommended treatment (or failure to engage) can significantly affect quantum in personal injury claims. Courts may consider whether a claimant has taken reasonable steps to mitigate their losses through accessing appropriate psychological therapy.</p>
    `,
    category: "Mental Health",
    tags: ["PTSD", "Personal Injury", "Trauma", "Psychometric Testing"],
    author: "Prof Richard Townsend",
    authorRole: "Forensic Psychologist",
    publishedDate: "2025-10-22",
    readTime: 10,
    image: "/images/article-ptsd.png",
  },
  {
    id: "3",
    slug: "choosing-right-psychological-expert",
    title: "How to Choose the Right Psychological Expert for Your Case",
    excerpt: "A practical guide to matching the right psychologist or psychiatrist to your specific case requirements, covering specialisms, qualifications, and what to look for in a good expert.",
    content: `
      <h2>Why the Right Match Matters</h2>
      <p>Selecting the appropriate psychological expert is one of the most critical decisions in any medico-legal case. The wrong match can lead to delays, increased costs, and — most importantly — a report that fails to address the key clinical issues. The right expert, conversely, will provide a clear, robust, and court-ready opinion that strengthens your case.</p>

      <h2>Psychologist vs Psychiatrist: Understanding the Difference</h2>
      <p>One of the most common questions we receive is whether a psychologist or psychiatrist is needed. Here's a simple guide:</p>
      <ul>
        <li><strong>Clinical Psychologist</strong> — doctoral-level training in assessment, diagnosis, and therapy. Best for: PTSD, anxiety, depression, cognitive assessments, behavioural analysis</li>
        <li><strong>Forensic Psychologist</strong> — specialist in criminal behaviour, risk assessment, and the intersection of psychology and law. Best for: criminal cases, risk evaluations, fitness to plead</li>
        <li><strong>Neuropsychologist</strong> — specialist in brain-behaviour relationships. Best for: brain injury, cognitive impairment, dementia, capacity assessments</li>
        <li><strong>Psychiatrist</strong> — medical doctor with specialist training in mental health. Best for: cases requiring medication review, complex psychiatric diagnoses, dual diagnosis</li>
        <li><strong>Child Psychologist</strong> — specialist in child development and family dynamics. Best for: family court proceedings, child welfare, developmental assessments</li>
      </ul>

      <h2>Key Qualifications to Check</h2>
      <p>When selecting an expert, verify the following:</p>
      <ul>
        <li>Registration with the Health and Care Professions Council (HCPC) for psychologists</li>
        <li>Registration with the General Medical Council (GMC) for psychiatrists</li>
        <li>Membership of relevant professional bodies (BPS, RCPsych)</li>
        <li>Professional indemnity insurance</li>
        <li>Experience of writing medico-legal reports and giving court testimony</li>
        <li>Enhanced DBS clearance</li>
      </ul>

      <h2>Questions to Ask Before Instructing</h2>
      <p>Before finalising your instruction, consider asking:</p>
      <ul>
        <li>How many medico-legal reports do you write per year?</li>
        <li>Have you given oral evidence in court, and how often?</li>
        <li>What is your current turnaround time?</li>
        <li>Are you available for a joint expert meeting if required?</li>
        <li>What are your fees, and are they fixed?</li>
      </ul>
    `,
    category: "Expert Witness",
    tags: ["Expert Witness", "Medico-Legal", "Court Reports"],
    author: "Dr James Harrington",
    authorRole: "Consultant Psychiatrist",
    publishedDate: "2025-09-18",
    readTime: 6,
    image: "/images/article-choosing-expert.png",
  },
  {
    id: "4",
    slug: "psychological-assessments-family-courts",
    title: "Psychological Assessments in Family Court Proceedings",
    excerpt: "Understanding the role of psychological assessments in family law cases, including parental capacity evaluations, child welfare assessments, and what judges look for in expert evidence.",
    content: `
      <h2>The Role of Psychology in Family Law</h2>
      <p>Family courts frequently rely on psychological assessments to help make decisions about children's welfare. These assessments provide the court with expert insight into parental capacity, attachment relationships, risk factors, and the psychological needs of children involved in proceedings.</p>

      <h2>Types of Family Court Assessments</h2>
      <ul>
        <li><strong>Parental capacity assessments</strong> — evaluating a parent's ability to meet their child's physical, emotional, and developmental needs</li>
        <li><strong>Risk assessments</strong> — identifying potential risks to children from parental behaviour, mental health, or substance use</li>
        <li><strong>Attachment assessments</strong> — evaluating the quality of the parent-child relationship</li>
        <li><strong>Cognitive assessments</strong> — where there are concerns about a parent's learning difficulties or cognitive functioning</li>
        <li><strong>Sibling assessments</strong> — understanding relationships between siblings and the impact of separation</li>
      </ul>

      <h2>What Judges Look For</h2>
      <p>Family court judges value expert reports that are:</p>
      <ul>
        <li>Child-focused — the child's welfare must be the paramount consideration</li>
        <li>Balanced — presenting strengths as well as concerns</li>
        <li>Evidence-based — grounded in established psychological theory and research</li>
        <li>Practical — offering clear, actionable recommendations</li>
        <li>Timely — delivered within court-directed timeframes</li>
      </ul>

      <h2>The Importance of Sensitivity</h2>
      <p>Family law cases are inherently sensitive. Psychologists working in this area must balance rigorous clinical assessment with empathy and respect for all parties involved. At Psychology Direct, our family law experts are selected not only for their clinical expertise but also for their ability to handle these cases with the sensitivity they deserve.</p>
    `,
    category: "Family Law",
    tags: ["Family Courts", "Child Psychology", "Capacity Assessment"],
    author: "Dr Laura Bennett",
    authorRole: "Child Psychologist",
    publishedDate: "2025-08-05",
    readTime: 7,
    image: "/images/article-family-law.png",
  },
  {
    id: "5",
    slug: "navigating-court-process-expert-witnesses",
    title: "Navigating the Court Process: What Expert Witnesses Need to Know",
    excerpt: "A step-by-step guide to the court process for psychological expert witnesses, from instruction to giving oral evidence, including practical tips for effective testimony.",
    content: `
      <h2>The Journey from Instruction to Court</h2>
      <p>For many psychologists and psychiatrists, the transition from clinical practice to the courtroom can feel daunting. Understanding the court process helps experts provide more effective evidence and better serve the interests of justice.</p>

      <h2>Key Stages</h2>
      <ul>
        <li><strong>Instruction</strong> — receiving the letter of instruction, agreeing terms, and reviewing case documents</li>
        <li><strong>Assessment</strong> — conducting the clinical assessment, administering psychometric tests, and reviewing records</li>
        <li><strong>Report writing</strong> — preparing a Part 35-compliant report with clear opinions and reasoning</li>
        <li><strong>Questions under Part 35</strong> — responding to written questions from the opposing party</li>
        <li><strong>Joint expert meetings</strong> — meeting with the opposing expert to identify areas of agreement and disagreement</li>
        <li><strong>Oral evidence</strong> — giving evidence in court, including examination-in-chief and cross-examination</li>
      </ul>

      <h2>Tips for Effective Oral Evidence</h2>
      <p>When giving evidence in court:</p>
      <ul>
        <li>Speak clearly and avoid jargon — the judge needs to understand your evidence</li>
        <li>Answer the question that was asked, not the one you wish had been asked</li>
        <li>It is perfectly acceptable to say "I don't know" or "that is outside my area of expertise"</li>
        <li>Remain calm and professional under cross-examination</li>
        <li>Direct your answers to the judge, not to the barrister asking the question</li>
      </ul>
    `,
    category: "Legal Process",
    tags: ["Court Reports", "Expert Witness", "Medico-Legal"],
    author: "Prof Richard Townsend",
    authorRole: "Forensic Psychologist",
    publishedDate: "2025-07-12",
    readTime: 9,
    image: "/images/article-court.png",
  },
  {
    id: "6",
    slug: "neuropsychological-assessment-brain-injury",
    title: "Neuropsychological Assessment Following Brain Injury: A Legal Perspective",
    excerpt: "How neuropsychological assessments are used in brain injury litigation, covering the assessment process, common cognitive domains tested, and implications for legal claims.",
    content: `
      <h2>What is Neuropsychological Assessment?</h2>
      <p>Neuropsychological assessment is a specialist form of psychological evaluation that examines the relationship between brain function and behaviour. It uses a battery of standardised tests to measure cognitive abilities including memory, attention, language, executive function, and processing speed.</p>

      <h2>When is Neuropsychological Assessment Needed?</h2>
      <p>In a legal context, neuropsychological assessment is most commonly required in:</p>
      <ul>
        <li>Traumatic brain injury (TBI) claims — including road traffic accidents, falls, and assaults</li>
        <li>Clinical negligence — where brain damage is alleged to have resulted from medical error</li>
        <li>Capacity assessments — evaluating a person's ability to make decisions under the Mental Capacity Act 2005</li>
        <li>Employment cases — where cognitive difficulties affect ability to work</li>
      </ul>

      <h2>The Assessment Process</h2>
      <p>A typical neuropsychological assessment involves:</p>
      <ul>
        <li>Detailed clinical interview covering premorbid functioning, the injury event, and current difficulties</li>
        <li>Administration of standardised psychometric tests across multiple cognitive domains</li>
        <li>Assessment of effort and symptom validity to ensure the reliability of test results</li>
        <li>Integration of test findings with neuroimaging data, medical records, and collateral information</li>
        <li>Formation of a clinical opinion on the nature and extent of cognitive impairment and its relationship to the index event</li>
      </ul>

      <h2>Cognitive Domains Assessed</h2>
      <ul>
        <li><strong>Attention and concentration</strong> — sustained, selective, and divided attention</li>
        <li><strong>Memory</strong> — verbal and visual memory, immediate and delayed recall</li>
        <li><strong>Executive function</strong> — planning, problem-solving, mental flexibility, and inhibition</li>
        <li><strong>Language</strong> — word-finding, comprehension, and verbal fluency</li>
        <li><strong>Processing speed</strong> — the speed at which information is processed</li>
        <li><strong>Visuospatial abilities</strong> — perception and construction of visual-spatial information</li>
      </ul>
    `,
    category: "Neuropsychology",
    tags: ["Neuropsychology", "Brain Injury", "Psychometric Testing", "Capacity Assessment"],
    author: "Dr Emily Chen",
    authorRole: "Neuropsychologist",
    publishedDate: "2025-06-20",
    readTime: 11,
    image: "/images/article-neuropsych.png",
  },
  {
    id: "7",
    slug: "clinical-negligence-psychological-impact",
    title: "The Psychological Impact of Clinical Negligence: What Solicitors Need to Know",
    excerpt: "Understanding how clinical negligence affects patients psychologically, the assessment process, and how psychological evidence strengthens negligence claims.",
    content: `
      <h2>Beyond Physical Harm</h2>
      <p>Clinical negligence doesn't just cause physical injury — it frequently results in significant psychological harm. Patients who have experienced medical errors often develop anxiety, depression, PTSD, and a profound loss of trust in healthcare professionals. Understanding and evidencing this psychological impact is essential for building a comprehensive negligence claim.</p>

      <h2>Common Psychological Consequences</h2>
      <ul>
        <li><strong>Post-Traumatic Stress Disorder</strong> — particularly following surgical errors, birth trauma, or life-threatening complications</li>
        <li><strong>Adjustment Disorder</strong> — difficulty coping with the aftermath of negligent treatment</li>
        <li><strong>Depression</strong> — often linked to loss of function, chronic pain, or changed life circumstances</li>
        <li><strong>Health Anxiety</strong> — heightened fear of medical treatment and loss of trust in healthcare</li>
        <li><strong>Medically Unexplained Symptoms</strong> — physical symptoms driven by psychological distress</li>
      </ul>

      <h2>Assessment Considerations</h2>
      <p>Assessing psychological harm in clinical negligence cases requires particular care:</p>
      <ul>
        <li>Distinguishing between psychological harm caused by the negligent act versus the underlying condition</li>
        <li>Assessing premorbid psychological functioning and vulnerability</li>
        <li>Considering the impact of the litigation process itself on psychological wellbeing</li>
        <li>Evaluating the claimant's engagement with recommended treatment</li>
      </ul>

      <h2>Strengthening Your Claim</h2>
      <p>Early instruction of a psychological expert can significantly strengthen a clinical negligence claim. A well-timed assessment captures the claimant's psychological state before treatment interventions potentially alter the clinical picture, and provides the court with contemporaneous evidence of harm.</p>
    `,
    category: "Clinical Negligence",
    tags: ["Clinical Negligence", "PTSD", "Trauma", "Personal Injury"],
    author: "Dr Sarah Mitchell",
    authorRole: "Clinical Psychologist",
    publishedDate: "2025-05-14",
    readTime: 8,
    image: "/images/article-clinical-negligence.png",
  },
  {
    id: "8",
    slug: "psychometric-testing-medico-legal",
    title: "The Role of Psychometric Testing in Medico-Legal Assessments",
    excerpt: "An overview of psychometric testing in the medico-legal context, including commonly used measures, validity testing, and how to interpret test results in expert reports.",
    content: `
      <h2>What is Psychometric Testing?</h2>
      <p>Psychometric testing refers to the use of standardised, scientifically validated assessment tools to measure psychological constructs such as intelligence, personality, mood, cognitive function, and specific symptoms. In medico-legal work, these tests provide objective, quantifiable data to support clinical opinions.</p>

      <h2>Why Psychometric Testing Matters in Legal Cases</h2>
      <p>Courts value psychometric testing because it:</p>
      <ul>
        <li>Provides objective data to support or challenge subjective clinical impressions</li>
        <li>Allows comparison of an individual's performance against normative data</li>
        <li>Includes built-in validity measures to detect exaggeration or malingering</li>
        <li>Produces results that are reproducible and can be scrutinised by opposing experts</li>
      </ul>

      <h2>Commonly Used Measures</h2>
      <ul>
        <li><strong>PCL-5</strong> — PTSD Checklist for DSM-5, a self-report measure of PTSD symptoms</li>
        <li><strong>PHQ-9</strong> — Patient Health Questionnaire, screening for depression severity</li>
        <li><strong>GAD-7</strong> — Generalised Anxiety Disorder scale</li>
        <li><strong>WAIS-IV</strong> — Wechsler Adult Intelligence Scale, measuring cognitive ability</li>
        <li><strong>WMS-IV</strong> — Wechsler Memory Scale, assessing memory function</li>
        <li><strong>TOMM</strong> — Test of Memory Malingering, a symptom validity test</li>
      </ul>

      <h2>Interpreting Results</h2>
      <p>When reading psychometric results in expert reports, solicitors should look for:</p>
      <ul>
        <li>Whether the tests used are appropriate for the clinical questions being asked</li>
        <li>Whether validity measures were administered and what they showed</li>
        <li>How the claimant's scores compare to normative data and clinical cut-offs</li>
        <li>Whether the test results are consistent with the clinical presentation and reported history</li>
      </ul>
    `,
    category: "Expert Witness",
    tags: ["Psychometric Testing", "Expert Witness", "Medico-Legal"],
    author: "Dr Emily Chen",
    authorRole: "Neuropsychologist",
    publishedDate: "2025-04-08",
    readTime: 7,
    image: "/images/article-expert-witness.png",
  },
  {
    id: "9",
    slug: "anxiety-depression-insurance-claims",
    title: "Assessing Anxiety and Depression in Insurance Claims",
    excerpt: "How anxiety and depression are assessed in the context of insurance claims, including the diagnostic process, severity measurement, and implications for claims outcomes.",
    content: `
      <h2>The Challenge of Assessment</h2>
      <p>Anxiety and depression are the most commonly claimed psychological conditions in insurance and personal injury cases. Assessing these conditions in a medico-legal context presents unique challenges, as the expert must balance clinical sensitivity with the need for objective, evidence-based opinion.</p>

      <h2>Diagnostic Frameworks</h2>
      <p>Both ICD-11 and DSM-5 provide clear diagnostic criteria for anxiety and depressive disorders. Key considerations include:</p>
      <ul>
        <li>Duration and persistence of symptoms</li>
        <li>Severity — mild, moderate, or severe</li>
        <li>Functional impact on daily life, work, and relationships</li>
        <li>Presence of comorbid conditions</li>
        <li>Pre-existing mental health history</li>
      </ul>

      <h2>Severity Measurement</h2>
      <p>Standardised measures help quantify the severity of anxiety and depression:</p>
      <ul>
        <li><strong>PHQ-9</strong> — scores of 5, 10, 15, and 20 represent mild, moderate, moderately severe, and severe depression respectively</li>
        <li><strong>GAD-7</strong> — scores of 5, 10, and 15 represent mild, moderate, and severe anxiety</li>
        <li><strong>DASS-21</strong> — measures depression, anxiety, and stress simultaneously</li>
        <li><strong>BDI-II</strong> — Beck Depression Inventory, widely used in clinical and research settings</li>
      </ul>

      <h2>Implications for Claims</h2>
      <p>The severity and prognosis of anxiety and depression significantly affect claims outcomes. Courts and insurers consider the extent of functional impairment, the likely duration of symptoms, and the cost of recommended treatment when determining quantum.</p>
    `,
    category: "Mental Health",
    tags: ["Anxiety", "Depression", "Insurance Claims", "Personal Injury"],
    author: "Dr James Harrington",
    authorRole: "Consultant Psychiatrist",
    publishedDate: "2025-03-01",
    readTime: 6,
    image: "/images/article-ptsd.png",
  },
  {
    id: "10",
    slug: "employment-law-psychological-evidence",
    title: "Psychological Evidence in Employment Law Disputes",
    excerpt: "How psychological assessments support employment tribunal cases, covering workplace stress, bullying, discrimination, and constructive dismissal claims.",
    content: `
      <h2>Psychology in the Workplace Context</h2>
      <p>Employment law disputes frequently involve claims of psychological harm arising from workplace experiences. These may include allegations of bullying, harassment, discrimination, excessive workload, or toxic management practices. Psychological expert evidence can be crucial in establishing both the existence and extent of psychological harm.</p>

      <h2>Common Employment Law Referrals</h2>
      <ul>
        <li><strong>Workplace stress and burnout</strong> — assessing the psychological impact of excessive work demands</li>
        <li><strong>Bullying and harassment</strong> — evaluating the effects of sustained workplace mistreatment</li>
        <li><strong>Discrimination claims</strong> — assessing psychological harm from discriminatory treatment</li>
        <li><strong>Constructive dismissal</strong> — evaluating the psychological impact of intolerable working conditions</li>
        <li><strong>Whistleblower cases</strong> — assessing the psychological effects of victimisation following disclosure</li>
      </ul>

      <h2>Assessment Approach</h2>
      <p>Psychological assessment in employment cases requires careful attention to:</p>
      <ul>
        <li>The workplace context and timeline of events</li>
        <li>The individual's occupational history and pre-existing vulnerabilities</li>
        <li>Contemporaneous evidence such as occupational health records, grievance outcomes, and GP records</li>
        <li>The distinction between workplace dissatisfaction and clinically significant psychological harm</li>
      </ul>
    `,
    category: "Legal Process",
    tags: ["Employment Law", "Anxiety", "Depression", "Medico-Legal"],
    author: "Prof Richard Townsend",
    authorRole: "Forensic Psychologist",
    publishedDate: "2025-02-10",
    readTime: 8,
    image: "/images/article-court.png",
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getArticlesByCategory(category: string): Article[] {
  return ARTICLES.filter((a) => a.category === category);
}

export function getArticlesByTag(tag: string): Article[] {
  return ARTICLES.filter((a) => a.tags.includes(tag));
}

export function getRelatedArticles(article: Article, limit = 3): Article[] {
  return ARTICLES.filter((a) => a.id !== article.id)
    .map((a) => ({
      article: a,
      score:
        (a.category === article.category ? 3 : 0) +
        a.tags.filter((t) => article.tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((a) => a.article);
}

export function searchArticles(query: string): Article[] {
  const q = query.toLowerCase();
  return ARTICLES.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q)) ||
      a.category.toLowerCase().includes(q)
  );
}

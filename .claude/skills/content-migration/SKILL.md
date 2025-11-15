# Content Migration & Page Builder Skill

## Mission
Merge Psychology Direct and Psychiatry Direct websites into one unified domain, creating SEO-optimized, conversion-focused pages that maintain brand voice and serve B2B organizational clients.

## Data Source
**Google Sheet:** https://docs.google.com/spreadsheets/d/1am6WhOg1ZAZBnpq-Wfd8Ro347OaGbQ9kv8REtGYI5p0/edit?gid=66286043#gid=66286043

**Columns:**
- ID
- Current Domain
- Current Page Name
- Current URL
- Proposed New Page
- Proposed URL
- Vertical
- Service Type
- Action
- SEO Target Phrases
- Suggested Title (<=60 chars)
- Suggested Meta Description (<=160 chars)
- Notes

## Output Structure

```
content-migration/
├── pages/
│   ├── [page-slug].md
│   └── ...
├── audit-log.md
└── migration-report.md
```

---

## Content Brief & Writing Rules

### Audience & Scope
- **Primary Audience:** B2B organizational clients (solicitors, local authorities, Multi-Academy Trusts, schools)
- **EXCLUDE:** Private individual therapy services
- **Focus:** Professional services only

### Tone & Voice
- **Professional authority** with **human-centric empathy**
- Clear, concise, and trustworthy
- Speak to professionals under pressure with understanding
- Avoid jargon (or briefly explain it)
- **Short, active sentences**
- Consistent, credible, yet warm brand personality

**Examples:**
✅ "CVs within 24 hours for urgent prison law cases"
✅ "We understand tight court deadlines"
❌ "We provide psychological assessment services in a timely manner"
❌ "Our comprehensive solutions..."

### Writing Style Rules
1. **Lead with benefits, follow with details**
2. **Active voice** > Passive voice
3. **Short paragraphs** (2-3 sentences max)
4. **Bullet lists** for scannability
5. **Modular blocks** for easy CMS integration
6. **Layered CTAs** throughout content
7. **Trust signals** near conversion points

### Design & Structure
- Modular, block-based sections
- Clear headings (H1, H2, H3 hierarchy)
- Brief paragraphs
- Bullet lists for readability
- Consistent page structure (see template below)

---

## Page Template Structure

Every page must follow this structure:

```markdown
# [Page Title - H1 with Primary Keyword]

<!-- PAGE TYPE: Service/Landing/Information -->
<!-- TARGET URL: [Full URL] -->
<!-- VERTICAL: Expert Witness/Education/Psychiatry -->
<!-- SERVICE TYPE: [Specific service] -->

## 🧩 Page Audit & Critique
**Old content summary:**
[1-2 sentences summarizing what existed before]

**Strengths:**
- [Bullet point]
- [Bullet point]

**Weaknesses:**
- [Bullet point]
- [Bullet point]

**Improvement focus:**
[1-2 sentences on what this new page fixes]

---

## 🔍 SEO Focus
**Primary Keyword:**
[exact phrase from sheet]

**Supporting Terms:**
[4-6 related keywords/phrases]

**Meta Title:**
[<=60 chars, includes primary keyword and brand]

**Meta Description:**
[<=160 chars, compelling with CTA]

**Internal Links:**
- [Related service page]
- [Parent category page]
- [Relevant resource]

**External Links:**
- [GOV.UK or regulatory body]
- [Professional register - HCPC/GMC]
- [Relevant legislation/guidance]

---

## 🧱 Page Content (Markdown)

# [Page Title - Benefit-Driven, Includes Keyword]

_[One-sentence hero subheading that reinforces trust and unique value]_

---

## The Challenge

[2-3 sentences acknowledging the specific pain points of the target audience.
Show empathy about their pressures - tight deadlines, complex requirements, etc.]

[Optional: Bullet list of specific challenges]

---

## Our Solution

[Opening paragraph explaining how PD addresses these issues]

[Specific services offered, as bullet list or short paragraphs:]
- **[Service 1]** — brief description
- **[Service 2]** — brief description
- **[Service 3]** — brief description

[Reinforcement of quality/compliance]

---

## Why Choose Psychology Direct

[Bullet list of 5-7 key benefits, tailored to this audience]

- **CVs within 24 hours** for urgent cases
- **Nationwide coverage** — [specific detail]
- **Legal Aid Agency rates** accepted for eligible cases
- **Psychology and Psychiatry** under one roof
- **100% quality-checked reports**
- **[Service-specific benefit]**
- **[Service-specific benefit]**

> [Optional quote or trust reinforcement]

---

## How It Works

| Step | Description |
|------|--------------|
| 1 | **[Step Name]** — [Brief description] |
| 2 | **[Step Name]** — [Brief description] |
| 3 | **[Step Name]** — [Brief description] |
| 4 | **[Step Name]** — [Brief description] |
| 5 | **[Step Name]** — [Brief description] |

_[Optional note about fast-track or special options]_

---

## Who We Work With

### For [Audience Segment 1]
[2-3 sentences addressing their specific needs and how PD helps]

### For [Audience Segment 2]
[2-3 sentences addressing their specific needs and how PD helps]

### For [Audience Segment 3]
[2-3 sentences addressing their specific needs and how PD helps]

---

## FAQs

**Q: [Common question]**
A: [Concise answer with reassurance and detail]

**Q: [Common question]**
A: [Concise answer with reassurance and detail]

**Q: [Common question]**
A: [Concise answer with reassurance and detail]

**Q: [Common question]**
A: [Concise answer with reassurance and detail]

---

**CTA:**
📩 _[Action-oriented CTA text]_ → [Contact our [Team Name]](https://www.psychologydirect.co.uk/contact/)
or call **01306 879 975** to speak directly with a Client Manager.

---

> "[Closing quote reinforcing trust, quality, or understanding]"
```

---

## Key Messaging Points (Must Include)

### For All Pages
- **HCPC registered** (psychologists)
- **GMC registered** (psychiatrists)
- **CVs within 24 hours**
- **Nationwide coverage**
- **100% quality-checked reports**
- **Legal Aid compliant** (where relevant)
- **Dedicated case managers**

### For Expert Witness Pages
- **CPR compliant reports**
- **Court-approved assessments**
- **Legal Aid Agency rates**
- **Multi-disciplinary expertise** (psychology + psychiatry)
- **Tight deadline handling**
- **Professional indemnity insurance**

### For Education Pages
- **EHCP expertise**
- **SEND legislation knowledge**
- **School and LA experience**
- **Volume discounts for MATs**
- **Ongoing support & training**
- **Flexible contracts**

---

## SEO Requirements

### Meta Tags
- **Title:** ≤60 characters, include primary keyword + brand
- **Description:** ≤160 characters, include CTA
- Use target phrases naturally in content
- Include primary keyword in H1
- Use related keywords in H2s and H3s

### Content Optimization
- **Keyword density:** Natural, not forced (aim for 1-2% of primary keyword)
- **H1:** One per page, includes primary keyword
- **H2/H3:** Logical hierarchy with keyword variations
- **Internal links:** 3-5 relevant pages
- **External links:** 1-3 authoritative sources (GOV.UK, HCPC, GMC)
- **Alt text:** For any images (descriptive + keyword when relevant)

### Long-tail Targeting
Include FAQ sections to capture long-tail queries:
- "What does a [service] do?"
- "How much does a [service] cost?"
- "How long does a [service] take?"
- "Do you work with Legal Aid?"

---

## Trust Elements & Conversion Strategy

### Layered CTAs
Place CTAs at multiple points:
1. **Hero section** - Primary CTA
2. **After benefits section** - "Ready to learn more?"
3. **End of page** - Final conversion push
4. **Sidebar/sticky** - Always visible option

### Trust Signals
Position near CTAs:
- **Accreditation logos:** HCPC, BPS, GMC, ICO
- **Statistics:** "1,000+ experts nationwide"
- **Testimonials:** Short quotes from similar clients
- **Case studies:** Brief success stories
- **Compliance mentions:** Legal Aid, CPR standards

### CTA Language
Use action-oriented, benefit-driven text:
- ✅ "Request CVs within 24 hours"
- ✅ "Get your quote today"
- ✅ "Speak to a case manager"
- ❌ "Submit"
- ❌ "Click here"
- ❌ "Contact us"

---

## Research Process

For each page in the spreadsheet:

### 1. Fetch Current Content
- Read the current page from the URL in the sheet
- Extract main content, headings, key messages
- Note tone, structure, strengths/weaknesses

### 2. Analyze & Audit
- Identify outdated information
- Note what works (keep)
- Note what doesn't work (improve)
- Check for missing SEO elements
- Assess tone against brand guidelines

### 3. Identify Audience Pain Points
Based on service type:
- **Solicitors:** Tight deadlines, Legal Aid compliance, report quality
- **Schools:** SEND requirements, EHCP timelines, capacity
- **Local Authorities:** Volume, consistency, statutory compliance
- **Parole Boards:** Risk assessment, mental health clarity

### 4. Map Keywords
- Use target phrases from spreadsheet
- Research related terms
- Identify FAQ opportunities
- Plan internal linking

### 5. Draft New Content
- Follow template structure exactly
- Match tone to brief
- Include all required trust elements
- Optimize for target keywords
- Add layered CTAs

### 6. Quality Check
- ✅ Follows template structure
- ✅ Includes SEO metadata
- ✅ Contains layered CTAs
- ✅ Has trust elements
- ✅ Matches tone guidelines
- ✅ Addresses pain points
- ✅ Clear benefits over features
- ✅ Active voice
- ✅ Short paragraphs
- ✅ Scannable format

---

## Workflow Commands

### Initialize Migration
```
"Using the content-migration skill, initialize the migration project from the Google Sheet"
```

This will:
1. Read the spreadsheet
2. Create output folder structure
3. Generate migration plan
4. Create audit log template

### Process Single Page
```
"Using the content-migration skill, create the [page name] page from row [ID]"
```

This will:
1. Fetch current page content
2. Research and analyze
3. Generate new markdown file
4. Save to `/content-migration/pages/`
5. Update audit log

### Batch Process
```
"Using the content-migration skill, process all pages in the [vertical] category"
```

This will:
1. Filter spreadsheet by vertical
2. Process each page sequentially
3. Generate all markdown files
4. Create summary report

### Generate Report
```
"Using the content-migration skill, generate migration progress report"
```

This will:
1. Review all completed pages
2. Check against spreadsheet
3. Identify remaining work
4. Generate status report

---

## Output Format

### Individual Page File
**Filename:** `[proposed-page-slug].md`
**Location:** `/content-migration/pages/`

**Structure:**
```markdown
---
id: [sheet row ID]
original_url: [old URL]
new_url: [proposed URL]
vertical: [Expert Witness/Education/Psychiatry]
service_type: [specific service]
status: draft
created: [date]
---

[Full page content following template]
```

### Audit Log
**Filename:** `audit-log.md`
**Location:** `/content-migration/`

```markdown
# Content Migration Audit Log

## Pages Completed
- [ID] [Page Name] - [Status] - [Date]
- ...

## Pages In Progress
- [ID] [Page Name] - [Status] - [Date]
- ...

## Pages Pending
- [ID] [Page Name]
- ...

## Notes & Issues
- [ID] [Page Name]: [Note]
- ...
```

### Migration Report
**Filename:** `migration-report.md`
**Location:** `/content-migration/`

```markdown
# Content Migration Report

## Summary
- Total pages: X
- Completed: X
- In progress: X
- Pending: X

## By Vertical
- Expert Witness: X/Y
- Education: X/Y
- Psychiatry: X/Y

## SEO Status
- Pages with metadata: X
- Pages with FAQs: X
- Pages with internal links: X

## Quality Checks
- Pages following template: X
- Pages with CTAs: X
- Pages with trust elements: X

## Next Steps
1. [Action item]
2. [Action item]
```

---

## Quality Standards

Every page must meet these standards:

### Content
- ✅ Follows template structure exactly
- ✅ Matches tone & voice guidelines
- ✅ Addresses audience pain points
- ✅ Benefits before features
- ✅ Active voice throughout
- ✅ Short paragraphs (2-3 sentences)
- ✅ Scannable format (bullets, tables)

### SEO
- ✅ Meta title ≤60 chars
- ✅ Meta description ≤160 chars
- ✅ Primary keyword in H1
- ✅ Keywords in H2/H3 naturally
- ✅ 3-5 internal links
- ✅ 1-3 external authoritative links
- ✅ FAQ section for long-tail

### Conversion
- ✅ Layered CTAs (3+ placements)
- ✅ Trust elements near CTAs
- ✅ Clear value propositions
- ✅ Process explanation
- ✅ Audience-specific sections
- ✅ Contact information prominent

### Brand Compliance
- ✅ Mentions both Psychology & Psychiatry where relevant
- ✅ Includes key trust signals (HCPC, GMC, Legal Aid)
- ✅ Emphasizes speed (24h CVs)
- ✅ Nationwide coverage mentioned
- ✅ Quality checks mentioned
- ✅ Professional, empathetic tone

---

## Example Content (Prison Law Page)

See the Prison Law Expert Witness page as the gold standard example.

**Key elements it demonstrates:**
- ✅ Perfect template adherence
- ✅ Empathetic opening addressing pain points
- ✅ Clear benefits over features
- ✅ Layered CTAs
- ✅ Trust signals throughout
- ✅ FAQ section with long-tail keywords
- ✅ Audience-specific sections
- ✅ SEO optimization
- ✅ Professional yet warm tone

---

## Common Patterns by Service Type

### Expert Witness Services

**Pain Points:**
- Tight court deadlines
- Legal Aid compliance
- Report quality concerns
- Expert credibility
- Last-minute requests

**Key Benefits to Emphasize:**
- CVs in 24 hours
- Legal Aid rates
- CPR compliant
- Court experience
- Quality checked

**CTAs:**
- "Request CVs within 24 hours"
- "Get a Legal Aid quote"
- "Speak to an expert witness specialist"

### Educational Psychology Services

**Pain Points:**
- EHCP statutory timelines
- SEND demand vs capacity
- Finding qualified EPs
- Consistent quality
- Budget constraints

**Key Benefits to Emphasize:**
- HCPC registered EPs
- EHCP expertise
- Volume capacity
- Flexible contracts
- Training & support

**CTAs:**
- "Request an Educational Psychologist"
- "Discuss your SEND needs"
- "Get a volume quote for your MAT"

### Psychiatry Services

**Pain Points:**
- Medical complexity
- Medication queries
- Diagnostic clarity
- Inpatient coordination
- Urgent assessments

**Key Benefits to Emphasize:**
- GMC registered
- Multidisciplinary approach
- Forensic psychiatry
- Hospital liaison
- Rapid response

**CTAs:**
- "Request a Psychiatrist"
- "Discuss psychiatric input"
- "Get multidisciplinary support"

---

## Notes for AI Processing

When processing pages:

1. **Always fetch the current page** from the URL in the sheet to understand existing content

2. **Analyze thoroughly** before writing:
   - What works in the old content?
   - What's missing?
   - What's outdated?
   - Who is the primary audience?
   - What are their specific pain points?

3. **Match the tone** of the example Prison Law page:
   - Professional but human
   - Empathetic to pressures
   - Confident and authoritative
   - Clear and concise

4. **Don't just fill a template** - create genuinely useful content that:
   - Answers real questions
   - Addresses real concerns
   - Builds genuine trust
   - Drives real conversions

5. **SEO naturally** - don't force keywords:
   - Use them where they fit naturally
   - Prioritize readability
   - Focus on user intent
   - FAQs are great for long-tail

6. **Think about the user journey**:
   - How did they find this page?
   - What do they need to know?
   - What objections might they have?
   - What will make them convert?

---

## Success Criteria

A successfully migrated page should:

1. **Rank better** than the old page (SEO optimized)
2. **Convert better** than the old page (CTAs, trust elements)
3. **Read better** than the old page (tone, structure, clarity)
4. **Serve the user** better than the old page (answers questions, builds trust)
5. **Represent the brand** better than the old page (consistent, modern, professional)

---

## Maintenance & Updates

After migration:
- Review pages quarterly for content freshness
- Update statistics and figures annually
- Monitor SEO performance and adjust
- Gather user feedback and iterate
- Keep compliance information current (Legal Aid rates, etc.)
- Add new services/specialisms as they develop

---

This skill ensures every page in the content migration meets Psychology Direct's standards for quality, conversion, SEO, and brand voice.
